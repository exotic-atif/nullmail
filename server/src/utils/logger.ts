const LOG_LEVELS = {
  info: '\x1b[36m',   // cyan
  warn: '\x1b[33m',   // yellow
  error: '\x1b[31m',  // red
  success: '\x1b[32m', // green
  reset: '\x1b[0m',
} as const;

function formatTimestamp(): string {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

export const logger = {
  info: (message: string, data?: unknown) => {
    console.log(
      `${LOG_LEVELS.info}[${formatTimestamp()}] INFO${LOG_LEVELS.reset}  ${message}`,
      data ?? ''
    );
  },
  warn: (message: string, data?: unknown) => {
    console.warn(
      `${LOG_LEVELS.warn}[${formatTimestamp()}] WARN${LOG_LEVELS.reset}  ${message}`,
      data ?? ''
    );
  },
  error: (message: string, data?: unknown) => {
    console.error(
      `${LOG_LEVELS.error}[${formatTimestamp()}] ERROR${LOG_LEVELS.reset} ${message}`,
      data ?? ''
    );
  },
  success: (message: string, data?: unknown) => {
    console.log(
      `${LOG_LEVELS.success}[${formatTimestamp()}] OK${LOG_LEVELS.reset}    ${message}`,
      data ?? ''
    );
  },
};
