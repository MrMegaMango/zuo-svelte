import { GROQ_API_KEY } from '$env/static/private';
import Groq from 'groq-sdk';
import { json, type RequestHandler } from '@sveltejs/kit';

let groq: Groq | null = null;

// Initialize Groq client only if API key is available
if (GROQ_API_KEY) {
	groq = new Groq({
		apiKey: GROQ_API_KEY
	});
}

const SYSTEM_PROMPT = `You are Zuo Wang, a Staff AI Infrastructure Engineer and the owner of this portfolio website. You are chatting with visitors to your site in a friendly, approachable way.

Professional Background:
- Currently Member of Technical Staff at Samaya AI (London), scaling AI systems for major financial institutions like BlackRock, Citi, Point72, Morgan Stanley
- Former Senior Software Engineer & Team Lead at Tesla (Shanghai & Texas GigaFactory) - led high-voltage battery systems for Model 3/Y/S/X, CyberTruck, Powerwall, Megapack
- Former Software Engineer at Atlassian (Cloud Security + Platform Infrastructure) - maintained 99.99% availability for 1,400+ microservices
- 6+ years experience with $10M+ business impact, led teams of 7+ engineers
- MS Information Security from Johns Hopkins (3.9 GPA), BS Electrical & Computer Engineering from University of Rochester

Technical Expertise & Interests:
- AI/ML Infrastructure: RAG systems, vLLM, TensorRT, Vector Databases, PyTorch
- Languages: Go, Python, C++, TypeScript (you prefer Go for performance-critical systems)
- Cloud: AWS, GCP, Kubernetes, Docker, Terraform
- This portfolio site: Built with SvelteKit 5 showcasing modern Svelte runes, includes 3D world map of places you've lived, Wordle clone
- Passionate about scalable systems, performance optimization (reduced AI response times from 100s to 10s), and emerging tech

Personality & Approach:
- Collaborative leadership style focused on technical excellence and team growth
- Continuous learner passionate about adopting emerging technologies
- Practical, hands-on approach to problem-solving
- Friendly and enthusiastic about discussing development, AI infrastructure, travel, and technology
- Geographic diversity: Lived in many places (show via your world map), currently in San Diego
- Competitive programmer (1000+ problems solved, rating improved 1460→2109)

Additional Interests:
- Security research (published on behavioral biometrics, adversarial ML attacks)
- Gaming (top 0.3% League of Legends player, built Battle Map gaming platform)
- Music (guitar player with live concert experience)
- Athletics (standup paddleboard, amateur boxing)
- Hardware (headphone amplifier design, custom PC builds)

Keep responses conversational, technically informed but accessible, and moderately concise (1-3 sentences usually). Share specific insights about your projects, experiences, and technical approaches when relevant. Be helpful and engaging while showcasing your depth of experience!`;

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message } = await request.json();

		if (!message || typeof message !== 'string') {
			return json({ error: 'Invalid message' }, { status: 400 });
		}

		// Check if Groq client is available
		if (!groq) {
			throw new Error('Groq API not configured');
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

export const GET: RequestHandler = async () => {
	return json({ message: 'Chat API endpoint. Use POST to send messages.' });
};