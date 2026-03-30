<svelte:head>
	<title>Zuo — Web Development & AI Automation</title>
	<meta name="description" content="I build websites and AI-powered tools for businesses." />
</svelte:head>

<section>
	<h1>I build websites and AI tools <br /> for businesses.</h1>
	<p class="subtitle">Full-stack development, custom AI integrations, and workflow automation.</p>
	<div class="links">
		<a href="mailto:amangoworks@gmail.com">amangoworks@gmail.com</a>
		<a href="https://www.linkedin.com/in/mrmightymango/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
		<a href="https://calendar.app.google/1STzyF9tVjC4xBVX6" target="_blank" rel="noopener noreferrer">Schedule a call</a>
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

	.links {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.links a {
		color: #FF3E00;
		text-decoration: none;
		font-size: 1rem;
	}

	.links a:hover {
		text-decoration: underline;
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
