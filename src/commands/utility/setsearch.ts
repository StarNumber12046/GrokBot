import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';
import { setUserSearch, type SearchMode } from '../../util/redis.js';
import type { Command } from '../index.js';

export default {
	data: {
		name: 'setsearch',
		description: 'Set your preferred web search provider for AI responses.',
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: 'search',
				description: 'The web search provider to use',
				required: true,
				choices: [
					{ name: 'Off', value: 'off' },
					{ name: 'OpenRouter Web Search', value: 'openrouter' },
					{ name: 'Exa', value: 'exa' },
				],
			},
		],
	},
	async execute(interaction: ChatInputCommandInteraction) {
		const search = interaction.options.getString('search', true) as SearchMode;

		await setUserSearch(interaction.user.id, search);

		const notes: Record<SearchMode, string> = {
			off: 'Web search has been disabled.',
			openrouter: 'Web search set to OpenRouter (works when your provider is OpenRouter).',
			exa: 'Web search set to Exa. Make sure the bot has an EXA_API_KEY configured.',
		};

		await interaction.reply({
			content: notes[search],
			ephemeral: true,
		});
	},
} satisfies Command;
