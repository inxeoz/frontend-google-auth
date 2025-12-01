import { writable } from 'svelte/store';

export const authToken = writable<string | null>(null);
export const baseUrl = writable<string>('http://127.0.0.1:8000'); // Default base URL, can be configured