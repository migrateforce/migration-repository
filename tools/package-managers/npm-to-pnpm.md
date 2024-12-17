# NPM to PNPM Migration

## Overview
This migration is designed to transition your Node.js project's package management from **npm** to **pnpm**. By leveraging migrateforce yaml (AMRS) recipe, the process is guided by pre-defined instructions that ensure consistency, reduce risk, and maintain performance. This documentation details the migration path, outlines key benefits and challenges, and demonstrates how to use LLM Agent Instructions with the AMRS recipe to achieve a seamless migration.

## Current Status
- [x] Planning
- [ ] In Progress
- [ ] Completed
- [ ] Deprecated

## Benefits
- **Faster Installations:** PNPM uses a content-addressable store to optimize dependencies, resulting in quicker installation times.
- **Reduced Disk Space Usage:** PNPM's symlink-based dependency structure dramatically decreases node_modules size.
- **Consistent Builds:** PNPM ensures that each installation yields a deterministic node_modules structure.
- **Enhanced Monorepo Support:** PNPM natively supports multi-package repositories and handles workspace dependencies elegantly.
- **Improved CI Performance:** PNPM's caching and linking strategies make CI/CD pipelines more efficient.

## Challenges
- **Dependency Resolution Differences:** While npm and pnpm are both package managers, their resolution and linking strategies differ.
- **Script Handling Changes:** Certain npm lifecycle scripts may need updates to run smoothly under pnpm.
- **Existing Tools & Integrations:** Some tools and CI scripts might assume npm presence and may require adjustments for pnpm.
- **Lockfile Conversion:** Converting `package-lock.json` to `pnpm-lock.yaml` must preserve dependency integrity.
- **Transition Period for Teams:** Developers familiar with npm need guidance to adopt pnpm's workflow effectively.

## Migration Path

### 1. Analysis Phase
- **Identify Dependencies:** Parse `package.json` and `package-lock.json` to understand current dependency graph.
- **Lockfile Evaluation:** Assess `package-lock.json` for compatibility and potential conflicts when converting to `pnpm-lock.yaml`.
- **Script Review:** Identify npm scripts that rely on npm-specific commands.
- **Integrations Check:** Verify if CI/CD pipelines, Dockerfiles, or dev tools reference npm commands directly.

### 2. Setup Phase
- **PNPM Installation:** Add pnpm to the environment and ensure it’s globally accessible.
- **AMRS Recipe Parsing:** Utilize the AMRS recipe (e.g., `recipe.yaml`) for structured guidance.
- **Configure PNPM Workspace:** Set up `pnpm-workspace.yaml` if dealing with multiple packages.
- **Adjust TSConfig (If Applicable):** If the project uses TypeScript, ensure build configuration remains compatible.

### 3. Migration Phase
- **Lockfile Conversion:** Use LLM instructions from the AMRS recipe to convert `package-lock.json` to `pnpm-lock.yaml`.
- **Dependency Alignment:** Run `pnpm import` or equivalent recipe steps to align dependencies.
- **Script Updates:** Modify npm scripts (e.g., `npm run start`) to their pnpm equivalents (`pnpm start`).
- **Refactor Tooling:** Update tooling references from npm to pnpm. This may involve CI scripts, Dockerfiles, or deployment pipelines.

### 4. Validation Phase
- **Type Checks & Linting:** If TypeScript or ESLint are in use, validate code to ensure no regressions.
- **Test Execution:** Run test suites (`pnpm test`) to confirm no functionality breaks.
- **Performance Testing:** Measure installation and build times before and after migration.
- **Dependency Integrity:** Validate that all dependencies resolve correctly and consistently.

### 5. Deployment Phase
- **Canary Deployments:** Release a limited version of the pnpm-based project to ensure stability under production load.
- **Monitor Metrics:** Track metrics defined in the AMRS recipe (e.g., install times, disk usage) to confirm improvements.
- **Incremental Rollout:** Gradually scale traffic and usage until fully migrated.
- **Fallback Plan:** Keep npm-based environment available for quick rollback if issues arise.


## Resources
- [PNPM Documentation](https://pnpm.io/)
- [npm to pnpm Migration Guide](https://pnpm.io/cli/import)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [CI/CD Integration with PNPM](https://pnpm.io/continuous-integration)


## Related Migrations
- Node.js Version Upgrades
- Monorepo Structuring (for multi-package projects)
- CI/CD Pipeline Modernization

---

# LLM Agent Instructions: Using AMRS Recipe for Migration

## 1. Recipe Parsing
First, load and parse the AMRS recipe file to guide the migration:
```typescript
const recipe = parseYAML('recipe.yaml');
// Validate recipe structure against the AMRS schema
