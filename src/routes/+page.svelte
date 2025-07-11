<script lang="ts">
	import { Spring } from 'svelte/motion';
	import Counter from './Counter.svelte';
	import { base } from '$app/paths';

	const colors = ['#FF3E00', '#40B3FF', '#676778', '#FF6B6B', '#4ECB71'];
	let tiles = Array(25).fill(null).map((_, i) => ({
		id: i,
		color: colors[Math.floor(Math.random() * colors.length)],
		scale: 1
	}));

	const spring = new Spring({ stiffness: 0.1, damping: 0.6 });
	let showPatienceMessage = false;

	function checkAllSameColor() {
		const firstColor = tiles[0].color;
		return tiles.every(tile => tile.color === firstColor);
	}

	function handleTileClick(index: number) {
		tiles[index].scale = 0.8;
		// Change to a random new color when clicked (excluding current color)
		const currentColor = tiles[index].color;
		const availableColors = colors.filter(color => color !== currentColor);
		tiles[index].color = availableColors[Math.floor(Math.random() * availableColors.length)];
		
		// Check if all tiles are the same color
		if (checkAllSameColor()) {
			showPatienceMessage = true;
			setTimeout(() => {
				showPatienceMessage = false;
			}, 3000);
		}
		
		setTimeout(() => {
			tiles[index].scale = 1;
		}, 150);
	}

	function handleTileHover(index: number) {
		tiles[index].scale = 1.1;
	}

	function handleTileLeave(index: number) {
		tiles[index].scale = 1;
	}
</script>

<svelte:head>
	<title>Zuo's App</title>
	<meta name="description" content="Interactive grid demo with Svelte" />
</svelte:head>

<section>
	<h1>Welcome to Mango's Svelte App</h1>
	<p class="intro">
		I spend 98% of my time on backend engineering...
		<br />
		<span class="small-text">This is clearly in that 2% 😅</span>
	</p>
	
	<div class="grid">
		{#each tiles as tile, i}
			<button
				type="button"
				class="tile"
				style="background-color: {tile.color}; transform: scale({tile.scale})"
				on:click={() => handleTileClick(i)}
				on:mouseenter={() => handleTileHover(i)}
				on:mouseleave={() => handleTileLeave(i)}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						handleTileClick(i);
					}
				}}
				aria-label={`Interactive tile ${i + 1}`}
			></button>
		{/each}
	</div>

	{#if showPatienceMessage}
		<div class="patience-message">
			You have too much patience! 😅
		</div>
	{/if}

	<div class="counter-section">
		<Counter />
	</div>

	<div class="navigation-section">
		<div class="nav-links">
			<a href="{base}/sverdle" class="nav-link">Play Wordle</a>
			<a href="{base}/world-map" class="nav-link">View Map</a>
			<a href="{base}/chat" class="nav-link">Chat</a>
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		gap: 2rem;
	}

	h1 {
		color: #FF3E00;
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		text-align: center;
	}

	.intro {
		text-align: center;
		font-size: 1.2rem;
		color: #676778;
		margin-bottom: 2rem;
		max-width: 600px;
	}

	.small-text {
		font-size: 0.9rem;
		color: #999;
		font-style: italic;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
		max-width: 500px;
		width: 100%;
		margin: 0 auto;
	}

	.tile {
		aspect-ratio: 1;
		border-radius: 8px;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
	}

	.tile:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.patience-message {
		background: linear-gradient(135deg, #FF6B6B, #4ECB71);
		color: white;
		padding: 1rem 2rem;
		border-radius: 12px;
		font-size: 1.1rem;
		font-weight: 600;
		text-align: center;
		box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
		animation: fadeInBounce 0.5s ease-out;
	}

	@keyframes fadeInBounce {
		0% {
			opacity: 0;
			transform: scale(0.8) translateY(-20px);
		}
		60% {
			opacity: 1;
			transform: scale(1.05) translateY(0);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.counter-section {
		margin-top: 2rem;
		text-align: center;
	}

	h2 {
		color: #676778;
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.navigation-section {
		margin-top: 2rem;
		text-align: center;
	}

	.nav-links {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.nav-link {
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition: all 0.2s;
	}

	.nav-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}

	@media (max-width: 600px) {
		.grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (max-width: 400px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
