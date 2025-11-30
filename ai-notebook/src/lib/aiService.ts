interface LLMSettings {
  provider: 'openai' | 'anthropic' | 'custom';
  baseUrl: string;
  apiKey: string;
  model: string;
}

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export const AiService = {
  getSettings: (): LLMSettings | null => {
    const savedSettings = localStorage.getItem('llm_settings');
    if (!savedSettings) return null;
    try {
      return JSON.parse(savedSettings);
    } catch (e) {
      console.error('Failed to parse settings', e);
      return null;
    }
  },

  generateResponse: async (messages: Message[]): Promise<string> => {
    const settings = AiService.getSettings();
    if (!settings || !settings.apiKey) {
      throw new Error('LLM Settings not configured or missing API Key.');
    }

    try {
      const response = await fetch(`${settings.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.model,
          messages: messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No response from AI.';

    } catch (error: any) {
      console.error('AI Service Error:', error);
      throw new Error(error.message || 'Failed to communicate with AI service.');
    }
  },

  generateSummary: async (sources: { title: string; content: string }[]): Promise<string> => {
      if (sources.length === 0) {
          return "Please add some sources to generate a summary.";
      }

      const context = sources.map(s => `Title: ${s.title}\nContent:\n${s.content}\n---\n`).join('\n');

      const messages: Message[] = [
          {
              role: 'system',
              content: 'You are a helpful research assistant. Analyze the provided source materials and generate a comprehensive summary and potential research topics based on them. Format the output with Markdown.'
          },
          {
              role: 'user',
              content: `Here are the source materials:\n\n${context}\n\nPlease analyze these and provide a summary and key research topics.`
          }
      ];

      return AiService.generateResponse(messages);
  },

  chat: async (history: Message[], question: string, sources: { title: string; content: string }[]): Promise<string> => {
       const context = sources.map(s => `Title: ${s.title}\nContent:\n${s.content}\n---\n`).join('\n');

       const systemMessage: Message = {
           role: 'system',
           content: `You are a helpful research assistant. Answer the user's question based strictly on the provided context below. If the answer is not in the context, say so.\n\nContext:\n${context}`
       };

       // Filter out previous system messages to avoid duplication if we are managing history manually
       const conversationHistory = history.filter(m => m.role !== 'system');

       const messages: Message[] = [
           systemMessage,
           ...conversationHistory,
           { role: 'user', content: question }
       ];

       return AiService.generateResponse(messages);
  }
};
