export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
export interface ChatCompletionResponse {
  message: string;
}
export interface ProviderAdapter {
  createChatCompletion(messages: ChatMessage[]): Promise<ChatCompletionResponse>;
}
export class OpenAIAdapter implements ProviderAdapter {
  private apiKey: string;
  private baseUrl: string;
  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required');
    }
  }
  async createChatCompletion(messages: ChatMessage[]): Promise<ChatCompletionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${response.status} ${error}`);
      }
      const data = await response.json() as any;
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from OpenAI API');
      }
      return {
        message: data.choices[0].message.content,
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to generate response from AI provider');
    }
  }
}
export class GeminiAdapter implements ProviderAdapter {
  private apiKey: string;
  private baseUrl: string;
  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    if (!this.apiKey) {
      throw new Error('Gemini API key is required');
    }
  }
  async createChatCompletion(messages: ChatMessage[]): Promise<ChatCompletionResponse> {
    try {
      const geminiMessages = this.convertToGeminiFormat(messages);
      const response = await fetch(`${this.baseUrl}/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
          systemInstruction: {
            parts: [{
              text: "Please respond in plain text format without markdown formatting. Use simple bullet points (•) instead of asterisks (*) for lists. Keep responses clean and readable for a chat interface."
            }]
          },
        }),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${response.status} ${error}`);
      }
      const data = await response.json() as any;
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }
      const responseText = data.candidates[0].content.parts[0].text;
      return {
        message: responseText,
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to generate response from AI provider');
    }
  }
  private convertToGeminiFormat(messages: ChatMessage[]) {
    const contents = [];
    let systemInstruction = '';
    const systemMessages = messages.filter(msg => msg.role === 'system');
    if (systemMessages.length > 0) {
      systemInstruction = systemMessages.map(msg => msg.content).join('\n\n');
    }
    const conversationMessages = messages.filter(msg => msg.role !== 'system');
    for (const message of conversationMessages) {
      contents.push({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }]
      });
    }
    if (systemInstruction && contents.length > 0 && contents[0].role === 'user') {
      contents[0].parts[0].text = `${systemInstruction}\n\n${contents[0].parts[0].text}`;
    }
    return contents;
  }
}
export class OpenRouterAdapter implements ProviderAdapter {
  private apiKey: string;
  private baseUrl: string;
  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = 'https://openrouter.ai/api/v1';
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required');
    }
  }
  async createChatCompletion(messages: ChatMessage[]): Promise<ChatCompletionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
          'X-Title': 'Chatbot Platform',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} ${error}`);
      }
      const data = await response.json() as any;
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from OpenRouter API');
      }
      return {
        message: data.choices[0].message.content,
      };
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw new Error('Failed to generate response from AI provider');
    }
  }
}
export const createProviderAdapter = (): ProviderAdapter => {
  const provider = process.env.AI_PROVIDER || 'gemini';
  switch (provider) {
    case 'openai':
      return new OpenAIAdapter();
    case 'gemini':
      return new GeminiAdapter();
    case 'openrouter':
      return new OpenRouterAdapter();
    default:
      return new GeminiAdapter();
  }
};
