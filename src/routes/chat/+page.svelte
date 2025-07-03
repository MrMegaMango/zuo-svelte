<script lang="ts">
	import { tick } from 'svelte';

	interface Message {
		id: string;
		text: string;
		sender: 'user' | 'zuo';
		timestamp: Date;
	}

	let messages = $state<Message[]>([
		{
			id: '1',
			text: "Hey there! I'm Zuo, a virtual version of the real me. Ask me anything about my projects, experiences, or just chat!",
			sender: 'zuo',
			timestamp: new Date()
		}
	]);

	let currentMessage = $state('');
	let isTyping = $state(false);
	let messagesContainer: HTMLDivElement;

	function addMessage(text: string, sender: 'user' | 'zuo') {
		const newMessage: Message = {
			id: Date.now().toString(),
			text,
			sender,
			timestamp: new Date()
		};
		messages.push(newMessage);
		scrollToBottom();
	}

	async function scrollToBottom() {
		await tick(); // Wait for DOM update
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	async function getZuoResponse(userMessage: string): Promise<string> {
		try {
			const response = await fetch('/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message: userMessage })
			});

			if (!response.ok) {
				throw new Error('API request failed');
			}

			const data = await response.json();
			return data.response || getFallbackResponse();
		} catch (error) {
			console.error('Failed to get AI response:', error);
			return getFallbackResponse();
		}
	}

	function getFallbackResponse(): string {
		const fallbacks = [
			"I'm having some technical difficulties right now, but I'd love to chat about my projects! Ask me about the world map or Wordle clone.",
			"My AI brain is taking a quick break! In the meantime, feel free to explore the interactive features on this site.",
			"I'm experiencing some connectivity issues, but I'm excited to chat with you about development, travel, or technology!",
			"Something went wrong with my responses, but I'm here to chat! What would you like to know about my work?",
			"I'm having trouble connecting right now, but I'd love to discuss my experience with SvelteKit 5 and modern web development!"
		];
		return fallbacks[Math.floor(Math.random() * fallbacks.length)];
	}

	async function sendMessage() {
		if (!currentMessage.trim()) return;
		
		const userText = currentMessage.trim();
		currentMessage = '';
		
		addMessage(userText, 'user');
		
		isTyping = true;
		await scrollToBottom(); // Scroll when typing indicator appears
		
		// Simulate typing delay
		await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
		
		isTyping = false;
		const response = await getZuoResponse(userText);
		addMessage(response, 'zuo');
	}

	function handleKeypress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}
</script>

<svelte:head>
	<title>Chat | Zuo</title>
	<meta name="description" content="Chat with virtual Zuo about projects, experiences, and development" />
</svelte:head>

<div class="chat-container">
	<div class="chat-header">
		<div class="avatar">🧑‍💻</div>
		<div class="header-info">
			<h1>Chat with Zuo</h1>
		</div>
	</div>

	<div class="messages-container" bind:this={messagesContainer}>
		{#each messages as message (message.id)}
			<div class="message {message.sender}">
				<div class="message-content">
					<div class="message-text">{message.text}</div>
					<div class="message-time">
						{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					</div>
				</div>
			</div>
		{/each}
		
		{#if isTyping}
			<div class="message zuo">
				<div class="message-content">
					<div class="typing-indicator">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="input-container">
		<div class="input-wrapper">
			<textarea
				bind:value={currentMessage}
				onkeypress={handleKeypress}
				placeholder="Type your message..."
				rows="1"
			></textarea>
			<button onclick={sendMessage} disabled={!currentMessage.trim() || isTyping}>
				Send
			</button>
		</div>
	</div>
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 8rem);
		max-width: 900px;
		margin: 0 auto;
		background: white;
		border-radius: 24px;
		overflow: hidden;
		box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
		border: 1px solid rgb(229 231 235);
	}

	.chat-header {
		display: flex;
		align-items: center;
		padding: 1.5rem 2rem;
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
		color: white;
		gap: 1rem;
		position: relative;
		overflow: hidden;
	}

	.chat-header::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
		animation: shimmer 3s infinite;
	}

	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}

	.avatar {
		font-size: 2.5rem;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border-radius: 20px;
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid rgba(255, 255, 255, 0.2);
		position: relative;
		z-index: 10;
	}

	.header-info h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		position: relative;
		z-index: 10;
	}

	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
		scrollbar-width: thin;
		scrollbar-color: #cbd5e1 transparent;
	}

	.messages-container::-webkit-scrollbar {
		width: 6px;
	}

	.messages-container::-webkit-scrollbar-track {
		background: transparent;
	}

	.messages-container::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 3px;
	}

	.messages-container::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}

	.message {
		display: flex;
		max-width: 75%;
		animation: messageSlide 0.3s ease-out;
	}

	@keyframes messageSlide {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.message.user {
		align-self: flex-end;
	}

	.message.zuo {
		align-self: flex-start;
	}

	.message-content {
		padding: 1rem 1.25rem;
		border-radius: 24px;
		word-wrap: break-word;
		position: relative;
		backdrop-filter: blur(10px);
	}

	.message.user .message-content {
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
		color: white;
		border-bottom-right-radius: 8px;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	.message.zuo .message-content {
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(226, 232, 240, 0.5);
		border-bottom-left-radius: 8px;
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
	}

	.message-text {
		margin-bottom: 0.5rem;
		line-height: 1.5;
		font-size: 0.95rem;
	}

	.message-time {
		font-size: 0.75rem;
		opacity: 0.6;
		font-weight: 500;
	}

	.typing-indicator {
		display: flex;
		gap: 0.4rem;
		align-items: center;
		padding: 0.5rem 0;
	}

	.typing-indicator span {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: linear-gradient(135deg, #6366f1, #8b5cf6);
		animation: typing 1.4s infinite ease-in-out;
	}

	.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
	.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
	.typing-indicator span:nth-child(3) { animation-delay: 0s; }

	@keyframes typing {
		0%, 80%, 100% {
			transform: scale(0.6);
			opacity: 0.3;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.input-container {
		padding: 1.5rem 2rem 2rem;
		background: linear-gradient(to top, #f8fafc 0%, rgba(248, 250, 252, 0.8) 100%);
		backdrop-filter: blur(10px);
		border-top: 1px solid rgba(226, 232, 240, 0.5);
	}

	.input-wrapper {
		display: flex;
		gap: 1rem;
		align-items: flex-end;
		background: white;
		border-radius: 24px;
		padding: 0.75rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
		border: 1px solid rgba(226, 232, 240, 0.5);
	}

	textarea {
		flex: 1;
		padding: 0.5rem 0;
		border: none;
		resize: none;
		font-family: inherit;
		font-size: 0.95rem;
		line-height: 1.5;
		max-height: 120px;
		min-height: 24px;
		background: transparent;
	}

	textarea:focus {
		outline: none;
	}

	textarea::placeholder {
		color: #9ca3af;
	}

	button {
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
		color: white;
		border: none;
		border-radius: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		min-width: 80px;
		box-shadow: 0 2px 4px -1px rgb(0 0 0 / 0.1);
	}

	button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px -2px rgb(0 0 0 / 0.2);
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	@media (max-width: 768px) {
		.chat-container {
			height: calc(100vh - 4rem);
			border-radius: 0;
			border-left: none;
			border-right: none;
			max-width: 100%;
		}

		.chat-header {
			padding: 1rem 1.5rem;
		}

		.avatar {
			width: 3.5rem;
			height: 3.5rem;
			font-size: 2rem;
			border-radius: 16px;
		}

		.header-info h1 {
			font-size: 1.25rem;
		}

		.messages-container {
			padding: 1.5rem;
			gap: 1rem;
		}

		.message {
			max-width: 85%;
		}

		.message-content {
			padding: 0.875rem 1rem;
		}

		.input-container {
			padding: 1rem 1.5rem 1.5rem;
		}

		.input-wrapper {
			gap: 0.75rem;
			padding: 0.5rem;
		}

		button {
			padding: 0.625rem 1.25rem;
			min-width: 70px;
		}
	}
</style>