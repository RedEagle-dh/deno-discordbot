# Discord Bot Template with Deno

This project is a template for creating Discord bots using [Deno](https://deno.land). It provides a modular structure, support for modern JavaScript/TypeScript features, and integrations with key tools like `discord.js`. Below, you'll find detailed instructions on how to use, extend, and deploy this bot.

---

## Getting Started

To get the bot running on your local machine, follow these steps:

1. **Clone the Repository**:

    ```bash
    git clone git@github.com:RedEagle-dh/deno-discordbot.git
    cd deno-discordbot
    ```

2. **Copy and Configure the Environment File**:

    - Locate the `.env.dist` file in the root directory.
    - Copy it and rename the copy to `.env`:
        ```bash
        cp .env.dist .env
        ```
    - Open the `.env` file and fill in your Discord bot token, application IDs, and other necessary configurations.

3. **Run the Bot**:
   Use the task defined in the `deno.json` file to start the bot:
    ```bash
    deno task dev
    ```
    This will start the bot in development mode with file watching enabled.

---

## How Deno Works

Deno is a modern JavaScript and TypeScript runtime that aims to provide secure, simple, and developer-friendly features:

1. **Secure by Default**: Deno requires explicit permissions to access files, the network, or the environment.
2. **Built-in TypeScript**: Deno supports TypeScript out of the box without additional configuration.
3. **Single Executable**: Deno does not rely on a `package.json` or a central registry like npm. Dependencies are imported directly via URLs.
4. **Standardized Modules**: Deno provides a set of standard modules to avoid fragmentation.

---

## Commands Overview

### Run the Bot

To run the bot locally in development mode with hot-reloading:

```bash
$ deno task dev
```

To run the bot in production mode:

```bash
$ deno task start
```

### Compile to Standalone Executable

To compile the bot into a standalone executable for distribution:

```bash
$ deno compile --env-file=.env.dev --allow-env --output=dir src/main.ts
```

-   **`--output`**: Specifies the name and location of the compiled binary.

### Reload Cache

To clear the cache and reload dependencies:

```bash
$ deno task reload
```

---

## Using npm Packages: `discord.js`

While Deno has its own module ecosystem, you can use npm packages like `discord.js` by importing them with `deno.land/x/npm`:

```typescript
import { Client } from 'npm:discord.js@latest';

const client = new Client({ intents: ['Guilds'] });
client.once('ready', () => console.log('Bot is ready!'));
client.login(Deno.env.get('DISCORD_TOKEN'));
```

### Why Use `deps.ts`?

A `deps.ts` file centralizes your dependencies, making updates and imports more manageable:

```typescript
// deps.ts
export { Client } from 'npm:discord.js@latest';
export { config } from 'https://deno.land/x/dotenv/mod.ts';
```

In your main files, import dependencies from `deps.ts`:

```typescript
import { Client, config } from './deps.ts';
```

---

## Dockerfile

To containerize your bot, use the following `Dockerfile`:

```dockerfile
# Use the official Deno base image
FROM denoland/deno:2.1.3

# Set the working directory
WORKDIR /app

# Use the non-root user "deno"
USER deno

# Copy the dependency file to cache dependencies
COPY deps.ts .

# Install and cache dependencies
RUN deno cache deps.ts

# Copy the rest of the source code
COPY . .

# Pre-cache the main script for faster startup
RUN deno cache src/main.ts

# Define the startup command for the bot
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--unstable", "src/main.ts"]
```

---

## Prettier Configuration

This project uses `Prettier` for consistent code formatting. Below is the recommended `.prettierrc` configuration:

```json
{
	"arrowParens": "always",
	"semi": true,
	"singleQuote": true,
	"tabWidth": 4,
	"trailingComma": "all",
	"bracketSameLine": true,
	"useTabs": true
}
```

---

## `import_map.json`

Use an `import_map.json` file to alias and simplify imports:

```json
{
	"imports": {
		"@deps/": "./deps.ts",
		"@src/": "./src/"
	}
}
```

Run the bot using the `--import-map` flag:

```bash
$ deno run --import-map=import_map.json --allow-env src/main.ts
```

---

## License

This project is licensed under the MIT License. You are free to use, modify, distribute, and build upon this code for any purpose.
