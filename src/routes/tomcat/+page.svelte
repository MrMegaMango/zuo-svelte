<script lang="ts">
	import { tick } from 'svelte';

	interface Message {
		id: string;
		text: string;
		sender: 'user' | 'tomcat';
		timestamp: Date;
	}

	let messages = $state<Message[]>([
		{
			id: '1',
			text: "Meow! I'm Tomcat Zuo! 🐱 Talk to me with your voice - I only speak in meows and purrs... just kidding! Ask me anything!",
			sender: 'tomcat',
			timestamp: new Date()
		}
	]);

	let isListening = $state(false);
	let isTyping = $state(false);
	let isVoiceSupported = $state(false);
	let recognition: any = null;
	let speechSynthesis: SpeechSynthesis | null = null;
	let messagesContainer: HTMLDivElement;
	let currentTranscript = $state('');

	function addMessage(text: string, sender: 'user' | 'tomcat') {
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
		await tick();
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	async function getTomcatResponse(userMessage: string): Promise<string> {
		try {
			const response = await fetch('/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					message: `${userMessage} (Note: You are Tomcat Zuo, a playful cat version of Zuo. Be slightly more playful and occasionally add cat references, but still be helpful and knowledgeable!)` 
				})
			});

			if (!response.ok) {
				throw new Error('API request failed');
			}

			const data = await response.json();
			return data.response || getTomcatFallback();
		} catch (error) {
			console.error('Failed to get Tomcat response:', error);
			return getTomcatFallback();
		}
	}

	function getTomcatFallback(): string {
		const fallbacks = [
			"Meow! My cat brain is having technical difficulties, but I'd love to chat about coding and purr-gramming! 🐱",
			"*stretches paws* I'm having some connectivity issues, but let's talk about my favorite development tools!",
			"Purr... my whiskers are telling me there's a network problem, but I'm excited to chat about technology!",
			"*tail swish* Something went wrong with my responses, but I'm here to discuss my projects and maybe some catnip!",
			"Meow! I'm having trouble connecting right now, but I'd love to talk about SvelteKit and other tech that makes me purr!"
		];
		return fallbacks[Math.floor(Math.random() * fallbacks.length)];
	}

	function initializeVoice() {
		// Check for speech synthesis support (TTS)
		if ('speechSynthesis' in window) {
			speechSynthesis = window.speechSynthesis;
		}
		
		// Check for speech recognition support (STT)
		const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
		if (SpeechRecognition) {
			recognition = new SpeechRecognition();
			recognition.continuous = false;
			recognition.interimResults = true;
			recognition.lang = 'en-US';
			
			recognition.onstart = () => {
				isListening = true;
			};
			
			recognition.onend = () => {
				isListening = false;
				currentTranscript = '';
			};
			
			recognition.onresult = (event: any) => {
				let finalTranscript = '';
				let interimTranscript = '';
				
				for (let i = event.resultIndex; i < event.results.length; i++) {
					const transcript = event.results[i][0].transcript;
					if (event.results[i].isFinal) {
						finalTranscript += transcript;
					} else {
						interimTranscript += transcript;
					}
				}
				
				// Show interim results
				if (interimTranscript) {
					currentTranscript = interimTranscript;
				}
				
				// Send final transcript
				if (finalTranscript.trim()) {
					currentTranscript = '';
					sendVoiceMessage(finalTranscript.trim());
				}
			};
			
			recognition.onerror = (event: any) => {
				console.error('Speech recognition error:', event.error);
				isListening = false;
				currentTranscript = '';
				
				if (event.error === 'not-allowed') {
					addMessage('Meow! Please allow microphone access so we can chat! 🎤', 'tomcat');
				} else if (event.error === 'no-speech') {
					addMessage('*perks ears* I didn\'t hear anything. Try speaking closer to your device! 👂', 'tomcat');
				}
			};
		}
		
		isVoiceSupported = !!(speechSynthesis && recognition);
	}

	function startListening() {
		if (!recognition || isListening) return;
		
		try {
			recognition.start();
		} catch (error) {
			console.error('Failed to start speech recognition:', error);
		}
	}

	function stopListening() {
		if (recognition && isListening) {
			recognition.stop();
		}
	}

	async function sendVoiceMessage(text: string) {
		addMessage(text, 'user');
		
		isTyping = true;
		await scrollToBottom();
		
		// Simulate typing delay
		await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
		
		isTyping = false;
		const response = await getTomcatResponse(text);
		addMessage(response, 'tomcat');
		
		// Always speak response in voice-only mode
		speakResponse(response);
	}

	function speakResponse(text: string) {
		if (!speechSynthesis) return;
		
		// Stop any ongoing speech
		speechSynthesis.cancel();
		
		const utterance = new SpeechSynthesisUtterance(text);
		
		// Natural but character-like voice settings (like Sesame Street style)
		utterance.rate = 0.85; // Slightly slower for clarity and character
		utterance.pitch = 1.25; // Moderately higher for friendly, approachable character
		utterance.volume = 0.9; // Clear volume
		
		// Find the best natural-sounding voice
		const voices = speechSynthesis?.getVoices() || [];
		
		// Prefer high-quality, natural voices that sound friendly
		const naturalVoice = voices.find(voice => 
			voice.lang.startsWith('en') && (
				voice.name.includes('Samantha') ||  // macOS/iOS high quality
				voice.name.includes('Karen') ||     // macOS friendly voice
				voice.name.includes('Moira') ||     // macOS character voice
				voice.name.includes('Tessa') ||     // macOS natural voice
				voice.name.includes('Nicky') ||     // iOS natural voice
				voice.name.includes('Siri Female') ||
				voice.name.includes('Google UK English Female') ||
				voice.name.includes('Microsoft Zira') ||
				voice.name.includes('Microsoft Hazel')
			)
		) || voices.find(voice => 
			voice.lang.startsWith('en') && voice.name.includes('Female')
		) || voices.find(voice => voice.lang.startsWith('en'));
		
		if (naturalVoice) {
			utterance.voice = naturalVoice;
			console.log(`🎭 Tomcat using voice: ${naturalVoice.name}`);
		}
		
		// Add subtle character touches for specific words
		const processedText = text
			.replace(/meow/gi, 'mee-ow') // Make meow sound more natural
			.replace(/purr/gi, 'purrrr'); // Extend purr sound
		
		utterance.text = processedText;
		
		speechSynthesis?.speak(utterance);
	}

	// Debug function to see available voices
	function listAvailableVoices() {
		if (!speechSynthesis) return;
		const voices = speechSynthesis.getVoices();
		console.log('🎤 Available voices on your device:');
		voices.forEach((voice, index) => {
			console.log(`${index}: ${voice.name} (${voice.lang}) - ${voice.voiceURI}`);
		});
		
		// Find the voice that would be selected
		const selectedVoice = voices.find(voice => 
			voice.lang.startsWith('en') && (
				voice.name.includes('Samantha') ||
				voice.name.includes('Karen') ||
				voice.name.includes('Moira') ||
				voice.name.includes('Tessa') ||
				voice.name.includes('Nicky') ||
				voice.name.includes('Siri Female') ||
				voice.name.includes('Google UK English Female') ||
				voice.name.includes('Microsoft Zira') ||
				voice.name.includes('Microsoft Hazel')
			)
		) || voices.find(voice => 
			voice.lang.startsWith('en') && voice.name.includes('Female')
		) || voices.find(voice => voice.lang.startsWith('en'));
		
		addMessage(`Purr! Found ${voices.length} voices on your device. I'm using "${selectedVoice?.name || 'default'}" for my natural Tomcat voice! Check the console to see all available options.`, 'tomcat');
		
		// Demo the voice
		setTimeout(() => {
			speakResponse("Meow! This is how I sound with my natural voice. Much better than those crazy robot variations, don't you think?");
		}, 1000);
	}

	// Initialize voice on component mount
	$effect(() => {
		initializeVoice();
		
		// Auto-speak the welcome message with delay
		setTimeout(() => {
			if (messages.length > 0) {
				speakResponse(messages[0].text);
			}
		}, 1000);
		
		if (speechSynthesis) {
			speechSynthesis.onvoiceschanged = () => {
				// Voices loaded - now we can access them
				console.log('🔊 Voices loaded for Tomcat!');
			};
		}
	});
</script>

<svelte:head>
	<title>Tomcat Zuo | Voice Chat</title>
	<meta name="description" content="Voice-only chat with Tomcat Zuo - a playful AI companion" />
</svelte:head>

<div class="tomcat-container">
	<div class="tomcat-header">
		<a href="/chat" class="back-button" title="Back to text chat">
			⬅️
		</a>
		<div class="tomcat-avatar">🐱</div>
		<div class="header-info">
			<h1>Tomcat Zuo</h1>
			<p>Voice-Only Chat</p>
		</div>
		<div class="status-indicator {isListening ? 'listening' : ''}">
			{isListening ? '🎤' : '😸'}
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
			<div class="message tomcat">
				<div class="message-content">
					<div class="typing-indicator">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>
		{/if}

		{#if currentTranscript}
			<div class="transcript-preview">
				<div class="transcript-text">🎙️ {currentTranscript}</div>
			</div>
		{/if}
	</div>

	<div class="voice-container">
		{#if isVoiceSupported}
			<div class="voice-info">
				<div class="quirky-indicator">
					🎭 Natural Tomcat Voice 🐱
				</div>
				<button class="voice-test-button" onclick={listAvailableVoices}>
					🔊 Check Voice
				</button>
			</div>
			
			<div class="main-voice-control">
				<button 
					class="big-listen-button {isListening ? 'listening' : ''}"
					onclick={isListening ? stopListening : startListening}
					disabled={isTyping}
				>
					<div class="button-content">
						<div class="emoji">{isListening ? '⏹️' : '🎙️'}</div>
						<div class="text">
							{isListening ? 'Stop Listening' : 'Tap to Talk'}
						</div>
						{#if isListening}
							<div class="pulse-ring"></div>
						{/if}
					</div>
				</button>
			</div>
		{:else}
			<div class="no-voice-support">
				<div class="error-message">
					<span class="emoji">😿</span>
					<p>Voice chat not supported on this device</p>
					<a href="/chat">Use text chat instead</a>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.tomcat-container {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 8rem);
		max-width: 900px;
		margin: 0 auto;
		background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
		border-radius: 24px;
		overflow: hidden;
		box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
		border: 1px solid rgb(229 231 235);
	}

	.tomcat-header {
		display: flex;
		align-items: center;
		padding: 1.5rem 2rem;
		background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
		color: white;
		gap: 1rem;
		position: relative;
		overflow: hidden;
	}

	.tomcat-header::before {
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

	.back-button {
		font-size: 1.5rem;
		text-decoration: none;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border-radius: 12px;
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid rgba(255, 255, 255, 0.2);
		position: relative;
		z-index: 10;
		transition: all 0.3s ease;
	}

	.back-button:hover {
		transform: translateX(-3px);
		background: rgba(255, 255, 255, 0.25);
	}

	.tomcat-avatar {
		font-size: 3rem;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border-radius: 20px;
		width: 4.5rem;
		height: 4.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid rgba(255, 255, 255, 0.2);
		position: relative;
		z-index: 10;
		animation: catBounce 3s ease-in-out infinite;
	}

	@keyframes catBounce {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		25% { transform: translateY(-5px) rotate(2deg); }
		75% { transform: translateY(-2px) rotate(-1deg); }
	}

	.header-info {
		flex: 1;
		position: relative;
		z-index: 10;
	}

	.header-info h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.header-info p {
		margin: 0;
		font-size: 0.9rem;
		opacity: 0.9;
	}

	.status-indicator {
		font-size: 2rem;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		width: 3.5rem;
		height: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid rgba(255, 255, 255, 0.2);
		position: relative;
		z-index: 10;
		transition: all 0.3s ease;
	}

	.status-indicator.listening {
		animation: pulse 2s infinite;
		background: rgba(239, 68, 68, 0.2);
	}

	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		background: linear-gradient(to bottom, #fffbeb 0%, #fef3c7 100%);
		scrollbar-width: thin;
		scrollbar-color: #d97706 transparent;
	}

	.messages-container::-webkit-scrollbar {
		width: 6px;
	}

	.messages-container::-webkit-scrollbar-track {
		background: transparent;
	}

	.messages-container::-webkit-scrollbar-thumb {
		background: #d97706;
		border-radius: 3px;
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

	.message.tomcat {
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
		background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
		color: white;
		border-bottom-right-radius: 8px;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	.message.tomcat .message-content {
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(217, 119, 6, 0.3);
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
		background: linear-gradient(135deg, #f59e0b, #d97706);
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

	.transcript-preview {
		padding: 1rem;
		background: rgba(251, 191, 36, 0.2);
		border: 2px dashed #f59e0b;
		border-radius: 16px;
		margin: 1rem 0;
		animation: fadeIn 0.3s ease-out;
	}

	.transcript-text {
		font-style: italic;
		color: #92400e;
		font-size: 0.9rem;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.voice-container {
		padding: 2rem;
		background: linear-gradient(to top, #fbbf24 0%, rgba(251, 191, 36, 0.8) 100%);
		backdrop-filter: blur(10px);
		border-top: 1px solid rgba(217, 119, 6, 0.3);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
	}

	.voice-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.quirky-indicator {
		background: rgba(255, 255, 255, 0.9);
		padding: 0.75rem 1.5rem;
		border-radius: 20px;
		border: 2px solid #d97706;
		color: #92400e;
		font-weight: 600;
		font-size: 0.9rem;
		animation: quirkBounce 3s ease-in-out infinite;
	}

	@keyframes quirkBounce {
		0%, 100% { transform: scale(1) rotate(0deg); }
		25% { transform: scale(1.05) rotate(1deg); }
		75% { transform: scale(0.98) rotate(-1deg); }
	}

	.voice-test-button {
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.3);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 16px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
	}

	.voice-test-button:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0,0,0,0.2);
	}

	.main-voice-control {
		position: relative;
	}

	.big-listen-button {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		border: 4px solid #ffffff;
		background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
		cursor: pointer;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
		box-shadow: 0 8px 16px rgba(0,0,0,0.2);
	}

	.big-listen-button:hover:not(:disabled) {
		transform: scale(1.05);
		box-shadow: 0 12px 24px rgba(0,0,0,0.3);
	}

	.big-listen-button.listening {
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		border-color: #ffffff;
		animation: listenPulse 2s infinite;
	}

	@keyframes listenPulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.1); }
	}

	.big-listen-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.button-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: white;
		font-weight: 600;
		position: relative;
		z-index: 2;
	}

	.button-content .emoji {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}

	.button-content .text {
		font-size: 0.9rem;
		text-align: center;
		line-height: 1.2;
	}

	.pulse-ring {
		position: absolute;
		top: -10px;
		left: -10px;
		right: -10px;
		bottom: -10px;
		border: 3px solid rgba(255, 255, 255, 0.6);
		border-radius: 50%;
		animation: pulseRing 2s infinite;
	}

	@keyframes pulseRing {
		0% {
			transform: scale(0.8);
			opacity: 1;
		}
		100% {
			transform: scale(1.4);
			opacity: 0;
		}
	}

	.no-voice-support {
		text-align: center;
		padding: 2rem;
	}

	.error-message {
		background: rgba(255, 255, 255, 0.9);
		padding: 2rem;
		border-radius: 16px;
		border: 2px solid rgba(217, 119, 6, 0.3);
	}

	.error-message .emoji {
		font-size: 3rem;
		display: block;
		margin-bottom: 1rem;
	}

	.error-message p {
		margin: 0 0 1rem 0;
		color: #92400e;
		font-weight: 600;
	}

	.error-message a {
		color: #d97706;
		text-decoration: underline;
		font-weight: 600;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	@media (max-width: 768px) {
		.tomcat-container {
			height: calc(100vh - 4rem);
			border-radius: 0;
			border-left: none;
			border-right: none;
			max-width: 100%;
		}

		.tomcat-header {
			padding: 1rem 1.5rem;
		}

		.tomcat-avatar {
			width: 4rem;
			height: 4rem;
			font-size: 2.5rem;
		}

		.header-info h1 {
			font-size: 1.25rem;
		}

		.header-info p {
			font-size: 0.8rem;
		}

		.status-indicator {
			width: 3rem;
			height: 3rem;
			font-size: 1.5rem;
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

		.voice-container {
			padding: 1.5rem;
			gap: 1rem;
		}

		.voice-info {
			gap: 0.75rem;
		}

		.quirky-indicator {
			font-size: 0.8rem;
			padding: 0.5rem 1rem;
		}

		.voice-test-button {
			font-size: 0.8rem;
			padding: 0.5rem 1rem;
		}

		.big-listen-button {
			width: 100px;
			height: 100px;
		}

		.button-content .emoji {
			font-size: 2rem;
		}

		.button-content .text {
			font-size: 0.8rem;
		}
	}
</style> 