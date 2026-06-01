# Expense Tracker Module

A simple personal expense tracking module for the Workspace platform.

## Tables

| Table | Purpose |
|---|---|
| `expense_tracker_categories` | Reusable category labels (Food, Transport, etc.) |
| `expense_tracker_expenses` | Individual expense records |

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | List all categories |
| `POST` | `/api/categories` | Create a category |
| `DELETE` | `/api/categories/:id` | Delete a category |
| `GET` | `/api/expenses` | List expenses (supports filters) |
| `GET` | `/api/expenses/summary` | Total per category |
| `GET` | `/api/expenses/:id` | Get one expense |
| `POST` | `/api/expenses` | Create an expense |
| `PUT` | `/api/expenses/:id` | Update an expense (partial) |
| `DELETE` | `/api/expenses/:id` | Delete an expense |

## Query Filters (`GET /api/expenses`)

```
?category_id=1      → filter by category
?from=2025-01-01    → from date
?to=2025-01-31      → to date
?limit=20           → page size (default 50)
?offset=0           → pagination offset
```

## Example Request Bodies

### Create Expense
```json
{
  "title": "Lunch at café",
  "amount": 12.50,
  "category_id": 1,
  "note": "Had the pasta",
  "spent_at": "2025-06-01"
}
```

### Create Category
```json
{
  "name": "Travel",
  "icon": "✈️",
  "color": "#74B9FF"
}
```

## Data Access Style

Uses **raw SQL** via the shared `pg` Pool from `src/config/db.js`.
No ORM. Complex queries (JOINs, aggregates) are in `queries.js`.
