# Graph Report - .  (2026-08-23)

## Corpus Check
- 4 files · ~13,534 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 222 nodes · 232 edges · 22 communities (15 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.86)
- Token cost: 1,213 input · 675 output

## Community Hubs (Navigation)
- [[_COMMUNITY_HTTP Errors & AppError|HTTP Errors & AppError]]
- [[_COMMUNITY_Expense Tracker Database Migration|Expense Tracker Database Migration]]
- [[_COMMUNITY_Workspace Dependencies & package.json|Workspace Dependencies & package.json]]
- [[_COMMUNITY_Graphify Pipeline Steps|Graphify Pipeline Steps]]
- [[_COMMUNITY_Backend Architecture Walkthrough|Backend Architecture Walkthrough]]
- [[_COMMUNITY_Database Configuration & Queries|Database Configuration & Queries]]
- [[_COMMUNITY_Graphify Skill Actions|Graphify Skill Actions]]
- [[_COMMUNITY_Express API Responses & Error Handler|Express API Responses & Error Handler]]
- [[_COMMUNITY_Express Routing & Controllers|Express Routing & Controllers]]
- [[_COMMUNITY_Express Middleware NotFound & RequestId|Express Middleware: NotFound & RequestId]]
- [[_COMMUNITY_Graphify Assistant Rules & Workflows|Graphify Assistant Rules & Workflows]]
- [[_COMMUNITY_Database Migrations Script|Database Migrations Script]]
- [[_COMMUNITY_Express Application Structure|Express Application Structure]]
- [[_COMMUNITY_BaseEntity Pattern & Soft Delete|BaseEntity Pattern & Soft Delete]]
- [[_COMMUNITY_Graphify Core Tools|Graphify Core Tools]]
- [[_COMMUNITY_Claude Settings & Hooks|Claude Settings & Hooks]]
- [[_COMMUNITY_CLAUDE.md Graphify Configuration|CLAUDE.md Graphify Configuration]]
- [[_COMMUNITY_CLAUDE.md Graphify Configurations|CLAUDE.md Graphify Configurations]]
- [[_COMMUNITY_Express Route Registration|Express Route Registration]]
- [[_COMMUNITY_Workspace project README|Workspace project README]]
- [[_COMMUNITY_Expense Tracker Migration Enhancement|Expense Tracker Migration Enhancement]]
- [[_COMMUNITY_Graphify Rules|Graphify Rules]]

## God Nodes (most connected - your core abstractions)
1. `What You Must Do When Invoked` - 16 edges
2. `/graphify` - 15 edges
3. `Expense Tracker Module` - 9 edges
4. `BaseEntity` - 7 edges
5. `4. How the Database & Migrations Work` - 7 edges
6. `Example Request Bodies` - 7 edges
7. `ValidationError` - 6 edges
8. `errorHandler()` - 6 edges
9. `Endpoints` - 6 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Expense Tracker Module` --conceptually_related_to--> `Migration 001: Expense Tracker Init`  [INFERRED]
  src/modules/expense-tracker/README.md → backend_architecture_walkthrough.md
- `validateSchema()` --calls--> `ValidationError`  [EXTRACTED]
  src/middleware/validateRequired.js → src/errors/httpErrors.js
- `Graphify Workflow` --conceptually_related_to--> `Graphify Rule`  [INFERRED]
  .agents/workflows/graphify.md → .agents/rules/graphify.md
- `errorHandler()` --calls--> `sendError()`  [EXTRACTED]
  src/middleware/errorHandler.js → src/lib/response.js
- `errorHandler()` --calls--> `logError()`  [EXTRACTED]
  src/middleware/errorHandler.js → src/utils/logger.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify System Integration** — graphify_graphify_rule, graphify_graphify_workflow, graphify_graphify_cli [EXTRACTED 0.90]

## Communities (22 total, 7 thin omitted)

### Community 0 - "HTTP Errors & AppError"
Cohesion: 0.10
Nodes (13): AppError, AppError, ConflictError, NotFoundError, UnauthorizedError, ValidationError, AppError, mapPgError (+5 more)

### Community 1 - "Expense Tracker Database Migration"
Cohesion: 0.08
Nodes (23): Migration 001: Expense Tracker Init, Attach Tag, Bulk Create, Bulk Delete, Business Logic Rules, Expense Tracker Business Logic, Categories, Create Category (+15 more)

### Community 2 - "Workspace Dependencies & package.json"
Cohesion: 0.09
Nodes (21): author, dependencies, cors, dotenv, express, helmet, morgan, pg (+13 more)

### Community 3 - "Graphify Pipeline Steps"
Cohesion: 0.11
Nodes (19): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - Clone GitHub repo(s) (only if a GitHub URL was given), Step 1 - Ensure graphify is installed, Step 2.5 - Transcribe video / audio files (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+11 more)

### Community 4 - "Backend Architecture Walkthrough"
Cohesion: 0.12
Nodes (16): 1. The Entry Point (`server.js` & `src/app.js`), 2. The HTTP Request Journey (The Expense Tracker), 3. How Responses and Errors are Handled, 4. How the Database & Migrations Work, Errors, How Migrations Work in Practice, Migration `001` — The Foundation (`001_expense_tracker_init.sql`), Migration `002` — The Enhancement (`002_expense_tracker_enhance.sql`) (+8 more)

### Community 5 - "Database Configuration & Queries"
Cohesion: 0.13
Nodes (6): { Pool }, BaseEntity, expensesEntity, pool, BaseEntity, pool

### Community 6 - "Graphify Skill Actions"
Cohesion: 0.12
Nodes (16): For --cluster-only, For git commit hook, For /graphify add, For /graphify explain, For /graphify path, For /graphify query, For native CLAUDE.md integration, For --update (incremental re-extraction) (+8 more)

### Community 7 - "Express API Responses & Error Handler"
Cohesion: 0.19
Nodes (13): sendError(), sendSuccess(), AppError, buildExtras(), errorHandler(), isProduction(), { logError }, mapError() (+5 more)

### Community 8 - "Express Routing & Controllers"
Cohesion: 0.12
Nodes (9): asyncHandler, { sendSuccess }, service, ctrl, { Router }, validate, q, { ValidationError } (+1 more)

### Community 9 - "Express Middleware: NotFound & RequestId"
Cohesion: 0.13
Nodes (10): { NotFoundError }, { randomUUID }, app, cors, errorHandler, express, helmet, morgan (+2 more)

### Community 10 - "Graphify Assistant Rules & Workflows"
Cohesion: 0.40
Nodes (5): Graphify CLI, Graphify Output Directory, Graphify Rule, Graphify Workflow, Graphify Skill Definition

### Community 11 - "Database Migrations Script"
Cohesion: 0.40
Nodes (3): fs, path, pool

### Community 12 - "Express Application Structure"
Cohesion: 0.67
Nodes (3): src/app.js Express App, errorHandler.js Global Handler, server.js Entry Point

### Community 13 - "BaseEntity Pattern & Soft Delete"
Cohesion: 0.67
Nodes (3): BaseEntity.js CRUD Powerhouse, Migration 003: Base Audit Pattern, Soft Delete Pattern

### Community 14 - "Graphify Core Tools"
Cohesion: 0.67
Nodes (3): graphify Skill, Knowledge Graph Pipeline, graphify Tool

## Knowledge Gaps
- **134 isolated node(s):** `name`, `version`, `main`, `dev`, `start` (+129 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `What You Must Do When Invoked` connect `Graphify Pipeline Steps` to `Graphify Skill Actions`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `/graphify` connect `Graphify Skill Actions` to `Graphify Pipeline Steps`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `name`, `version`, `main` to the rest of the system?**
  _136 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Errors & AppError` be split into smaller, more focused modules?**
  _Cohesion score 0.10461538461538461 - nodes in this community are weakly interconnected._
- **Should `Expense Tracker Database Migration` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Workspace Dependencies & package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Graphify Pipeline Steps` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._