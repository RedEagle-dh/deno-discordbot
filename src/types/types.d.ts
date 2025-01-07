import {
	ChatInputCommandInteraction,
	Client,
	CommandInteraction,
	ContextMenuCommandBuilder,
	ContextMenuCommandInteraction,
	Events,
	Guild,
	GuildBan,
	GuildMember,
	Interaction,
	Message,
	MessageReaction,
	Role,
	SlashCommandBuilder,
	User,
} from '@deps';
import { Logger } from '../lib/Logger.ts';
import { WichtelEvent } from '../lib/WichtelEvent.ts';

/**
 * Globale Payload für den Bot, die sicherheitsrelevante Variablen, den Client,
 * Logger und Event-Scheduler enthält.
 */
export type GlobalPayload = {
	secret: {
		/** Discord-Bot-Token für Authentifizierung */
		DISCORD_BOT_TOKEN: string;
		/** ID der Discord-Anwendung */
		APPLICATION_ID: string;
		/** Node.js Umgebung (z.B., 'development', 'production') */
		NODE_ENV: string;
	};
	log: Logger;
	client: Client<boolean>;
	wichtelEvents: WichtelEvent[];
};

/**
 * Payload für die Initialisierung von Befehlen, die aktive und alle verfügbaren Events enthält.
 */
export type CommandInitPayload = {
	activeEvents: {
		name: string;
		value: string;
	}[];
	allEvents: {
		name: string;
		value: string;
	}[];
};

/**
 * Typdefinition für eine Funktion zur Erstellung von Befehlen.
 */
export type CommandFunction = (
	injectedData?: CommandInitPayload,
) => Command<ChatInputCommandInteraction>;

/**
 * Repräsentiert einen Slash- oder Kontextmenübefehl und seine Ausführungslogik.
 *
 * @template T - Die Interaktion, die der Befehl akzeptiert (z.B., ChatInputCommandInteraction).
 */
export type Command<
	T extends
		| CommandInteraction
		| ChatInputCommandInteraction
		| ContextMenuCommandInteraction,
> = {
	/** Die Struktur des Slash- oder Kontextmenübefehls */
	data: SlashCommandBuilder | ContextMenuCommandBuilder;
	/** Die Logik zur Ausführung des Befehls */
	execute: (event: T, payload: GlobalPayload) => Promise<void>;
};

/**
 * Repräsentiert ein Eventmodul, das für Discord.js-Ereignisse verwendet wird.
 *
 * @template T - Ein Array von Argumenten für das Event.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EventModule<T extends any[]> {
	/** Name des Events (z.B., 'messageCreate') */
	name: Events;
	/** Gibt an, ob das Event nur einmal ausgeführt wird */
	once: boolean;
	/** Gibt an, ob das Event aktuell gesperrt ist */
	locked?: boolean;
	/** Die Funktion, die das Event ausführt */
	execute: (...args: [...T, GlobalPayload]) => Promise<void> | void;
}

/** Argumente für das Ready-Ereignis */
export type ReadyEventArgs = [client: Client<boolean>];

/** Argumente für das MessageReaction-Ereignis */
export type MessageReactionEventArgs = [reaction: MessageReaction, user: User];

/** Argumente für das Message-Ereignis */
export type MessageEventArgs = [message: Message];

/** Argumente für das Interaction-Ereignis */
export type InteractionEventArgs = [event: Interaction];

/** Argumente für das Error-Ereignis */
export type ErrorEventArgs = [error: Error];

/** Argumente für das GuildCreate-Ereignis */
export type GuildCreateEventArgs = [guild: Guild];

/** Argumente für das GuildDelete-Ereignis */
export type GuildDeleteEventArgs = [guild: Guild];

/** Argumente für das GuildBanAdd-Ereignis */
export type GuildBanAddEventArgs = [ban: GuildBan];

/** Argumente für das GuildBanRemove-Ereignis */
export type GuildBanRemoveEventArgs = [ban: GuildBan];

/** Argumente für das GuildMemberAdd-Ereignis */
export type GuildMemberAddEventArgs = [member: GuildMember];

/** Argumente für das GuildMemberRemove-Ereignis */
export type GuildMemberRemoveEventArgs = [member: GuildMember];

/** Argumente für das GuildMemberUpdate-Ereignis */
export type GuildMemberUpdateEventArgs = [
	oldMember: GuildMember,
	newMember: GuildMember,
];

/** Argumente für das GuildRoleCreate-Ereignis */
export type GuildRoleCreateEventArgs = [role: Role];

/** Argumente für das GuildRoleDelete-Ereignis */
export type GuildRoleDeleteEventArgs = [role: Role];

/** Argumente für das GuildRoleUpdate-Ereignis */
export type GuildRoleUpdateEventArgs = [oldRole: Role, newRole: Role];

/**
 * Repräsentiert eine Spaltenkonfiguration in einer Tabelle oder einem Array.
 */
export type Column = {
	name: string;
	id: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	content?: (item: any) => string;
	fullContent?: (item: DataObject) => string;
};

/** Repräsentiert ein Datenobjekt, in dem Schlüssel beliebige Werte enthalten können */
export type DataObject = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
};

/**
 * Payload zur Konfiguration von Text- und Einbettungsdaten für Discord-Nachrichten.
 */
export type Payload = {
	text: {
		embedTitle: string | null;
		embedDescription: string | null;
	};
};
