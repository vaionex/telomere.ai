<script>
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import AppSidebar from '$lib/components/AppSidebar.svelte';
  import { isTauri } from '$lib/stores/platform.js';
  let { children } = $props();
</script>

{#if $isTauri}
  <!-- Desktop app layout -->
  <AppSidebar />
  <main class="ml-56 min-h-screen">
    {@render children()}
  </main>
{:else}
  <!-- Website layout -->
  <Nav />
  <main class="min-h-screen pt-16">
    {@render children()}
  </main>
  <Footer />
{/if}
