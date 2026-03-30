<script lang="ts">
	import { Spring } from 'svelte/motion';

	const count = new Spring(0);
	const offset = $derived(modulo(count.current, 1));

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}

	// Update background temperature based on counter value
	$effect(() => {
		const value = count.current;
		// Map counter value to temperature colors
		// Negative = cool (blue), Positive = warm (red/orange)
		// Use a range of -20 to +20 for nice color transitions
		const normalizedValue = Math.max(-20, Math.min(20, value));
		const percentage = (normalizedValue + 20) / 40; // 0 to 1
		
		// Create temperature gradient: blue (cold) to neutral to red/orange (hot)
		let r, g, b;
		if (percentage < 0.5) {
			// Cool side: blue to neutral gray
			const t = percentage * 2; // 0 to 1
			r = Math.round(150 + (226 - 150) * t); // 150 to 226
			g = Math.round(200 + (232 - 200) * t); // 200 to 232
			b = Math.round(255 + (240 - 255) * t); // 255 to 240
		} else {
			// Warm side: neutral gray to orange/red
			const t = (percentage - 0.5) * 2; // 0 to 1
			r = Math.round(226 + (255 - 226) * t); // 226 to 255
			g = Math.round(232 + (180 - 232) * t); // 232 to 180
			b = Math.round(240 + (120 - 240) * t); // 240 to 120
		}
		
		document.documentElement.style.setProperty('--bg-color-start', `rgb(${r}, ${g}, ${b})`);
		document.documentElement.style.setProperty('--bg-color-end', `rgb(${Math.max(0, r-30)}, ${Math.max(0, g-30)}, ${Math.max(0, b-30)})`);
	});
</script>

<div class="counter">
	<button onclick={() => (count.target -= 1)} aria-label="Decrease the counter by one">
		<svg aria-hidden="true" viewBox="0 0 1 1">
			<path d="M0,0.5 L1,0.5" />
		</svg>
	</button>

	<div class="counter-viewport">
		<div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
			<strong class="hidden" aria-hidden="true">{Math.floor(count.current + 1)}</strong>
			<strong>{Math.floor(count.current)}</strong>
		</div>
	</div>

	<button onclick={() => (count.target += 1)} aria-label="Increase the counter by one">
		<svg aria-hidden="true" viewBox="0 0 1 1">
			<path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
		</svg>
	</button>
</div>

<style>
	.counter {
		display: flex;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		margin: 1rem 0;
	}

	.counter button {
		width: 2em;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		background-color: transparent;
		touch-action: manipulation;
		font-size: 2rem;
	}

	.counter button:hover {
		background-color: var(--color-bg-1);
	}

	svg {
		width: 25%;
		height: 25%;
	}

	path {
		vector-effect: non-scaling-stroke;
		stroke-width: 2px;
		stroke: #444;
	}

	.counter-viewport {
		width: 8em;
		height: 4em;
		overflow: hidden;
		text-align: center;
		position: relative;
	}

	.counter-viewport strong {
		position: absolute;
		display: flex;
		width: 100%;
		height: 100%;
		font-weight: 400;
		color: var(--color-theme-1);
		font-size: 4rem;
		align-items: center;
		justify-content: center;
	}

	.counter-digits {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.hidden {
		top: -100%;
		user-select: none;
	}
</style>
