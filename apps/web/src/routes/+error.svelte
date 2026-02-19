<script>
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Page Not Found — Telomere.ai</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center px-4">
  <div class="text-center space-y-4 max-w-md">
    <p class="text-6xl font-bold text-[var(--color-text-tertiary)]">{$page.status}</p>
    <h1 class="text-xl font-semibold text-[var(--color-text-primary)]">
      {$page.status === 404 ? 'Page not found' : 'Something went wrong'}
    </h1>
    <p class="text-sm text-[var(--color-text-secondary)]">
      {$page.error?.message || "The page you're looking for doesn't exist or has been moved."}
    </p>
    <div class="flex items-center justify-center gap-3 pt-4">
      <a href="/" class="px-5 py-2.5 rounded-lg bg-[var(--color-accent-blue)] text-white text-sm font-medium hover:opacity-90 transition-opacity">Go Home</a>
      <a href="/upload" class="px-5 py-2.5 rounded-lg border border-black/10 text-sm text-[var(--color-text-secondary)] hover:bg-black/[0.02] transition-colors">Analyze DNA</a>
    </div>
  </div>
</div>
