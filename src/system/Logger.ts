export enum LogLevel {
    Warn, Error, Info
}

export interface Log {
    level: LogLevel;
    s: string;
}

export interface Logger {
    logs: Log[];

    w(str: string);

    e(str: string);

    i(str: string);
}

export function createLog(level: LogLevel, s: string): Log {
    return {level, s}
}