// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	
	// Web Speech API types
	interface Window {
		SpeechRecognition: typeof SpeechRecognition;
		webkitSpeechRecognition: typeof SpeechRecognition;
	}
	
	declare class SpeechRecognition extends EventTarget {
		continuous: boolean;
		interimResults: boolean;
		lang: string;
		onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
		onend: ((this: SpeechRecognition, ev: Event) => any) | null;
		onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
		onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
		start(): void;
		stop(): void;
	}
	
	interface SpeechRecognitionEvent extends Event {
		resultIndex: number;
		results: SpeechRecognitionResultList;
	}
	
	interface SpeechRecognitionErrorEvent extends Event {
		error: string;
	}
	
	interface SpeechRecognitionResultList {
		length: number;
		item(index: number): SpeechRecognitionResult;
		[index: number]: SpeechRecognitionResult;
	}
	
	interface SpeechRecognitionResult {
		length: number;
		item(index: number): SpeechRecognitionAlternative;
		[index: number]: SpeechRecognitionAlternative;
		isFinal: boolean;
	}
	
	interface SpeechRecognitionAlternative {
		transcript: string;
		confidence: number;
	}
}

declare module '$env/static/private' {
	export const GROQ_API_KEY: string;
}

export {};
