<script lang="ts">
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

	function addMessage(text: string, sender: 'user' | 'zuo') {
		const newMessage: Message = {
			id: Date.now().toString(),
			text,
			sender,
			timestamp: new Date()
		};
		messages.push(newMessage);
	}

	function getZuoResponse(userMessage: string): string {
		const lowerMessage = userMessage.toLowerCase();
		
		if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
			return "Hi! Great to meet you! I'm excited to chat about my work in software development, my travels, or anything else you're curious about.";
		}
		
		if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('code')) {
			return "I love working on interactive web experiences! This portfolio site showcases some of my recent work with SvelteKit 5, including the 3D world map and the Wordle clone. I'm passionate about creating smooth, engaging user interfaces.";
		}
		
		if (lowerMessage.includes('travel') || lowerMessage.includes('world') || lowerMessage.includes('map')) {
			return "The world map is one of my favorite features! It shows places I've been with a 3D globe you can interact with. Travel has really shaped my perspective on development - seeing how people use technology differently around the world.";
		}
		
		if (lowerMessage.includes('svelte') || lowerMessage.includes('framework') || lowerMessage.includes('tech')) {
			return "I'm really excited about Svelte 5! The new runes system with $state() and $derived() makes reactivity so much cleaner. This whole site is built with SvelteKit 5, and I love how intuitive it makes component development.";
		}
		
		if (lowerMessage.includes('game') || lowerMessage.includes('wordle')) {
			return "The Wordle clone was fun to build! I implemented it with server-side game logic to handle sessions properly. It was a great exercise in state management and user interaction design.";
		}
		
		if (lowerMessage.includes('about') || lowerMessage.includes('yourself') || lowerMessage.includes('who')) {
			return "I'm a software developer who loves creating interactive web experiences. I enjoy traveling, building things that people actually want to use, and exploring new technologies. Always happy to chat about development, design, or life in general!";
		}
		
		return "That's interesting! I'd love to hear more about what you're thinking. Feel free to ask me about my projects, development experience, or anything else that comes to mind.";
	}

	async function sendMessage() {
		if (!currentMessage.trim()) return;
		
		const userText = currentMessage.trim();
		currentMessage = '';
		
		addMessage(userText, 'user');
		
		isTyping = true;
		
		// Simulate typing delay
		await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
		
		isTyping = false;
		const response = getZuoResponse(userText);
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
	<title>Talk to Me | Zuo</title>
	<meta name="description" content="Chat with virtual Zuo about projects, experiences, and development" />
</svelte:head>

<div class="chat-container">
	<div class="chat-header">
		<div class="avatar">🧑‍💻</div>
		<div class="header-info">
			<h1>Chat with Zuo</h1>
			<p>Ask me about my projects, development experience, or anything else!</p>
		</div>
	</div>

	<div class="messages-container">
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
		max-width: 800px;
		margin: 0 auto;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		overflow: hidden;
		background: white;
	}

	.chat-header {
		display: flex;
		align-items: center;
		padding: 1.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		gap: 1rem;
	}

	.avatar {
		font-size: 3rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.header-info h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.header-info p {
		margin: 0.25rem 0 0 0;
		opacity: 0.9;
		font-size: 0.9rem;
	}

	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background: #f8fafc;
	}

	.message {
		display: flex;
		max-width: 80%;
	}

	.message.user {
		align-self: flex-end;
	}

	.message.zuo {
		align-self: flex-start;
	}

	.message-content {
		padding: 0.75rem 1rem;
		border-radius: 18px;
		word-wrap: break-word;
	}

	.message.user .message-content {
		background: #667eea;
		color: white;
		border-bottom-right-radius: 6px;
	}

	.message.zuo .message-content {
		background: white;
		border: 1px solid #e2e8f0;
		border-bottom-left-radius: 6px;
	}

	.message-text {
		margin-bottom: 0.25rem;
		line-height: 1.4;
	}

	.message-time {
		font-size: 0.75rem;
		opacity: 0.7;
	}

	.typing-indicator {
		display: flex;
		gap: 0.25rem;
		align-items: center;
	}

	.typing-indicator span {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #94a3b8;
		animation: typing 1.4s infinite ease-in-out;
	}

	.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
	.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

	@keyframes typing {
		0%, 80%, 100% {
			transform: scale(0);
			opacity: 0.5;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.input-container {
		padding: 1rem;
		background: white;
		border-top: 1px solid #e2e8f0;
	}

	.input-wrapper {
		display: flex;
		gap: 0.75rem;
		align-items: flex-end;
	}

	textarea {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 20px;
		resize: none;
		font-family: inherit;
		font-size: 0.9rem;
		line-height: 1.4;
		max-height: 120px;
		min-height: 44px;
	}

	textarea:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	button {
		padding: 0.75rem 1.5rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 20px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		min-width: 80px;
	}

	button:hover:not(:disabled) {
		background: #5a67d8;
		transform: translateY(-1px);
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	@media (max-width: 768px) {
		.chat-container {
			height: calc(100vh - 6rem);
			border-radius: 0;
			border-left: none;
			border-right: none;
		}

		.message {
			max-width: 90%;
		}

		.chat-header {
			padding: 1rem;
		}

		.avatar {
			width: 3rem;
			height: 3rem;
			font-size: 2rem;
		}
	}
</style>