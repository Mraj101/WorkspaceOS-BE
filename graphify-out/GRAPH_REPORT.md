# Graph Report - WorkSpace-BE  (2026-06-01)

## Corpus Check
- 20 files · ~10,188 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 123 nodes · 114 edges · 13 communities (7 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `962edd7e`
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

## God Nodes (most connected - your core abstractions)
1. `What You Must Do When Invoked` - 16 edges
2. `/graphify` - 15 edges
3. `Expense Tracker Module` - 6 edges
4. `scripts` - 4 edges
5. `Step 3 - Extract entities and relationships` - 4 edges
6. `For /graphify query` - 3 edges
7. `Example Request Bodies` - 3 edges
8. `hooks` - 2 edges
9. `AppError` - 2 edges
10. `PreToolUse` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (13 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (19): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - Clone GitHub repo(s) (only if a GitHub URL was given), Step 1 - Ensure graphify is installed, Step 2.5 - Transcribe video / audio files (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (16): For --cluster-only, For git commit hook, For /graphify add, For /graphify explain, For /graphify path, For /graphify query, For native CLAUDE.md integration, For --update (incremental re-extraction) (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (16): author, dependencies, cors, dotenv, express, helmet, morgan, pg (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (7): AppError, asyncHandler, q, router, ctrl, { Router }, AppError

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (8): app, app, cors, errorHandler, express, helmet, morgan, notFound

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (8): Create Category, Create Expense, Data Access Style, Endpoints, Example Request Bodies, Expense Tracker Module, Query Filters (`GET /api/expenses`), Tables

### Community 8 - "Community 8"
Cohesion: 0.50
Nodes (4): scripts, dev, start, test

## Knowledge Gaps
- **75 isolated node(s):** `PreToolUse`, `name`, `version`, `main`, `dev` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `What You Must Do When Invoked` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `/graphify` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `PreToolUse`, `name`, `version` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._