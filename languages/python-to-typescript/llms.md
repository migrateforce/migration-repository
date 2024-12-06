# LLM Agent Instructions: Using AMRS Recipe for Migration

## 1. Recipe Parsing

First, parse the provided AMRS recipe YAML file:
```typescript
const recipe = parseYAML('recipe.yaml');
// Validate recipe structure against AMRS schema
```

## 2. Using Recipe Sections

### Initial Setup
```typescript
// Use source.discovery section
const sourceConfig = recipe.source.discovery.locations;
for (const location of sourceConfig) {
    if (location.type === 'git') {
        // Clone repository using provided URL and branch
        cloneRepo(location.url, location.branch);
        // Scan specified paths
        scanPaths(location.paths);
    }
}

// Use dependencies section to set up new project
const dependencies = recipe.dependencies.python_packages;
createPackageJson({
    dependencies: dependencies.map(dep => ({
        [dep.typescript_equivalent]: 'latest'
    }))
});
```

### Pattern Analysis
```typescript
// Use code_patterns section from recipe
const patterns = recipe.code_patterns;
for (const file of pythonFiles) {
    analyzePatterns(file, patterns.map(pattern => ({
        type: pattern.name,
        strategy: pattern.migration_strategy,
        usage: pattern.usage
    })));
}
```

### Code Conversion
```typescript
// Use pattern_mappings from ai_agent_instructions
const mappings = recipe.ai_agent_instructions.pattern_mappings.python_to_typescript;

function convertCode(pythonCode) {
    for (const mapping of mappings) {
        // Apply each pattern conversion based on recipe
        applyPattern(pythonCode, mapping.pattern, mapping.typescript);
    }
}
```

### Validation
```typescript
// Use validation stages from recipe
for (const stage of recipe.validation.stages) {
    switch(stage.stage) {
        case 'type-conversion':
            runChecks(stage.checks); // ['valid-typescript', 'type-completeness', etc.]
            break;
        case 'functionality':
            runTests(stage.checks);
            break;
        // etc.
    }
}
```

### Progress Monitoring
```typescript
// Use observability metrics from recipe
const metricsToTrack = recipe.observability.metrics;
for (const metric of metricsToTrack) {
    trackMetric(metric);
}
```

## 3. Step-by-Step Process Using Recipe

1. **Configure Environment**
```typescript
// Use target configuration from recipe
setupTypeScript({
    version: recipe.target.version,
    config: recipe.target.configuration
});
```

2. **Analyze Source**
```typescript
// Use source.code_patterns from recipe to identify patterns
for (const pattern of recipe.source.code_patterns) {
    detectPattern({
        type: pattern.type,
        usage: pattern.usage,
        strategy: pattern.migration_strategy
    });
}
```

3. **Convert Code**
```typescript
// Use conversion_steps from ai_agent_instructions
for (const step of recipe.ai_agent_instructions.conversion_steps) {
    executeStep({
        name: step.step,
        actions: step.actions,
        priority: step.priority
    });
}
```

4. **Validate**
```typescript
// Use validation_rules from ai_agent_instructions
for (const rule of recipe.ai_agent_instructions.validation_rules) {
    validateCode(rule);
}
```

## 4. Example Usage Flow

```typescript
async function executeMigration(recipe) {
    // 1. Setup using recipe configuration
    await setupFromRecipe(recipe.target);

    // 2. Analyze patterns using recipe definitions
    const patterns = await analyzeWithRecipe(recipe.source.code_patterns);

    // 3. Convert each file using recipe mappings
    for (const file of sourceFiles) {
        await convertFile(file, recipe.ai_agent_instructions.pattern_mappings);
        await validateConversion(recipe.validation_rules);
    }

    // 4. Run final validation using recipe criteria
    await validateAll(recipe.validation.stages);
}
```

## 5. Error Handling Using Recipe

```typescript
function handleError(error, recipe) {
    // Check if error matches any known patterns
    const mapping = recipe.ai_agent_instructions.pattern_mappings
        .find(m => m.pattern === error.pattern);

    if (mapping) {
        return applyMapping(mapping);
    } else {
        return requestHumanReview(error);
    }
}
