import { InteractionType, Events, Interaction } from '@deps';
import {
	EventModule,
	GlobalPayload,
	InteractionEventArgs,
} from '../../types/types.d.ts';
import { getErrorEmbed } from '../../lib/embeds/index.ts';

export const interactionCreate: EventModule<InteractionEventArgs> = {
	name: Events.InteractionCreate,
	once: false,
	locked: false,
	async execute(event: Interaction, payload: GlobalPayload) {
		payload.log.debug('Interaction event fired');

		switch (event.type) {
			case InteractionType.ApplicationCommand: {
				try {
					const { commandName } = event;
					const command = event.client.commands.get(commandName);

					if (!command || !event.isChatInputCommand()) return;

					payload.log.info(
						`${event.user.tag} used /${event.commandName}`,
					);

					await command.execute(event, payload);
				} catch (error) {
					if (event.deferred || event.replied) {
						await event.followUp({
							embeds: [
								getErrorEmbed(
									`Ein Fehler ist aufgetreten. Bitte erstelle einen Screenshot und leite ihn an **redeagle.** weiter.\n\`\`\`${error}\`\`\``,
								),
							],
							ephemeral: true,
						});
					} else {
						await event.reply({
							embeds: [
								getErrorEmbed(
									`Ein Fehler ist aufgetreten. Bitte erstelle einen Screenshot und leite ihn an **redeagle.** weiter. \n\`\`\`${error}\`\`\``,
								),
							],
						});
					}
					payload.log.error(error);
				}
				break;
			}
			case InteractionType.MessageComponent: {
				if (event.isButton()) {
					// Handle button interactions
				}
				break;
			}
			default: {
				payload.log.error(
					'Not handled interaction type. This interaction is from type: ' +
						event.type +
						'.',
				);
			}
		}
	},
};
