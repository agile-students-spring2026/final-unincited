# Contributing to our Project

Thank you for your interest in contributing to the News Bias & Framing Analyzer project.

This document outlines our team values, development workflow, Git practices, contribution rules, and setup instructions. It serves as a contract between all contributors to ensure consistency, accountability, and high-quality collaboration.

---

# Team Values and Norms

Our team operates under the following core principles:

- **Accountability** - Each member is responsible for delivering their commited work.
- **Clear Communication** - We communicate early and clearly about progress and blockers.
- **Respectful Collaboration** - We critique ideas, not individuals.
- **Working Software First** - We prioritize delivering functional features before optimizing.
- **Consistency Over Complexity** - We avoid over-engineering and focus on incremental improvement.

## Standups

- Standups occur **2 times per week** at an agreed upon time.
- Each standup lasts no longer than 30 minutes.
- Members are expected to attend synchronously.

Each member answers:
1. What did I complete?
2. What am I working on next?
3. What blockers do I have?

### Attendance Expectations

- Members must notify the team in advance if unable to attend and catch themselves up through other members.
- Members who miss witout notice will be addressed directly.
- If a member reports no progress for two standups in a row, the tema will intervene.

## Communication

- All project communication occurs in the team Discord.
- Members are expected to respond within **12-24 hours**.
- Extended absences must be communicated in advance.

## Conflict Resolution

If disagreements occur:
1. Discuss respectfully.
2. Base decisions on user value and sprint goals.
3. If consensus cannot be reached, the Product Owner makes the final decision.

---

# Git Workflow

We follow a structured Git workflow to maintain stability and code quality.

## Branching Strategy

- `main` branch is always stable and deployable.
- All new work must occur in a feature branch.

No direct commits to `main`.

## Pull Requests

Before merging:

- Code must pass build checks.
- Acceptance criteria must be met.
- Code must be peer-reviewed by at least one team member.
- No unresolved merge conflicts.
- No console errors.

## Commit Standards

- Make small, focused commits.
- One logical change per commit.
- Write one sentence messages per commit.

# Rules for Contributing

All contributions must:

- Correspond to a User Story or approved Spike.
- Align with the current Sprint Backlog.
- Meet defined Acceptance Criteria.
- Follow coding standards and project structure.

We do not accept:
- Random or unplanned features.
- Large unreviewed code dumps.
- Code that breaks formatting or linting rules.

## Testing (For Later)
- Critical functionality must be tested.
- Contributors must verify features manually before submitting a PR.
- Automated tests should be written for core services when applicable.

## Definition of Done

A User Story is complete when:

- Code is written.
- Acceptance criteria are met.
- The project builds successfully.
- The feature is tested.
- The branch is merged into `main`.

# Setting up the Local Development Environment

To be done in later Sprints.