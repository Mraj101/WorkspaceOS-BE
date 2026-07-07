# Graph Report - .  (2026-07-07)

## Corpus Check
- 7 files · ~13,562 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 163 nodes · 169 edges · 19 communities (13 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]

## God Nodes (most connected - your core abstractions)
1. `Expense Tracker Module` - 9 edges
2. `BaseEntity` - 7 edges
3. `4. How the Database & Migrations Work` - 7 edges
4. `Example Request Bodies` - 7 edges
5. `errorHandler()` - 6 edges
6. `Endpoints` - 6 edges
7. `scripts` - 5 edges
8. `2. The HTTP Request Journey (The Expense Tracker)` - 5 edges
9. `logError()` - 4 edges
10. `Response Format` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Expense Tracker Module` --conceptually_related_to--> `Migration 001: Expense Tracker Init`  [INFERRED]
  src/modules/expense-tracker/README.md → backend_architecture_walkthrough.md
- `errorHandler()` --calls--> `sendError()`  [EXTRACTED]
  src/middleware/errorHandler.js → src/lib/response.js
- `errorHandler()` --calls--> `logError()`  [EXTRACTED]
  src/middleware/errorHandler.js → src/utils/logger.js
- `validateSchema()` --calls--> `ValidationError`  [EXTRACTED]
  src/middleware/validateRequired.js → src/errors/httpErrors.js
- `graphify Skill` --references--> `graphify Tool`  [EXTRACTED]
  .claude/CLAUDE.md → .claude/skills/graphify/SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Expense Tracker Schema Evolution** — backend_architecture_walkthrough_migration001, backend_architecture_walkthrough_migration002, backend_architecture_walkthrough_migration003 [EXTRACTED 1.00]
- **HTTP Request Lifecycle** — backend_architecture_walkthrough_appjs, backend_architecture_walkthrough_errorhandler, backend_architecture_walkthrough_baseentity [INFERRED 0.85]

## Communities (19 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (21): author, dependencies, cors, dotenv, express, helmet, morgan, pg (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (9): AppError, AppError, mapPgError, {
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
}, AppError, { ConflictError }, q, { ValidationError } (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (16): 1. The Entry Point (`server.js` & `src/app.js`), 2. The HTTP Request Journey (The Expense Tracker), 3. How Responses and Errors are Handled, 4. How the Database & Migrations Work, Errors, How Migrations Work in Practice, Migration `001` — The Foundation (`001_expense_tracker_init.sql`), Migration `002` — The Enhancement (`002_expense_tracker_enhance.sql`) (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (16): Migration 001: Expense Tracker Init, Business Logic Rules, Expense Tracker Business Logic, Categories, Data Access Style, Duplicate Warning, Endpoints, Expense Tracker Module (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (6): { Pool }, BaseEntity, expensesEntity, pool, BaseEntity, pool

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (12): sendError(), AppError, buildExtras(), errorHandler(), isProduction(), { logError }, mapError(), mapPgError (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (9): { randomUUID }, app, cors, errorHandler, express, helmet, morgan, notFound (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.20
Nodes (7): ValidationError, ctrl, { Router }, validate, validateSchema, validateSchema(), { ValidationError }

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (4): asyncHandler, { sendSuccess }, service, sendSuccess()

### Community 9 - "Community 9"
Cohesion: 0.29
Nodes (7): Attach Tag, Bulk Create, Bulk Delete, Create Category, Create Expense, Create Tag, Example Request Bodies

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (3): src/app.js Express App, errorHandler.js Global Handler, server.js Entry Point

### Community 11 - "Community 11"
Cohesion: 0.67
Nodes (3): BaseEntity.js CRUD Powerhouse, Migration 003: Base Audit Pattern, Soft Delete Pattern

### Community 12 - "Community 12"
Cohesion: 0.67
Nodes (3): graphify Skill, Knowledge Graph Pipeline, graphify Tool

## Knowledge Gaps
- **95 isolated node(s):** `name`, `version`, `main`, `dev`, `start` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Expense Tracker Module` connect `Community 3` to `Community 9`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `ValidationError` connect `Community 7` to `Community 1`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `name`, `version`, `main` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._