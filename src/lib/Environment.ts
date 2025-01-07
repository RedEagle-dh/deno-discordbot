import { Logger } from '@/lib/Logger.ts';

const log = new Logger('ENVIRONMENT');
log.debug('Loading environment variables...');
// Pfad zur .env-Datei, basierend auf dem aktuellen Arbeitsverzeichnis
const EnvFilePath = `${Deno.cwd()}/.env.${Deno.env.get('NODE_ENV') ?? 'dev'}`;

log.trace(`Loading environment variables from ${EnvFilePath}...`);

/**
 * Ruft eine Umgebungsvariable ab und gibt einen Fallback-Wert zurück, falls die Variable nicht gesetzt ist.
 * Wenn weder die Variable noch ein Fallback vorhanden sind, wird ein Fehler ausgelöst.
 *
 * @param name - Der Name der Umgebungsvariable, die abgerufen werden soll.
 * @param fallback - Ein optionaler Fallback-Wert, der zurückgegeben wird, wenn die Variable nicht gesetzt ist.
 * @returns Der Wert der Umgebungsvariable oder der Fallback-Wert, falls angegeben.
 * @throws Wenn die Umgebungsvariable nicht gesetzt ist und kein Fallback-Wert angegeben wurde.
 */
export function getEnvVar(name: string, fallback?: string): string {
	const value = Deno.env.get(name);
	if (value === undefined) {
		log.trace(
			`Environment variable ${name} is not set, trying fallback...`,
		);
		if (fallback === undefined) {
			log.error(`Fallback of environment variable ${name} is not set.`);
			throw new Error(`Environment variable ${name} is not set.`);
		}
		return fallback;
	}
	const maskedValue =
		value.length > 4
			? value.slice(0, Math.ceil(value.length / 4)) +
			  '*'.repeat(value.length - Math.ceil(value.length / 4))
			: value;
	log.trace(`Environment variable ${name} is set to ${maskedValue}.`);
	return value;
}

export type Keys = {
	/**
	 * Das Token für die Authentifizierung des Discord-Bots. Erforderlich für die Bot-Verbindung zu Discord.
	 */
	DISCORD_BOT_TOKEN: string;

	/**
	 * Die Anwendungs-ID des Bots, die die Bot-Instanz eindeutig identifiziert.
	 */
	APPLICATION_ID: string;

	/**
	 * Die Node.js-Umgebung (z.B. 'development', 'production'), standardmäßig 'development', falls nicht angegeben.
	 */
	NODE_ENV: string;

	/**
	 * Das Log Level (z.B. 'DEBUG', 'TRACE'), standardmäßig 'INFO', falls nicht angegeben.
	 */
	LOG_LEVEL: string;
};

/**
 * Eine Sammlung von sicherheitsrelevanten Umgebungsvariablen des Projekts, die verwendet werden,
 * um den Bot zu authentifizieren und die Umgebungskonfiguration zu steuern.
 */
export const Keys: Keys = {
	/**
	 * Das Token für die Authentifizierung des Discord-Bots. Erforderlich für die Bot-Verbindung zu Discord.
	 */
	DISCORD_BOT_TOKEN: getEnvVar('DISCORD_BOT_TOKEN'),

	/**
	 * Die Anwendungs-ID des Bots, die die Bot-Instanz eindeutig identifiziert.
	 */
	APPLICATION_ID: getEnvVar('APPLICATION_ID'),

	/**
	 * Die Node.js-Umgebung (z.B. 'development', 'production'), standardmäßig 'development', falls nicht angegeben.
	 */
	NODE_ENV: getEnvVar('NODE_ENV'),

	/**
	 * Das Log Level (z.B. 'DEBUG', 'TRACE'), standardmäßig 'INFO', falls nicht angegeben.
	 */
	LOG_LEVEL: getEnvVar('LOG_LEVEL', 'INFO'),
} as const;

export default Keys;
