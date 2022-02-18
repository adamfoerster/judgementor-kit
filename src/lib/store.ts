import { writable } from 'svelte/store';

export const snackbarStore = writable(null);

export const loadingFullScreenStore = writable(false);
