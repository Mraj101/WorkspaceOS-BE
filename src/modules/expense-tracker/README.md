# Expense Tracker Module

A personal expense tracking module for the Workspace platform with categories, tags, payment methods, and analytics.

## Tables

| Table | Purpose |
|---|---|
| `expense_tracker_categories` | Reusable category labels (Food, Transport, etc.) |
| `expense_tracker_expenses` | Individual expense records |
| `expense_tracker_payment_methods` | Payment method reference (Cash, Card, etc.) |
| `expense_tracker_tags` | Flexible tags that can be applied to any expense |
| `expense_tracker_expense_tags` | Junction table: expense ↔ tag (many-to-many) |

## Endpoints

### Categories

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | List all categories |
| `POST` | `/api/categories` | Create a category |
| `DELETE` | `/api/categories/:id` | Delete a category |

### Payment Methods

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/payment-methods` | List all payment methods |
| `POST` | `/api/payment-methods` | Create a payment method |
| `DELETE` | `/api/payment-methods/:id` | Delete a payment method |

### Tags

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tags` | List all tags |
| `POST` | `/api/tags` | Create a tag |
| `DELETE` | `/api/tags/:id` | Delete a tag |

### Expenses

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expenses` | List expenses (with filters & pagination) |
| `GET` | `/api/expenses/summary` | Total per category |
| `GET` | `/api/expenses/analytics` | Rich analytics (trends, comparisons) |
| `GET` | `/api/expenses/:id` | Get one expense (with tags) |
| `POST` | `/api/expenses` | Create an expense |
| `PUT` | `/api/expenses/:id` | Update an expense (partial) |
| `DELETE` | `/api/expenses/:id` | Delete an expense |
| `POST` | `/api/expenses/bulk` | Bulk create expenses |
| `DELETE` | `/api/expenses/bulk` | Bulk delete by IDs |
| `POST` | `/api/expenses/:id/tags` | Attach a tag to an expense |
| `DELETE` | `/api/expenses/:id/tags/:tagId` | Remove a tag from an expense |

## Query Filters (`GET /api/expenses`)

```
?category_id=1         → filter by category
?from=2026-01-01       → from date
?to=2026-01-31         → to date
?search=coffee         → full-text search on title + note
?payment_method=cash   → filter by payment method
?min_amount=100        → minimum amount
?max_amount=500        → maximum amount
?tags=1,3,5            → filter by tag IDs (comma-separated)
?is_recurring=true     → filter recurring expenses
?sort=amount_desc      → sort: date_asc, date_desc, amount_asc, amount_desc
?page=1                → page number (default 1)
?pageSize=20           → items per page (default 20, max 100)
```

## Response Format

### Paginated List (`GET /api/expenses`)
```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 142,
    "totalPages": 8
  }
}
```

### Single Expense (includes tags)
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Lunch at café",
    "amount": "12.50",
    "category_id": 1,
    "category_name": "Food",
    "category_icon": "🍕",
    "payment_method": "cash",
    "is_recurring": false,
    "tags": [
      { "id": 1, "name": "Work", "color": "#3B82F6" }
    ]
  }
}
```

### Duplicate Warning
When creating an expense that matches an existing one (same title + amount + date within 5 minutes):
```json
{
  "status": "success",
  "data": {
    "id": 15,
    "title": "Coffee",
    "_warning": {
      "message": "Possible duplicate: 1 similar expense(s) found in the last 5 minutes",
      "duplicates": [{ "id": 14, "title": "Coffee", "amount": "4.50" }]
    }
  }
}
```

## Example Request Bodies

### Create Expense
```json
{
  "title": "Lunch at café",
  "amount": 12.50,
  "category_id": 1,
  "note": "Had the pasta",
  "spent_at": "2026-06-01",
  "payment_method": "cash",
  "is_recurring": false
}
```

### Bulk Create
```json
{
  "expenses": [
    { "title": "Coffee", "amount": 4.50, "category_id": 1 },
    { "title": "Bus fare", "amount": 2.00, "category_id": 2 }
  ]
}
```

### Bulk Delete
```json
{
  "ids": [1, 2, 3]
}
```

### Attach Tag
```json
{
  "tag_id": 1
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

### Create Tag
```json
{
  "name": "Tax Deductible",
  "color": "#10B981"
}
```

## Business Logic Rules

| Rule | Description |
|---|---|
| **Amount cap** | Max 10,000,000 per expense |
| **No future dates** | `spent_at` cannot be tomorrow or later |
| **Category must exist** | `category_id` is validated against the DB before insert/update |
| **Duplicate detection** | Warns if same title + amount + date exists within 5 min |
| **Auto updated_at** | Every update sets `updated_at = NOW()` automatically |
| **Pagination limits** | Max 100 items per page |
| **Bulk limits** | Max 50 items per bulk create |

## Data Access Style

Uses **raw SQL** via the shared `pg` Pool from `src/config/db.js`.
No ORM. Complex queries (JOINs, aggregates) are in `queries.js`.
Analytics queries are separated into `analytics.js`.
