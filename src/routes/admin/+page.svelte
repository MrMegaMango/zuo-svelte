<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	function formatTimestamp(timestamp: string) {
		return new Date(timestamp).toLocaleString();
	}

	function formatIP(ip: string) {
		// Anonymize IP by showing only first 3 octets
		const parts = ip.split('.');
		if (parts.length === 4) {
			return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
		}
		return ip.substring(0, Math.min(ip.length, 10)) + '...';
	}

	function selectConversation(id: number) {
		goto(`/admin?conversation=${id}`);
	}

	function clearSelection() {
		goto('/admin');
	}
</script>

<svelte:head>
	<title>Chat Admin | Zuo</title>
	<meta name="description" content="Admin interface for viewing chat conversations" />
</svelte:head>

<div class="admin-container">
	<div class="admin-header">
		<h1>💬 Chat Administration</h1>
		<p>View and manage all user conversations</p>
	</div>

	<div class="admin-content">
		<div class="conversations-panel">
			<div class="panel-header">
				<h2>Conversations ({data.conversations.length})</h2>
			</div>
			
			<div class="conversations-list">
				{#each data.conversations as conversation}
					<button 
						class="conversation-item"
						class:selected={data.selectedConversation.conversation?.id === conversation.id}
						onclick={() => selectConversation(conversation.id)}
					>
						<div class="conversation-meta">
							<div class="ip">🌐 {formatIP(conversation.client_ip)}</div>
							<div class="message-count">💬 {conversation.message_count} messages</div>
						</div>
						<div class="conversation-times">
							<div class="started">Started: {formatTimestamp(conversation.created_at)}</div>
							{#if conversation.last_message_at}
								<div class="last-message">Last: {formatTimestamp(conversation.last_message_at)}</div>
							{/if}
						</div>
					</button>
				{/each}
				
				{#if data.conversations.length === 0}
					<div class="no-conversations">
						<p>No conversations yet!</p>
						<p class="hint">Chat messages will appear here once users start chatting.</p>
					</div>
				{/if}
			</div>
		</div>

		<div class="messages-panel">
			{#if data.selectedConversation.conversation}
				<div class="panel-header">
					<h2>
						Conversation with {formatIP(data.selectedConversation.conversation.client_ip)}
					</h2>
					<button class="close-btn" onclick={clearSelection}>✕</button>
				</div>
				
				<div class="conversation-details">
					<div class="detail-item">
						<strong>Started:</strong> {formatTimestamp(data.selectedConversation.conversation.created_at)}
					</div>
					<div class="detail-item">
						<strong>Last Updated:</strong> {formatTimestamp(data.selectedConversation.conversation.updated_at)}
					</div>
					<div class="detail-item">
						<strong>Total Messages:</strong> {data.selectedConversation.conversation.message_count}
					</div>
				</div>

				<div class="messages-container">
					{#each data.selectedConversation.messages as message}
						<div class="message {message.role}">
							<div class="message-header">
								<span class="role">{message.role === 'user' ? '👤 User' : '🤖 Zuo'}</span>
								<span class="timestamp">{formatTimestamp(message.timestamp)}</span>
							</div>
							<div class="message-content">
								{message.content}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="no-selection">
					<h2>Select a conversation</h2>
					<p>Choose a conversation from the left panel to view its messages.</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.admin-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
		background: #f8fafc;
		min-height: calc(100vh - 4rem);
	}

	.admin-header {
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
		color: white;
		padding: 2rem;
		border-radius: 16px;
		margin-bottom: 2rem;
		text-align: center;
	}

	.admin-header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		font-weight: 600;
	}

	.admin-header p {
		margin: 0;
		opacity: 0.9;
	}

	.admin-content {
		display: grid;
		grid-template-columns: 400px 1fr;
		gap: 2rem;
		height: calc(100vh - 12rem);
	}

	.conversations-panel,
	.messages-panel {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.panel-header {
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.panel-header h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #374151;
	}

	.close-btn {
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 6px;
		padding: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
		line-height: 1;
	}

	.conversations-list {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
	}

	.conversation-item {
		width: 100%;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 1rem;
		margin-bottom: 0.75rem;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.conversation-item:hover {
		border-color: #6366f1;
		transform: translateY(-1px);
		box-shadow: 0 4px 8px -2px rgb(0 0 0 / 0.1);
	}

	.conversation-item.selected {
		border-color: #6366f1;
		background: #f0f4ff;
	}

	.conversation-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.ip {
		color: #6366f1;
		font-size: 0.9rem;
	}

	.message-count {
		color: #059669;
		font-size: 0.85rem;
	}

	.conversation-times {
		font-size: 0.8rem;
		color: #6b7280;
	}

	.no-conversations {
		text-align: center;
		padding: 3rem 1rem;
		color: #6b7280;
	}

	.no-conversations .hint {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.conversation-details {
		padding: 1rem 1.5rem;
		background: #f9fafb;
		border-bottom: 1px solid #e5e7eb;
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.detail-item {
		font-size: 0.9rem;
		color: #374151;
	}

	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: 1rem 1.5rem;
	}

	.message {
		margin-bottom: 1.5rem;
		border-radius: 12px;
		padding: 1rem;
		border-left: 4px solid transparent;
	}

	.message.user {
		background: #eff6ff;
		border-left-color: #3b82f6;
	}

	.message.assistant {
		background: #f0f9ff;
		border-left-color: #06b6d4;
	}

	.message-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.role {
		font-weight: 600;
		font-size: 0.9rem;
	}

	.message.user .role {
		color: #1d4ed8;
	}

	.message.assistant .role {
		color: #0891b2;
	}

	.timestamp {
		font-size: 0.8rem;
		color: #6b7280;
	}

	.message-content {
		line-height: 1.5;
		color: #374151;
	}

	.no-selection {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #6b7280;
		text-align: center;
	}

	.no-selection h2 {
		margin: 0 0 0.5rem 0;
		color: #374151;
	}

	@media (max-width: 1024px) {
		.admin-content {
			grid-template-columns: 1fr;
			height: auto;
		}

		.conversations-panel {
			height: 400px;
		}

		.messages-panel {
			height: 600px;
		}
	}

	@media (max-width: 768px) {
		.admin-container {
			padding: 1rem;
		}

		.admin-header {
			padding: 1.5rem;
		}

		.admin-header h1 {
			font-size: 1.5rem;
		}

		.conversation-details {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style> 