/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    db: import('./db').DbClient;
    auth: ReturnType<typeof import('./auth').createAuth>;
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      image?: string | null;
    } | null;
    session: {
      id: string;
      userId: string;
      expiresAt: Date;
      token: string;
    } | null;
    runtime?: {
      env?: Record<string, any>;
    };
  }
}
