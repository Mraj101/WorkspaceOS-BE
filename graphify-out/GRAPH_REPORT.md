# Graph Report - WorkSpace-BE  (2026-06-23)

## Corpus Check
- 28 files · ~10,938 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 185 nodes · 196 edges · 16 communities (10 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ef2fdc7b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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

## God Nodes (most connected - your core abstractions)
1. `What You Must Do When Invoked` - 16 edges
2. `/graphify` - 15 edges
3. `Expense Tracker Module` - 8 edges
4. `Example Request Bodies` - 7 edges
5. `ValidationError` - 5 edges
6. `Endpoints` - 5 edges
7. `scripts` - 4 edges
8. `ConflictError` - 4 edges
9. `errorHandler()` - 4 edges
10. `logError()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `errorHandler()` --calls--> `logError()`  [EXTRACTED]
  src/middleware/errorHandler.js → src/utils/logger.js

## Import Cycles
- None detected.

## Communities (16 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (19): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - Clone GitHub repo(s) (only if a GitHub URL was given), Step 1 - Ensure graphify is installed, Step 2.5 - Transcribe video / audio files (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (16): For --cluster-only, For git commit hook, For /graphify add, For /graphify explain, For /graphify path, For /graphify query, For native CLAUDE.md integration, For --update (incremental re-extraction) (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (20): author, dependencies, cors, dotenv, express, helmet, morgan, pg (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (10): AppError, asyncHandler, service, ctrl, { Router }, AppError, categoryQueries, q (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (10): { NotFoundError }, { randomUUID }, app, cors, errorHandler, express, helmet, morgan (+2 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (5): buildExpenseFilterClause(), countExpenses(), getExpenses(), pool, SORT_MAP

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (21): Attach Tag, Bulk Create, Bulk Delete, Business Logic Rules, Categories, Create Category, Create Expense, Create Tag (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (11): AppError, AppError, ConflictError, NotFoundError, UnauthorizedError, ValidationError, AppError, mapPgError (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.50
Nodes (4): expenses, http, postExpense(), seed()

### Community 15 - "Community 15"
Cohesion: 0.24
Nodes (10): AppError, buildErrorResponse(), errorHandler(), isProduction(), { logError }, mapError(), mapPgError, app (+2 more)

## Knowledge Gaps
- **106 isolated node(s):** `PreToolUse`, `name`, `version`, `main`, `dev` (+101 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `What You Must Do When Invoked` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `/graphify` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `PreToolUse`, `name`, `version` to the rest of the system?**
  _106 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._