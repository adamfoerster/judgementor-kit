<script>
import { page } from "$app/stores";


import Entity from "$components/Entity.svelte";
</script>
<Entity entity_id={$page.params.entity_id}></Entity>