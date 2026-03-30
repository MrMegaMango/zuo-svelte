<svelte:head>
	<title>Zuo — Web Development & AI Automation</title>
	<meta name="description" content="I build websites and AI-powered tools for businesses." />
</svelte:head>

<section>
	<h1>I build websites and AI tools <br /> for businesses.</h1>
	<p class="subtitle">Full-stack development, custom AI integrations, and workflow automation.</p>
	<a href="mailto:amangoworks@gmail.com" class="cta">Get in touch</a>
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

	.cta {
		display: inline-block;
		padding: 0.85rem 2rem;
		background: #FF3E00;
		color: white;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 600;
		font-size: 1.05rem;
		transition: background 0.2s;
	}

	.cta:hover {
		background: #e03500;
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
