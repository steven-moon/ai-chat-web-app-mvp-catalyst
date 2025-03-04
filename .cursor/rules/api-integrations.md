# API Integrations Rules
**Applies to**: `src/api/*.ts`, `src/contexts/UserContext.tsx`, `src/components/chat/ProviderSelector.tsx`

## General API Guidelines

- Use a consistent pattern for all API integrations
- Implement proper error handling for all API calls
- Mask API keys in logs for security
- Validate API keys before making requests
- Use appropriate typing for all API responses
- Implement retry logic for transient failures
- Log API calls with appropriate detail level

## Service Structure

- Each API service should be a singleton
- Implement an `initialize` method that validates the API key
- Implement a `generateResponse` method with consistent signature
- Format messages appropriately for each provider
- Handle provider-specific error responses

## OpenAI API

- **File**: `src/api/openaiApi.ts`
- **API Key Format**: Must start with `sk-`
- **Message Format**:
  ```typescript
  {
    role: 'user' | 'assistant',
    content: string
  }
  ```
- **Dependencies**: Use the official OpenAI Node.js SDK
- **Configuration**:
  - Set `dangerouslyAllowBrowser: true` for client-side usage
  - Use appropriate temperature (0.7 recommended)
  - Set reasonable max_tokens limit (1000 recommended)

## Google Gemini API

- **File**: `src/api/geminiApi.ts`
- **API Key Format**: Must start with `AIza`
- **Message Format**:
  ```typescript
  {
    role: 'user' | 'model',
    parts: string
  }
  ```
- **Dependencies**: Use the official Google Generative AI SDK
- **Configuration**:
  - Implement appropriate safety settings
  - Send chat history separately from the current message
  - Use appropriate temperature and token limits

## Anthropic Claude API

- **File**: `src/api/anthropicApi.ts`
- **API Key Format**: Must start with `sk-ant`
- **Message Format**:
  ```typescript
  {
    role: 'user' | 'assistant',
    content: string
  }
  ```
- **Dependencies**: Use direct fetch API calls
- **Configuration**:
  - Set appropriate API version in headers
  - Use consistent temperature and token limits
- **CORS Handling**:
  - Implement a CORS proxy solution for browser-based requests
  - Use the CORS Anywhere service for development
  - Include proper Origin headers
  - Provide clear error messages for CORS-related failures
  - For production, implement a backend proxy

## Chat API Integration

- **File**: `src/api/chatApi.ts`
- Provide a unified interface for all providers
- Select the appropriate service based on provider
- Handle message history consistently
- Store conversations in localStorage
- Generate appropriate error messages for users

## Provider Selection

- **Component**: `src/components/chat/ProviderSelector.tsx`
- Allow users to select from available providers
- Display available models for each provider
- Remember user's last selected provider/model
- Provide clear UI for switching between providers

## API Key Management

- **File**: `src/contexts/UserContext.tsx`
- Store API keys securely in localStorage
- Validate API key formats before saving
- Provide methods to update API keys
- Mask API keys in any logs or UI

## Error Handling

- Implement specific error handling for each provider
- Provide user-friendly error messages
- Handle common error scenarios:
  - Invalid API keys
  - Rate limiting
  - Quota exceeded
  - Model not available
  - Network failures
- Log detailed error information for debugging

## Performance Considerations

- Minimize unnecessary API calls
- Implement caching where appropriate
- Use debouncing for user input
- Show loading states during API calls
- Handle long-running requests gracefully

## Security Best Practices

- Never expose API keys in client-side code
- Use environment variables for sensitive information
- Implement proper CORS handling
  - Use a CORS proxy for APIs with restrictions (especially Anthropic)
  - For development, use services like CORS Anywhere with proper attribution
  - For production, implement your own backend proxy
- Validate all user input before sending to APIs
- Consider using a backend proxy for production 