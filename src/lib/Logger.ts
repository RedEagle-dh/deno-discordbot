/**
 * Die `Logger`-Klasse stellt verschiedene Protokollierungs-Methoden bereit, um Nachrichten mit unterschiedlichen
 * Schweregraden (z. B. `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `success`) auszugeben. Die Protokollierung
 * ist je nach `LOG_LEVEL`-Einstellung konfigurierbar, sodass z. B. `debug`-Nachrichten nur in Entwicklungsumgebungen angezeigt werden.
 */
class Logger {
  private instance;
  private logLevel;

  /**
   * Erstellt eine Instanz der `Logger`-Klasse.
   * @param instance - Der Name der Instanz, der für diese Logger-Instanz verwendet wird. Standardmäßig "MAIN".
   */
  constructor(instance = "MAIN") {
    this.logLevel = getLogLevel(Deno.env.get("LOG_LEVEL") ?? "INFO");
    this.instance = instance;
  }

  /**
   * Konvertiert eine Nachricht in eine lesbare Zeichenfolge, insbesondere bei JSON-Objekten.
   * @param message - Die Nachricht, die protokolliert werden soll.
   * @returns Die formatierte Nachricht als Zeichenfolge.
   */
  private log(message: unknown): string | unknown {
    return isJSONObject(message) ? JSON.stringify(message, null, 2) : message;
  }

  /**
   * Gibt eine TRACE-Protokollnachricht aus, falls `LOG_LEVEL` 0 ist.
   * @param message - Die Nachricht, die im Trace-Level protokolliert werden soll.
   */
  trace(message: unknown) {
    if (this.logLevel === 0) return;
    console.log(
      `${createDateString()} 📑 \x1b[46mTRACE\x1b[0m      : [${
        this.instance
      }] ${this.log(message)}`,
    );
  }

  /**
   * Gibt eine DEBUG-Protokollnachricht aus, falls `LOG_LEVEL` <= 1 ist.
   * @param message - Die Nachricht, die im Debug-Level protokolliert werden soll.
   */
  debug(message: unknown) {
    if (this.logLevel === 1) return;
    console.log(
      `${createDateString()} 🔹 \x1b[36mDEBUG\x1b[0m      : [${
        this.instance
      }] ${this.log(message)}`,
    );
  }

  /**
   * Gibt eine INFO-Protokollnachricht aus, falls `LOG_LEVEL` <= 2 ist.
   * @param message - Die Nachricht, die im Info-Level protokolliert werden soll.
   */
  info(message: unknown) {
    if (this.logLevel === 2) return;
    console.log(
      `${createDateString()} 🆗 \x1b[34mINFO\x1b[0m       : [${
        this.instance
      }] ${this.log(message)}`,
    );
  }

  /**
   * Gibt eine WARN-Protokollnachricht aus, falls `LOG_LEVEL` <= 3 ist.
   * @param message - Die Nachricht, die im Warn-Level protokolliert werden soll.
   */
  warn(message: unknown) {
    if (this.logLevel === 3) return;
    console.log(
      `${createDateString()} ⚠️  \x1b[33mWARN\x1b[0m       : [${
        this.instance
      }] ${this.log(message)}`,
    );
  }

  /**
   * Gibt eine ERROR-Protokollnachricht aus, falls `LOG_LEVEL` <= 4 ist.
   * @param message - Die Nachricht, die im Error-Level protokolliert werden soll.
   */
  error(message: unknown) {
    if (this.logLevel === 4) return;
    console.log(
      `${createDateString()} 💢 \x1b[31mERROR\x1b[0m      : [${
        this.instance
      }] ${this.log(message)}`,
    );
  }

  /**
   * Gibt eine FATAL-Protokollnachricht aus, falls `LOG_LEVEL` <= 5 ist.
   * @param message - Die Nachricht, die im Fatal-Level protokolliert werden soll.
   */
  fatal(message: unknown) {
    if (this.logLevel === 5) return;
    console.log(
      `${createDateString()} 💀 \x1b[35mFATAL\x1b[0m      : [${
        this.instance
      }] ${this.log(message)}`,
    );
  }

  /**
   * Gibt eine SUCCESS-Protokollnachricht aus, falls `LOG_LEVEL` <= 6 ist.
   * @param message - Die Nachricht, die im Success-Level protokolliert werden soll.
   */
  success(message: unknown) {
    if (this.logLevel === 6) return;
    console.log(
      `${createDateString()} ✅ \x1b[32mSUCCESS\x1b[0m    : [${
        this.instance
      }] ${this.log(message)}`,
    );
  }
}

/**
 * Hilfsfunktion zur Erstellung eines Datumsstrings für die Protokollausgabe.
 * @param date - Ein optionales Datum, das formatiert werden soll (Standardwert ist das aktuelle Datum).
 * @returns Der formatierte Datumsstring im Format `[YYYY-MM-DD HH:MM:SS]`.
 */
function createDateString(date: Date = new Date()) {
  return `[${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${
    date.getSeconds().toString().length === 1
      ? `0${date.getSeconds()}`
      : date.getSeconds()
  }]`;
}

/**
 * Prüft, ob die übergebene Variable ein JSON-Objekt ist.
 * @param variable - Die Variable, die geprüft werden soll.
 * @returns `true`, wenn die Variable ein JSON-Objekt ist; andernfalls `false`.
 */
function isJSONObject(variable: unknown) {
  try {
    JSON.parse(variable as string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gibt den numerischen Wert des Protokollierungslevels für den übergebenen Protokollierungslevel zurück.
 * @param logLevel - Der Protokollierungslevel als Zeichenfolge.
 * @returns Der numerische Wert des Protokollierungslevels.
 */
function getLogLevel(logLevel: string): number {
  const logLevels: Record<string, number> = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
    SUCCESS: 6,
  };

  // Gib den entsprechenden Wert zurück oder den Default-Wert (INFO = 2)
  return logLevels[logLevel.toUpperCase()] ?? logLevels.INFO;
}

export { Logger };
