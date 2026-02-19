<script>
  let mobileOpen = $state(false);
</script>

<nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0A0E17]/80 border-b border-white/5">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="flex items-center gap-2">
        <svg class="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <path d="M16 2C12 8 8 12 8 16s4 8 8 14c4-6 8-10 8-14s-4-8-8-14z" stroke="url(#nav-grad)" stroke-width="2" fill="none"/>
          <path d="M10 10q6 6 12 0M10 22q6-6 12 0" stroke="url(#nav-grad)" stroke-width="1.5" opacity="0.6"/>
          <defs><linearGradient id="nav-grad" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#00E5CC"/><stop offset="1" stop-color="#3B82F6"/></linearGradient></defs>
        </svg>
        <span class="text-xl font-bold gradient-text">Telomere</span>
      </a>

      <div class="hidden md:flex items-center gap-8">
        <a href="/#features" class="text-text-secondary hover:text-text-primary transition-colors text-sm">Features</a>
        <a href="/#reports" class="text-text-secondary hover:text-text-primary transition-colors text-sm">Reports</a>
        <a href="/explore" class="text-text-secondary hover:text-text-primary transition-colors text-sm">SNP Explorer</a>
        <a href="/about" class="text-text-secondary hover:text-text-primary transition-colors text-sm">About</a>
        <a href="/upload" class="btn-primary text-sm !py-2 !px-4">Upload DNA</a>
      </div>

      <button class="md:hidden text-text-secondary" onclick={() => mobileOpen = !mobileOpen}>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if mobileOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          {/if}
        </svg>
      </button>
    </div>
  </div>

  {#if mobileOpen}
    <div class="md:hidden border-t border-white/5 bg-[#0A0E17]/95 backdrop-blur-xl">
      <div class="px-4 py-4 space-y-3">
        <a href="/#features" class="block text-text-secondary hover:text-text-primary py-2" onclick={() => mobileOpen = false}>Features</a>
        <a href="/#reports" class="block text-text-secondary hover:text-text-primary py-2" onclick={() => mobileOpen = false}>Reports</a>
        <a href="/explore" class="block text-text-secondary hover:text-text-primary py-2" onclick={() => mobileOpen = false}>SNP Explorer</a>
        <a href="/about" class="block text-text-secondary hover:text-text-primary py-2" onclick={() => mobileOpen = false}>About</a>
        <a href="/upload" class="btn-primary text-sm text-center block" onclick={() => mobileOpen = false}>Upload DNA</a>
      </div>
    </div>
  {/if}
</nav>
