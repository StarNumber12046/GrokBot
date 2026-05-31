import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';
import { setUserProvider } from '../../util/redis.js';
import { PROVIDERS } from '../../util/providers.js';
import type { Command } from '../index.js';

export default {
	data: {
		name: 'setprovider',
		description: 'Set your preferred AI provider for the /ask command.',
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: 'provider',
				description: 'The AI provider to use',
				required: true,
				choices: PROVIDERS.map((p) => ({ name: p.label, value: p.id })),
			},
		],
	},
	async execute(interaction: ChatInputCommandInteraction) {
		const provider = interaction.options.getString('provider', true) as Parameters<typeof setUserProvider>[1];

		await setUserProvider(interaction.user.id, provider);

		await interaction.reply({
			content: `Your preferred AI provider has been set to \`${provider}\`. Don't forget to set your API key with \`/setkey\` if you haven't already.`,
			ephemeral: true,
		});
	},
} satisfies Command;
