import { Client, Events, Guild } from '@deps';
import {
	EventModule,
	GlobalPayload,
	ReadyEventArgs,
} from '../../types/types.d.ts';

export const clientReady: EventModule<ReadyEventArgs> = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client, payload: GlobalPayload) {
		const nodeEnv = payload.secret.NODE_ENV;
		try {
			client.guilds.cache.forEach(async (guild) => {
				await guild.members.fetch();
			});

			payload.log.info(
				`[${nodeEnv}] Logged in as ${client.user?.tag} on ${
					client.guilds.cache.size
				} Servers: ${client.guilds.cache
					.map((g: Guild) => g.name)
					.join(', ')}`,
			);
			client.user?.setPresence({ activities: undefined });

			payload.log.info(`Activity of ${client.user?.tag}`);
		} catch (e) {
			console.error(e);
		}
	},
};
