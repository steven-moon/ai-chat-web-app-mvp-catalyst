# General Project Rules

## Project Overview
This is an AI chat web application built with React, TypeScript, and various modern web technologies. The application provides a chat interface for users to interact with AI models.

## Code Style and Standards
- Use TypeScript for all new code
- Follow functional programming paradigms where possible
- Use strong typing and avoid `any` types unless absolutely necessary
- Use ES6+ features like arrow functions, destructuring, and spread operators
- Keep functions small and focused on a single responsibility
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

## Component Structure
- Use functional components with hooks instead of class components
- Keep components small and focused on a single responsibility
- Use composition over inheritance
- Extract reusable logic into custom hooks
- Use proper prop typing with TypeScript interfaces

## State Management
- Use React Context API for global state when appropriate
- Use React Query for server state management
- Prefer local component state for UI-only state
- Avoid prop drilling by using context or composition

## Error Handling
- Use try/catch blocks for async operations
- Provide meaningful error messages
- Implement proper error boundaries
- Log errors appropriately

## Performance Considerations
- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect and useMemo
- Avoid unnecessary re-renders
- Use virtualization for long lists
- Implement code splitting where appropriate

## Accessibility
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers

## Testing
- Write unit tests for utility functions
- Write component tests for UI components
- Use React Testing Library for component testing
- Mock external dependencies appropriately

## Security
- Sanitize user input
- Implement proper authentication and authorization
- Avoid storing sensitive information in client-side storage
- Use HTTPS for all API requests
- Implement proper CORS policies 