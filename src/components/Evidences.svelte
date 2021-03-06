<script lang="ts">
	import { Label } from '@smui/common';
	import Button, { GroupItem } from '@smui/button';
	import Textfield from '@smui/textfield';
	import { createEvidence, getEvidences, removeEvidence } from '$lib/db';
	import { loadingFullScreenStore, snackbarStore } from '$lib/store';
	import { onMount } from 'svelte';
	import { guardRouteOnlyLogged } from '$lib/user';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import type { TEvidence } from '$lib/models';

	export let evidences: TEvidence[] = [];
	let description = '';
	let url = '';
	let id = null;
	let ask = false;
	let selectedEvidence;

	onMount(async () => {
		await loadEvidences();
	});

	const loadEvidences = async () => {
		loadingFullScreenStore.set(true);
		guardRouteOnlyLogged.subscribe(async (logged) => {
			if (!logged) return;
			evidences = await getEvidences(logged.id);
			loadingFullScreenStore.set(false);
		});
	};

	const newEvidence = () => {
		id = '';
		url = '';
		description = '';
	};

	const saveEvidence = async () => {
		console.log('saveEvidence');
		loadingFullScreenStore.set(true);
		await createEvidence({ url, description });
		snackbarStore.set('Evidence saved');
		newEvidence();
		await loadEvidences();
	};

	const askRemoveEvidence = async (id) => {
		ask = true;
		selectedEvidence = id;
	};

	const confirmRemoveEvidence = async () => {
		loadingFullScreenStore.set(true);
		await removeEvidence(selectedEvidence);
		snackbarStore.set('Evidence removed');
		loadingFullScreenStore.set(false);
		await loadEvidences();
	};
</script>

<h2>Evidences</h2>

<DataTable stickyHeader table$aria-label="User list" style="width: 100%;">
	<Head>
		<Row>
			<Cell>Description</Cell>
			<Cell>Actions</Cell>
		</Row>
	</Head>
	<Body>
		{#each evidences as item (item.id)}
			<Row>
				<Cell><a target="_BLANK" href={item.url}>{item.description}</a></Cell>
				<Cell
					><Button on:click={() => askRemoveEvidence(item.id)}>
						<Label>Remove</Label>
					</Button></Cell
				>
			</Row>
		{/each}
	</Body>
</DataTable>

<div class="fields-center">
	<Textfield variant="outlined" bind:value={description} label="Description" style="width: 100%;" />
	<Textfield variant="outlined" bind:value={url} label="URL" style="width: 100%;" />
</div>
<div class="center-line">
	<Button on:click={saveEvidence} variant="raised" disabled={!description || !url}>
		<Label>{!id ? 'Create' : 'Update'}</Label>
	</Button>
	<Button on:click={newEvidence} variant="raised" disabled={!id}>
		<Label>New</Label>
	</Button>
</div>

<Dialog bind:open={ask} aria-labelledby="simple-title" aria-describedby="simple-content">
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title id="simple-title">Remove Evidence</Title>
	<Content id="simple-content">Are you sure you want to remove this evidence?</Content>
	<Actions>
		<Button on:click={() => (ask = false)}>
			<Label>No</Label>
		</Button>
		<Button on:click={confirmRemoveEvidence}>
			<Label>Yes</Label>
		</Button>
	</Actions>
</Dialog>
