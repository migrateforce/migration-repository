```markdown
# NPM to PNPM Migration

## Overview

This document outlines the process for migrating a Node.js project's package management from **npm** to **pnpm**. This migration leverages an AMRS Migrateforce recipe based approach, providing a structured and automated way to transition while minimizing risks and ensuring a smooth process. The migration will utilize LLM (Large Language Model) Agent Instructions derived from the AMRS recipe to guide and perform tasks.

## Current Status

[x] Planning
[ ] In Progress
[ ] Completed
[ ] Deprecated

## Benefits

**Faster Installations:**  pnpm's content-addressable file system and hard linking lead to significantly faster package installations, especially in CI/CD environments.
**Reduced Disk Space Usage:** pnpm stores dependencies in a global store and creates hard links to them in projects, saving considerable disk space compared to npm's duplicated `node_modules` folders.
**Consistent Builds:** pnpm enforces strict dependency resolution, leading to more reliable and reproducible builds.
**Monorepo Support:** pnpm offers first-class support for monorepos with features like workspaces, simplifying dependency management across multiple packages.
**Improved Security:** pnpm's strictness helps prevent issues arising from phantom dependencies and version conflicts.

## Challenges

**Dependency Resolution Differences:** pnpm's approach to dependency resolution, while more robust, may differ slightly from npm's, potentially requiring adjustments in certain projects.
**Script Handling:** Some npm lifecycle scripts that rely on implicit behaviors or environment variables might need modification for pnpm.
**Tooling Compatibility:** While most modern tools support pnpm, some older or less-maintained tools may require updates or workarounds to function correctly.
**Learning Curve:** Developers accustomed to npm will need to familiarize themselves with pnpm's commands and workflows.
**Lockfile Conversion:** The migration involves converting `package-lock.json` to `pnpm-lock.yaml`, which must be done carefully to preserve dependency integrity.

## Migration Path

### 1. Analysis Phase

-   **Dependency Audit:** Analyze `package.json` and `package-lock.json` to understand the project's dependency tree and identify potential conflicts.
-   **Script Analysis:** Review existing npm scripts in `package.json` to determine which scripts need to be adapted for pnpm.
-   **Tooling Assessment:** Evaluate existing tools (CI/CD, build tools, etc.) for compatibility with pnpm and plan for any necessary updates.
-   **AMRS Recipe Review**: Ensure the AMRS recipe is correctly configured and understood.

### 2. Setup Phase

**Install pnpm:** Install pnpm globally or locally as per project requirements.
    ```bash
    npm install -g pnpm
    ```
**Environment Setup:** Configure the development environment for pnpm, including any necessary environment variables.
**Configure PNPM Workspace (Optional):** For monorepos, set up `pnpm-workspace.yaml` to define workspaces.
**Adjust TSConfig (Optional):** If using TypeScript, verify that tsconfig.json remains compatible with the new module resolution strategy.

### 3. Migration Phase

**Lockfile Conversion:** Use `pnpm import` to generate `pnpm-lock.yaml` from `package-lock.json`.
    ```bash
    pnpm import
    ```
**Dependency Installation:** Install dependencies using pnpm.
    ```bash
    pnpm install
    ```
**Script Modification:** Update npm scripts in `package.json` to their pnpm equivalents.
    -   Example:
        -   `npm start` becomes `pnpm start`
        -   `npm run build` becomes `pnpm build`
        -   `npm test` becomes `pnpm test`
**Tooling Updates:** Modify CI/CD pipelines, Dockerfiles, and other tools to use pnpm commands instead of npm.
    -   Example: Replace `npm ci` with `pnpm install --frozen-lockfile` in CI scripts.
**Refactor according to AMRS recipe**: Use the recipe to modify and update code patterns.

### 4. Validation Phase

**Testing:** Run the project's test suite using `pnpm test` to ensure that all tests pass after the migration.
**Build Verification:** Build the project using pnpm to confirm that the build process works correctly.
**Functionality Checks:** Manually test key features of the application to verify that everything functions as expected.
**Performance Testing:** Compare installation times and disk space usage before and after the migration to measure improvements.
**Code Review:** Perform a code review of the changes made during the migration to ensure they are correct and maintainable.
**Use AMRS validation rules:** Leverage defined validation rules and stages in the AMRS recipe for thorough checks.

### 5. Deployment Phase

**Canary Deployment (Recommended):** Deploy the pnpm-based version of the application to a staging or canary environment for initial testing.
**Monitoring:** Monitor the application closely for any issues or errors.
**Full Deployment:** If the canary deployment is successful, proceed with a full deployment to production.
**Rollback Plan:** Have a plan in place to revert to the npm-based version if significant issues are encountered.
**Monitor metrics from AMRS recipe**: Observe metrics like install time, disk usage, and CI speed to confirm positive impact.


## Resources

-   [PNPM Documentation](https://pnpm.io/)
-   [npm to pnpm Migration Guide](https://pnpm.io/cli/import)
-   [Node.js Documentation](https://nodejs.org/en/docs/)
-   [CI/CD Integration with PNPM](https://pnpm.io/continuous-integration)


## Related Migrations

-   Node.js Version Upgrades
-   Monorepo Structuring (for multi-package projects)
-   CI/CD Pipeline Modernization

---

# LLM Agent Instructions: Using AMRS Recipe for Migration

The following sections detail how to use an AMRS recipe to guide the migration process. The examples are in TypeScript, but the concepts can be adapted to other languages.

## 1. Recipe Parsing

Load and parse the `recipe.yaml` file (or equivalent format) that contains the AMRS recipe.

```typescript
interface Recipe {
  metadata: {
    name: string;
    description: string;
    owner: string;
    contact: {
      email: string;
      slack: string;
    };
    tags: string[];
    priority: string;
    "estimated-downtime": string;
  };
  source: {
    type: string;
    discovery: {
      locations: {
        type: string;
        url: string;
        branch: string;
        paths: string[];
      }[];
      analysis: string[];
    };
    "code_patterns": Record<string, {
      usage: string;
      "migration_strategy": string;
    }>;
  };
  dependencies: {
    npm_packages: {
      name: string;
      version: string;
    }[];
  };
  target: {
    manager: string;
    version: string;
    configuration: Record<string, boolean | string>;
  };
  analysis: {
    code: {
      type: string;
      tools: string[];
      goal: string;
    }[];
  };
  validation: {
    stages: {
      stage: string;
      checks: string[];
    }[];
  };
  observability: {
    metrics: string[];
  };
  rollback: {
    strategy: {
      type: string;
      version_control: string;
    };
  };
  ai_agent_instructions: {
    priorities: string[];
    conversion_steps: {
      step: string;
      actions: string[];
    }[];
    pattern_mappings: {
      npm_to_pnpm: {
        pattern: string;
        pnpm: string;
        example: string;
      }[];
    };
    validation_rules: string[];
  };
}

function parseYAML(filePath: string): Recipe {
  // Implementation to load and parse the YAML file
  // ... (using a YAML parsing library)
  // Validate the parsed object against the Recipe interface
  // Return the validated Recipe object
    throw new Error("Function not implemented.");
}

const recipe: Recipe = parseYAML('recipe.yaml');
```

## 2. Using Recipe Sections

### Initial Setup

Use the `source.discovery` section to locate and clone the npm-based project.

```typescript
import { execSync } from 'child_process';

function cloneRepo(url: string, branch: string): void {
  console.log(`Cloning repository: ${url} (branch: ${branch})`);
  execSync(`git clone -b ${branch} ${url}`, { stdio: 'inherit' });
}

function scanPaths(paths: string[]): void {
    console.log("Scanning paths:", paths);
    // Implement logic to find package.json, package-lock.json, etc.
    // ...
}

const sourceConfig = recipe.source.discovery.locations;
for (const location of sourceConfig) {
  if (location.type === 'git') {
    cloneRepo(location.url, location.branch);
    // Assuming the repo name is the last part of the URL
    const repoName = location.url.split('/').pop()?.split('.').shift() || '';

    // Change directory to the cloned repository
    process.chdir(repoName);
    scanPaths(location.paths)
  }
}
```

### Pattern Analysis

Use `code_patterns` to identify npm-specific scripts or commands.

```typescript
import fs from 'fs';

function analyzePatterns(filePath: string, patterns: { type: string; strategy: string; usage: string }[]): void {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    for (const pattern of patterns) {
        const regex = new RegExp(pattern.type, 'g'); // Assuming pattern.type can be used in a regex
        let match;
        while ((match = regex.exec(fileContent)) !== null) {
            console.log(`Found pattern: ${pattern.type} in ${filePath} at index ${match.index}`);
            console.log(`Migration strategy: ${pattern.strategy}`);
            // Implement logic to update or flag the code based on the strategy
            // ...
        }
    }
}

const patterns = Object.entries(recipe.source.code_patterns).map(([key, value]) => ({
    type: key,
    strategy: value.migration_strategy,
    usage: value.usage
}));
// Assuming you have a list of files to analyze (e.g., from scanPaths)
const filesToAnalyze = ['package.json', 'scripts/build.js', /* ... other files */];
for (const file of filesToAnalyze) {
  if (fs.existsSync(file)) {
        analyzePatterns(file, patterns);
    }
}
```

### Lockfile Conversion

Use `pattern_mappings` from `ai_agent_instructions` for lockfile conversion guidance.

```typescript
function convertLockfile(npmLockContent: string, mappings: { pattern: string; pnpm: string; example: string }[]): string {
    let pnpmLockContent = npmLockContent;
    for (const mapping of mappings) {
        const regex = new RegExp(mapping.pattern, 'g');
        pnpmLockContent = pnpmLockContent.replace(regex, mapping.pnpm);
        console.log(`Applying mapping: ${mapping.pattern} -> ${mapping.pnpm}`);
    }
    return pnpmLockContent;
}

const lockfileMappings = recipe.ai_agent_instructions.pattern_mappings.npm_to_pnpm;
const npmLockContent = fs.readFileSync('package-lock.json', 'utf-8');
const pnpmLockContent = convertLockfile(npmLockContent, lockfileMappings);
fs.writeFileSync('pnpm-lock.yaml', pnpmLockContent);
```

### Validation

Use `validation.stages` to ensure the pnpm setup is correct.

```typescript
function runChecks(checks: string[]): void {
    for (const check of checks) {
        switch (check) {
            case 'valid-lockfile':
                console.log("Verifying pnpm-lock.yaml...");
                // Implement logic to validate the lockfile (e.g., using pnpm's built-in checks)
                // ...
                break;
            case 'consistent-versions':
                console.log("Checking for consistent dependency versions...");
                // Implement logic to check for version conflicts
                // ...
                break;
            case 'unit-tests-pass':
                console.log("Running unit tests...");
                execSync('pnpm test', { stdio: 'inherit' });
                break;
            case 'ci-pipeline-works':
                console.log('Simulating CI pipeline...');
                // Implement logic to simulate or trigger the CI pipeline
                break;
            case 'install-speed':
                console.log('Measuring installation speed...');
                const startTime = Date.now();
                execSync('pnpm install', { stdio: 'inherit' });
                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000;
                console.log(`Installation time: ${duration} seconds`);
                break;
            case 'disk-usage':
                console.log('Measuring disk usage...');
                // Implement logic to measure disk usage (e.g., using `du`)
                break;
            default:
                console.warn(`Unknown check: ${check}`);
        }
    }
}

for (const stage of recipe.validation.stages) {
  console.log(`Running validation stage: ${stage.stage}`);
  runChecks(stage.checks);
}
```

### Observability & Metrics

Track metrics defined in `observability.metrics`.

```typescript
function trackMetric(metric: string): void {
    switch (metric) {
        case 'install-time':
            // Logic to measure and record installation time (already implemented in runChecks)
            break;
        case 'disk-usage':
            // Logic to measure and record disk usage (already implemented in runChecks)
            break;
        case 'test-coverage':
            console.log("Measuring test coverage...");
            // Implement logic to run coverage tools and record results
            // ...
            break;
        case 'ci-speed':
            console.log("Measuring CI pipeline speed...");
            // Implement logic to measure CI pipeline execution time
            // ...
            break;
        default:
            console.warn(`Unknown metric: ${metric}`);
    }
}

const metricsToTrack = recipe.observability.metrics;
for (const metric of metricsToTrack) {
  trackMetric(metric);
}
```

## 3. Step-by-Step Process Using Recipe

### Configure PNPM Environment

```typescript
function setupPnpm(config: { version: string; config: Record<string, boolean | string> }): void {
  console.log(`Setting up pnpm version: ${config.version}`);
  execSync(`npm install -g pnpm@${config.version}`, { stdio: 'inherit' });

  console.log("Configuring pnpm...");
  for (const [key, value] of Object.entries(config.config)) {
    execSync(`pnpm config set ${key} ${value}`, { stdio: 'inherit' });
  }
}

setupPnpm({
  version: recipe.target.version,
  config: recipe.target.configuration,
});
```

### Analyze Source

```typescript
function detectPattern(pattern: { type: string; usage: string; strategy: string }): void {
    // Similar to analyzePatterns, but might involve more complex logic or external tools
    // ...
}

for (const pattern of Object.values(recipe.source.code_patterns)) {
  detectPattern({
    type: pattern.usage,
    usage: pattern.usage,
    strategy: pattern.migration_strategy
  });
}
```

### Convert to PNPM

```typescript
Okay, let's complete the remaining steps for the pnpm migration, building upon the previous code and explanations.

```typescript
// ... (Previous code for parsing, setup, analysis, etc.)

function executeStep(step: { name: string; actions: string[]; priority: string }): void {
    console.log(`Executing step: ${step.name}`);
    for (const action of step.actions) {
        switch (action) {
            case 'identify-npm-specific-lock-elements':
                console.log("Identifying npm-specific elements in package-lock.json...");
                // Implement logic to identify elements to be converted
                break;
            case 'map-equivalents-in-pnpm-lock':
                console.log("Mapping npm lock elements to pnpm equivalents...");
                // Implement logic to map elements based on pattern_mappings
                break;
            case 'install-pnpm-globally':
                console.log("Installing pnpm globally...");
                execSync('npm install -g pnpm', { stdio: 'inherit' });
                break;
            case 'create-pnpm-workspace':
                console.log("Creating pnpm workspace...");
                // Implement logic to create pnpm-workspace.yaml if needed
                if (!fs.existsSync('pnpm-workspace.yaml')) {
                  if(recipe.source.discovery.locations.some(location => location.paths.length > 1)){
                      // default multi package project setup
                      const workspaceConfig = `packages:\n  - 'packages/*'\n`;
                      fs.writeFileSync('pnpm-workspace.yaml', workspaceConfig);
                  }
                }
                break;
            case 'configure-strict-peer-dependencies':
                console.log("Configuring strict peer dependencies...");
                execSync('pnpm config set strict-peer-dependencies true', { stdio: 'inherit' });
                break;
            case 'translate-npm-lock-to-pnpm':
                console.log("Translating npm lockfile to pnpm...");
                execSync('pnpm import', { stdio: 'inherit' });
                break;
            case 'clean-legacy-artifacts':
                console.log("Cleaning up legacy npm artifacts...");
                if (fs.existsSync('package-lock.json')) {
                    fs.unlinkSync('package-lock.json');
                }
                if (fs.existsSync('node_modules')) {
                    // Use rimraf for cross-platform compatibility
                    execSync('npx rimraf node_modules', { stdio: 'inherit' });
                }
                break;
            case 'replace-npm-run-with-pnpm':
                console.log("Replacing 'npm run' with 'pnpm' in scripts...");
                const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
                for (const scriptName in packageJson.scripts) {
                    packageJson.scripts[scriptName] = packageJson.scripts[scriptName].replace(/npm run /g, 'pnpm ');
                    // Special case for "npm start" without "run"
                    packageJson.scripts[scriptName] = packageJson.scripts[scriptName].replace(/npm start/g, 'pnpm start');
                }
                fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
                break;
            case 'adjust-ci-scripts':
                console.log("Adjusting CI scripts...");
                // Implement logic to update CI configuration files (e.g., .github/workflows/*.yml, .gitlab-ci.yml)
                // Replace npm ci with pnpm install --frozen-lockfile
                const ciFiles = ['.github/workflows/ci.yml', '.gitlab-ci.yml', /* ... other CI files */];
                for (const ciFile of ciFiles) {
                    if (fs.existsSync(ciFile)) {
                        let ciContent = fs.readFileSync(ciFile, 'utf-8');
                        ciContent = ciContent.replace(/npm ci/g, 'pnpm install --frozen-lockfile');
                        ciContent = ciContent.replace(/npm install/g, 'pnpm install');
                        ciContent = ciContent.replace(/npm run /g, 'pnpm ');

                        fs.writeFileSync(ciFile, ciContent);
                    }
                }
                break;
            case 'run-tests':
                console.log("Running tests...");
                execSync('pnpm test', { stdio: 'inherit' });
                break;
            case 'check-performance':
                console.log("Checking performance...");
                // Implement logic to measure performance metrics (time, disk space, etc.)
                break;
            case 'validate-metrics':
                console.log("Validating metrics...");
                // Implement logic to validate metrics against expected thresholds
                break;
            default:
                console.warn(`Unknown action: ${action}`);
        }
    }
}
const conversionSteps = recipe.ai_agent_instructions.conversion_steps;
// Sort steps by priority if needed (assuming lower numbers are higher priority)
// conversionSteps.sort((a, b) => a.priority - b.priority);
for (const step of conversionSteps) {
  executeStep({
        name: step.step,
        actions: step.actions,
        priority: ""
    });
}
```

### Validate

```typescript
function validateEnvironment(rule: string): void {
    switch (rule) {
        case 'ensure-valid-lockfile':
            console.log("Ensuring valid pnpm-lock.yaml...");
            // Implement logic to validate the lockfile (e.g., using pnpm's built-in checks)
            try {
                execSync('pnpm ls', { stdio: 'inherit' }); // Simple check: list installed packages
            } catch (error) {
                console.error("Invalid pnpm-lock.yaml detected.");
                throw error;
            }
            break;
        case 'verify-tests-pass':
            console.log("Verifying that tests pass...");
            execSync('pnpm test', { stdio: 'inherit' });
            break;
        case 'check-install-time':
            console.log("Checking installation time...");
            // Implement logic to measure install time and compare against a threshold
            const startTime = Date.now();
            execSync('pnpm install', { stdio: 'inherit' });
            const endTime = Date.now();
            const installTime = (endTime - startTime) / 1000;
            console.log(`Installation time: ${installTime} seconds`);
            // Add logic to compare against an expected threshold
            break;
        default:
            console.warn(`Unknown validation rule: ${rule}`);
    }
}

const validationRules = recipe.ai_agent_instructions.validation_rules;
for (const rule of validationRules) {
  validateEnvironment(rule);
}
```

## 4. Example Usage Flow

```typescript
async function executeMigration(recipe: Recipe) {
    // 1. Setup environment according to recipe
    await setupFromRecipe(recipe.target);

    // 2. Analyze patterns related to npm usage
    const patterns = await analyzeWithRecipe(recipe.source.code_patterns);

    // 3. Convert dependencies and lockfiles to pnpm equivalents
    for (const file of lockfiles) {
        await convertLockfile(file, recipe.ai_agent_instructions.pattern_mappings);
        await validateConversion(recipe.validation_rules);
    }

    // 4. Run final validation steps
    await validateAll(recipe.validation.stages);
}
```
- * tbd: add more functionality here in the orchestrator.*

## 5. Error Handling Using Recipe

```typescript
function handleError(error: any, recipe: Recipe) {
    console.error("An error occurred during the migration:", error.message);
    // Use the recipe to determine the appropriate error handling strategy
    if (error.message.includes("pnpm-lock.yaml is invalid")) {
        console.error("Error related to pnpm-lock.yaml. Attempting automatic fix...");
        try {
            execSync('pnpm import', { stdio: 'inherit' }); // Try to regenerate the lockfile
            console.log("pnpm-lock.yaml regenerated. Please re-run the validation.");
            return;
        } catch (importError) {
            console.error("Failed to fix pnpm-lock.yaml automatically:", importError.message);
        }
    }

    // Generic error handling or fallback
    const mapping = recipe.ai_agent_instructions.pattern_mappings.npm_to_pnpm.find(
        (m) => error.message.includes(m.pattern)
    );

    if (mapping) {
        console.log(`Applying specific fix for pattern: ${mapping.pattern}`);
        // Implement logic based on the mapping
        return;
    } else {
        console.error("No specific fix found in the recipe. Requesting human review...");
        // Implement logic to escalate the error or request manual intervention
        return;
    }
}

// integrate error handling into the migration process:
async function executeMigrationWithRetry(recipe: Recipe) {
    const maxRetries = 3;
    let retries = 0;
    let success = false;

    while (retries < maxRetries && !success) {
        try {
            await executeMigration(recipe);
            success = true;
        } catch (error) {
            console.error(`Migration attempt ${retries + 1} failed.`);
            handleError(error, recipe);
            retries++;
            if (retries < maxRetries) {
                console.log("Retrying migration...");
            }
        }
    }

    if (!success) {
        console.error("Migration failed after multiple retries. Manual intervention required.");
        // Implement logic to escalate or notify about the failure
    } else {
        console.log("Migration completed successfully!");
    }
}

// calling the migration with error handling:
executeMigrationWithRetry(recipe)
    .then(() => console.log("Migration process finished."))
    .catch((error) => console.error("Migration process failed:", error));
```

**Error Handling Description:**

1.  **Specific Error Handling:** The `handleError` function first checks if the error message matches a known pattern (e.g., an invalid `pnpm-lock.yaml`). If it does, it attempts a specific fix based on the recipe's instructions.
2.  **Generic Error Handling (Mapping-Based):** If no specific error pattern is matched, it looks for a relevant mapping in the `pattern_mappings` section of the recipe. This allows you to define custom error handling logic based on specific patterns that might occur during the migration.
3.  **Fallback (Human Review):** If no mapping is found, it falls back to a generic error message and requests human review. This is where you would implement logic to escalate the issue, log detailed error information, or provide instructions for manual intervention.
4.  **Retry Mechanism (Example):** The `executeMigrationWithRetry` function demonstrates a simple retry mechanism. It attempts to run the migration up to `maxRetries` times. If an error occurs, it calls `handleError` to try and fix it. If the error persists after all retries, it reports the failure and suggests manual intervention.

**Important Notes:**

-   **Recipe-Driven:** The error handling is guided by the AMRS recipe. You can add more specific error patterns and corresponding handling strategies to the recipe as you encounter them during your migration process.
-   **Customization:** You'll need to customize the error handling logic based on your specific project needs and the types of errors you anticipate.
-   **Logging:** Ensure that you have proper logging in place to capture detailed error information, which will be crucial for debugging and manual intervention.
-   **Escalation:**  Implement appropriate escalation procedures to notify the relevant teams or individuals when the automated error handling fails.
-   **Testing:** Thoroughly test your error handling logic to ensure that it behaves as expected in various error scenarios.

This completed structure should provide a solid foundation for your npm to pnpm migration. Remember to tailor the code and the recipe to your project's specific requirements and thoroughly test each step of the process. 

