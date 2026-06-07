# Graph Report - WorkSpace-BE  (2026-06-04)

## Corpus Check
- 22 files · ~10,490 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 132 nodes · 125 edges · 15 communities (9 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `446ec555`
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

## God Nodes (most connected - your core abstractions)
1. `What You Must Do When Invoked` - 16 edges
2. `/graphify` - 15 edges
3. `Expense Tracker Module` - 6 edges
4. `scripts` - 4 edges
5. `Step 3 - Extract entities and relationships` - 4 edges
6. `For /graphify query` - 3 edges
7. `Example Request Bodies` - 3 edges
8. `hooks` - 2 edges
9. `postExpense()` - 2 edges
10. `seed()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (15 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (19): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - Clone GitHub repo(s) (only if a GitHub URL was given), Step 1 - Ensure graphify is installed, Step 2.5 - Transcribe video / audio files (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (16): For --cluster-only, For git commit hook, For /graphify add, For /graphify explain, For /graphify path, For /graphify query, For native CLAUDE.md integration, For --update (incremental re-extraction) (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (13): author, description, devDependencies, nodemon, keywords, license, main, name (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (7): AppError, asyncHandler, q, service, AppError, q, AppError

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (8): app, app, cors, errorHandler, express, helmet, morgan, notFound

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (8): Create Category, Create Expense, Data Access Style, Endpoints, Example Request Bodies, Expense Tracker Module, Query Filters (`GET /api/expenses`), Tables

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (7): dependencies, cors, dotenv, express, helmet, morgan, pg

### Community 13 - "Community 13"
Cohesion: 0.40
Nodes (3): router, ctrl, { Router }

### Community 14 - "Community 14"
Cohesion: 0.50
Nodes (4): expenses, http, postExpense(), seed()

## Knowledge Gaps
- **80 isolated node(s):** `PreToolUse`, `name`, `version`, `main`, `dev` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `What You Must Do When Invoked` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `/graphify` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 8` to `Community 2`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `PreToolUse`, `name`, `version` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._