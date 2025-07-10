import { getAllConversations, getConversationMessages, initializeDatabase, type ConversationSummary, type ChatMessage } from '$lib/database.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	try {
		// Initialize database (graceful failure)
		await initializeDatabase();

		const conversationId = url.searchParams.get('conversation');
		
		// Get all conversations for the summary view
		const conversations = await getAllConversations() as ConversationSummary[];
		
		// If a specific conversation is requested, get its messages
		let selectedConversation: {
			conversation: ConversationSummary | null;
			messages: ChatMessage[];
		} = {
			conversation: null,
			messages: []
		};
		
		if (conversationId) {
			const id = parseInt(conversationId);
			if (!isNaN(id)) {
				const conversation = conversations.find(c => c.id === id) || null;
				const messages = await getConversationMessages(id) as ChatMessage[];
				
				selectedConversation = {
					conversation,
					messages
				};
			}
		}
		
		return {
			conversations,
			selectedConversation
		};
	} catch (error) {
		console.error('⚠️  Error loading admin data:', (error as Error).message);
		
		// Return empty data if there are issues
		return {
			conversations: [],
			selectedConversation: {
				conversation: null,
				messages: []
			}
		};
	}
}; 