export interface TEvidence {
	id?: string;
	description: string;
	url: string;
	case_id?: string;
}

export interface TEntity {
	id?: string;
	name: string;
	status: boolean;
	owner?: string;
	bylaws?: TBylaws[];
}

export interface TBylaws {
	id?: string;
	text: JSON;
	entity_id?: string;
	revision?: number;
}
