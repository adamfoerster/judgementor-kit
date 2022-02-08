import { get, writable } from 'svelte/store';
import supabase from './db';

export const userStore = writable(null);

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

export const doSaveProfile = async (profile: UserProfile) => {
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

export interface UserProfile {
	id?: string;
	email?: string;
	username?: string;
	avatar_url?: string;
}
