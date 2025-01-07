import { Column, DataObject, Payload } from '@/types/types.d.ts';
import {
	ButtonInteraction,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	CommandInteraction,
	EmbedField,
} from '@deps';

/**
 * Erzeugt eine Seitenansicht für Nachrichten mit mehreren Datenobjekten und einer definierten Anzahl von Spalten.
 * Unterstützt Paginierung über "Next" und "Previous" Buttons.
 *
 * @param payload - Die eingebetteten Titel- und Beschreibungsinformationen.
 * @param dataObjects - Eine Liste von Datenobjekten, die in der Nachricht angezeigt werden.
 * @param columns - Die Spalten, die jede Seite anzeigen soll.
 * @param itemsPerPage - Die Anzahl der Objekte pro Seite. Standardwert ist 5.
 * @param buttonSuffix - Ein optionaler Suffix zur Unterscheidung der Buttons für unterschiedliche Events.
 * @param event - Die Interaktion, die den aktuellen Paginierungsschritt auslöst (optional).
 * @returns Ein Objekt mit dem eingebetteten Nachrichteninhalt und den Komponenten (Buttons) für die Paginierung.
 */
export const getMultiPageMessagePayload = (
	payload: Payload,
	dataObjects: DataObject[],
	columns: Column[],
	itemsPerPage: number = 5,
	buttonSuffix?: string,
	event?: ButtonInteraction | CommandInteraction,
) => {
	const totalPages = Math.ceil(dataObjects.length / itemsPerPage);

	let currentPage = 0;

	if (event && event.isButton()) {
		const footer = event.message.embeds[0].footer?.text.split(' ');
		if (footer) {
			currentPage = parseInt(footer[1]) - 1;
		}

		if (event.customId.includes('next') && currentPage < totalPages - 1) {
			currentPage++;
		} else if (event.customId.includes('previous') && currentPage > 0) {
			currentPage--;
		}
	}

	const paginatedData = Array.from({ length: totalPages }, (_, index) =>
		dataObjects.slice(index * itemsPerPage, (index + 1) * itemsPerPage),
	);

	const pagesRow = new ActionRowBuilder<ButtonBuilder>();
	if (totalPages > 1) {
		pagesRow.addComponents(
			new ButtonBuilder()
				.setCustomId(`previous_${buttonSuffix}`)
				.setLabel('Previous')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(currentPage === 0),
			new ButtonBuilder()
				.setCustomId(`next_${buttonSuffix}`)
				.setLabel('Next')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(currentPage === totalPages - 1),
		);
	}

	const embed = new EmbedBuilder()
		.setTitle(payload.text.embedTitle)
		.setDescription(payload.text.embedDescription)
		.setFooter({
			text: `Seite ${currentPage + 1} von ${
				totalPages === 0 ? 1 : totalPages
			}`,
		});

	const currentData = paginatedData[currentPage];

	if (currentData && currentData.length > 0) {
		const fields: EmbedField[] = columns.map((column) => ({
			name: `${column.name}`,
			value:
				currentData
					.map((item) =>
						column.fullContent
							? column.fullContent(item)
							: column.content
							? column.content(item[column.id])
							: item[column.id],
					)
					.join('\n') || 'N/A', // Ensure no empty value
			inline: true,
		}));

		embed.addFields(fields);
	}

	return {
		embeds: [embed],
		components: totalPages > 1 ? [pagesRow] : [],
	};
};

/**
 * Erzeugt eine Seitenansicht für Nachrichten, die spezifische Felder mit Werten der Datenobjekte anzeigt.
 * Die Felder enthalten Benutzer und Zahlungsinformationen und unterstützen Paginierung.
 *
 * @param payload - Die eingebetteten Titel- und Beschreibungsinformationen.
 * @param dataObjects - Eine Liste von Datenobjekten, die in der Nachricht angezeigt werden.
 * @param itemsPerPage - Die Anzahl der Objekte pro Seite. Standardwert ist 25.
 * @param buttonSuffix - Ein optionaler Suffix zur Unterscheidung der Buttons für unterschiedliche Events.
 * @param event - Die Interaktion, die den aktuellen Paginierungsschritt auslöst (optional).
 * @returns Ein Objekt mit dem eingebetteten Nachrichteninhalt und den Komponenten (Buttons) für die Paginierung.
 */
export const getMultiPageFieldsMessagePayload = (
	payload: Payload,
	dataObjects: DataObject[],
	itemsPerPage: number = 25,
	buttonSuffix?: string,
	event?: ButtonInteraction | CommandInteraction,
) => {
	const totalPages = Math.ceil(dataObjects.length / itemsPerPage);

	let currentPage = 0;

	if (event && event.isButton()) {
		const footer = event.message.embeds[0].footer?.text.split(' ');
		if (footer) {
			currentPage = parseInt(footer[1]) - 1;
		}

		if (event.customId.includes('next') && currentPage < totalPages - 1) {
			currentPage++;
		} else if (event.customId.includes('previous') && currentPage > 0) {
			currentPage--;
		}
	}

	const paginatedData = Array.from({ length: totalPages }, (_, index) =>
		dataObjects.slice(index * itemsPerPage, (index + 1) * itemsPerPage),
	);

	const pagesRow = new ActionRowBuilder<ButtonBuilder>();
	if (totalPages > 1) {
		pagesRow.addComponents(
			new ButtonBuilder()
				.setCustomId(`previous_${buttonSuffix}`)
				.setLabel('Previous')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(currentPage === 0),
			new ButtonBuilder()
				.setCustomId(`next_${buttonSuffix}`)
				.setLabel('Next')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(currentPage === totalPages - 1),
		);
	}

	const embed = new EmbedBuilder()
		.setTitle(payload.text.embedTitle)
		.setDescription(payload.text.embedDescription)
		.setFooter({
			text: `Seite ${currentPage + 1} von ${
				totalPages === 0 ? 1 : totalPages
			}`,
		});

	const currentData = paginatedData[currentPage];
	if (currentData && currentData.length > 0) {
		const fields: EmbedField[] = currentData.map((item: DataObject) => ({
			name:
				item.kill_amount != null && item.bonus_amount != null
					? `$ ${
							item.kill_amount +
							item.bonus_amount +
							item.travel_amount
					  }`
					: 'N/A',
			value: `<@${item.user.discord_id}>${
				item.penalty_amount > 0
					? `\n\`\`\`bash\n$${item.penalty_amount} Strafe\`\`\``
					: ''
			}`,
			inline: true,
		}));

		embed.addFields(fields);
	}

	return {
		embeds: [embed],
		components: totalPages > 1 ? [pagesRow] : [],
	};
};
