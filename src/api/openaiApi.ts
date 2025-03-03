import OpenAI from 'openai';
import { Message } from '../types/chat';

// Mock response for when no API key is provided
const mockResponse = (prompt: string): string => {
  return `This is a mock response. In a real application, this would be a response from OpenAI.
  
You asked: "${prompt}"

To use the real OpenAI API, please add your API key in the Settings page.`;
};

// Helper function to safely mask an API key for logging
const maskApiKey = (apiKey: string): string => {
  if (!apiKey || apiKey.length < 14) return 'invalid-key-format';
  const firstPart = apiKey.substring(0, 10);
  const lastPart = apiKey.substring(apiKey.length - 4);
  return `${firstPart}...${lastPart}`;
};

// Available OpenAI models
export const OPENAI_MODELS = {
  'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o Mini',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'o1': 'o1',
  'o1-mini': 'o1-mini',
  'o1-preview': 'o1-preview',
};

class OpenAIService {
  private client: OpenAI | null = null;

  // Initialize the OpenAI client with the API key
  initialize(apiKey: string | undefined): boolean {
    // If no API key is provided or it's empty, don't initialize
    if (!apiKey || apiKey.trim() === '') {
      console.log('OpenAI API key is empty or undefined');
      this.client = null;
      return false;
    }

    // Log masked API key for debugging
    console.log(`Initializing OpenAI client with API key: ${maskApiKey(apiKey)}`);

    // Basic validation for OpenAI API key format (should start with "sk-")
    if (!apiKey.startsWith('sk-')) {
      console.error('Invalid OpenAI API key format. API keys should start with "sk-"');
      this.client = null;
      return false;
    }

    try {
      this.client = new OpenAI({
        apiKey: apiKey.trim(),
        dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
      });
      return true;
    } catch (error) {
      console.error('Error initializing OpenAI client:', error);
      this.client = null;
      return false;
    }
  }

  // Check if the client is initialized
  isInitialized(): boolean {
    return this.client !== null;
  }

  // Convert our app's message format to OpenAI's format
  private formatMessagesForOpenAI(messages: Message[]): Array<OpenAI.Chat.ChatCompletionMessageParam> {
    return messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    } as OpenAI.Chat.ChatCompletionMessageParam));
  }

  // Generate a response using the OpenAI API
  async generateResponse(messages: Message[], userPrompt: string, model: string = 'gpt-3.5-turbo'): Promise<string> {
    // If no API key is provided, return a mock response
    if (!this.client) {
      return mockResponse(userPrompt);
    }

    try {
      // Format messages for OpenAI
      const formattedMessages = this.formatMessagesForOpenAI(messages);
      
      // Add the new user message
      formattedMessages.push({
        role: 'user',
        content: userPrompt
      });

      // Validate model
      if (!model || model.trim() === '') {
        model = 'gpt-3.5-turbo'; // Default fallback
      }

      console.log('Calling OpenAI API with client configuration:', {
        apiKeyFirstChars: this.client.apiKey ? maskApiKey(this.client.apiKey) : 'undefined',
        modelUsed: model,
        messagesCount: formattedMessages.length
      });

      // Call the OpenAI API with the specified model
      const response = await this.client.chat.completions.create({
        model: model, // Use the provided model
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      // Return the response text
      return response.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('Error generating response from OpenAI:', error);
      
      // Handle specific API errors
      if (error instanceof OpenAI.APIError) {
        if (error.status === 401) {
          return `Error: Your OpenAI API key is invalid. Please check your API key in the Settings page and make sure it's correct.`;
        } else if (error.status === 429) {
          return `Error: You've exceeded your OpenAI API rate limit or quota. Please check your billing details at https://platform.openai.com/account/billing`;
        } else if (error.status === 500) {
          return `Error: OpenAI's servers encountered an error. Please try again later.`;
        } else if (error.status === 404) {
          return `Error: The model "${model}" was not found or is not available. Please try a different model.`;
        }
      }
      
      return `Error: Failed to generate a response. ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}

// Create and export a singleton instance
const openaiService = new OpenAIService();
export default openaiService; 