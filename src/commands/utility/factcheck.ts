import { ApplicationCommandType, type MessageContextMenuCommandInteraction } from 'discord.js';
import { generateText } from 'ai';
import { getUserApiKey, getUserModel, getUserProvider } from '../../util/redis.js';
import { createModel, getDefaultModel, getWebSearchOptions, type ProviderId } from '../../util/providers.js';
import type { Command } from '../index.js';

export default {
	data: {
		name: 'Fact Check This',
		type: ApplicationCommandType.Message,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},
	async execute(interaction: MessageContextMenuCommandInteraction) {
		const message = interaction.targetMessage;
		const content = message.content;

		if (!content) {
			await interaction.reply({
				content: 'That message has no text content to fact check.',
				ephemeral: true,
			});
			return;
		}

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
					"You are a fact-checking assistant. Analyze the user's claim for accuracy. Point out any inaccuracies, provide context, cite sources if possible, and rate the overall accuracy. Keep answers concise and use Discord-compatible markdown without headings or tables.",
				prompt: `Fact check this claim:\n\n${content}`,
				providerOptions: getWebSearchOptions(provider),
			});

			await interaction.editReply(text.slice(0, 2000));
		} catch (error) {
			console.error(error);
			await interaction.editReply('Sorry, something went wrong while fact-checking.');
		}
	},
} satisfies Command;
