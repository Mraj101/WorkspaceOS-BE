# Graph Report - Workspace Be  (2026-10-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 276 nodes · 370 edges · 22 communities (13 shown, 9 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0dc5632e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Graphify Pipeline
- app.js
- expense.queries.js
- 001_setup_schema.sql
- express
- errors/index.js
- sendSuccess
- Server-Side Budget Resolution
- errorHandler.js
- dependencies
- budget.service.js
- Graphify Rule
- App Entry Walkthrough
- BaseEntity & Soft Deletes
- Migration 001: Expense Tracker Init
- Migration 002: Expense Tracker Enhance
- Graphify Rules
- WorkspaceOS-BE
- BaseEntity

## God Nodes (most connected - your core abstractions)
1. `Graphify Pipeline` - 16 edges
2. `sendSuccess()` - 12 edges
3. `Incremental Update (--update)` - 8 edges
4. `BaseEntity` - 7 edges
5. `Extraction Subagent Prompt` - 7 edges
6. `ConflictError` - 6 edges
7. `ValidationError` - 6 edges
8. `errorHandler()` - 6 edges
9. `scripts` - 6 edges
10. `express` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Duplicate Expense Detection` --semantically_similar_to--> `EXTRACTED / INFERRED / AMBIGUOUS Audit Trail`  [INFERRED] [semantically similar]
  src/modules/expense-tracker/README.md → .claude/skills/graphify/references/extraction-spec.md
- `One Budget Per Scope Per Window` --semantically_similar_to--> `Node ID Format`  [INFERRED] [semantically similar]
  src/modules/expense-tracker/README.md → .claude/skills/graphify/references/extraction-spec.md
- `currentUser Identity Seam` --semantically_similar_to--> `Python Interpreter Resolution`  [INFERRED] [semantically similar]
  src/modules/expense-tracker/README.md → .claude/skills/graphify/SKILL.md
- `Post-Commit Auto-Rebuild Hook` --semantically_similar_to--> `Folder Watcher (--watch)`  [INFERRED] [semantically similar]
  .claude/skills/graphify/references/hooks.md → .claude/skills/graphify/references/add-watch.md
- `Cross-Repo Graph Merge` --semantically_similar_to--> `build_merge Replace-on-Re-extract`  [INFERRED] [semantically similar]
  .claude/skills/graphify/references/github-and-merge.md → .claude/skills/graphify/references/update.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify System Integration** — agents_rules_graphify_graphify_rule, agents_workflows_graphify_graphify_workflow, agents_rules_graphify_graphify_cli [EXTRACTED 0.90]
- **Expense Tracker Schema Evolution** — backend_architecture_walkthrough_migration001, backend_architecture_walkthrough_migration002, backend_architecture_walkthrough_migration003 [EXTRACTED 1.00]
- **Server-Authority Invariants** — src_modules_expense_tracker_readme_server_side_budget_resolution, src_modules_expense_tracker_readme_ownership_filtering, src_modules_expense_tracker_readme_base_entity, src_modules_expense_tracker_readme_one_budget_per_scope_per_window, src_modules_expense_tracker_readme_current_user_middleware [INFERRED 0.85]
- **Extraction Integrity Guards** — _claude_skills_graphify_references_extraction_spec_node_id_format, _claude_skills_graphify_references_extraction_spec_source_file_rule, _claude_skills_graphify_skill_shrink_guard, _claude_skills_graphify_skill_graph_health_check, _claude_skills_graphify_skill_semantic_extraction_cache [INFERRED 0.85]
- **Mechanisms Keeping The Graph Current** — _claude_skills_graphify_references_update_incremental_update, _claude_skills_graphify_references_add_watch_folder_watcher, _claude_skills_graphify_references_hooks_post_commit_hook, _claude_skills_graphify_references_add_watch_url_ingest, _claude_skills_graphify_skill_manifest_stamping [INFERRED 0.85]
- **HTTP Request Lifecycle** — backend_architecture_walkthrough_appjs, backend_architecture_walkthrough_errorhandler, backend_architecture_walkthrough_baseentity [INFERRED 0.85]

## Communities (22 total, 9 thin omitted)

### Community 0 - "Graphify Pipeline"
Cohesion: 0.08
Nodes (21): Graphify Skill Registration, /graphify Slash Trigger, URL Ingest (/graphify add), FalkorDB Export, Graphify MCP Server, Neo4j Export, Wiki Export, Extraction Subagent Prompt (+13 more)

### Community 1 - "app.js"
Cohesion: 0.06
Nodes (30): author, description, devDependencies, nodemon, keywords, license, main, name (+22 more)

### Community 2 - "expense.queries.js"
Cohesion: 0.05
Nodes (18): pg, { Client }, ensureDatabaseExists(), fs, path, runMigrations(), { Pool }, pool (+10 more)

### Community 3 - "001_setup_schema.sql"
Cohesion: 0.26
Nodes (8): expense_tracker_categories, set_updated_at_categories, set_updated_at_users, users, expense_tracker_budgets, set_updated_at_budgets, expense_tracker_expenses, set_updated_at_expenses

### Community 4 - "express"
Cohesion: 0.10
Nodes (12): express, { ValidationError }, ctrl, { Router }, validate, validateSchema, { Router }, validateSchema (+4 more)

### Community 5 - "errors/index.js"
Cohesion: 0.14
Nodes (12): AppError, AppError, ConflictError, NotFoundError, UnauthorizedError, ValidationError, AppError, mapPgError (+4 more)

### Community 6 - "sendSuccess"
Cohesion: 0.12
Nodes (18): sendSuccess(), asyncHandler, createBudget(), deleteBudget(), { sendSuccess }, service, asyncHandler, createCategory() (+10 more)

### Community 7 - "Server-Side Budget Resolution"
Cohesion: 0.11
Nodes (7): Token Reduction Benchmark, EXTRACTED / INFERRED / AMBIGUOUS Audit Trail, Expense Tracker API Endpoints, Budget, Expense Tracker Category, Expense, Expense Tracker Module

### Community 8 - "errorHandler.js"
Cohesion: 0.22
Nodes (12): app, { logError }, sendError(), AppError, buildExtras(), errorHandler(), isProduction(), { logError } (+4 more)

### Community 9 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, cors, dotenv, express, helmet, morgan, pg

### Community 10 - "budget.service.js"
Cohesion: 0.33
Nodes (5): createBudget(), deleteBudget(), parseDateField(), q, { ValidationError, ConflictError }

### Community 11 - "Graphify Rule"
Cohesion: 0.40
Nodes (5): Graphify CLI, Graphify Output Directory, Graphify Rule, Graphify Workflow, Graphify Skill Definition

### Community 12 - "App Entry Walkthrough"
Cohesion: 0.67
Nodes (3): src/app.js Express App, errorHandler.js Global Handler, server.js Entry Point

## Knowledge Gaps
- **95 isolated node(s):** `author`, `description`, `nodemon`, `keywords`, `license` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 136 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `express` to `app.js`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `pg` connect `expense.queries.js` to `app.js`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `sendSuccess()` connect `sendSuccess` to `errorHandler.js`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `author`, `description`, `nodemon` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Graphify Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.07557354925775979 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05873015873015873 - nodes in this community are weakly interconnected._
- **Should `expense.queries.js` be split into smaller, more focused modules?**
  _Cohesion score 0.053426248548199766 - nodes in this community are weakly interconnected._