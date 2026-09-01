# Graph Report - .  (2026-08-19)

## Corpus Check
- 2 files · ~13,572 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 212 nodes · 222 edges · 21 communities (14 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Error Handling & HTTP Exceptions|Error Handling & HTTP Exceptions]]
- [[_COMMUNITY_Expense Tracker Documentation|Expense Tracker Documentation]]
- [[_COMMUNITY_Project Dependencies & Package Configuration|Project Dependencies & Package Configuration]]
- [[_COMMUNITY_Graphify Pipeline Core Steps|Graphify Pipeline Core Steps]]
- [[_COMMUNITY_Backend Architecture Walkthrough|Backend Architecture Walkthrough]]
- [[_COMMUNITY_Graphify Skill & CLI Reference|Graphify Skill & CLI Reference]]
- [[_COMMUNITY_HTTP Response & Error Logging|HTTP Response & Error Logging]]
- [[_COMMUNITY_Express Application & Request Identification|Express Application & Request Identification]]
- [[_COMMUNITY_Expense Routes & Controller Layer|Expense Routes & Controller Layer]]
- [[_COMMUNITY_Database Configuration & BaseEntity ORM|Database Configuration & BaseEntity ORM]]
- [[_COMMUNITY_Expense Queries & Service Layer|Expense Queries & Service Layer]]
- [[_COMMUNITY_Walkthrough Entry Point & Express Setup|Walkthrough: Entry Point & Express Setup]]
- [[_COMMUNITY_Walkthrough Database Base Audit Pattern|Walkthrough: Database Base Audit Pattern]]
- [[_COMMUNITY_Graphify Skill Integration|Graphify Skill Integration]]
- [[_COMMUNITY_Claude Settings & Hooks|Claude Settings & Hooks]]
- [[_COMMUNITY_Claude Config Files|Claude Config Files]]
- [[_COMMUNITY_Claude CLI Configuration|Claude CLI Configuration]]
- [[_COMMUNITY_Expense Tracker Module Router|Expense Tracker Module Router]]
- [[_COMMUNITY_Project Readme|Project Readme]]
- [[_COMMUNITY_Walkthrough Expense Schema Enhancement|Walkthrough: Expense Schema Enhancement]]
- [[_COMMUNITY_Claude MD Documentation|Claude MD Documentation]]

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
- `errorHandler()` --calls--> `sendError()`  [EXTRACTED]
  src/middleware/errorHandler.js → src/lib/response.js
- `errorHandler()` --calls--> `logError()`  [EXTRACTED]
  src/middleware/errorHandler.js → src/utils/logger.js
- `graphify Skill` --references--> `graphify Tool`  [EXTRACTED]
  .claude/CLAUDE.md → .claude/skills/graphify/SKILL.md

## Import Cycles
- None detected.

## Communities (21 total, 7 thin omitted)

### Community 0 - "Error Handling & HTTP Exceptions"
Cohesion: 0.10
Nodes (13): AppError, AppError, ConflictError, NotFoundError, UnauthorizedError, ValidationError, AppError, mapPgError (+5 more)

### Community 1 - "Expense Tracker Documentation"
Cohesion: 0.08
Nodes (23): Migration 001: Expense Tracker Init, Attach Tag, Bulk Create, Bulk Delete, Business Logic Rules, Expense Tracker Business Logic, Categories, Create Category (+15 more)

### Community 2 - "Project Dependencies & Package Configuration"
Cohesion: 0.09
Nodes (21): author, dependencies, cors, dotenv, express, helmet, morgan, pg (+13 more)

### Community 3 - "Graphify Pipeline Core Steps"
Cohesion: 0.11
Nodes (19): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - Clone GitHub repo(s) (only if a GitHub URL was given), Step 1 - Ensure graphify is installed, Step 2.5 - Transcribe video / audio files (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+11 more)

### Community 4 - "Backend Architecture Walkthrough"
Cohesion: 0.12
Nodes (16): 1. The Entry Point (`server.js` & `src/app.js`), 2. The HTTP Request Journey (The Expense Tracker), 3. How Responses and Errors are Handled, 4. How the Database & Migrations Work, Errors, How Migrations Work in Practice, Migration `001` — The Foundation (`001_expense_tracker_init.sql`), Migration `002` — The Enhancement (`002_expense_tracker_enhance.sql`) (+8 more)

### Community 5 - "Graphify Skill & CLI Reference"
Cohesion: 0.12
Nodes (16): For --cluster-only, For git commit hook, For /graphify add, For /graphify explain, For /graphify path, For /graphify query, For native CLAUDE.md integration, For --update (incremental re-extraction) (+8 more)

### Community 6 - "HTTP Response & Error Logging"
Cohesion: 0.19
Nodes (13): sendError(), sendSuccess(), AppError, buildExtras(), errorHandler(), isProduction(), { logError }, mapError() (+5 more)

### Community 7 - "Express Application & Request Identification"
Cohesion: 0.13
Nodes (10): { NotFoundError }, { randomUUID }, app, cors, errorHandler, express, helmet, morgan (+2 more)

### Community 8 - "Expense Routes & Controller Layer"
Cohesion: 0.17
Nodes (7): asyncHandler, { sendSuccess }, service, ctrl, { Router }, validate, validateSchema

### Community 9 - "Database Configuration & BaseEntity ORM"
Cohesion: 0.20
Nodes (3): { Pool }, BaseEntity, pool

### Community 10 - "Expense Queries & Service Layer"
Cohesion: 0.20
Nodes (5): BaseEntity, expensesEntity, pool, q, { ValidationError }

### Community 11 - "Walkthrough: Entry Point & Express Setup"
Cohesion: 0.67
Nodes (3): src/app.js Express App, errorHandler.js Global Handler, server.js Entry Point

### Community 12 - "Walkthrough: Database Base Audit Pattern"
Cohesion: 0.67
Nodes (3): BaseEntity.js CRUD Powerhouse, Migration 003: Base Audit Pattern, Soft Delete Pattern

### Community 13 - "Graphify Skill Integration"
Cohesion: 0.67
Nodes (3): graphify Skill, Knowledge Graph Pipeline, graphify Tool

## Knowledge Gaps
- **128 isolated node(s):** `name`, `version`, `main`, `dev`, `start` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `What You Must Do When Invoked` connect `Graphify Pipeline Core Steps` to `Graphify Skill & CLI Reference`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `/graphify` connect `Graphify Skill & CLI Reference` to `Graphify Pipeline Core Steps`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `name`, `version`, `main` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Error Handling & HTTP Exceptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10461538461538461 - nodes in this community are weakly interconnected._
- **Should `Expense Tracker Documentation` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Project Dependencies & Package Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Graphify Pipeline Core Steps` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._