# AI API Integrations

This document provides an overview of the AI API integrations implemented in the AI Chat Web App.

## Overview

The application supports multiple AI providers through their respective APIs:

1. **OpenAI API** - Access to GPT models like GPT-4o, GPT-3.5 Turbo, and o1
2. **Google Gemini API** - Access to Gemini models like Gemini Pro and Gemini 1.5
3. **Anthropic Claude API** - Access to Claude models like Claude 3 Opus, Sonnet, and Haiku

Each integration allows users to interact with these AI models through a unified chat interface while maintaining provider-specific functionality.

## Implementation Details

### Common Architecture

All API integrations follow a similar pattern:

1. **Service Layer** - Each provider has a dedicated service file (`openaiApi.ts`, `geminiApi.ts`, `anthropicApi.ts`) that handles:
   - API key management
   - Model initialization
   - Message formatting
   - API request handling
   - Error handling

2. **Chat API Integration** - The `chatApi.ts` file integrates all services and provides a unified interface for:
   - Selecting the appropriate service based on the provider
   - Handling message history
   - Managing chat sessions
   - Storing conversations locally

3. **UI Components** - The `ProviderSelector` component allows users to:
   - Switch between providers
   - Select specific models
   - Create new chats with the selected provider/model

### OpenAI API Integration

- **File**: `src/api/openaiApi.ts`
- **Models**: GPT-4o, GPT-4o Mini, GPT-3.5 Turbo, o1, o1-mini, o1-preview
- **API Key Format**: Starts with `sk-`
- **Dependencies**: Uses the official OpenAI Node.js SDK
- **Cursor Rules**:
  - The cursor is maintained at the end of each message
  - Responses are processed as complete messages (non-streaming)
  - Message history is preserved in the chat context

### Google Gemini API Integration

- **File**: `src/api/geminiApi.ts`
- **Models**: Gemini Pro, Gemini Pro Vision, Gemini 1.5 Pro, Gemini 1.5 Flash
- **API Key Format**: Starts with `AIza`
- **Dependencies**: Uses the official Google Generative AI SDK (`@google/generative-ai`)
- **Cursor Rules**:
  - The cursor is maintained at the end of each message
  - Responses are processed as complete messages (non-streaming)
  - Chat history is formatted as an array of role-content pairs
  - The last user message is sent separately from the history

### Anthropic Claude API Integration

- **File**: `src/api/anthropicApi.ts`
- **Models**: Claude 3 Sonnet (`claude-3-sonnet-20240229`), Claude 3 Haiku (`claude-3-haiku-20240307`), Claude 3.5 Sonnet v2 (`claude-3-5-sonnet-20241022`), Claude 3.7 Sonnet (`claude-3-7-sonnet-20250219`)
- **API Key Format**: Starts with `sk-ant`
- **Dependencies**: Uses the official Anthropic TypeScript SDK (`@anthropic-ai/sdk`)
- **CORS Support**: Enabled via `dangerouslyAllowBrowser: true` option
- **Default Model**: Claude 3 Haiku (`claude-3-haiku-20240307`) - chosen for reliability and performance
- **Cursor Rules**:
  - The cursor is maintained at the end of each message
  - Responses are processed as complete messages (non-streaming)
  - Messages are formatted as an array of role-content pairs

## Technical Implementation Details

### Message Formatting

Each provider requires different message formats:

1. **OpenAI**:
   ```typescript
   {
     role: 'user' | 'assistant',
     content: string
   }
   ```

2. **Google Gemini**:
   ```typescript
   {
     role: 'user' | 'model',
     parts: string
   }
   ```

3. **Anthropic Claude**:
   ```typescript
   {
     role: 'user' | 'assistant',
     content: string
   }
   ```

### API Request Handling

Each service implements a `generateResponse` method with a common signature:

```typescript
async generateResponse(
  messages: Message[], 
  userPrompt: string, 
  model: string
): Promise<string>
```

This method:
1. Formats the message history according to the provider's requirements
2. Adds the new user prompt
3. Makes the API request with appropriate headers and parameters
4. Processes the response
5. Returns the text content

### Error Handling

All services implement comprehensive error handling that:
1. Catches API-specific errors
2. Provides user-friendly error messages
3. Logs detailed error information for debugging
4. Handles network failures gracefully

## Usage

### Setting Up API Keys

1. Navigate to the Settings page
2. Enter your API keys for the providers you want to use
3. API keys are validated for format and stored locally in the browser

### Using Different Providers

1. Open a chat session
2. Use the provider selector in the header to choose a provider and model
3. Start chatting with the selected AI model

### API Key Security

- API keys are stored locally in the browser using localStorage
- Keys are never sent to our servers
- When logging API keys for debugging, they are masked for security
- API requests are made directly from the browser to the provider's API

## Error Handling

Each API integration includes comprehensive error handling for:

- Invalid API keys
- Rate limiting and quota issues
- Server errors
- Model availability issues
- Network failures

Error messages are displayed to the user with helpful information about how to resolve the issue.

## Provider-Specific Configuration

### OpenAI Configuration

```typescript
// Initialize OpenAI client
const client = new OpenAI({
  apiKey: apiKey.trim(),
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

// API call configuration
const response = await client.chat.completions.create({
  model: model,
  messages: formattedMessages,
  temperature: 0.7,
  max_tokens: 1000,
});
```

### Google Gemini Configuration

```typescript
// Initialize Gemini client
const client = new GoogleGenerativeAI(apiKey.trim());

// Get the Gemini model with safety settings
const geminiModel = client.getGenerativeModel({
  model: model,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // Additional safety settings...
  ],
});

// Start a chat session
const chat = geminiModel.startChat({
  history: formattedMessages.slice(0, -1), // All messages except the last one
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1000,
  },
});

// Generate a response
const result = await chat.sendMessage(userPrompt);
```

### Anthropic Claude Configuration

```typescript
// Initialize Anthropic client with CORS support
const client = new Anthropic({
  apiKey: apiKey.trim(),
  dangerouslyAllowBrowser: true // Enable CORS support for browser usage
});

// Generate a response
const response = await client.messages.create({
  model: 'claude-3-haiku-20240307',
  messages: formattedMessages,
  max_tokens: 1000,
  temperature: 0.7,
});

// Extract the response text
const responseText = response.content[0].text;
```

## Future Enhancements

Potential improvements for the API integrations:

1. **Streaming Responses** - Implement streaming for real-time responses
2. **File Uploads** - Add support for file uploads to vision-capable models
3. **Advanced Parameters** - Allow users to adjust temperature, max tokens, etc.
4. **API Proxy** - Add a backend proxy to enhance security
5. **Additional Providers** - Integrate more AI providers like Cohere, Mistral, etc.

## Getting API Keys

- **OpenAI**: [OpenAI API Keys](https://platform.openai.com/api-keys)
- **Google Gemini**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Anthropic Claude**: [Anthropic Console](https://console.anthropic.com/keys)

## Cursor Rules

Cursor rules for this project are stored in the `.cursor/rules/` directory. The chat-features.md file contains guidelines for implementing chat functionality, including:

- Chat message structure
- UI components
- Input handling
- Context management
- AI integration
- Error handling
- Performance considerations
- Accessibility requirements

For API-specific cursor rules, refer to the individual API integration sections above.

## Troubleshooting

### Common Issues

1. **Invalid API Key Format**
   - OpenAI keys must start with `sk-`
   - Google Gemini keys must start with `AIza`
   - Anthropic Claude keys must start with `sk-ant`

2. **Rate Limiting**
   - If you encounter rate limiting errors, check your usage quotas on the provider's dashboard
   - Consider implementing exponential backoff for retries

3. **Model Availability**
   - Not all models may be available in all regions
   - Some models require special access or higher tier accounts

4. **CORS Issues**
   - When testing locally, you may encounter CORS issues, especially with the Anthropic API
   - The application uses a CORS proxy for Anthropic API calls to work around browser security restrictions
   - For the CORS Anywhere proxy, you may need to request temporary access at https://cors-anywhere.herokuapp.com/corsdemo
   - In production, consider implementing your own backend proxy instead of using a public service

### Anthropic API CORS Solution

The Anthropic API implementation includes a CORS proxy solution to handle browser security restrictions:

```typescript
// Use a CORS proxy service
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
response = await fetch(`${proxyUrl}https://api.anthropic.com/v1/messages`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'Origin': window.location.origin
  },
  // ... rest of the request
});
```

To use this solution:
1. Visit https://cors-anywhere.herokuapp.com/corsdemo and request temporary access
2. Refresh your application and try again
3. For a production application, implement your own backend proxy

### Debugging

Each API service includes detailed logging that can help identify issues:

```typescript
console.log('Calling API with client configuration:', {
  apiKeyFirstChars: maskApiKey(apiKey),
  modelUsed: model,
  messagesCount: formattedMessages.length
});
```

Check the browser console for these logs when troubleshooting. 