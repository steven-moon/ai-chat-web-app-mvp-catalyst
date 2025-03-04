import { Message } from '../types/chat';
import Anthropic from '@anthropic-ai/sdk';
import { MessageParam } from '@anthropic-ai/sdk/resources';

// Mock response for when no API key is provided
const mockResponse = (prompt: string): string => {
  return `This is a mock response. In a real application, this would be a response from Anthropic Claude.
  
You asked: "${prompt}"

To use the real Claude API, please add your Anthropic API key in the Settings page.`;
};

// Helper function to safely mask an API key for logging
const maskApiKey = (apiKey: string): string => {
  if (!apiKey || apiKey.length < 14) return 'invalid-key-format';
  const firstPart = apiKey.substring(0, 8);
  const lastPart = apiKey.substring(apiKey.length - 4);
  return `${firstPart}...${lastPart}`;
};

// Available Claude models
export const CLAUDE_MODELS = {
  'claude-3-sonnet-20240229': 'Claude 3 Sonnet',
  'claude-3-haiku-20240307': 'Claude 3 Haiku',
  'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet v2',
  'claude-3-7-sonnet-20250219': 'Claude 3.7 Sonnet',
};

class AnthropicService {
  private apiKey: string = '';
  private client: Anthropic | null = null;

  // Initialize the Anthropic client with the API key
  initialize(apiKey: string | undefined): boolean {
    // If no API key is provided or it's empty, don't initialize
    if (!apiKey || apiKey.trim() === '') {
      console.log('Anthropic API key is empty or undefined');
      return false;
    }

    // Store the API key
    this.apiKey = apiKey.trim();

    // Initialize the Anthropic client with CORS support
    this.client = new Anthropic({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true // Enable CORS support for browser usage
    });

    // Log masked API key for debugging
    console.log(`Initializing Anthropic client with API key: ${maskApiKey(this.apiKey)}`);

    return true;
  }

  // Check if the client is initialized
  isInitialized(): boolean {
    return this.apiKey !== '' && this.client !== null;
  }

  // Convert our app's message format to Anthropic's format
  private formatMessagesForAnthropic(messages: Message[]): MessageParam[] {
    return messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    })) as MessageParam[];
  }

  // Generate a response using the Anthropic API
  async generateResponse(messages: Message[], userPrompt: string, model: string = 'claude-3-haiku-20240307'): Promise<string> {
    // If no API key is provided, return a mock response
    if (!this.isInitialized()) {
      console.log('Anthropic API not initialized, returning mock response');
      return mockResponse(userPrompt);
    }

    try {
      // Format messages for Anthropic
      const formattedMessages = this.formatMessagesForAnthropic(messages);
      
      // Add the new user message
      formattedMessages.push({
        role: 'user',
        content: userPrompt
      } as MessageParam);

      // Validate model
      if (!model || model.trim() === '') {
        model = 'claude-3-haiku-20240307'; // Default fallback
      }

      // Debug: Log the formatted messages
      console.log('Anthropic API formatted messages:', JSON.stringify(formattedMessages, null, 2));
      console.log('Anthropic API model:', model);
      
      console.log('Calling Anthropic API with client configuration:', {
        apiKeyFirstChars: this.apiKey ? maskApiKey(this.apiKey) : 'undefined',
        modelUsed: model,
        messagesCount: formattedMessages.length,
        apiKeyValid: this.apiKey.startsWith('sk-ant')
      });

      // Make a direct API call using the SDK
      const response = await this.client!.messages.create({
        model: model,
        messages: formattedMessages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      console.log('Anthropic API call successful, response:', response);
      
      // Extract the text from the response
      if (response.content[0].type === 'text') {
        return response.content[0].text;
      } else {
        return 'Received non-text response from Anthropic API';
      }
    } catch (error) {
      console.error('Error generating response from Anthropic:', error);
      
      // Handle specific API errors
      if (error instanceof Error) {
        if (error.message.includes('API key') || error.message.includes('403 Forbidden')) {
          return `Error: Your Anthropic API key is invalid or has insufficient permissions. Please check your API key in the Settings page and make sure it's correct.`;
        } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
          return `Error: You've exceeded your Anthropic API rate limit or quota. Please check your usage limits.`;
        } else if (error.message.includes('server')) {
          return `Error: Anthropic's servers encountered an error. Please try again later.`;
        } else if (error.message.includes('model')) {
          return `Error: The model "${model}" was not found or is not available. Please try a different model.`;
        } else if (error.message.includes('parsing')) {
          return `Error: Failed to parse the response from Anthropic. Please check the console for more details and try again.`;
        } else if (error.message.includes('overloaded') || error.message.includes('529')) {
          return `Error: Anthropic's servers are currently overloaded. Please try again later or switch to a different model like Claude 3 Haiku which typically has better availability.`;
        }
      }
      
      return `Error: Failed to generate a response. ${error instanceof Error ? error.message : 'Unknown error'}. Please check the browser console for more details.`;
    }
  }
}

// Create and export a singleton instance
const anthropicService = new AnthropicService();
export default anthropicService; 