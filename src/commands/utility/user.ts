import type { Command } from '../index.js';

export default {
	data: {
		name: 'user',
		description: 'Provides information about the user.',
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},
	async execute(interaction) {
		await interaction.reply(`This command was run by ${interaction.user.username}.`);
	},
} satisfies Command;
