import { DEFAULTS } from '../constants/constants.js';
import { PATHS } from '../constants/constants.js';
import { ERROR_MESSAGES } from '../constants/constants.js';
import { ConfigError } from '../errors/errors.js';

/**
 * Centralized configuration management
 */
export class Config {
  static #instance: Config;
  #githubTokens: string;
  #githubUsernames: string;
  #generatedDir: string;
  #readmePath: string;
  #indexPath: string;

  private constructor() {
    this.#githubTokens = process.env.GH_STATS_TOKENS || '';
    this.#githubUsernames =
      process.env.GH_USERNAMES || process.env.GH_USERNAME || DEFAULTS.USERNAME;
    this.#generatedDir = PATHS.GENERATED_DIR;
    this.#readmePath = PATHS.README;
    this.#indexPath = PATHS.INDEX_HTML;
  }

  static getInstance(): Config {
    if (!Config.#instance) {
      Config.#instance = new Config();
    }
    return Config.#instance;
  }

  get githubTokens(): string[] {
    return this.#githubTokens.split(',').filter(Boolean);
  }

  get githubUsernames(): string[] {
    return this.#githubUsernames.split(',').map(u => u.trim());
  }

  get githubUsername(): string {
    return this.githubUsernames[0];
  }

  get generatedDir(): string {
    return this.#generatedDir;
  }

  get readmePath(): string {
    return this.#readmePath;
  }

  get indexPath(): string {
    return this.#indexPath;
  }

  validate(): void {
    if (!this.#githubTokens) {
      throw new ConfigError(ERROR_MESSAGES.NO_TOKEN, {
        username: this.githubUsername,
      });
    }

    const tokens = this.githubTokens;
    const usernames = this.githubUsernames;
    if (tokens.length !== usernames.length) {
      throw new ConfigError(
        `GH_STATS_TOKENS has ${tokens.length} token(s) but GH_USERNAMES has ${usernames.length} username(s). They must match.`,
      );
    }
  }
}
