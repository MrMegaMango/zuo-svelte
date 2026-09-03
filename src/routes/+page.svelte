<script lang="ts">
	const products = [
		{
			name: 'High Match',
			label: 'Job search · Local-first',
			description:
				'A local-first dashboard that finds and ranks public ATS jobs with explainable matching and review-gated application handoffs.',
			stack: ['SvelteKit', 'TypeScript', 'SQLite'],
			liveUrl: 'https://high-match-job-assistant.vercel.app',
			githubUrl: 'https://github.com/MrMegaMango/job-assistant',
			status: 'New',
			isNew: true
		},
		{
			name: 'ChipDue',
			label: 'Personal finance · Private',
			description:
				'A private command center for credit-card due dates, signup bonuses, investments, and optional account sync.',
			stack: ['SvelteKit', 'TypeScript', 'Plaid'],
			liveUrl: 'https://chipdue.vercel.app',
			githubUrl: 'https://github.com/MrMegaMango/chipdue',
			status: 'New',
			isNew: true
		},
		{
			name: 'Dialora',
			label: 'Voice AI · On-device',
			description:
				'A local-first macOS phone conversation agent powered by MLX Whisper, Qwen, and Kokoro.',
			stack: ['Python', 'FastAPI', 'On-device AI'],
			liveUrl: 'https://dialora.vercel.app',
			githubUrl: 'https://github.com/MrMegaMango/dialora',
			status: 'New',
			isNew: true
		},
		{
			name: 'LyricDesk',
			label: 'Desktop music · macOS',
			description:
				'A native lyrics overlay with line-synced lyrics for YouTube Music, Spotify, and Apple Music.',
			stack: ['Swift', 'macOS', 'Music'],
			liveUrl: null,
			githubUrl: 'https://github.com/MrMegaMango/lyric-desk',
			status: 'Open source',
			isNew: false
		},
		{
			name: 'Yumoo',
			label: 'Food diary · Generative art',
			description:
				'A mobile-first food diary that turns meals into an illustrated calendar, one entry at a time.',
			stack: ['Next.js', 'OpenAI', 'PWA'],
			liveUrl: 'https://yumoo.vercel.app',
			githubUrl: 'https://github.com/MrMegaMango/yumoo',
			status: 'Live',
			isNew: false
		},
		{
			name: 'CarDeals',
			label: 'Car shopping · Price transparency',
			description:
				'Crowdsourced car pricing that makes MSRP, real sale prices, and out-the-door costs easier to compare.',
			stack: ['Next.js', 'Neon', 'PostgreSQL'],
			liveUrl: 'https://car-price-reports.vercel.app/',
			githubUrl: 'https://github.com/MrMegaMango/CarPrices',
			status: 'Live',
			isNew: false
		}
	] as const;
</script>

<svelte:head>
	<title>Zuo — Products, Web Development & AI Automation</title>
	<meta
		name="description"
		content="Products and AI-powered tools built by Zuo, from private local-first assistants to consumer web apps."
	/>
</svelte:head>

<section class="hero">
	<p class="eyebrow">Independent product engineer</p>
	<h1>I build websites and AI tools <br /> for businesses.</h1>
	<p class="subtitle">Full-stack development, custom AI integrations, and workflow automation.</p>
	<div class="links" aria-label="Contact links">
		<a href="mailto:amangoworks@gmail.com">amangoworks@gmail.com</a>
		<a href="https://github.com/MrMegaMango" target="_blank" rel="noopener noreferrer">GitHub</a>
		<a href="https://www.linkedin.com/in/mrmightymango/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
		<a href="https://calendar.app.google/1STzyF9tVjC4xBVX6" target="_blank" rel="noopener noreferrer">Schedule a call</a>
	</div>
</section>

<section class="products" id="products" aria-labelledby="products-heading">
	<div class="section-heading">
		<div>
			<p class="eyebrow">Shipped work</p>
			<h2 id="products-heading">Products</h2>
		</div>
		<p>Useful software built around privacy, clarity, and a little delight.</p>
	</div>

	<div class="product-grid">
		{#each products as product, index}
			<article class="product-card">
				<div class="card-topline">
					<span class="product-number">{String(index + 1).padStart(2, '0')}</span>
					<span class:new-badge={product.isNew} class="status">{product.status}</span>
				</div>
				<p class="product-label">{product.label}</p>
				<h3>{product.name}</h3>
				<p class="product-description">{product.description}</p>
				<ul class="stack" aria-label={`${product.name} technologies`}>
					{#each product.stack as technology}
						<li>{technology}</li>
					{/each}
				</ul>
				<div class="card-links">
					{#if product.liveUrl}
						<a
							class="primary-link"
							href={product.liveUrl}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Open ${product.name}`}
						>
							Open product <span aria-hidden="true">↗</span>
						</a>
						<a
							href={product.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`${product.name} on GitHub`}
						>
							GitHub <span aria-hidden="true">↗</span>
						</a>
					{:else}
						<a
							class="primary-link"
							href={product.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`View ${product.name} on GitHub`}
						>
							View on GitHub <span aria-hidden="true">↗</span>
						</a>
					{/if}
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	.hero {
		display: flex;
		min-height: 52vh;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 6rem 2rem 4rem;
		text-align: center;
	}

	.eyebrow {
		margin: 0 0 0.8rem;
		color: #525261;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	h1 {
		margin: 0 0 1rem;
		color: var(--color-text, #222);
		font-size: clamp(2.15rem, 6vw, 3.7rem);
		font-weight: 500;
		letter-spacing: -0.045em;
		line-height: 1.08;
	}

	.subtitle {
		max-width: 520px;
		margin: 0 0 2.5rem;
		color: #5d5d6d;
		font-size: 1.15rem;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem 2rem;
	}

	.links a,
	.card-links a {
		color: #a52a08;
		font-weight: 600;
		text-decoration: none;
	}

	.links a:hover,
	.card-links a:hover {
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}

	.products {
		padding: 2rem 1rem 7rem;
		scroll-margin-top: 1.5rem;
	}

	.section-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		max-width: 60rem;
		margin: 0 auto 1.75rem;
		gap: 2rem;
	}

	.section-heading .eyebrow {
		margin-bottom: 0.35rem;
	}

	.section-heading h2 {
		margin: 0;
		color: #22222d;
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 500;
		letter-spacing: -0.04em;
	}

	.section-heading > p {
		max-width: 360px;
		margin: 0 0 0.35rem;
		color: #525261;
	}

	.product-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 270px), 1fr));
		max-width: 60rem;
		margin: 0 auto;
		gap: 1rem;
	}

	.product-card {
		display: flex;
		min-height: 285px;
		flex-direction: column;
		padding: 1.4rem;
		border: 1px solid rgba(255, 255, 255, 0.72);
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.62);
		box-shadow: 0 18px 44px rgba(55, 67, 83, 0.1);
		backdrop-filter: blur(12px);
		transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
	}

	.product-card:hover {
		transform: translateY(-3px);
		background: rgba(255, 255, 255, 0.76);
		box-shadow: 0 22px 50px rgba(55, 67, 83, 0.16);
	}

	.card-topline {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.8rem;
	}

	.product-number {
		color: #525261;
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}

	.status {
		padding: 0.25rem 0.55rem;
		border: 1px solid rgba(64, 117, 166, 0.2);
		border-radius: 999px;
		background: rgba(64, 117, 166, 0.08);
		color: #315f88;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.status.new-badge {
		border-color: rgba(255, 62, 0, 0.24);
		background: rgba(255, 62, 0, 0.09);
		color: #ba3206;
	}

	.product-label {
		margin: 0 0 0.45rem;
		color: #525261;
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}

	.product-card h3 {
		margin: 0 0 0.75rem;
		color: #22222d;
		font-size: 1.55rem;
		font-weight: 600;
		letter-spacing: -0.03em;
	}

	.product-description {
		margin: 0 0 1.25rem;
		color: #525261;
		font-size: 0.95rem;
	}

	.stack {
		display: flex;
		flex-wrap: wrap;
		margin: auto 0 1.35rem;
		padding: 0;
		gap: 0.45rem;
		list-style: none;
	}

	.stack li {
		padding: 0.28rem 0.55rem;
		border-radius: 0.4rem;
		background: rgba(49, 63, 79, 0.07);
		color: #525261;
		font-family: var(--font-mono);
		font-size: 0.68rem;
	}

	.card-links {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		font-size: 0.88rem;
	}

	.card-links .primary-link {
		padding: 0.55rem 0.75rem;
		border-radius: 0.5rem;
		background: #d93500;
		color: white;
	}

	.card-links .primary-link:hover {
		background: #b42c00;
		text-decoration: none;
	}

	@media (max-width: 640px) {
		.hero {
			min-height: 48vh;
			padding: 6rem 1rem 3rem;
		}

		h1 br {
			display: none;
		}

		.subtitle {
			font-size: 1rem;
		}

		.section-heading {
			align-items: start;
			flex-direction: column;
			gap: 0.5rem;
		}

		.products {
			padding-bottom: 4rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.product-card {
			transition: none;
		}
	}
</style>
