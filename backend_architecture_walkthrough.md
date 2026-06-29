# Backend Architecture & Data Flow Walkthrough

This document explains exactly how your backend is wired together, from the moment an HTTP request hits your server, all the way down to the database, and back out to the user.

---

## 1. The Entry Point (`server.js` & `src/app.js`)
When you run `npm run dev`, Node executes `server.js`. 
- `server.js` is extremely lightweight. Its only job is to import the main application (`app.js`), connect to the database (via `src/config/db.js`), and start listening on a port (e.g., 3000).
- `src/app.js` is the heart of the Express application. Here, global middlewares are applied first:
  - **Security & Utility**: `helmet()` for security headers, `cors()` for cross-origin requests, `express.json()` to parse incoming JSON bodies, and `morgan` for logging.
  - **Routing**: It mounts your modules (e.g., `app.use('/api/v1/expense_tracker', expenseTrackerRoutes)`).
  - **Fallbacks**: At the very bottom of `app.js`, it registers a `notFound` middleware for 404s, and finally, the **Global Error Handler** (`errorHandler.js`).

---

## 2. The HTTP Request Journey (The Expense Tracker)
Let's trace what happens when you send a `POST /crt` request to create an expense.

### Step 1: The Route & Validator (`routes.js` & `validator.js`)
The request hits `src/modules/expense-tracker/expenses/routes.js`.
```javascript
router.post('/crt', validate.createExpense, ctrl.createExpense);
```
Before reaching the controller, it passes through `validate.createExpense`.
- This uses your custom middleware (`src/middleware/validateRequired.js`). 
- It looks at the schema you defined (e.g., `title: 'string', note: 'string?'`). 
- If a required field is missing, or a type is wrong, this middleware instantly calls `next(error)`. The request stops here and skips straight to the Global Error Handler.

### Step 2: The Controller (`controller.js`)
If the validation passes, the request reaches the Controller.
- The Controller is wrapped in `asyncHandler` (`src/lib/asyncHandler.js`). This is a crucial utility that catches any `throw` or Promise rejection and forwards it to `next(error)`, preventing your server from crashing.
- The Controller's job is purely HTTP-focused: It extracts `req.body`, passes it to the Service layer, and takes the result to send a success response using your new generic `sendSuccess` helper.

### Step 3: The Service Layer (`service.js`)
This is where your **Business Logic** lives.
- It checks rules: "Is the amount positive?", "Is the date in the future?", "Are there duplicate expenses in the last 5 minutes?"
- If any rule is broken, it `throw`s an `AppError` or `ValidationError`.
- It doesn't know anything about HTTP (`req`/`res`) or raw SQL. It just coordinates the rules and calls the Query layer.

### Step 4: The Query Layer & BaseEntity (`queries.js` & `BaseEntity.js`)
The Service calls `createExpense(data)` in `queries.js`.
- In `queries.js`, we instantiated `new BaseEntity('expense_tracker_expenses')`.
- **`BaseEntity.js`** is your generic CRUD powerhouse. It takes the JSON payload, dynamically strips out any protected audit fields (`id`, `created_at`, `updated_at`, `deleted_at`), dynamically generates the raw `INSERT INTO ...` SQL string, and executes it via the pg pool.
- For more complex operations (like `findDuplicates`), `queries.js` still writes raw SQL, but safely utilizes `deleted_at IS NULL` to ignore soft-deleted rows.

---

## 3. How Responses and Errors are Handled

### Success
When the Query finishes, the Service returns the data to the Controller. The Controller calls `sendSuccess(res, ...)` from `src/lib/response.js`, which ensures your output is perfectly structured:
`{ data: {...}, error: false, status: 201, message: "..." }`

### Errors
If *anything* goes wrong anywhere (Validation fails, Service throws an error, or the Database rejects the insert due to a constraint):
1. The error is caught (by `asyncHandler` or explicit `next(err)`) and passed down the Express chain until it hits `src/middleware/errorHandler.js`.
2. The Error Handler passes the error to `mapError()`. 
3. If it's a PostgreSQL database error (like a NOT NULL violation), `pgErrorMapper.js` translates the ugly database code (`23502`) into a clean, human-readable `AppError`.
4. Finally, the Error Handler calls `sendError(res, ...)` to output a standard JSON error response, ensuring the frontend always gets a predictable `{ data: null, error: true, status: 400, message: "..." }`.

---

## 4. How the Database & Migrations Work

### The Story Behind Migrations — Why They Exist

Imagine you build a project, ship it, and users start adding data. One week later you realize you need a new column — say, `payment_method`. You can't just go edit the `CREATE TABLE` statement you wrote at the start and re-run it — the table already exists, with real data inside. If you drop and recreate it, all user data is gone. If you just `ALTER TABLE` on your local machine directly, your teammate's machine (or your production server) is now out of sync. Next time they pull your code, their database doesn't match yours, and the app breaks in mysterious ways.

**This is the core problem migrations solve.** A migration is a plain SQL file that describes *one specific, forward-moving change* to your database schema. Every developer on the team (and every environment — local, staging, production) runs these files in the exact same numbered order. The database always ends up in an identical, known state. You never edit a migration file after it's been committed — you only ever *add new ones*.

Think of your database schema like a timeline of decisions. Each migration file is a commit on that timeline, and the file number is the commit hash. This is how every serious production database is managed — from small SaaS apps to systems at Netflix, Stripe, and GitHub.

### How Migrations Work in Practice

The convention this project follows is simple and battle-tested:

1. **Numbered files, run in order.** `001_` runs before `002_`, which runs before `003_`. The number is the only enforced rule.
2. **Forward-only.** Never modify a migration that has already run. If you made a mistake in `002`, you write a `003` that corrects it. The history is immutable.
3. **Idempotent by default.** Where possible, every statement is safe to re-run: `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, `ON CONFLICT DO NOTHING`. This means if a migration is accidentally run twice, nothing breaks.
4. **Manual execution (no ORM magic).** In this project, you run migrations yourself with a `psql` command. There is no migration runner framework — which means you have full control and full understanding of exactly what SQL hits your database. The tradeoff is that you must remember to run new migrations in every environment yourself.

---

### Migration `001` — The Foundation (`001_expense_tracker_init.sql`)

This was the very first SQL ever written for this project. Its job was to answer the question: **"What is the minimum schema needed to track an expense?"**

It created two core tables:
- **`expense_tracker_categories`**: A reference table for grouping expenses (Food, Transport, Health, etc.), with an `icon` (emoji) and `color` (hex code for the UI). It was seeded immediately with 7 default categories using `ON CONFLICT (name) DO NOTHING` so re-running the file won't create duplicates.
- **`expense_tracker_expenses`**: The main business table. Key design decisions baked in from day one:
  - `amount NUMERIC(12, 2)` — never `FLOAT` for money. Floating-point arithmetic cannot represent `0.10` exactly, which causes subtle rounding errors in financial calculations. `NUMERIC` is exact.
  - `CHECK (amount > 0)` — a database-level constraint that *physically prevents* a zero or negative expense from being saved, regardless of whether your Node.js validation runs or not. The database is the last line of defence.
  - `spent_at DATE` — a `DATE` (calendar day), not a `TIMESTAMPTZ` (exact moment). This was a deliberate choice: a user cares that they spent money "on June 28th", not at "23:14:07.332 UTC". Using the right type prevents confusion.
  - `category_id ... ON DELETE SET NULL` — if a category is deleted, existing expenses are not deleted with it. Their `category_id` just becomes `NULL`. This protects historical data.

Two indexes were created immediately on the most predictable query patterns: filtering by `category_id` and sorting by `spent_at DESC` (most recent first). Indexes are invisible to queries — they only affect speed — but they must be planned ahead of time.

---

### Migration `002` — The Enhancement (`002_expense_tracker_enhance.sql`)

After the initial schema was running, new requirements emerged. Rather than touching `001`, a second migration file was created to layer new features on top.

This migration introduced:
- **Two new columns on `expenses`**: `payment_method` (VARCHAR, default `'cash'`) and `is_recurring` (BOOLEAN, default `FALSE`). These used `ADD COLUMN IF NOT EXISTS`, making the migration safe to re-run.
- **`expense_tracker_payment_methods`**: A reference table to standardize payment method names (Cash, Credit Card, Mobile Pay, etc.), seeded with 5 defaults.
- **`expense_tracker_tags`**: A reference table for user-defined labels (Work, Personal, Urgent, Reimbursable).
- **`expense_tracker_expense_tags`**: A **junction table** implementing a many-to-many relationship. One expense can have many tags; one tag can belong to many expenses. The junction table holds foreign keys to both, with a composite primary key `(expense_id, tag_id)` to prevent duplicate tag attachments. The `ON DELETE CASCADE` means if an expense is hard-deleted, its tag links are automatically cleaned up.
- **Additional indexes** on `payment_method` and the junction table's `tag_id` column for query performance.

---

### Migration `003` — The Base Audit Pattern (`003_base_audit_pattern.sql`)

This is the most architecturally significant migration. By `001` and `002`, the audit fields (`created_at`, `updated_at`, `deleted_at`) were being added inconsistently — some tables had some of them, some didn't. This migration retrofitted every existing table to follow one unified standard, and more importantly, it automated the enforcement of that standard for all future tables.

It did this in four steps:

**Step 1 — Create the trigger function.**
```sql
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
This is a PostgreSQL **trigger function** — a piece of logic that lives inside the database engine itself, written in PL/pgSQL (PostgreSQL's procedural language). It intercepts every `UPDATE` statement on any table it's attached to, and before the row is written to disk, it stamps `updated_at` with the current time. Your Node.js application never needs to include `updated_at` in any query.

**Step 2 — Create the `apply_base_entity()` procedure.**
```sql
CREATE OR REPLACE PROCEDURE apply_base_entity(target_table text) ...
```
This is a reusable **procedure** (not a function — procedures are called with `CALL` and don't return a value). It accepts any table name as a string and does the following to it:
- Adds `created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL` (filling in `NOW()` for any rows that are missing it).
- Adds `updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL`.
- Adds `deleted_at TIMESTAMPTZ` (nullable — `NULL` means the record is alive).
- Drops any existing `set_updated_at` trigger on that table (to avoid duplicate trigger errors on re-run), then attaches the fresh `trigger_set_updated_at` function to it.

The use of `EXECUTE format('ALTER TABLE %I ...', target_table)` is important: `%I` is PostgreSQL's **identifier quoting** placeholder (like `?` for values), which safely escapes the table name and prevents SQL injection in dynamic DDL.

**Step 3 — Fix the junction table.**
The `expense_tracker_expense_tags` table was created in `002` with a composite primary key `(expense_id, tag_id)`. The `BaseEntity` pattern requires every table to have a single integer `id` column. So this migration dropped the composite primary key, added a `SERIAL PRIMARY KEY id` column, and restored uniqueness on the pair via a `UNIQUE` constraint. The `DO $$ ... $$` block checks whether the constraint already exists before adding it, making it safe to re-run.

**Step 4 — Apply the pattern to all existing tables.**
```sql
CALL apply_base_entity('expense_tracker_categories');
CALL apply_base_entity('expense_tracker_expenses');
CALL apply_base_entity('expense_tracker_payment_methods');
CALL apply_base_entity('expense_tracker_tags');
CALL apply_base_entity('expense_tracker_expense_tags');
```
Five `CALL` statements. Every table in the database now has identical audit fields and an active trigger. When the next module is added (Notes, Tasks, etc.), a new table just needs one `CALL apply_base_entity('new_table')` in its migration and it instantly inherits the full audit behaviour.

### Soft Deletes
When you want to delete a record, `BaseEntity.deleteById(id)` doesn't run `DELETE FROM`. It runs `UPDATE ... SET deleted_at = NOW()`. Because all your `.findById()` and `.findMany()` queries are hardcoded to append `AND deleted_at IS NULL`, the deleted record instantly becomes "invisible" to the app without actually losing the historical data. The `deleted_at` column, introduced uniformly by `003`, is what makes this work across every table.
