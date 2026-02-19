<script>
  let mobileOpen = $state(false);
</script>

<nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-black/5">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="flex items-center gap-2">
        <svg class="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <path d="M16 2C12 8 8 12 8 16s4 8 8 14c4-6 8-10 8-14s-4-8-8-14z" stroke="url(#nav-grad)" stroke-width="2" fill="none"/>
          <path d="M10 10q6 6 12 0M10 22q6-6 12 0" stroke="url(#nav-grad)" stroke-width="1.5" opacity="0.6"/>
          <defs><linearGradient id="nav-grad" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#3B82F6"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs>
        </svg>
        <span class="text-xl font-bold text-text-primary tracking-tight">Telomere<span class="text-accent-blue font-medium text-sm">.ai</span></span>
      </a>

      <div class="hidden md:flex items-center gap-8">
        <a href="/#features" class="text-text-secondary hover:text-text-primary transition-colors text-sm">Features</a>
        <a href="/#reports" class="text-text-secondary hover:text-text-primary transition-colors text-sm">Reports</a>
        <a href="/blog" class="text-text-secondary hover:text-text-primary transition-colors text-sm">Blog</a>
        <a href="/about" class="text-text-secondary hover:text-text-primary transition-colors text-sm">About</a>
        <a href="/explore" class="text-text-secondary hover:text-text-primary transition-colors text-sm">Explorer</a>
        <a href="/upload" class="btn-cta text-sm !py-2 !px-4">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.772.13c-3.052.513-6.174.513-9.226 0l-.772-.13c-1.717-.293-2.3-2.379-1.067-3.61L5 14.5"/>
          </svg>
          Analyze DNA
        </a>
        <a href="/download" class="btn-primary text-sm !py-2 !px-4">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Download
        </a>
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
    <div class="md:hidden border-t border-black/5 bg-white/90 backdrop-blur-xl">
      <div class="px-4 py-4 space-y-3">
        <a href="/#features" class="block text-text-secondary hover:text-text-primary py-2" onclick={() => mobileOpen = false}>Features</a>
        <a href="/#reports" class="block text-text-secondary hover:text-text-primary py-2" onclick={() => mobileOpen = false}>Reports</a>
        <a href="/blog" class="block text-text-secondary hover:text-text-primary py-2" onclick={() => mobileOpen = false}>Blog</a>
        <a href="/about" class="block text-text-secondary hover:text-text-primary py-2" onclick={() => mobileOpen = false}>About</a>
        <a href="/explore" class="block text-text-secondary hover:text-text-primary py-2" onclick={() => mobileOpen = false}>Explorer</a>
        <a href="/upload" class="btn-cta text-sm text-center block" onclick={() => mobileOpen = false}>Analyze DNA</a>
        <a href="/download" class="btn-primary text-sm text-center block" onclick={() => mobileOpen = false}>Download</a>
      </div>
    </div>
  {/if}
</nav>
