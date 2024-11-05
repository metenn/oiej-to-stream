// Don't place import/export within this file.
// This is only to extend existing types like library types.
// Doing so will make this a module and make it not work.

declare namespace Express {
    export interface Request {
        client?: import("./types.d.ts").Client | undefined;
        ip2: string;
    }
}