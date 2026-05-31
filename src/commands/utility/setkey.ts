import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';
import { setUserApiKey } from '../../util/redis.js';
import type { Command } from '../index.js';

export default {
	data: {
		name: 'setkey',
		description: 'Set your API key for AI responses (use /setprovider first to see which provider).',
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: 'key',
				description: 'Your API key for the selected AI provider',
				required: true,
			},
		],
	},
	async execute(interaction: ChatInputCommandInteraction) {
		const key = interaction.options.getString('key', true);

		await setUserApiKey(interaction.user.id, key);

		await interaction.reply({
			content: 'Your API key has been saved.',
			ephemeral: true,
		});
	},
} satisfies Command;
