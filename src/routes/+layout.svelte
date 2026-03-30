<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	onMount(async () => {
		if (browser) {
			const { injectAnalytics } = await import('@vercel/analytics/sveltekit');
			injectAnalytics();
			
			// Optional: Add Speed Insights for Core Web Vitals
			const { injectSpeedInsights } = await import('@vercel/speed-insights/sveltekit');
			injectSpeedInsights();
		}
	});

	function goToHome() {
		window.location.href = 'https://zuo.vercel.app';
	}
</script>

<div class="app">
	<Header />
	<button class="back-button" onclick={goToHome}>← Back to Zuo's landing page</button>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>
			built with Svelte 5 & curiosity
		</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	.back-button {
		position: fixed;
		top: 4rem;
		left: 1rem;
		padding: 0.5rem 1rem;
		background-color: #4a5568;
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background-color 0.2s;
		z-index: 1000;
		animation: quirkBounce 3s ease-in-out infinite;
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 12px rgba(74, 85, 104, 0.3);
	}

	.back-button:hover {
		background-color: #2d3748;
	}

	@keyframes quirkBounce {
		0%, 100% { transform: scale(1) rotate(0deg); }
		25% { transform: scale(1.05) rotate(1deg); }
		75% { transform: scale(0.98) rotate(-1deg); }
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
