# Feature Specification: Python Lab

**Status**: As-built. **Deployment fix 12 Nov 2026:** the Pages workflow now publishes `tools/python-lab`.

## User Scenarios & Testing

### US1 — Practise programming with instant checking (P1)

**Acceptance Scenarios**

1. **Given** a Computing student, **When** they open Python Lab, **Then** they see 58 tasks mapped to Computing AAQ Unit 1 spec codes (A1–C2) and Unit 4 projects. Tasks have three difficulty levels.
2. **Given** a task, **When** they press Run, **Then** real Python runs in the browser. Input is scripted, errors highlight the line, and the tests report pass or fail.
3. **Given** a predict task, **Then** they predict a program's output (a trace table).
4. **Given** progress, **Then** it is remembered on the device.

### Edge Cases

- An infinite loop: the run stops after 6 seconds and the runtime restarts.
- A task needs files: the setup code creates them first.

## Requirements

- **FR-001**: Every task's reference solution MUST pass all of its tests, and its starter code MUST NOT pass.
- **FR-002**: Code MUST run isolated from the page, in a Web Worker.
- **FR-003**: Attempts MUST be logged as learning activity, so Study Hub can recommend tasks.

## Success Criteria

- **SC-001**: 100% of tasks pass the CPython solution-and-starter proof.
- **SC-002**: The first run is ready within 10 s on a mid-range phone.
