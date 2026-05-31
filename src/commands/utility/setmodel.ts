import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';
import { setUserModel } from '../../util/redis.js';
import type { Command } from '../index.js';

export default {
	data: {
		name: 'setmodel',
		description: 'Set your preferred AI model for the /ask command (use /setprovider first).',
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: 'model',
				description: 'e.g. openai/gpt-4o-mini, anthropic/claude-sonnet-4-20250514',
				required: true,
			},
		],
	},
	async execute(interaction: ChatInputCommandInteraction) {
		const model = interaction.options.getString('model', true);

		await setUserModel(interaction.user.id, model);

		await interaction.reply({
			content: `Your preferred model has been saved as \`${model}\`.`,
			ephemeral: true,
		});
	},
} satisfies Command;
