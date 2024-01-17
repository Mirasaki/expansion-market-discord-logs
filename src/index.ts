import { existsSync } from 'fs';

if (!existsSync('./config.json')) {
  throw new Error('config.json not found. Please copy config.example.json to config.json and fill in the values.');
}

import config from '../config.json';
import { initEMLogFileWatcher } from '.';

export const appConfig = config;

export * from './discord';
export * from './files';
export * from './market';
export * from './watcher';

initEMLogFileWatcher();
