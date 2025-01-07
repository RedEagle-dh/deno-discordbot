import {
	SlashCommandBuilder,
	EmbedBuilder,
	ChatInputCommandInteraction,
	InteractionContextType,
} from '@deps';
import { Command, CommandFunction } from '../types/types.d.ts';

/**
 * Der `getPingCommand` zeigt die Latenz zwischen dem Discord-Client und dem Discord-Server
 * sowie die Latenz zur Datenbank an. Dies hilft Administratoren oder Nutzern,
 * die aktuelle Performance und Reaktionszeiten des Bots zu prüfen.
 *
 * @returns {Command<ChatInputCommandInteraction>} Ein Kommando zur Anzeige der Latenzen.
 */

export const getPingCommand: CommandFunction =
	(): Command<ChatInputCommandInteraction> => {
		return {
			data: new SlashCommandBuilder()
				.setName('ping')
				.setDescription('Zeigt die Latenz zum Discord-Server an.')
				.setContexts([
					InteractionContextType.BotDM,
					InteractionContextType.Guild,
					InteractionContextType.PrivateChannel,
				]),
			async execute(event) {
				await event.deferReply({
					ephemeral: true,
				});
				const commandCreatedTimestamp = event.createdTimestamp;

				const discordLatency = commandCreatedTimestamp
					? Date.now() - commandCreatedTimestamp
					: -1;

				const pingEmbed = new EmbedBuilder().setDescription(
					`⌛️ Pong! Mein Ping zu Discord ist **${discordLatency}ms**.`,
				);

				await event.editReply({
					embeds: [pingEmbed],
				});
			},
		};
	};
