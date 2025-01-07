# Verwende die offizielle Deno-Base-Image
FROM denoland/deno:2.1.3

# Setze den Arbeitsordner
WORKDIR /app

# Nutze den nicht-root Benutzer "deno"
USER deno

# Kopiere zuerst die Abhängigkeitsdatei, um die Abhängigkeiten zu cachen
COPY deps.ts .

# Installiere und cache die Abhängigkeiten
RUN deno cache deps.ts

# Kopiere den restlichen Quellcode in das Image
COPY . .

# Kompiliere das Projekt, um eine schnellere Startzeit zu gewährleisten
RUN deno cache src/main.ts

# Definiere den Startbefehl für den Discord-Bot
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--unstable", "src/main.ts"]
