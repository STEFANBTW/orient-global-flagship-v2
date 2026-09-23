'use client';

/**
 * Barrel file for Firebase functionality.
 * Exports initialization logic, providers, and hooks for use throughout the app.
 */

export * from './init';
export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
