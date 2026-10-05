# Expense Tracker Module

Personal expense tracking for the Workspace platform, built on **envelope
budgeting**: you fund a budget for a fixed window, and expenses draw it down.

## Model

A **budget** is a named pot with a fixed window — `start_date` to `end_date`,
both required. There is no recurring cadence: "October food" is a budget whose
window happens to be October. A monthly rhythm is many budgets, one per month.

An **expense** draws from exactly one budget, or none. The server decides which,
from the expense's category and date — clients never pick. A category-specific
budget wins over an overall one, so groceries hit the Food pot rather than the
catch-all. Spending that no budget covers is still recorded with
`budget_id = null`; refusing to log real spending would be worse than leaving it
unbudgeted.

Because at most one budget per scope may cover any given date (enforced at
create time with a `409`), resolution is unambiguous and "what's left" is a
single `SUM`.

## Tables

| Table | Purpose |
|---|---|
| `users` | Platform-level accounts. Minimal until the auth module lands |
| `expense_tracker_categories` | Reusable labels (Food, Transport, …). Global, 7 seeded |
| `expense_tracker_budgets` | A funded pot for a fixed date window |
| `expense_tracker_expenses` | Individual spending records, each drawing from ≤1 budget |

Every table carries `created_at`, `updated_at` (trigger-maintained) and
`deleted_at` (soft delete). `BaseEntity` strips all three from client payloads,
so they can never be set from a request body.

`expenses` and `budgets` carry `user_id`; categories are global reference data
for now. Deleting a category is `RESTRICT`ed while anything references it.

## Endpoints

Base path: `/api/v1/expense_tracker`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/budgets/crt` | Create a budget |
| `POST` | `/expenses/crt` | Create an expense (budget resolved server-side) |

Read, update and delete are not built yet. Category CRUD is deferred — the 7
seeded categories cover normal use.

## Request Bodies

### Create Budget
```json
{
  "name": "Food October",
  "amount": 5000,
  "category_id": 1,
  "start_date": "2026-10-01",
  "end_date": "2026-10-31"
}
```
`category_id` is optional — omit it for an **overall** budget covering all
spending. Everything else is required.

### Create Expense
```json
{
  "title": "Groceries",
  "amount": 850,
  "category_id": 1,
  "note": "Weekly shop",
  "spent_at": "2026-10-01"
}
```
Only `title` and `amount` are required; `spent_at` defaults to today.
`budget_id` is **not** accepted — the server resolves it.

## Response Format

```json
{
  "data": { "...": "the created row", "budget_id": 5,
            "_budget": { "id": 5, "name": "Food October", "amount": "5000.00" } },
  "error": false,
  "status": 201,
  "message": "Expense created successfully"
}
```

`_budget` reports which pot the expense landed in, or `null` when unbudgeted —
without it, server-side resolution would be invisible to the caller.

### Duplicate Warning
Creating an expense matching an existing one (same title + amount + date, within
5 minutes) succeeds and attaches a warning:

```json
{
  "_warning": {
    "message": "Possible duplicate: 1 similar expense(s) found in the last 5 minutes",
    "duplicates": [{ "id": 14, "title": "Coffee", "amount": "4.50" }]
  }
}
```

## Business Rules

| Rule | Description |
|---|---|
| **Expense amount cap** | Max 10,000,000 |
| **Budget amount cap** | Max 100,000,000 |
| **No future spending** | `spent_at` cannot be tomorrow or later |
| **Budgets may start in the future** | No such restriction on `start_date` |
| **Budget window** | `end_date` must be after `start_date`; both required |
| **Category must exist** | Validated before insert on both resources |
| **One budget per scope per window** | Overlapping budgets for the same scope → `409` |
| **Budget resolution** | Category-specific beats overall; no match → `budget_id: null` |
| **Duplicate detection** | Warns (does not block) on same title + amount + date within 5 min |
| **Ownership** | Taken from `req.user.id`; `user_id` in a request body is rejected |

## Auth

Not built. [`src/middleware/currentUser.js`](../../middleware/currentUser.js)
resolves every request to the seeded dev user (id 1). It is the **only** place
that decides identity — controllers pass `req.user.id` down, and every query
filters on `user_id`, so shipping real auth means replacing that one file.

## Data Access Style

Raw SQL via the shared `pg` Pool from `src/config/db.js`. No ORM. All SQL lives
in `*.queries.js` — never in a service or controller — so ownership filtering
has exactly one layer to audit.

## Deliberately Removed

Tags, the expense↔tag junction, payment methods, `is_recurring`, and budget
`period` were dropped in migration `004`. Each was either unreferenced by any
code or ambiguous: budget `period` in particular made drawdown unresolvable,
since summing expenses against a recurring rule spans every period at once.
