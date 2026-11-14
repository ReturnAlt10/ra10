# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

## Summary

[Primary requirement + technical approach]

## Technical Context

**Language/Version**: Browser JS (ES2020, no build) · Deno TypeScript (edge functions) · PostgreSQL 15 (Supabase) · Python 3.11+ (pipelines)
**Primary Dependencies**: supabase-js 2.x (CDN), Supabase Auth/Postgres/Edge Functions/Storage, LLM providers via `_shared/ai.ts`
**Storage**: Supabase Postgres (RLS) · localStorage for per-device progress
**Testing**: `enterprise/scripts/health_check.py`, pipeline checkers, Playwright smoke tests, throwaway postgres:15 for SQL
**Target Platform**: Evergreen browsers, 390 px phone to desktop; GitHub Pages static hosting
**Constraints**: No build step; cache busting via `?v=`; owner-approved production changes

## Constitution Check

*GATE: must pass before work starts and again after design.*

| Gate | Status | Notes |
|---|---|---|
| Accuracy | | |
| Exam fidelity | | |
| Security (server-side authz, RLS) | | |
| Privacy (retention) | | |
| Compatibility (public contracts) | | |
| Verification plan | | |

## Project Structure

```
[files to add/change, grouped: shell / unit apps / shared / supabase/sql / supabase/functions / training-data]
```

## Contracts

[RPC signatures, edge function request/response, postMessage types, globals]

## Rollout

[SQL → functions → static; cache tokens; News/announcement]

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
