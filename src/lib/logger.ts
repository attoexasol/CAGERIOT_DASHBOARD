/**
 * Logger Utility
 * Provides consistent logging with mode awareness
 */

import { isDemoMode } from "./config";

const styles = {
  demo: "background: #fbbf24; color: #000; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
  live: "background: #10b981; color: #000; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
  api: "background: #ff0050; color: #fff; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
  info: "background: #3b82f6; color: #fff; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
  success:
    "background: #10b981; color: #fff; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
  error:
    "background: #ef4444; color: #fff; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
};

class Logger {
  private mode = isDemoMode() ? "DEMO" : "LIVE";
  private modeStyle = isDemoMode() ? styles.demo : styles.live;

  api(message: string, ...args: any[]) {
    console.log(
      `%c${this.mode}%c API`,
      this.modeStyle,
      styles.api,
      message,
      ...args
    );
  }

  info(message: string, ...args: any[]) {
    console.log(
      `%c${this.mode}%c INFO`,
      this.modeStyle,
      styles.info,
      message,
      ...args
    );
  }

  success(message: string, ...args: any[]) {
    console.log(
      `%c${this.mode}%c SUCCESS`,
      this.modeStyle,
      styles.success,
      message,
      ...args
    );
  }

  error(message: string, ...args: any[]) {
    console.error(
      `%c${this.mode}%c ERROR`,
      this.modeStyle,
      styles.error,
      message,
      ...args
    );
  }

  warn(message: string, ...args: any[]) {
    console.warn(
      `%c${this.mode}%c WARN`,
      this.modeStyle,
      "background: #f59e0b; color: #000; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
      message,
      ...args
    );
  }
}

export const logger = new Logger();
