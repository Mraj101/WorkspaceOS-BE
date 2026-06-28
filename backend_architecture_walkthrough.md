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
You are using raw SQL migrations located in the `/migrations/` folder. These files define the shape of your tables.

1. **`001` & `002`**: These initial migrations created the tables (`expenses`, `categories`, `tags`) and defined constraints (like `amount > 0`).
2. **`003_base_audit_pattern.sql`**: This migration introduced standard architecture rules to your database:
   - It created a PostgreSQL procedure called `apply_base_entity()`.
   - When called on a table, this procedure automatically injects `created_at`, `updated_at`, and `deleted_at` columns.
   - It also attaches a PostgreSQL **Trigger** (`trigger_set_updated_at`). 
   - **Why this is powerful:** Because of this trigger and default values (`DEFAULT NOW()`), your Node.js backend NEVER has to insert timestamps. The moment a row is inserted or updated, the database engine itself calculates the exact microsecond timestamp and saves it.

### Soft Deletes
When you want to delete a record, `BaseEntity.deleteById(id)` doesn't run `DELETE FROM`. It runs `UPDATE ... SET deleted_at = NOW()`. Because all your `.findById()` and `.findMany()` queries are hardcoded to append `AND deleted_at IS NULL`, the deleted record instantly becomes "invisible" to the app without actually losing the historical data.
