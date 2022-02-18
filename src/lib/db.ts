import { createClient } from '@supabase/supabase-js';
import { get } from 'svelte/store';
import { userStore } from './user';

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL + '',
	import.meta.env.VITE_SUPABASE_ANON_KEY + ''
);

export default supabase;

export const createEvidence = async (evidence: Evidence) => {
	let { data, error } = await supabase
		.from('evidences')
		.insert({ ...evidence, uid: get(userStore).id }, { returning: 'minimal' });
	if (error) {
		console.log(error);
		return error;
	}
	return data;
};

export const getEvidences = async (uid: string) => {
	let { data: evidences, error } = await supabase.from('evidences').select('*').eq('uid', uid);
	if (error) {
		console.log(error);
	}
	return evidences;
};

export const removeEvidence = async (id: string) => {
	let { error } = await supabase.from('evidences').delete().eq('id', id);
	if (error) {
		console.log(error);
	}
};

export interface TEvidence {
	id?: string;
	description: string;
	url: string;
	case_id?: string;
}
