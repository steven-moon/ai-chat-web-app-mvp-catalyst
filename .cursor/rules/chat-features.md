# Chat Features Rules
**Applies to**: `src/components/chat/**/*.tsx`, `src/contexts/ChatContext.tsx`, `src/hooks/useChat.ts`

## Chat Message Structure
- Use a consistent message structure for all chat messages
- Include message ID, sender, content, timestamp, and status
- Support different message types (text, image, code, etc.)
- Handle message formatting (markdown, code highlighting, etc.)

## Example Message Interface
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'error';
  type: 'text' | 'image' | 'code' | 'file';
  metadata?: {
    language?: string;
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
    [key: string]: any;
  };
}
```

## Chat UI Components
- Create reusable components for chat messages
- Implement message bubbles with appropriate styling
- Support message status indicators
- Implement typing indicators
- Support message reactions
- Implement message threading if needed
- Support message editing and deletion

## Chat Input
- Implement a textarea for message input
- Support multiline input
- Implement auto-resize for the textarea
- Support keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Implement character count and limits
- Support file uploads
- Implement emoji picker
- Support @mentions and #hashtags if needed

## Chat Context
- Use React Context for chat state management
- Store chat messages in context
- Implement functions for sending, editing, and deleting messages
- Handle message pagination
- Implement real-time updates

## Chat Hooks
- Create custom hooks for chat functionality
- Implement useChat hook for accessing chat context
- Implement useChatInput hook for input handling
- Implement useChatScroll hook for scrolling behavior

## AI Integration
- Implement API calls to AI services
- Handle streaming responses
- Implement retry logic for failed requests
- Support different AI models
- Implement context management for AI
- Support conversation history

## Error Handling
- Handle network errors gracefully
- Implement retry mechanisms
- Show appropriate error messages
- Allow resending failed messages
- Log errors for debugging

## Performance
- Implement virtualization for long chat histories
- Optimize rendering of chat messages
- Implement pagination for loading older messages
- Use memoization for expensive computations
- Implement debouncing for frequent updates

## Accessibility
- Ensure keyboard navigation works
- Use proper ARIA roles and attributes
- Implement proper focus management
- Provide alternative text for images
- Support screen readers 