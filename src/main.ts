import {
	ChatInputCommandInteraction,
	Client,
	Collection,
	ContextMenuCommandBuilder,
	GatewayIntentBits,
	Partials,
	SlashCommandBuilder,
	REST,
	Routes,
	OAuth2Guild,
} from '@deps';

import { Command, EventModule, GlobalPayload } from '@/types/types.d.ts';
import * as events from '@/events/index.ts';
import * as commandModules from '@/commands/index.ts';
import Keys from '@/lib/Environment.ts';
import { Logger } from '@/lib/Logger.ts';
import process from 'node:process';

declare module 'npm:discord.js' {
	interface Client {
		commands: Collection<string, Command<ChatInputCommandInteraction>>;
	}
}

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMembers,
	],
	partials: [
		Partials.User,
		Partials.Reaction,
		Partials.Message,
		Partials.GuildMember,
		Partials.Channel,
	],
});

/**
 * Registriert alle Events, die für den Bot definiert sind.
 * @param payload - Das globale Payload-Objekt, das Instanzen wie Logger und Client enthält.
 */
export function registerEvents(payload: GlobalPayload) {
	payload.log.info('Started loading events...');
	const eventModules: EventModule<any>[] = Object.values(events).map(
		(m) => m as unknown as EventModule<any>,
	);
	eventModules.forEach((eventModule) => {
		for (const [key, module] of Object.entries(eventModule)) {
			if (
				module &&
				typeof module.name === 'string' &&
				typeof module.once === 'boolean' &&
				typeof module.execute === 'function'
			) {
				const eventName = module.name;
				const handler = (...args: object[]) =>
					module.execute(...args, payload);
				payload.log.info(`Loading event [${eventName}]`);
				if (module.once) {
					client.once(eventName, handler);
				} else {
					client.on(eventName, handler);
				}
			} else {
				console.error(`Invalid event module for key ${key}:`, module);
			}
		}
	});
	payload.log.success(`${eventModules.length} events loaded!`);
}

/**
 * Authentifiziert den Bot bei Discord und stellt die Verbindung her.
 * @param payload - Das globale Payload-Objekt.
 */
export function login(payload: GlobalPayload) {
	client.login(Keys.DISCORD_BOT_TOKEN).catch((err) => {
		payload.log.error('Login failed: ' + err);
	});
}

const log = new Logger();

/**
 * Stellt Slash- und Kontext-Menü-Befehle für den Bot in Discord bereit.
 * @param payload - Das globale Payload-Objekt.
 * @param allEvents - Eine Liste von Events, die als Auswahl in den Befehlen verfügbar sind.
 * @param guildId - Parameter zur Einschränkung der Befehle auf eine spezifische Gilde.
 * @returns Ein Array von Command-Objekten.
 */
export async function deployCommands(
	payload: GlobalPayload,
	guild: OAuth2Guild,
): Promise<Command<ChatInputCommandInteraction>[]> {
	const rest = new REST().setToken(`${payload.secret.DISCORD_BOT_TOKEN}`);
	const returnObject: Command<ChatInputCommandInteraction>[] = [];

	const commands: (SlashCommandBuilder | ContextMenuCommandBuilder)[] = [];

	for (const getCommand of Object.values(commandModules)) {
		const module = getCommand(); // Factory-Funktion aufrufen
		payload.log.trace(module.data);
		returnObject.push(module);
		commands.push(module.data);
	}

	payload.log.warn(
		`Refreshing ${commands.length} application (/) commands...`,
	);
	await rest
		.put(
			Routes.applicationGuildCommands(
				payload.secret.APPLICATION_ID,
				guild.id,
			),
			{
				body: commands.map((command) => command.toJSON()),
			},
		)
		.then(() => {
			payload.log.info(
				`${commands.length} application (/) commands loaded successfully for guild ${guild.id}.`,
			);
		})
		.catch((error) => {
			payload.log.error(`Failed to parse token in main.ts`);
			console.log(error);
			process.exit();
		});

	return returnObject;
}

/**
 * Registriert alle Befehle für den Bot und fügt sie dem Discord-Client hinzu.
 * @param payload - Das globale Payload-Objekt.
 * @param commands - Ein Array von Command-Objekten.
 * @param allEvents - Eine Liste von Events, die in den Befehlen verfügbar sind.
 */
export function registerCommands(payload: GlobalPayload) {
	payload.client.commands = new Collection<
		string,
		Command<ChatInputCommandInteraction>
	>();

	Object.values(commandModules).forEach((command) => {
		const cmd = command();
		payload.client.commands.set(cmd.data.name, cmd);
	});
}

/**
 * Listener für nicht abgefangene Ausnahmen, um sie zu protokollieren.
 * @param e - Der Fehler, der nicht abgefangen wurde.
 */
process.on('uncaughtException', (error: any) => {
	console.error(error);
	log.error(`Uncaught Exception: ${error}`);
});

/**
 * Hauptfunktion, die den Bot initialisiert, Daten lädt und notwendige Instanzen erstellt.
 */
export const startBot = async () => {
	try {
		const payload: GlobalPayload = {
			client: client,
			log: log,
			secret: Keys,
			wichtelEvents: [],
		};

		registerCommands(payload);
		registerEvents(payload);
		login(payload);

		const guilds = await client.guilds.fetch();

		guilds.forEach(async (guild) => {
			deployCommands(payload, guild);
			await client.guilds.cache.get(guild.id)?.members.fetch();
		});

		return payload;
	} catch (error) {
		log.error(error);
		return null;
	}
};

startBot();
