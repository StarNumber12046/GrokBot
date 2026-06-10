import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';
import { setUserEndpoint } from '../../util/redis.js';
import type { Command } from '../index.js';

export default {
	data: {
		name: 'setendpoint',
		description: 'Set your custom API endpoint URL (only needed for Custom OpenAI-Compatible provider).',
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: 'endpoint',
				description: 'e.g. https://api.my-custom-server.com/v1',
				required: true,
			},
		],
	},
	async execute(interaction: ChatInputCommandInteraction) {
		const endpoint = interaction.options.getString('endpoint', true);

		await setUserEndpoint(interaction.user.id, endpoint);

		await interaction.reply({
			content: `Your custom API endpoint has been saved as \`${endpoint}\`. Make sure your provider is set to "Custom OpenAI-Compatible" with \`/setprovider\`.`,
			ephemeral: true,
		});
	},
} satisfies Command;
