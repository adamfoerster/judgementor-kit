import { createClient } from '@supabase/supabase-js';
import { get } from 'svelte/store';
import type { TBylaws, TEntity, TEvidence } from './models';
import { userStore } from './user';

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL + '',
	import.meta.env.VITE_SUPABASE_ANON_KEY + ''
);

export default supabase;

export const createEvidence = async (evidence: TEvidence) => {
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

export const createEntity = async (entity: TEntity) => {
	let { data, error } = await supabase
		.from('entities')
		.insert({ ...entity, owner: get(userStore).id }, { returning: 'minimal' });
	if (error) {
		console.log(error);
		return error;
	}
	return data;
};

export const getEntities = async () => {
	let { data: entities, error } = await supabase
		.from('entities')
		.select('*')
		.eq('owner', get(userStore).id);
	if (error) {
		console.log(error);
	}
	return entities;
};

export const getEntity = async (id: string) => {
	let { data: entities, error } = await supabase
		.from('entities')
		.select('*')
		.eq('id', id);
	if (error) {
		console.log(error);
	}
	const bylaws = await getBylaws(entities[0].id);
	return {...entities[0], bylaws};
};

export const createBylaws = async (bylaws: TBylaws) => {
	let { data, error } = await supabase.from('bylaws').insert(bylaws, { returning: 'minimal' });
	if (error) {
		console.log(error);
		return error;
	}
	return data;
};

export const getBylaws = async (entity_id: string) => {
	let { data: bylaws, error } = await supabase
		.from('bylaws')
		.select('*')
		.eq('entity_id', entity_id);
	if (error) {
		console.log(error);
	}
	return bylaws;
};

