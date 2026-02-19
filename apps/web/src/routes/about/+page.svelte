<svelte:head>
  <title>About — Telomere.ai</title>
  <meta name="description" content="Telomere.ai is a free, open-source desktop app for genetic analysis. Learn about our mission, privacy-first approach, and curated SNP database." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden pt-32 pb-20">
  <div class="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#3B82F6] opacity-[0.12] blur-[160px] animate-blob"></div>
  <div class="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full bg-[#7C3AED] opacity-[0.08] blur-[140px] animate-blob animation-delay-2000"></div>
  
  <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-accent-blue mb-6">
      <span class="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
      Open Source · MIT Licensed
    </div>
    <h1 class="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
      Making genetics<br/><span class="gradient-text">accessible to everyone</span>
    </h1>
    <p class="text-xl text-text-secondary max-w-2xl mx-auto">
      Your genetic data belongs to you — understanding it shouldn't cost a fortune or compromise your privacy.
    </p>
  </div>
</section>

<!-- Mission -->
<section class="py-20">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-2 gap-16 items-center">
      <div>
        <h2 class="text-3xl font-bold mb-4">Our Mission</h2>
        <p class="text-text-secondary mb-4">Genetic insights shouldn't cost $297 per year. Telomere.ai is a free, open-source desktop application that analyzes your raw genetic data — completely offline, on your own computer.</p>
        <p class="text-text-secondary">No accounts. No subscriptions. No data harvesting. Just science.</p>
      </div>
      <!-- Abstract mission illustration -->
      <div class="flex justify-center">
        <svg viewBox="0 0 400 400" class="w-full max-w-[360px]" fill="none">
          <defs>
            <linearGradient id="m-blue" x1="0" y1="0" x2="400" y2="400">
              <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#7C3AED" stop-opacity="0.4"/>
            </linearGradient>
            <linearGradient id="m-rose" x1="400" y1="0" x2="0" y2="400">
              <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#F59E0B" stop-opacity="0.3"/>
            </linearGradient>
            <linearGradient id="m-green" x1="200" y1="0" x2="200" y2="400">
              <stop offset="0%" stop-color="#10B981" stop-opacity="0.5"/>
              <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.3"/>
            </linearGradient>
          </defs>
          
          <!-- Large soft circle — knowledge/wholeness -->
          <circle cx="200" cy="200" r="150" fill="#3B82F6" opacity="0.04"/>
          <circle cx="200" cy="200" r="150" stroke="#3B82F6" stroke-width="1" opacity="0.1"/>
          <circle cx="200" cy="200" r="120" stroke="#7C3AED" stroke-width="0.5" opacity="0.08" stroke-dasharray="4 6"/>
          
          <!-- Orbiting paths — accessibility/openness -->
          <ellipse cx="200" cy="200" rx="170" ry="80" transform="rotate(-20 200 200)" stroke="url(#m-blue)" stroke-width="1.5" opacity="0.3"/>
          <ellipse cx="200" cy="200" rx="170" ry="80" transform="rotate(40 200 200)" stroke="url(#m-rose)" stroke-width="1.5" opacity="0.25"/>
          <ellipse cx="200" cy="200" rx="170" ry="80" transform="rotate(100 200 200)" stroke="url(#m-green)" stroke-width="1.5" opacity="0.25"/>
          
          <!-- Orbiting dots — people/data points accessing knowledge -->
          <circle r="6" fill="#3B82F6" opacity="0.8">
            <animateMotion dur="12s" repeatCount="indefinite"><mpath href="#orbit1"/></animateMotion>
          </circle>
          <circle r="5" fill="#F43F5E" opacity="0.7">
            <animateMotion dur="12s" repeatCount="indefinite" begin="-4s"><mpath href="#orbit2"/></animateMotion>
          </circle>
          <circle r="4" fill="#10B981" opacity="0.7">
            <animateMotion dur="12s" repeatCount="indefinite" begin="-8s"><mpath href="#orbit3"/></animateMotion>
          </circle>
          <circle r="3.5" fill="#F59E0B" opacity="0.6">
            <animateMotion dur="12s" repeatCount="indefinite" begin="-2s"><mpath href="#orbit1"/></animateMotion>
          </circle>
          <circle r="4.5" fill="#7C3AED" opacity="0.6">
            <animateMotion dur="12s" repeatCount="indefinite" begin="-6s"><mpath href="#orbit3"/></animateMotion>
          </circle>
          
          <!-- Hidden motion paths -->
          <ellipse id="orbit1" cx="200" cy="200" rx="170" ry="80" transform="rotate(-20 200 200)" fill="none"/>
          <ellipse id="orbit2" cx="200" cy="200" rx="170" ry="80" transform="rotate(40 200 200)" fill="none"/>
          <ellipse id="orbit3" cx="200" cy="200" rx="170" ry="80" transform="rotate(100 200 200)" fill="none"/>
          
          <!-- Center DNA icon — the core -->
          <g transform="translate(200,200)">
            <!-- Double helix simplified -->
            <path d="M-20,-50 Q0,-30 20,-25 Q0,-20 -20,0 Q0,20 20,25 Q0,30 -20,50" stroke="#3B82F6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M20,-50 Q0,-30 -20,-25 Q0,-20 20,0 Q0,20 -20,25 Q0,30 20,50" stroke="#7C3AED" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <!-- Base pair bridges -->
            <line x1="-12" y1="-37" x2="12" y2="-37" stroke="#94A3B8" stroke-width="1.5" opacity="0.4"/>
            <line x1="-16" y1="-12" x2="16" y2="-12" stroke="#94A3B8" stroke-width="1.5" opacity="0.4"/>
            <line x1="-16" y1="12" x2="16" y2="12" stroke="#94A3B8" stroke-width="1.5" opacity="0.4"/>
            <line x1="-12" y1="37" x2="12" y2="37" stroke="#94A3B8" stroke-width="1.5" opacity="0.4"/>
            <!-- Nucleotide dots -->
            <circle cx="-12" cy="-37" r="2.5" fill="#3B82F6" opacity="0.7"/>
            <circle cx="12" cy="-37" r="2.5" fill="#F43F5E" opacity="0.7"/>
            <circle cx="-16" cy="-12" r="2.5" fill="#10B981" opacity="0.7"/>
            <circle cx="16" cy="-12" r="2.5" fill="#F59E0B" opacity="0.7"/>
            <circle cx="-16" cy="12" r="2.5" fill="#F43F5E" opacity="0.7"/>
            <circle cx="16" cy="12" r="2.5" fill="#3B82F6" opacity="0.7"/>
            <circle cx="-12" cy="37" r="2.5" fill="#F59E0B" opacity="0.7"/>
            <circle cx="12" cy="37" r="2.5" fill="#10B981" opacity="0.7"/>
          </g>
          
          <!-- Gentle pulse ring -->
          <circle cx="200" cy="200" r="60" stroke="#3B82F6" stroke-width="1" fill="none" opacity="0.15">
            <animate attributeName="r" values="60;75;60" dur="4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.15;0.05;0.15" dur="4s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
    </div>
  </div>
</section>

<!-- Why Telomere -->
<section class="py-20 bg-bg-secondary relative overflow-hidden">
  <div class="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#F59E0B] opacity-[0.06] blur-[120px] animate-blob animation-delay-3000"></div>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-2 gap-16 items-center">
      <!-- Illustration: Chromosome with telomere detail -->
      <div class="flex justify-center order-2 md:order-1">
        <div class="relative w-full max-w-[320px]">
          <!-- Chromosome diagram -->
          <div class="rounded-2xl bg-white border border-black/[0.08] shadow-lg p-8">
            <svg viewBox="0 0 260 320" class="w-full" fill="none">
              <defs>
                <linearGradient id="chr-body" x1="130" y1="0" x2="130" y2="320">
                  <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.15"/>
                  <stop offset="50%" stop-color="#7C3AED" stop-opacity="0.2"/>
                  <stop offset="100%" stop-color="#F43F5E" stop-opacity="0.15"/>
                </linearGradient>
                <linearGradient id="telo-cap" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#3B82F6"/>
                  <stop offset="100%" stop-color="#60A5FA"/>
                </linearGradient>
              </defs>
              
              <!-- Left arm -->
              <path d="M100 30 Q100 80 85 120 Q70 160 85 200 Q100 240 100 290" stroke="#7C3AED" stroke-width="32" stroke-linecap="round" fill="none" opacity="0.12"/>
              <path d="M100 30 Q100 80 85 120 Q70 160 85 200 Q100 240 100 290" stroke="#7C3AED" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6"/>
              
              <!-- Right arm -->
              <path d="M160 30 Q160 80 175 120 Q190 160 175 200 Q160 240 160 290" stroke="#7C3AED" stroke-width="32" stroke-linecap="round" fill="none" opacity="0.12"/>
              <path d="M160 30 Q160 80 175 120 Q190 160 175 200 Q160 240 160 290" stroke="#7C3AED" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6"/>
              
              <!-- Centromere -->
              <ellipse cx="130" cy="160" rx="55" ry="12" fill="#7C3AED" opacity="0.08" stroke="#7C3AED" stroke-width="1.5"/>
              
              <!-- Telomere caps - top -->
              <rect x="82" y="18" width="36" height="14" rx="7" fill="url(#telo-cap)" opacity="0.85">
                <animate attributeName="opacity" values="0.85;1;0.85" dur="3s" repeatCount="indefinite"/>
              </rect>
              <rect x="142" y="18" width="36" height="14" rx="7" fill="url(#telo-cap)" opacity="0.85">
                <animate attributeName="opacity" values="0.85;1;0.85" dur="3s" repeatCount="indefinite" begin="0.5s"/>
              </rect>
              
              <!-- Telomere caps - bottom -->
              <rect x="82" y="282" width="36" height="14" rx="7" fill="#F43F5E" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.9;0.7" dur="3s" repeatCount="indefinite" begin="1s"/>
              </rect>
              <rect x="142" y="282" width="36" height="14" rx="7" fill="#F43F5E" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.9;0.7" dur="3s" repeatCount="indefinite" begin="1.5s"/>
              </rect>
              
              <!-- Banding pattern -->
              {#each [55, 75, 95, 185, 210, 235, 260] as y}
                <line x1="88" y1={y} x2="110" y2={y} stroke="#7C3AED" stroke-width="2" opacity="0.15" stroke-linecap="round"/>
                <line x1="150" y1={y} x2="172" y2={y} stroke="#7C3AED" stroke-width="2" opacity="0.15" stroke-linecap="round"/>
              {/each}
              
              <!-- Annotation line -->
              <line x1="45" y1="25" x2="78" y2="25" stroke="#3B82F6" stroke-width="1" stroke-dasharray="3 2" opacity="0.5"/>
              <text x="5" y="22" fill="#3B82F6" font-size="9" font-weight="600" font-family="Inter" opacity="0.8">Telomere</text>
              <text x="5" y="32" fill="#94A3B8" font-size="7" font-family="Inter">TTAGGG repeats</text>
            </svg>
          </div>
        </div>
      </div>
      <div class="order-1 md:order-2">
        <h2 class="text-3xl font-bold mb-4">Why "Telomere"?</h2>
        <p class="text-text-secondary mb-4">Telomeres are the protective caps on the ends of your chromosomes — repetitive TTAGGG sequences that prevent DNA degradation during cell division.</p>
        <p class="text-text-secondary mb-4">They shorten with each division, making them one of the most studied biomarkers of biological aging.</p>
        <p class="text-text-secondary">The name reflects our focus: <strong class="text-text-primary">understanding longevity and health through genetics</strong> — not ancestry party tricks.</p>
      </div>
    </div>
  </div>
</section>

<!-- Privacy -->
<section class="py-20 relative overflow-hidden">
  <div class="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full bg-[#10B981] opacity-[0.06] blur-[130px] animate-blob animation-delay-2000"></div>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-2 gap-16 items-center">
      <div>
        <h2 class="text-3xl font-bold mb-4">Privacy by Architecture</h2>
        <p class="text-text-secondary mb-6">This isn't a promise — it's how the software works. Telomere.ai is a desktop app. Your genetic data never touches a network.</p>
        <div class="space-y-5">
          {#each [
            { title: 'No servers', desc: 'Zero network requests during analysis', color: 'bg-blue-50 text-accent-blue' },
            { title: 'No accounts', desc: 'Download, install, use. That\'s it.', color: 'bg-emerald-50 text-accent-green' },
            { title: 'No tracking', desc: 'No analytics, no telemetry, no cookies', color: 'bg-violet-50 text-accent-violet' },
            { title: 'Fully auditable', desc: 'Every line of code on GitHub', color: 'bg-amber-50 text-accent-amber' }
          ] as item}
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl {item.color} flex items-center justify-center shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <p class="font-semibold text-text-primary">{item.title}</p>
                <p class="text-text-secondary text-sm">{item.desc}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <!-- Illustration: Privacy architecture diagram -->
      <div class="flex justify-center">
        <div class="relative w-full max-w-[340px]">
          <div class="rounded-2xl bg-white border border-black/[0.08] shadow-lg p-6">
            <!-- Your computer box -->
            <div class="rounded-xl border-2 border-dashed border-accent-blue/30 bg-blue-50/50 p-5">
              <p class="text-[10px] font-semibold text-accent-blue uppercase tracking-wider mb-4">Your Computer</p>
              
              <!-- File icon -->
              <div class="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm border border-black/[0.04] mb-3">
                <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <div>
                  <p class="text-xs font-medium text-text-primary">genome_data.txt</p>
                  <p class="text-[10px] text-text-tertiary">23andMe raw data</p>
                </div>
              </div>
              
              <!-- Arrow down -->
              <div class="flex justify-center my-2">
                <svg class="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
              </div>
              
              <!-- Telomere engine -->
              <div class="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm border border-black/[0.04] mb-3">
                <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg class="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <p class="text-xs font-medium text-text-primary">Telomere.ai Engine</p>
                  <p class="text-[10px] text-text-tertiary">Local analysis · Rust + Tauri</p>
                </div>
              </div>
              
              <!-- Arrow down -->
              <div class="flex justify-center my-2">
                <svg class="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
              </div>
              
              <!-- Results -->
              <div class="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm border border-black/[0.04]">
                <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <svg class="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p class="text-xs font-medium text-text-primary">Your Reports</p>
                  <p class="text-[10px] text-text-tertiary">Health · Longevity · Pharma · More</p>
                </div>
              </div>
            </div>
            
            <!-- Blocked cloud section -->
            <div class="mt-4 rounded-xl bg-red-50/50 border border-red-200/30 p-4 flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
              </div>
              <div>
                <p class="text-xs font-medium text-red-600">No cloud. No servers. Ever.</p>
                <p class="text-[10px] text-red-400">Data never leaves your machine</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Database -->
<section class="py-20 bg-bg-secondary relative overflow-hidden">
  <div class="absolute -bottom-20 left-0 w-[500px] h-[500px] rounded-full bg-[#10B981] opacity-[0.06] blur-[140px] animate-blob"></div>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold mb-4">Our Database</h2>
      <p class="text-text-secondary max-w-2xl mx-auto">Curated from peer-reviewed sources. Every SNP entry includes PubMed references so you can verify the science yourself.</p>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each [
        { source: 'ClinVar', desc: 'NCBI clinical variant database', color: '#3B82F6', bg: 'bg-blue-50' },
        { source: 'PharmGKB', desc: 'Pharmacogenomics knowledge base', color: '#7C3AED', bg: 'bg-violet-50' },
        { source: 'GWAS Catalog', desc: 'Genome-wide association studies', color: '#F43F5E', bg: 'bg-rose-50' },
        { source: 'SNPedia', desc: 'Community SNP encyclopedia', color: '#F59E0B', bg: 'bg-amber-50' }
      ] as item}
        <div class="card text-center group">
          <div class="w-14 h-14 rounded-2xl {item.bg} mx-auto mb-4 flex items-center justify-center shadow-sm">
            <svg class="w-7 h-7" style="color: {item.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          </div>
          <p class="font-semibold text-text-primary">{item.source}</p>
          <p class="text-text-secondary text-sm mt-1">{item.desc}</p>
        </div>
      {/each}
    </div>
    <div class="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
      {#each [
        { value: '257+', label: 'Curated SNPs' },
        { value: '6', label: 'Report Categories' },
        { value: '4', label: 'File Formats' },
        { value: '100%', label: 'Open Source' }
      ] as stat}
        <div>
          <p class="text-3xl font-bold gradient-text">{stat.value}</p>
          <p class="text-text-secondary text-sm mt-1">{stat.label}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Transparency -->
<section class="py-20">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="card border-accent-blue/15 bg-blue-50/30">
      <div class="flex flex-col md:flex-row items-start gap-6 p-3">
        <div class="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-text-primary mb-2">Full Transparency</h2>
          <p class="text-text-secondary">Telomere.ai shows you everything — no results hidden, no paywalls, no gatekeeping. You already have your genome file; we just make it readable. All findings include their research basis so you can verify independently.</p>
          <p class="text-text-tertiary text-sm mt-3">Legal note: This software is not a medical device and does not provide diagnoses.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Built By -->
<section class="py-20 bg-bg-secondary">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="text-3xl font-bold mb-4">Built by Vaionex</h2>
    <p class="text-text-secondary max-w-2xl mx-auto mb-8">A technology company building tools that make complex data accessible to everyone.</p>
    <a href="https://vaionex.com" target="_blank" rel="noopener" class="btn-primary">
      Learn more about Vaionex
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
    </a>
  </div>
</section>
