import posthog from 'posthog-js';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogMeta {
  [key: string]: any;
}

class Logger {
  private posthogInitialized = false;
  private logLevel: LogLevel;

  constructor() {
    this.logLevel = (import.meta.env.VITE_LOG_LEVEL as LogLevel) || LogLevel.INFO;

    // PostHog já está inicializado via web snippet no index.html
    // Verificamos se está disponível globalmente
    if (typeof window !== 'undefined' && (window as any).posthog) {
      this.posthogInitialized = true;
      this.info('PostHog initialized via web snippet', { context: 'Logger' });
    } else {
      // Fallback: inicializar via SDK se web snippet não estiver disponível
      const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
      const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

      if (posthogKey) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          loaded: (posthog) => {
            this.posthogInitialized = true;
            this.info('PostHog initialized via SDK', { context: 'Logger' });
          },
        });
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private formatMessage(message: string, context?: string, meta?: LogMeta): string {
    const contextStr = context ? `[${context}]` : '';
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `${new Date().toISOString()} ${contextStr} ${message}${metaStr}`;
  }

  private sendToPostHog(level: LogLevel, message: string, context?: string, meta?: LogMeta) {
    if (!this.posthogInitialized) return;

    const eventName = `frontend_${level}`;
    const properties = {
      message,
      context: context || 'unknown',
      level,
      environment: import.meta.env.MODE || 'development',
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...meta,
    };

    // Usar posthog global se disponível (web snippet) ou o importado
    const posthogInstance = typeof window !== 'undefined' && (window as any).posthog 
      ? (window as any).posthog 
      : posthog;
    
    posthogInstance.capture(eventName, properties);
  }

  error(message: string, context?: string, meta?: LogMeta) {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    console.error(this.formatMessage(message, context, meta));
    this.sendToPostHog(LogLevel.ERROR, message, context, meta);
  }

  warn(message: string, context?: string, meta?: LogMeta) {
    if (!this.shouldLog(LogLevel.WARN)) return;

    console.warn(this.formatMessage(message, context, meta));
    this.sendToPostHog(LogLevel.WARN, message, context, meta);
  }

  info(message: string, context?: string, meta?: LogMeta) {
    if (!this.shouldLog(LogLevel.INFO)) return;

    console.info(this.formatMessage(message, context, meta));
    this.sendToPostHog(LogLevel.INFO, message, context, meta);
  }

  debug(message: string, context?: string, meta?: LogMeta) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    console.debug(this.formatMessage(message, context, meta));
    this.sendToPostHog(LogLevel.DEBUG, message, context, meta);
  }

  // Método para identificar usuário no PostHog
  identify(userId: string, properties?: Record<string, any>) {
    if (this.posthogInitialized) {
      const posthogInstance = typeof window !== 'undefined' && (window as any).posthog 
        ? (window as any).posthog 
        : posthog;
      posthogInstance.identify(userId, properties);
    }
  }

  // Método para resetar identificação (logout)
  reset() {
    if (this.posthogInitialized) {
      const posthogInstance = typeof window !== 'undefined' && (window as any).posthog 
        ? (window as any).posthog 
        : posthog;
      posthogInstance.reset();
    }
  }
}

export const logger = new Logger();
