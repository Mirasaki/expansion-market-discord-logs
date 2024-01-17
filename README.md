# expansion-market-discord-logs

A small application that forwards [DayZ Expansion Market](https://steamcommunity.com/sharedfiles/filedetails/?id=2572328470) to your Discord server through webhooks, allowing your administrators to use Discord's powerful search function to find exactly what they need without directly accessing the server.

## Prerequisites

- [NodeJS](https://nodejs.org/en/download/ "Node official website") (if you're running as a plain NodeJS app)
    1) Head over to the download page
    2) Download the current build (latest features) available for your OS
    3) Be sure to check the box that says "Automatically install the necessary tools" when you're running the installation wizard

## Run through Docker (preferred)

Docker files are included for your convenience. Requires previous experience with docker.

1. Install [Docker Desktop (Windows)](https://www.docker.com/products/docker-desktop/), [Docker Compose](https://docs.docker.com/compose/), or [docker](https://www.docker.com/) (in order of preference)
2. Rename `/config.example.json` to `config.json` and go through your application configuration
3. Run `docker-compose up` or check out the example docker scripts in `package.json`

## Run as a plain NodeJS app

1. Head over to [the download page](https://github.com/Mirasaki/expansion-market-discord-logs/releases/)
    - Alternatively, clone this repository by using `git clone https://github.com/Mirasaki/expansion-market-discord-logs.git` and skip to step 4 if you have [Git](https://git-scm.com/downloads "Git Download Section") installed.
2. Download either the `zip` or `zip.gz` source code
3. Extract it using [your favorite zip tool](https://www.rarlab.com/download.htm "It's WinRar, duh")
4. Open a new console/terminal/shell window in the newly created project folder.
5. Run `npm i --exclude-dev` to install all dependencies, excluding development dependencies.
6. Rename `/config.example.json` to `config.json` and go through your application configuration
7. Use the command `npm run build && npm run start` to start the application, or alternatively:
    - `pm2 start dist/src/index.js --name="em-discord-logs"` to keep the process alive with [PM2](https://pm2.io/ "PM2 | Official Website"), suitable for production environments. (`npm i -g pm2` to install)
    - `npm run start:dev` for automatic restarts on changes, suitable for development environments

## Configuration

### `themeColor`

The color to use for embeds, if not using `compactOutput`. Requires hex-color format.

Example: `#FF0000`

### `webhookURL`

The Discord webhook URL to send logs to.

Example: `https://discord.com/api/webhooks/...`

### `logFolderPath`

The path to your Expansion Market logging directory.

Example: `C:\\Users\\Administrator\\OmegaManager\\servers\\0\\profiles\\ExpansionMod\\Logs`

### `compactOutput`

Should the logging output in Discord be compact? No embeds are used when `true`, embeds are used when `false`.

Disabled by default.

### `hidePositions`

Should player positions be hidden from the Discord output?

Disabled by default.

### `excludeEnabled`

Should we exclude/ignore specific events from the logs send to Discord?

Disabled by default.

### `excludeEvents`

The events to exclude.

Available values: `SAFE_ZONE_ENTER`, `SAFE_ZONE_EXIT`, `PLAYER_PURCHASE`, `PLAYER_SALE`, and `HAS_RETRIEVED`
