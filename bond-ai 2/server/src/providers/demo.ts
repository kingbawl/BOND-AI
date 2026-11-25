import type { AIProvider, ChatTurn } from './types.js';
export class DemoProvider implements AIProvider {
 async reply(messages: ChatTurn[], agentName: string) { const q=messages.at(-1)?.content ?? ''; return `I'm ${agentName}. Your message is saved, but no live AI provider is configured yet.\n\nTo enable real AI, add an API key to the server .env file and set AI_PROVIDER to gemini, openai, or anthropic.\n\nFor now, I can help you plan the next step: ${q.slice(0,220)}`; }
}
