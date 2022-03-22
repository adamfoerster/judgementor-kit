import { goto } from '$app/navigation';
import { derived, get, writable } from 'svelte/store';
import supabase from './db';
import type { TUserProfile } from './models';
import { snackbarStore } from './store';

export const userStore = writable<TUserProfile>(null);
export const authStateChecked = writable(false);
export const selectedEntityStore = writable<string>(null);

export const guardRouteOnlyLogged = derived(
	[userStore, authStateChecked],
	([user, authStateChecked]) => {
		if (authStateChecked && !user) {
			snackbarStore.set('You must be logged in to view this page');
			goto('/');
			return false;
		}
		if (authStateChecked && user) {
			return user;
		}
	}
);

export const doLogin = async (email: string, password: string) => {
	let { user, error } = await supabase.auth.signIn({
		email,
		password
	});
	if (error) {
		console.log(error);
	}
	userStore.set(user);
	return user;
};

export const doLogout = async () => {
	let { error } = await supabase.auth.signOut();
	if (error) {
		console.log(error);
	}
	userStore.set(null);
};

export const doForgotPassword = async (email: string) => {
	let { error } = await supabase.auth.api.resetPasswordForEmail(email);
	if (error) {
		console.log(error);
	}
};

export const doResetPassword = async (password: string) => {
	let { user, error } = await supabase.auth.update({ password });
	if (error) {
		return console.log(error);
	}
	return user;
};

export const doRegister = async (email: string, password: string) => {
	let { user, error } = await supabase.auth.signUp({
		email,
		password
	});
	if (error) {
		console.log(error);
	}
	userStore.set(user);
	return user;
};

export const doSaveProfile = async (profile: TUserProfile) => {
	const user = get(userStore);
	let { data: profiles, error } = await supabase.from('profiles').upsert({
		id: user.id,
		email: user.email,
		...profile
	});
	if (error) {
		console.log(error);
	}
	user.profile = profiles[0];
	userStore.set(user);
	return user;
};

export const getProfile = async (id) => {
	const { data: profiles, error } = await supabase.from('profiles').select('*').eq('id', id);
	if (error) {
		console.log(error);
	}
	return profiles[0];
};

export const getEntitiesByUser = async (user_id) => {
	const { data, error } = await supabase.from('entity_users').select('*').eq('user_id', user_id);
	if (error) {
		console.log(error);
	}
	return data.map(({ entity_id }) => entity_id);
};

export const getProfiles = async () => {
	const { data: profiles, error } = await supabase.from('profiles').select('*');
	if (error) {
		console.log(error);
	}
	return profiles;
};
