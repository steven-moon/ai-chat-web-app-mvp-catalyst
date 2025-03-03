# TypeScript Rules
**Applies to**: `**/*.ts`, `**/*.tsx`

## Type Definitions
- Use TypeScript interfaces for object shapes
- Use TypeScript types for unions, intersections, and mapped types
- Define reusable types in dedicated type files
- Use descriptive names for types and interfaces
- Export types and interfaces that are used across multiple files

## Example Type Definitions
```typescript
// Basic interface
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Generic type
type Nullable<T> = T | null;

// Union type
type Status = 'idle' | 'loading' | 'success' | 'error';

// Utility type
type UserWithoutId = Omit<User, 'id'>;
```

## Type Safety
- Avoid using `any` type unless absolutely necessary
- Use `unknown` instead of `any` when the type is not known
- Use type guards to narrow types
- Use assertion functions when appropriate
- Use the `as const` assertion for literal values
- Use `readonly` for immutable properties
- Use `Partial<T>` for optional properties
- Use `Required<T>` for required properties
- Use `Pick<T, K>` to select specific properties
- Use `Omit<T, K>` to exclude specific properties

## Type Inference
- Let TypeScript infer types when possible
- Explicitly type function parameters and return types
- Use type inference for variables when the type is obvious
- Use type inference for array and object literals when the type is obvious

## Enums and Constants
- Use string literal unions instead of enums when possible
- Use const enums for numeric values
- Use const assertions for object literals
- Define constants in dedicated constant files

## Generics
- Use generics for reusable components and functions
- Use descriptive names for generic type parameters
- Use constraints to limit generic types
- Use default type parameters when appropriate

## Async Code
- Use Promise<T> for async functions
- Use async/await instead of .then()/.catch()
- Handle errors with try/catch
- Type async function return values explicitly

## Module Imports
- Use named imports instead of default imports when possible
- Use absolute imports with path aliases
- Group imports by source
- Order imports: external libraries, internal modules, relative imports

## Type Guards
- Use type predicates for custom type guards
- Use instanceof for class instances
- Use typeof for primitive types
- Use in operator for property checks
- Use Array.isArray() for arrays 