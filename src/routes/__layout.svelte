<script lang="ts">
	import Menu, { MenuComponentDev } from '@smui/menu';
	import List, { Item, Separator, Text, PrimaryText, SecondaryText } from '@smui/list';
	import Snackbar, { Actions, SnackbarComponentDev } from '@smui/snackbar';
	import CircularProgress from '@smui/circular-progress';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import Button, { Label } from '@smui/button';
	import { loadingFullScreenStore, snackbarStore } from '$lib/store';
	import { onMount } from 'svelte';
	import { authStateChecked, doLogout, getProfile, userStore } from '$lib/user';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';

	let snackText = '';
	let snackbarWithClose: SnackbarComponentDev;
	let snackSub;
	let menu: MenuComponentDev;

	onMount(async () => {
		if (localStorage.getItem('supabase.auth.token')) {
			const user = JSON.parse(localStorage.getItem('supabase.auth.token')).currentSession.user;
			const profile = await getProfile(user.id);
			userStore.set({ ...user, profile });
		}
		authStateChecked.set(true);

		snackSub = snackbarStore.subscribe((snack) => {
			console.log('snack', snack);
			if (snack && snackbarWithClose) {
				snackText = snack;
				snackbarWithClose.open();
				snackbarStore.set('');
			}
		});
	});

	beforeNavigate(() => {
		loadingFullScreenStore.set(true);
	});

	afterNavigate(() => {
		loadingFullScreenStore.set(false);
	});

	const handleGoto = (path: string) => {
		goto(path);
	};
</script>

<Snackbar bind:this={snackbarWithClose}>
	<Label>{snackText}.</Label>
	<Actions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>

<Menu bind:this={menu} anchorCorner="TOP_LEFT">
	<List twoLine>
		<Item on:SMUI:action={() => handleGoto('/')}>
			<Text>Home</Text>
		</Item>
		<Separator />
		{#if $userStore}
			<Item on:SMUI:action={() => handleGoto('/profile')}>
				<Text>Profile</Text>
			</Item>
		{:else}
			<Item on:SMUI:action={() => handleGoto('/reset-password')}>
				<Text>Reset Password</Text>
			</Item>
			<Item on:SMUI:action={() => handleGoto('/register')}>
				<Text>Register</Text>
			</Item>
		{/if}
		<Separator />
		<Item on:SMUI:action={() => handleGoto('/cases/new')}>
			<Text>
				<PrimaryText>File a Claim</PrimaryText>
				<SecondaryText>Create a new case</SecondaryText>
			</Text>
		</Item>
		<Item on:SMUI:action={() => handleGoto('/evidences')}>
			<Text>
				<PrimaryText>Evidences</PrimaryText>
				<SecondaryText>Manage all the evidences</SecondaryText>
			</Text>
		</Item>
		{#if $userStore}
			<Separator />
			<Item on:SMUI:action={doLogout}>
				<Text>Logout</Text>
			</Item>
		{/if}
	</List>
</Menu>

<div id="all-wrapper">
	<TopAppBar variant="static" color="primary">
		<Row>
			<Section>
				<IconButton on:click={() => menu.setOpen(true)} class="material-icons">menu</IconButton>
				<Title>Judgementor</Title>
			</Section>
			<Section align="end" toolbar>
				<IconButton class="material-icons" aria-label="Download">file_download</IconButton>
				<IconButton class="material-icons" aria-label="Print this page">print</IconButton>
				<IconButton class="material-icons" aria-label="Bookmark this page">bookmark</IconButton>
			</Section>
		</Row>
	</TopAppBar>
	<div class="content-wrapper">
		<slot />
	</div>
</div>

{#if $loadingFullScreenStore}
	<div class="loading">
		<CircularProgress style="height: 32px; width: 32px;" indeterminate />
	</div>
{/if}

<style>
	.content-wrapper {
		padding: 20px;
	}
	#all-wrapper {
		width: 800px;
		max-width: 100%;
		margin: 0 auto;
	}
	.loading {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-color: rgba(155, 155, 155, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
