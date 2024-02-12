import { EM_LOG_DELAY, appConfig, findNewestFile, handleEMLogLine, initFileWatcher, takeLatestBatch } from '.';
import { EmbedBuilder, HexColorString, WebhookClient, resolveColor } from 'discord.js';

const tag = '[log-tail/market]';

export const processedEMLogLines = new Set<string>();

export const initEMLogFileWatcher = async () => {
  const result = await initFileWatcher(
    appConfig.logFolderPath,
    handleEMLogLine,
    undefined,
    'log'
  );
  if (result === null) return;
  let { tail, filePath } = result;

  const webhook = new WebhookClient({ url: appConfig.webhookURL });
  setInterval(() => {
    console.debug(`${tag} Checking for new batch to process`);
    const batch = takeLatestBatch();
    if (!batch || !batch.length) {
      console.debug(`${tag} No new batch to process`);
      return;
    }
    processEMLogBatch(batch, webhook);
  }, EM_LOG_DELAY);

  setInterval(async () => {
    const newestFilePath = await findNewestFile(appConfig.logFolderPath, 0, 'log');
    if (newestFilePath === filePath) return;
    console.debug(`${tag} New file detected, switching to "${newestFilePath}"`);
    tail.unwatch();
    processedEMLogLines.clear();
    const result = await initFileWatcher(
      appConfig.logFolderPath,
      handleEMLogLine,
      undefined,
      'log'
    );
    if (result === null) return; // Logged inside function
    ({ tail, filePath } = result);
  }, EM_LOG_DELAY * 10);
};

export const processEMLogBatch = (batch: string[], webhook: WebhookClient) => {
  console.debug(`${tag} Processing batch of ${batch.length} lines`);

  if (appConfig.compactOutput) {
    const output = batch.map(resolveOutputForEMLogLine).join('\n\n');
    if (output === '') return;
    webhook.send(output);
    return;
  }

  const output = batch.map(resolveOutputForEMLogLine).filter((e) => e !== '');
  if (output.length === 0) return;

  if (!appConfig.themeColor.startsWith('#')) {
    console.warn(`${tag} Invalid themeColor "${appConfig.themeColor}"`);
  }

  webhook.send({
    embeds: output.map((line) => new EmbedBuilder()
      .setColor(resolveColor(appConfig.themeColor as HexColorString))
      .setDescription(line)
    ),
  });
};

export const SAFE_ZONE_ENTER = 'SAFE_ZONE_ENTER';
export const SAFE_ZONE_EXIT = 'SAFE_ZONE_EXIT';
export const PLAYER_PURCHASE = 'PLAYER_PURCHASE';
export const PLAYER_SALE = 'PLAYER_SALE';
export const HAS_RETRIEVED = 'HAS_RETRIEVED';

export const emLogTypeRegex = {
  [SAFE_ZONE_ENTER]: new RegExp(/Entered the safezone$/),
  [SAFE_ZONE_EXIT]: new RegExp(/Left the safezone$/),
  [PLAYER_PURCHASE]: new RegExp(/=\) has bought /),
  [PLAYER_SALE]: new RegExp(/=\) has sold /),
  [HAS_RETRIEVED]: new RegExp(/ has retrieved /),
};

export const resolveOutputForEMLogLine = (line: string) => {
  let activeType: string | null = null;
  for (const [type, regex] of Object.entries(emLogTypeRegex)) {
    if (regex.test(line)) {
      activeType = type;
      break;
    }
  }

  const [
    , // Timestamp
    , // Tag
    ...rest
  ] = line.split(' ');
  let resolved = appConfig.compactOutput ? line : rest.join(' ');

  // Remove trader coords from purchase/sale logs
  if (activeType === PLAYER_PURCHASE || activeType === PLAYER_SALE) {
    const removedTraderCoords = resolved.slice(
      resolved.lastIndexOf('('),
      resolved.lastIndexOf(')') + 1
    );
    resolved = resolved.replace(removedTraderCoords, '');
  }

  // Remove position from logs
  if (appConfig.hidePositions) {
    resolved = resolved.replaceAll(/\(pos=<\d+\.\d+, \d+\.\d+, \d+\.\d+>\)/g, '');
    // .replaceAll(/\(pos=<[^>]+>\)/g, '');
  }

  return resolved;
};

export const resolveLogLineType = (line: string) => {
  for (const [type, regex] of Object.entries(emLogTypeRegex)) {
    if (regex.test(line)) return type;
  }
  return null;
};
