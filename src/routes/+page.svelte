<svelte:head>
	<title>Zuo — Web Development & AI Automation</title>
	<meta name="description" content="I build websites and AI-powered tools for businesses." />
</svelte:head>

<section>
	<h1>I build websites and AI tools <br /> for businesses.</h1>
	<p class="subtitle">Full-stack development, custom AI integrations, and workflow automation.</p>
	<div class="cta-group">
		<a href="mailto:amangoworks@gmail.com" class="cta">amangoworks@gmail.com</a>
		<a href="https://linkedin.com/in/mango-zuo" class="cta secondary" target="_blank" rel="noopener noreferrer">LinkedIn</a>
		<a href="https://calendly.com/" class="cta secondary" target="_blank" rel="noopener noreferrer">Schedule a call</a>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 6rem 2rem;
		text-align: center;
		min-height: 60vh;
	}

	h1 {
		font-size: 2.5rem;
		color: var(--color-text, #222);
		line-height: 1.3;
		margin: 0 0 1rem;
	}

	.subtitle {
		font-size: 1.15rem;
		color: #676778;
		margin: 0 0 2.5rem;
		max-width: 480px;
	}

	.cta-group {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.cta {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: #FF3E00;
		color: white;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 600;
		font-size: 1rem;
		transition: background 0.2s;
	}

	.cta:hover {
		background: #e03500;
	}

	.cta.secondary {
		background: #4a5568;
	}

	.cta.secondary:hover {
		background: #2d3748;
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 1.75rem;
		}

		section {
			padding: 4rem 1.5rem;
		}
	}
</style>
