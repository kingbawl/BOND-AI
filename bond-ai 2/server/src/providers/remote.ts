import type { AIProvider, ChatTurn } from './types.js';
export class RemoteProvider implements AIProvider {
 constructor(private kind:'gemini'|'openai'|'anthropic', private key:string, private model:string) {}
 async reply(messages:ChatTurn[], agentName:string, instructions='') {
  const system=`You are ${agentName}, a practical business operating assistant inside BOND. Be honest about what you can and cannot access. Never claim to have executed an external action unless a connected tool actually did it. ${instructions}`;
  if(this.kind==='gemini'){
   const contents=messages.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]}));
   const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents,generationConfig:{temperature:0.6}})});
   const j:any=await r.json(); if(!r.ok) throw new Error(j.error?.message||'Gemini request failed'); return j.candidates?.[0]?.content?.parts?.map((p:any)=>p.text||'').join('')||'The model returned an empty response.';
  }
  if(this.kind==='openai'){
   const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${this.key}`,'Content-Type':'application/json'},body:JSON.stringify({model:this.model,messages:[{role:'system',content:system},...messages],temperature:0.6})}); const j:any=await r.json(); if(!r.ok) throw new Error(j.error?.message||'OpenAI request failed'); return j.choices?.[0]?.message?.content||'The model returned an empty response.';
  }
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'x-api-key':this.key,'anthropic-version':'2023-06-01','content-type':'application/json'},body:JSON.stringify({model:this.model,max_tokens:1200,system,messages:messages.map(m=>({role:m.role,content:m.content}))})}); const j:any=await r.json(); if(!r.ok) throw new Error(j.error?.message||'Anthropic request failed'); return j.content?.map((p:any)=>p.text||'').join('')||'The model returned an empty response.';
 }
}
