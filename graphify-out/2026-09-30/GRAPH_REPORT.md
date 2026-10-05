# Graph Report - Workspace Be  (2026-09-30)

## Corpus Check
- 49 files · ~17,758 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .graphify-bak 1, .bak 1)

## Summary
- 294 nodes · 335 edges · 29 communities (19 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `543d230c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- errors/index.js
- Expense Tracker Module
- package.json
- What You Must Do When Invoked
- 4. How the Database & Migrations Work
- service.js
- /graphify
- errorHandler.js
- category.controller.js
- graphify reference: extra exports and benchmark
- Graphify Rule
- migrate.js
- src/app.js Express App
- Soft Delete Pattern
- graphify Tool
- CLAUDE.md
- .claude/CLAUDE.md
- BaseEntity
- README.md
- Migration 002: Expense Tracker Enhance
- Graphify Rules
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `What You Must Do When Invoked` - 16 edges
2. `/graphify` - 15 edges
3. `sendSuccess()` - 11 edges
4. `Expense Tracker Module` - 9 edges
5. `graphify reference: extra exports and benchmark` - 8 edges
6. `BaseEntity` - 7 edges
7. `Example Request Bodies` - 7 edges
8. `4. How the Database & Migrations Work` - 7 edges
9. `scripts` - 6 edges
10. `express` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Expense Tracker Module` --conceptually_related_to--> `Migration 001: Expense Tracker Init`  [INFERRED]
  src/modules/expense-tracker/README.md → backend_architecture_walkthrough.md
- `Graphify Workflow` --conceptually_related_to--> `Graphify Rule`  [INFERRED]
  .agents/workflows/graphify.md → .agents/rules/graphify.md
- `mapPgError()` --calls--> `ConflictError`  [EXTRACTED]
  src/errors/pgErrorMapper.js → src/errors/httpErrors.js
- `budgetController()` --calls--> `sendSuccess()`  [EXTRACTED]
  src/modules/expense-tracker/budget/budget.controller.js → src/lib/response.js
- `createCategory()` --calls--> `sendSuccess()`  [EXTRACTED]
  src/modules/expense-tracker/category/category.controller.js → src/lib/response.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify System Integration** — agents_rules_graphify_graphify_rule, agents_workflows_graphify_graphify_workflow, agents_rules_graphify_graphify_cli [EXTRACTED 0.90]

## Communities (29 total, 10 thin omitted)

### Community 0 - "errors/index.js"
Cohesion: 0.11
Nodes (14): AppError, AppError, ConflictError, NotFoundError, UnauthorizedError, ValidationError, AppError, mapPgError (+6 more)

### Community 1 - "Expense Tracker Module"
Cohesion: 0.08
Nodes (23): Migration 001: Expense Tracker Init, Attach Tag, Bulk Create, Bulk Delete, Business Logic Rules, Categories, Create Category, Create Expense (+15 more)

### Community 2 - "package.json"
Cohesion: 0.05
Nodes (40): author, dependencies, cors, dotenv, express, helmet, morgan, pg (+32 more)

### Community 3 - "What You Must Do When Invoked"
Cohesion: 0.11
Nodes (19): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - Clone GitHub repo(s) (only if a GitHub URL was given), Step 1 - Ensure graphify is installed, Step 2.5 - Transcribe video / audio files (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+11 more)

### Community 4 - "4. How the Database & Migrations Work"
Cohesion: 0.12
Nodes (16): 1. The Entry Point (`server.js` & `src/app.js`), 2. The HTTP Request Journey (The Expense Tracker), 3. How Responses and Errors are Handled, 4. How the Database & Migrations Work, Errors, How Migrations Work in Practice, Migration `001` — The Foundation (`001_expense_tracker_init.sql`), Migration `002` — The Enhancement (`002_expense_tracker_enhance.sql`) (+8 more)

### Community 5 - "service.js"
Cohesion: 0.12
Nodes (10): src_errors_index_validationerror, { ValidationError }, validateSchema, ctrl, { Router }, validate, createExpense(), q (+2 more)

### Community 6 - "/graphify"
Cohesion: 0.12
Nodes (16): For --cluster-only, For git commit hook, For /graphify add, For /graphify explain, For /graphify path, For /graphify query, For native CLAUDE.md integration, For --update (incremental re-extraction) (+8 more)

### Community 7 - "errorHandler.js"
Cohesion: 0.23
Nodes (12): app, { logError }, sendError(), AppError, buildExtras(), errorHandler(), isProduction(), { logError } (+4 more)

### Community 8 - "category.controller.js"
Cohesion: 0.11
Nodes (20): sendSuccess(), asyncHandler, budgetController(), {createBudget}, {sendSuccess}, {budgetController}, { Router }, createBudget() (+12 more)

### Community 9 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 10 - "Graphify Rule"
Cohesion: 0.40
Nodes (5): Graphify CLI, Graphify Output Directory, Graphify Rule, Graphify Workflow, Graphify Skill Definition

### Community 11 - "migrate.js"
Cohesion: 0.12
Nodes (13): ref_fs, ref_path, pg, { Client }, ensureDatabaseExists(), fs, path, runMigrations() (+5 more)

### Community 12 - "src/app.js Express App"
Cohesion: 0.67
Nodes (3): src/app.js Express App, errorHandler.js Global Handler, server.js Entry Point

### Community 13 - "Soft Delete Pattern"
Cohesion: 0.67
Nodes (3): BaseEntity.js CRUD Powerhouse, Migration 003: Base Audit Pattern, Soft Delete Pattern

### Community 14 - "graphify Tool"
Cohesion: 0.67
Nodes (3): graphify Skill, Knowledge Graph Pipeline, graphify Tool

### Community 22 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 24 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 25 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 26 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **163 isolated node(s):** `name`, `version`, `main`, `dev`, `start` (+158 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 201 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `package.json` to `category.controller.js`, `service.js`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `pg` connect `migrate.js` to `package.json`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `name`, `version`, `main` to the rest of the system?**
  _163 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `errors/index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11396011396011396 - nodes in this community are weakly interconnected._
- **Should `Expense Tracker Module` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0463768115942029 - nodes in this community are weakly interconnected._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._