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
			text: "Meow! I'm Tomcat Zuo! 🐱 But I have yet to be trained to do the cat voice. Although I've got text processing, emotional context analysis, and intelligent speech segmentation. Talk to me with your voice",
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
	let needsUserGesture = $state(true);
	let isIOS = $state(false);

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
					message: userMessage,
					chatType: 'tomcat'
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
		// Detect iOS
		isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
		
		// Check for speech synthesis support (TTS)
		if ('speechSynthesis' in window) {
			speechSynthesis = window.speechSynthesis;
			
			// iOS Safari fix: voices aren't immediately available
			if (speechSynthesis.getVoices().length === 0) {
				speechSynthesis.addEventListener('voiceschanged', () => {
					console.log('🔊 Voices loaded for iOS');
				});
			}
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
		
		// Enable audio with user gesture (required for iOS)
		if (needsUserGesture) {
			enableAudioWithUserGesture();
		}
		
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

	// Advanced phonetic and prosodic speech processing
	function createNaturalSpeechSegments(text: string) {
		// Comprehensive text normalization for natural speech
		let processedText = text
			// Normalize contractions to full forms for clearer pronunciation
			.replace(/won't/gi, 'will not')
			.replace(/can't/gi, 'cannot')
			.replace(/n't/gi, ' not')
			.replace(/'ll/gi, ' will')
			.replace(/'re/gi, ' are')
			.replace(/'ve/gi, ' have')
			.replace(/'d/gi, ' would')
			.replace(/'m/gi, ' am')
			
			// Character-specific pronunciations
			.replace(/meow/gi, 'mee ow')
			.replace(/purr/gi, 'purrrr')
			
			// Technical terms and acronyms
			.replace(/\bAPI\b/gi, 'A P I')
			.replace(/\bURL\b/gi, 'U R L')
			.replace(/\bHTML\b/gi, 'H T M L')
			.replace(/\bCSS\b/gi, 'C S S')
			.replace(/\bJS\b/gi, 'javascript')
			
			// Numbers to words for more natural speech
			.replace(/\b1\b/g, 'one')
			.replace(/\b2\b/g, 'two')
			.replace(/\b3\b/g, 'three')
			.replace(/\b4\b/g, 'four')
			.replace(/\b5\b/g, 'five')
			
			// Add natural pauses and breathing
			.replace(/\.\s+/g, '. ')
			.replace(/\?\s+/g, '? ')
			.replace(/!\s+/g, '! ')
			.replace(/,\s+/g, ', ')
			.replace(/;\s+/g, '; ')
			.replace(/:\s+/g, ': ');

		// Intelligent sentence segmentation for natural breathing
		const segments = [];
		const sentences = processedText.split(/(?<=[.!?])\s+/).filter(s => s.trim());
		
		for (let sentence of sentences) {
			// Break long sentences at natural pause points
			if (sentence.length > 80) {
				const chunks = sentence.split(/,\s+|;\s+|:\s+|\s+and\s+|\s+but\s+|\s+or\s+|\s+so\s+/);
				if (chunks.length > 1) {
					segments.push(...chunks.map(chunk => chunk.trim()).filter(chunk => chunk));
				} else {
					segments.push(sentence);
				}
			} else {
				segments.push(sentence);
			}
		}
		
		return segments;
	}

	function getEmotionalContext(text: string) {
		const emotions = {
			excitement: /\b(amazing|awesome|incredible|fantastic|wonderful|great|excited|love)\b/i,
			question: /\?/,
			emphasis: /!/,
			sadness: /\b(sorry|sad|unfortunately|disappointed|problem)\b/i,
			technical: /\b(code|programming|development|function|variable|API)\b/i,
			friendly: /\b(hello|hi|hey|thanks|thank you|please)\b/i,
			cat: /\b(meow|purr|cat|kitty|feline)\b/i
		};
		
		const context = {
			primary: 'neutral' as string,
			intensity: 0.5,
			traits: [] as string[]
		};
		
		for (const [emotion, pattern] of Object.entries(emotions)) {
			if (pattern.test(text)) {
				context.traits.push(emotion);
				if (!context.primary || context.primary === 'neutral') {
					context.primary = emotion;
				}
			}
		}
		
		// Determine intensity based on punctuation and caps
		const exclamationCount = (text.match(/!/g) || []).length;
		const capsWords = (text.match(/\b[A-Z]{2,}\b/g) || []).length;
		context.intensity = Math.min(1.0, 0.3 + (exclamationCount * 0.2) + (capsWords * 0.1));
		
		return context;
	}

	function enableAudioWithUserGesture() {
		if (!speechSynthesis) return;
		
		// Test utterance to enable audio on iOS
		const testUtterance = new SpeechSynthesisUtterance('');
		testUtterance.volume = 0;
		speechSynthesis.speak(testUtterance);
		needsUserGesture = false;
		
		console.log('🎵 Audio enabled with user gesture');
	}

	function speakResponse(text: string) {
		if (!speechSynthesis) return;
		
		// iOS requires user gesture to enable audio
		if (needsUserGesture) {
			enableAudioWithUserGesture();
		}
		
		// Stop any ongoing speech
		speechSynthesis.cancel();
		
		const segments = createNaturalSpeechSegments(text);
		const emotionalContext = getEmotionalContext(text);
		
		if (isIOS) {
			// iOS: speak segments immediately without delays to avoid autoplay restrictions
			segments.forEach((segment, index) => {
				speakSegmentWithEmotion(segment, index, segments.length, emotionalContext);
			});
		} else {
			// Desktop: use natural timing with delays
			segments.forEach((segment, index) => {
				const delay = index * 800;
				setTimeout(() => {
					speakSegmentWithEmotion(segment, index, segments.length, emotionalContext);
				}, delay);
			});
		}
	}

	function speakSegmentWithEmotion(text: string, segmentIndex: number, totalSegments: number, emotion: any) {
		const utterance = new SpeechSynthesisUtterance(text);
		
		// Find the best natural voice
		const voices = speechSynthesis?.getVoices() || [];
		let naturalVoice;
		
		if (isIOS) {
			// iOS-specific voice selection
			naturalVoice = voices.find(voice => 
				voice.lang.startsWith('en') && (
					voice.name.includes('Samantha') ||  // iOS premium voice
					voice.name.includes('Karen') ||     // iOS friendly voice
					voice.name.includes('Nicky') ||     // iOS Australian
					voice.name.includes('Moira') ||     // iOS Irish
					voice.name.includes('Tessa')        // iOS South African
				)
			) || voices.find(voice => 
				voice.lang.startsWith('en') && voice.localService
			) || voices.find(voice => voice.lang.startsWith('en'));
		} else {
			// Desktop voice selection
			naturalVoice = voices.find(voice => 
				voice.lang.startsWith('en') && (
					voice.name.includes('Samantha') ||
					voice.name.includes('Karen') ||
					voice.name.includes('Google UK English Female') ||
					voice.name.includes('Microsoft Aria') ||
					voice.name.includes('Microsoft Jenny')
				)
			) || voices.find(voice => 
				voice.lang.startsWith('en') && voice.name.includes('Female')
			) || voices.find(voice => voice.lang.startsWith('en'));
		}
		
		if (naturalVoice) {
			utterance.voice = naturalVoice;
		}
		
		// Emotional voice parameters based on context
		let baseRate = 0.92;
		let basePitch = 1.0;
		let baseVolume = 0.9;
		
		switch (emotion.primary) {
			case 'excitement':
				baseRate = 1.05;
				basePitch = 1.15;
				baseVolume = 0.95;
				break;
			case 'question':
				baseRate = 0.95;
				basePitch = 1.1;
				break;
			case 'sadness':
				baseRate = 0.85;
				basePitch = 0.9;
				baseVolume = 0.8;
				break;
			case 'technical':
				baseRate = 0.9;
				basePitch = 1.0;
				break;
			case 'cat':
				baseRate = 0.95;
				basePitch = 1.2;
				break;
			case 'friendly':
				baseRate = 0.95;
				basePitch = 1.05;
				break;
		}
		
		// Apply intensity scaling
		const intensityFactor = 0.7 + (emotion.intensity * 0.3);
		baseRate *= intensityFactor;
		basePitch = 1.0 + ((basePitch - 1.0) * intensityFactor);
		
		// Natural variation for conversation flow
		const variation = 0.05;
		utterance.rate = baseRate + (Math.random() * variation * 2 - variation);
		utterance.pitch = basePitch + (Math.random() * variation * 2 - variation);
		utterance.volume = baseVolume;
		
		// Ensure reasonable bounds
		utterance.rate = Math.max(0.7, Math.min(1.3, utterance.rate));
		utterance.pitch = Math.max(0.8, Math.min(1.4, utterance.pitch));
		
		console.log(`🎭 Tomcat [${segmentIndex + 1}/${totalSegments}] ${emotion.primary}(${emotion.intensity.toFixed(1)}): "${text.substring(0, 30)}..."`);
		
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
		
		// Find the voice that would be selected with enhanced selection
		const selectedVoice = voices.find(voice => 
			voice.lang.startsWith('en') && (
				voice.name.includes('Neural') ||
				voice.name.includes('Enhanced') ||
				voice.name.includes('Samantha') ||
				voice.name.includes('Karen') ||
				voice.name.includes('Moira') ||
				voice.name.includes('Tessa') ||
				voice.name.includes('Nicky') ||
				voice.name.includes('Siri Female') ||
				voice.name.includes('Google UK English Female') ||
				voice.name.includes('Google US English Female') ||
				voice.name.includes('Microsoft Aria') ||
				voice.name.includes('Microsoft Jenny') ||
				voice.name.includes('Microsoft Michelle') ||
				voice.name.includes('Microsoft Zira')
			)
		) || voices.find(voice => 
			voice.lang.startsWith('en') && voice.name.includes('Female')
		) || voices.find(voice => voice.lang.startsWith('en'));
		
		addMessage(`Purr! Found ${voices.length} voices on your device. I'm using "${selectedVoice?.name || 'default'}" with enhanced human-like prosody! Check the console to see all available options.`, 'tomcat');
		
		// Demo the enhanced voice with natural speech processing
		setTimeout(() => {
			speakResponse("Meow! This is my advanced natural speech system! I now process text like a human would speak it, with intelligent segmentation, emotional context awareness, and natural breathing patterns. Pretty amazing, don't you think? 😸");
		}, 1000);
	}

	// Initialize voice on component mount
	$effect(() => {
		initializeVoice();
		
		// Don't auto-speak on iOS due to autoplay restrictions
		if (!isIOS) {
			setTimeout(() => {
				if (messages.length > 0) {
					speakResponse(messages[0].text);
				}
			}, 1000);
		}
		
		if (speechSynthesis) {
			speechSynthesis.onvoiceschanged = () => {
				console.log('🔊 Voices loaded for Tomcat!');
			};
		}
	});

	function speakWelcomeMessage() {
		if (messages.length > 0) {
			speakResponse(messages[0].text);
		}
	}
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
				{#if isIOS && needsUserGesture}
					<button class="voice-test-button" onclick={speakWelcomeMessage}>
						🔊 Enable Audio & Hear Welcome
					</button>
				{:else}
					<button class="voice-test-button" onclick={listAvailableVoices}>
						🔊 Test Enhanced Voice
					</button>
				{/if}
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