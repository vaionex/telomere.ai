<script>
  import { goto } from '$app/navigation';
  $effect(() => { goto('/analysis', { replaceState: true }); });
</script>
