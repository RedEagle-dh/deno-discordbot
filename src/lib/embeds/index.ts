import { client } from '@/main.ts';
import { User, Colors, EmbedBuilder } from '@deps';

/**
 * Basic Embeds
 *
 */

/**
 * Erstellt eine Fehler-Einbettung mit einer roten Markierung und einer benutzerdefinierten Fehlermeldung.
 * @param error - Die Fehlermeldung, die in der Einbettung angezeigt wird.
 * @returns Eine Einbettung mit einem Fehlerinhalt.
 */
export const getErrorEmbed = (error: string) => {
	return getBaseEmbed()
		.setTitle('❌ Fehler')
		.setDescription(error)
		.setColor('Red');
};

/**
 * Erstellt eine Erfolgs-Einbettung mit einer grünen Markierung und einer benutzerdefinierten Nachricht.
 * @param message - Die Erfolgsnachricht, die in der Einbettung angezeigt wird.
 * @returns Eine Einbettung mit einer Erfolgsnachricht.
 */
export const getSuccessEmbed = (message: string) => {
	return getBaseEmbed()
		.setTitle('✅ Erfolg')
		.setDescription(message)
		.setColor('Green');
};

export const getInfoEmbed = (message: string) => {
	return getBaseEmbed()
		.setTitle(':information_source: Info')
		.setDescription(message)
		.setColor('Blue');
};

/**
 * Erstellt eine Basis-Einbettung mit Author und Fußzeile für den GrandRP Manager.
 * @returns Eine Standard-Einbettung mit Standard-Author und Footer.
 */
export const getBaseEmbed = () => {
	return new EmbedBuilder()
		.setAuthor({
			name: `Secret Santa`,
			iconURL: `${
				client.user?.displayAvatarURL() ||
				'https://example.com/default-avatar.png'
			}`,
		})
		.setFooter({
			text: 'Secret Santa - Bei Fragen an redeagle. wenden.',
		})
		.setTimestamp();
};

export const partnerEmbed = (user: User) => {
	return getBaseEmbed()
		.setTitle('🎅🏻 Secret Santa Partner')
		.setDescription(
			`Dein Secret Santa Partner ist: **${user}**\n\nKaufe ihm/ihr ein Geschenk im Wert von 20€ und bringe es am 30.12.2024 mit zu Dave!`,
		)
		.setColor(Colors.DarkRed);
};
