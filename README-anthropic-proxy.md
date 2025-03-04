# Anthropic API Integration

This document provides information about the Anthropic Claude API integration in the AI Chat Web Application.

## Overview

The application integrates with Anthropic's Claude AI models through their official TypeScript SDK, which now supports CORS for browser-based applications.

## CORS Support in Anthropic SDK

As of August 2024, the Anthropic TypeScript SDK includes CORS support, allowing direct API calls from browser environments without the need for a proxy server. This is enabled by setting the `dangerouslyAllowBrowser: true` option when instantiating the SDK.

## Implementation

### Installation

To use the Anthropic SDK in your project:

```bash
npm install @anthropic-ai/sdk
```

### Usage

The integration is implemented in `src/api/anthropicApi.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { MessageParam } from '@anthropic-ai/sdk/resources';

// Initialize the client with CORS support
const client = new Anthropic({
  apiKey: 'your-api-key',
  dangerouslyAllowBrowser: true // Enable CORS support for browser usage
});

// Make API calls directly from the browser
const response = await client.messages.create({
  model: 'claude-3-sonnet-20240229',
  messages: [{ role: 'user', content: 'Hello, Claude!' }],
  max_tokens: 1000
});
```

### Available Models

The application supports the following Claude models:

- Claude 3 Sonnet (`claude-3-sonnet-20240229`)
- Claude 3 Haiku (`claude-3-haiku-20240307`)
- Claude 3.5 Sonnet v2 (`claude-3-5-sonnet-20241022`)
- Claude 3.7 Sonnet (`claude-3-7-sonnet-20250219`)

Note: We've limited the available models to those with the best reliability and performance. Claude 3 Haiku is set as the default model due to its faster response times and better availability during high traffic periods.

## API Key Management

Users need to provide their own Anthropic API key in the Settings page. The application stores this key securely in the user's preferences and uses it for all requests to the Anthropic API.

## Error Handling

The implementation includes comprehensive error handling for various scenarios:

- Invalid API keys
- Rate limiting and quota issues
- Server errors
- Model availability issues
- Parsing errors

## Security Considerations

While the SDK now supports browser-based requests, it's important to note:

1. **API Key Exposure**: When using `dangerouslyAllowBrowser: true`, your API key is exposed in the browser. This is acceptable for development or personal projects, but for production applications with many users, consider implementing a backend proxy to protect your API key.

2. **Usage Monitoring**: Monitor your API usage to prevent unexpected charges, especially in public-facing applications.

## Troubleshooting

### Common Issues

1. **API Key Issues**: Ensure your API key is valid and has the necessary permissions.

2. **Model Availability**: Verify that the selected model is available for your API key tier.

3. **Rate Limiting**: If you encounter rate limit errors, consider implementing request throttling or upgrading your API plan.

## References

- [Anthropic TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript)
- [Anthropic API Documentation](https://docs.anthropic.com/en/api)
- [Claude Models Overview](https://docs.anthropic.com/claude/docs/models-overview) 