import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Message } from '../types/chat';

// Mock response for when no API key is provided
const mockResponse = (prompt: string): string => {
  return `This is a mock response. In a real application, this would be a response from Google Gemini.
  
You asked: "${prompt}"

To use the real Gemini API, please add your Google Gemini API key in the Settings page.`;
};

// Helper function to safely mask an API key for logging
const maskApiKey = (apiKey: string): string => {
  if (!apiKey || apiKey.length < 10) return 'invalid-key-format';
  const firstPart = apiKey.substring(0, 6);
  const lastPart = apiKey.substring(apiKey.length - 4);
  return `${firstPart}...${lastPart}`;
};

// Available Gemini models
export const GEMINI_MODELS = {
  'gemini-pro': 'Gemini Pro',
  'gemini-pro-vision': 'Gemini Pro Vision',
  'gemini-1.5-pro': 'Gemini 1.5 Pro',
  'gemini-1.5-flash': 'Gemini 1.5 Flash',
};

class GeminiService {
  private client: GoogleGenerativeAI | null = null;
  private apiKey: string = '';

  // Initialize the Gemini client with the API key
  initialize(apiKey: string | undefined): boolean {
    // If no API key is provided or it's empty, don't initialize
    if (!apiKey || apiKey.trim() === '') {
      console.log('Gemini API key is empty or undefined');
      this.client = null;
      return false;
    }

    // Store the API key
    this.apiKey = apiKey.trim();

    // Log masked API key for debugging
    console.log(`Initializing Gemini client with API key: ${maskApiKey(this.apiKey)}`);

    try {
      this.client = new GoogleGenerativeAI(this.apiKey);
      return true;
    } catch (error) {
      console.error('Error initializing Gemini client:', error);
      this.client = null;
      return false;
    }
  }

  // Check if the client is initialized
  isInitialized(): boolean {
    return this.client !== null;
  }

  // Convert our app's message format to Gemini's format
  private formatMessagesForGemini(messages: Message[]): Array<{ role: string; parts: string }> {
    return messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: msg.content
    }));
  }

  // Generate a response using the Gemini API
  async generateResponse(messages: Message[], userPrompt: string, model: string = 'gemini-pro'): Promise<string> {
    // If no API key is provided, return a mock response
    if (!this.client) {
      return mockResponse(userPrompt);
    }

    try {
      // Format messages for Gemini
      const formattedMessages = this.formatMessagesForGemini(messages);
      
      // Add the new user message
      formattedMessages.push({
        role: 'user',
        parts: userPrompt
      });

      // Validate model
      if (!model || model.trim() === '') {
        model = 'gemini-pro'; // Default fallback
      }

      console.log('Calling Gemini API with client configuration:', {
        apiKeyFirstChars: this.apiKey ? maskApiKey(this.apiKey) : 'undefined',
        modelUsed: model,
        messagesCount: formattedMessages.length
      });

      // Get the Gemini model
      const geminiModel = this.client.getGenerativeModel({
        model: model,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
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
      const response = await result.response;
      
      // Return the response text
      return response.text() || 'No response generated';
    } catch (error) {
      console.error('Error generating response from Gemini:', error);
      
      // Handle specific API errors
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return `Error: Your Gemini API key is invalid. Please check your API key in the Settings page and make sure it's correct.`;
        } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
          return `Error: You've exceeded your Gemini API rate limit or quota. Please check your usage limits.`;
        } else if (error.message.includes('server')) {
          return `Error: Gemini's servers encountered an error. Please try again later.`;
        } else if (error.message.includes('model')) {
          return `Error: The model "${model}" was not found or is not available. Please try a different model.`;
        }
      }
      
      return `Error: Failed to generate a response. ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}

// Create and export a singleton instance
const geminiService = new GeminiService();
export default geminiService; 