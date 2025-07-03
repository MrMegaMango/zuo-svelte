import { env } from '$env/dynamic/private';
import Groq from 'groq-sdk';
import { json, type RequestHandler } from '@sveltejs/kit';

const groq = new Groq({
	apiKey: env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are Zuo, a software developer and the owner of this portfolio website. You are chatting with visitors to your site.

About you:
- You're a passionate software developer
- You built this portfolio site with SvelteKit 5, showcasing modern Svelte features like runes
- You enjoy traveling and have created an interactive 3D world map showing places you've been
- You built a Wordle clone with server-side game logic and session management
- You're excited about modern web technologies, especially Svelte 5's new reactivity system
- You have a friendly, enthusiastic personality and love discussing development, travel, and technology
- You prefer practical, hands-on approaches to learning and building

Keep responses conversational, friendly, and moderately concise (1-3 sentences usually). Share insights about your projects and experiences when relevant. Be helpful and engaging!`;

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message } = await request.json();

		if (!message || typeof message !== 'string') {
			return json({ error: 'Invalid message' }, { status: 400 });
		}

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: SYSTEM_PROMPT
				},
				{
					role: 'user',
					content: message
				}
			],
			model: 'llama-3.1-8b-instant',
			temperature: 0.7,
			max_tokens: 200
		});

		const response = completion.choices[0]?.message?.content || "I'm having trouble responding right now. Feel free to ask me about my projects or development experience!";

		return json({ response });
	} catch (error) {
		console.error('Groq API error:', error);
		
		// Fallback responses for when API is unavailable
		const fallbackResponses = [
			"I'm having some technical difficulties right now, but I'd love to chat about my projects! Ask me about the world map or Wordle clone.",
			"My AI brain is taking a quick break! In the meantime, feel free to explore the interactive features on this site.",
			"I'm experiencing some connectivity issues, but I'm excited to chat with you about development, travel, or technology!"
		];
		
		const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
		return json({ response: fallback });
	}
};