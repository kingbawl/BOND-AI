export type ChatTurn = { role: 'user' | 'assistant'; content: string };
export interface AIProvider { reply(messages: ChatTurn[], agentName: string, instructions?: string): Promise<string> }
