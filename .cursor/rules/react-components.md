# React Component Rules
**Applies to**: `src/components/**/*.tsx`

## Component Structure
- Use functional components with hooks
- Export components as named exports
- Define prop interfaces above the component
- Use destructuring for props
- Keep components focused on a single responsibility
- Extract complex logic into custom hooks

## Example Component Structure
```tsx
import React from 'react';
import { useCustomHook } from '@/hooks/useCustomHook';

interface ExampleComponentProps {
  title: string;
  description?: string;
  onAction: () => void;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  description,
  onAction,
}) => {
  const { data, loading } = useCustomHook();

  return (
    <div className="example-component">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <button onClick={onAction}>Action</button>
      )}
    </div>
  );
};
```

## Component Naming
- Use PascalCase for component names
- Use descriptive names that reflect the component's purpose
- Prefix higher-order components with "with" (e.g., withAuth)
- Suffix custom hooks with "use" (e.g., useAuth)

## Props
- Define prop interfaces with descriptive names
- Mark optional props with `?`
- Use specific types instead of `any`
- Provide default values for optional props when appropriate
- Use prop destructuring in function parameters

## State Management
- Use useState for simple component state
- Use useReducer for complex state logic
- Extract shared state to context when needed
- Keep state as close as possible to where it's used

## Side Effects
- Use useEffect for side effects
- Clean up side effects when component unmounts
- Specify dependencies array correctly
- Avoid unnecessary re-renders

## Event Handling
- Use inline arrow functions for simple event handlers
- Extract complex event handlers to separate functions
- Name event handlers with "handle" prefix (e.g., handleClick)
- Pass event handlers as props to child components when needed

## Styling
- Use Tailwind CSS for styling
- Use consistent class naming
- Extract complex styling to separate components
- Use CSS variables for theming

## Accessibility
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers 