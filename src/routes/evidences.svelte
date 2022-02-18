<script lang="ts">
	import { Label } from '@smui/common';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import { TEvidence, createEvidence, getEvidences, removeEvidence } from '$lib/db';
	import { loadingFullScreenStore, snackbarStore } from '$lib/store';
	import { onMount } from 'svelte';
	import { guardRouteOnlyLogged } from '$lib/user';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';

	let description = '';
	let url = '';
	let id = null;
	let items: TEvidence[] = [];
	let ask = false;
	let selectedEvidence;

	onMount(async () => {
		loadingFullScreenStore.set(true);
		guardRouteOnlyLogged.subscribe(async (logged) => {
			if (!logged) return;
			items = await getEvidences(logged.id);
			loadingFullScreenStore.set(false);
		});
	});

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
    guardRouteOnlyLogged.subscribe(async (logged) => {
			if (!logged) return;
			items = await getEvidences(logged.id);
			loadingFullScreenStore.set(false);
		});
	};

	const askRemoveEvidence = async (id) => {
		ask = true;
		selectedEvidence = id;
	};
</script>

<h2>Evidences</h2>

<DataTable stickyHeader table$aria-label="User list">
	<Head>
		<Row>
			<Cell>Description</Cell>
			<Cell>URL</Cell>
			<Cell>Actions</Cell>
		</Row>
	</Head>
	<Body>
		{#each items as item (item.id)}
			<Row>
				<Cell>{item.description}</Cell>
				<Cell>{item.url}</Cell>
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
	<Textfield variant="outlined" bind:value={description} label="Description" />
	<Textfield variant="outlined" bind:value={url} label="URL" />
</div>
<div class="center-line">
	<Button on:click={saveEvidence} variant="raised" disabled={!description || !url}>
		<Label>{!id ? 'Create' : 'Update'}</Label>
	</Button>
	<Button on:click={newEvidence} variant="raised" disabled={!id}>
		<Label>New</Label>
	</Button>
</div>

<Dialog bind:ask aria-labelledby="simple-title" aria-describedby="simple-content">
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title id="simple-title">Dialog Title</Title>
	<Content id="simple-content">Super awesome dialog body text?</Content>
	<Actions>
		<Button on:click={() => (ask = false)}>
			<Label>No</Label>
		</Button>
		<Button
			on:click={() => {
				removeEvidence(selectedEvidence);
				ask = false;
			}}
		>
			<Label>Yes</Label>
		</Button>
	</Actions>
</Dialog>
