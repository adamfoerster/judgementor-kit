import { writable } from 'svelte/store';
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
	let { user, error } = await supabase.auth.update({password});
	if (error) {
		return console.log(error);
	}
	return user;
}
