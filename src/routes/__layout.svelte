<script lang="ts">
	import Snackbar, { Actions, SnackbarComponentDev } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
	import Button, { Label } from '@smui/button';
	import { snackbarStore } from '$lib/store';
	import { onMount } from 'svelte';

	let snackText = '';
  let snackbarWithClose: SnackbarComponentDev;
  let snackSub;
  
	onMount(() => {
    console.log('mounted')
		snackSub = snackbarStore.subscribe((snack) => {
			console.log(snack);
			if (snack && snackbarWithClose) {
				snackText = snack;
				snackbarWithClose.open();
				snackbarStore.set('');
			}
		});
	});

</script>

<Snackbar bind:this={snackbarWithClose}>
	<Label>{snackText}.</Label>
	<Actions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>

<div id="all-wrapper">
	<h1>Judgementor</h1>
	<nav>
		<a href="/">Home</a>
		<a href="/reset-password">Reset Pass</a>
		<a href="/register">Register</a>
	</nav>
	<slot />
</div>

<style>
	#all-wrapper {
		width: 800px;
		max-width: 100%;
		margin: 0 auto;
	}
	h1 {
		text-align: center;
	}
</style>
