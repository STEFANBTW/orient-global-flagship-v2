'use client';

type EventCallback = (...args: any[]) => void;

class SimpleEventEmitter {
 private listeners: Record<string, EventCallback[]> = {};

 on(event: string, callback: EventCallback) {
 if (!this.listeners[event]) {
 this.listeners[event] = [];
 }
 this.listeners[event].push(callback);
 return this;
 }

 off(event: string, callback: EventCallback) {
 if (!this.listeners[event]) return this;
 this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
 return this;
 }

 emit(event: string, ...args: any[]) {
 if (!this.listeners[event]) return false;
 this.listeners[event].forEach(callback => callback(...args));
 return true;
 }
}

export const errorEmitter = new SimpleEventEmitter();
