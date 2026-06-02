import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';
import { generateText } from 'ai';
import { getUserApiKey, getUserModel, getUserProvider } from '../../util/redis.js';
import { createModel, getDefaultModel, getWebSearchOptions, type ProviderId } from '../../util/providers.js';
import type { Command } from '../index.js';

export default {
	data: {
		name: 'ask',
		description: 'Ask GrokBot anything powered by AI!',
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: 'prompt',
				description: 'The prompt to send to the AI',
				required: true,
			},
		],
	},
	async execute(interaction: ChatInputCommandInteraction) {
		const prompt = interaction.options.getString('prompt', true);

		const userApiKey = await getUserApiKey(interaction.user.id);

		if (!userApiKey) {
			await interaction.reply({
				content: 'You need to set your API key first using `/setkey`.',
				ephemeral: true,
			});
			return;
		}

		await interaction.deferReply();

		try {
			const [userProvider, userModel] = await Promise.all([
				getUserProvider(interaction.user.id),
				getUserModel(interaction.user.id),
			]);
			const provider: ProviderId = userProvider ?? 'openrouter';
			const modelName = userModel ?? getDefaultModel(provider);

			const { text } = await generateText({
				model: createModel(provider, userApiKey, modelName),
				system:
					'You are a helpful assistant. Always keep answers concise. Use Discord-compatible markdown. Do NOT use headings (#, ##, etc.) or tables for any reason. Do not ask follow up questions. NEVER use tables and NEVER ask follow up questions.',
				prompt,
				providerOptions: getWebSearchOptions(provider),
			});
			console.log(text);
			await interaction.editReply(text.slice(0, 2000));
		} catch (error) {
			console.error(error);
			await interaction.editReply('Sorry, something went wrong while asking the AI.');
		}
	},
} satisfies Command;
