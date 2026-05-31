import type { Command } from './index.js';

export default {
	data: {
		name: 'ping',
		description: 'Ping!',
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
} satisfies Command;
