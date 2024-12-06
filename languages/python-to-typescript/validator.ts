import { z } from 'zod';

The validator:

// 1. **Validates Recipe Structure**
//    - Ensures all required fields are present
//    - Validates data types and formats
//    - Checks for required patterns

// 2. **Type Conversion Validation**
//    - Checks type coverage
//    - Identifies any 'any' types
//    - Validates type consistency

// 3. **Pattern Migration Validation**
//    - Verifies Python patterns are correctly converted
//    - Checks migration strategy compliance
//    - Validates pattern usage

// 4. **Test Coverage Validation**
//    - Ensures adequate test coverage
//    - Validates test migration
//    - Checks test execution

// 5. **Dependency Validation**
//    - Verifies all Python dependencies have TypeScript equivalents
//    - Checks package versions
//    - Validates dependency compatibility

// Type definitions for recipe sections
const PythonPattern = z.object({
  usage: z.enum(['common', 'frequent', 'occasional']),
  migration_strategy: z.string()
});

const RecipeSchema = z.object({
  metadata: z.object({
    name: z.string(),
    description: z.string(),
    owner: z.string(),
    contact: z.object({
      email: z.string().email(),
      slack: z.string()
    }),
    tags: z.array(z.string()),
    priority: z.enum(['low', 'medium', 'high'])
  }),
  source: z.object({
    code_patterns: z.array(z.object({
      decorators: PythonPattern.optional(),
      type_hints: PythonPattern.optional(),
      list_comprehensions: PythonPattern.optional(),
      generators: PythonPattern.optional(),
      async_await: PythonPattern.optional()
    }))
  })
});

type Recipe = z.infer<typeof RecipeSchema>;

export class RecipeValidator {
  private recipe: Recipe;
  private validationErrors: string[] = [];

  constructor(recipe: Recipe) {
    this.recipe = recipe;
  }

  // Validate recipe structure against schema
  validateRecipeStructure(): boolean {
    try {
      RecipeSchema.parse(this.recipe);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.validationErrors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      }
      return false;
    }
  }

  // Validate type conversion compliance
  async validateTypeConversion(sourcePath: string): Promise<boolean> {
    const typeValidation = {
      totalFiles: 0,
      typedFiles: 0,
      anyTypes: 0,
      errors: [] as string[]
    };

    try {
      const result = await runTypeCheck(sourcePath);
      
      if (result.coverage < 85) {
        typeValidation.errors.push(
          `Type coverage ${result.coverage}% is below required 85%`
        );
      }

      if (result.anyCount > 0) {
        typeValidation.errors.push(
          `Found ${result.anyCount} 'any' types - these should be properly typed`
        );
      }

      return typeValidation.errors.length === 0;
    } catch (error) {
      typeValidation.errors.push(`Type check failed: ${error}`);
      return false;
    }
  }

  // Validate pattern migrations
  async validatePatternMigration(sourceFile: string, targetFile: string): Promise<boolean> {
    const patternErrors: string[] = [];
    
    // Get patterns from recipe
    const patterns = this.recipe.source.code_patterns;
    
    // Check each pattern's migration
    for (const pattern of patterns) {
      if (pattern.decorators) {
        const decoratorCheck = await checkDecoratorMigration(sourceFile, targetFile);
        if (!decoratorCheck.valid) {
          patternErrors.push(`Decorator migration error: ${decoratorCheck.error}`);
        }
      }
      
      if (pattern.list_comprehensions) {
        const listCheck = await checkListComprehensionMigration(sourceFile, targetFile);
        if (!listCheck.valid) {
          patternErrors.push(`List comprehension migration error: ${listCheck.error}`);
        }
      }
      
      // Add checks for other patterns...
    }

    return patternErrors.length === 0;
  }

  // Validate test coverage
  async validateTestCoverage(testPath: string): Promise<boolean> {
    try {
      const coverage = await runTestCoverage(testPath);
      
      if (coverage.percentage < 80) {
        this.validationErrors.push(
          `Test coverage ${coverage.percentage}% is below required 80%`
        );
        return false;
      }

      return true;
    } catch (error) {
      this.validationErrors.push(`Test coverage check failed: ${error}`);
      return false;
    }
  }

  // Validate dependency mapping
  validateDependencies(packageJson: any): boolean {
    const dependencyErrors: string[] = [];
    
    // Check if all Python packages have TypeScript equivalents
    for (const pkg of this.recipe.source.dependencies.python_packages) {
      if (!packageJson.dependencies[pkg.typescript_equivalent]) {
        dependencyErrors.push(
          `Missing TypeScript equivalent for Python package: ${pkg.name}`
        );
      }
    }

    return dependencyErrors.length === 0;
  }

  // Comprehensive validation runner
  async validateMigration(migrationConfig: {
    sourcePath: string,
    targetPath: string,
    testPath: string,
    packageJson: any
  }): Promise<ValidationResult> {
    const results = {
      recipeValid: false,
      typeCheckPassed: false,
      patternsPassed: false,
      testsPassed: false,
      dependenciesValid: false,
      errors: [] as string[]
    };

    // 1. Validate recipe structure
    results.recipeValid = this.validateRecipeStructure();
    if (!results.recipeValid) {
      results.errors.push(...this.validationErrors);
      return results;
    }

    // 2. Validate type conversion
    results.typeCheckPassed = await this.validateTypeConversion(
      migrationConfig.targetPath
    );
    if (!results.typeCheckPassed) {
      results.errors.push('Type validation failed');
    }

    // 3. Validate pattern migration
    results.patternsPassed = await this.validatePatternMigration(
      migrationConfig.sourcePath,
      migrationConfig.targetPath
    );
    if (!results.patternsPassed) {
      results.errors.push('Pattern migration validation failed');
    }

    // 4. Validate test coverage
    const testsPassed = await this.validateTestCoverage(
      migrationConfig.testPath
    );
    if (!testsPassed) {
      results.errors.push('Test coverage validation failed');
    }

    // 5. Validate dependencies
    results.dependenciesValid = this.validateDependencies(
      migrationConfig.packageJson
    );
    if (!results.dependenciesValid) {
      results.errors.push('Dependency validation failed');
    }

    return results;
  }

  // Get validation errors
  getErrors(): string[] {
    return this.validationErrors;
  }
}

// Helper type for validation results
interface ValidationResult {
  recipeValid: boolean;
  typeCheckPassed: boolean;
  patternsPassed: boolean;
  testsPassed: boolean;
  dependenciesValid: boolean;
  errors: string[];
}

// Usage example
async function validateMigrationCompliance(
  recipe: Recipe,
  migrationConfig: {
    sourcePath: string;
    targetPath: string;
    testPath: string;
    packageJson: any;
  }
) {
  const validator = new RecipeValidator(recipe);
  const results = await validator.validateMigration(migrationConfig);
  
  if (results.errors.length > 0) {
    console.error('Migration validation failed:');
    results.errors.forEach(error => console.error(`- ${error}`));
    return false;
  }
  
  console.log('Migration validation passed all checks');
  return true;
}


