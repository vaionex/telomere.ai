<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  const categoryColors = {
    'Genetics 101': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: '#3B82F6' },
    'Pharmacogenomics': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', accent: '#7C3AED' },
    'Nutrigenomics': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: '#10B981' },
    'Longevity': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', accent: '#F59E0B' },
    'Privacy': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', accent: '#F43F5E' },
    'Guides': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', accent: '#0EA5E9' },
  };

  let articles = $state({});
  let loaded = $state(false);

  onMount(async () => {
    const mod = await import('$lib/data/blog-articles.js');
    articles = mod.articles;
    loaded = true;
  });

  const slug = $derived($page.params.slug);
  const article = $derived(articles[slug]);
  const colors = $derived(article ? categoryColors[article.category] : null);

  const relatedArticles = $derived(
    article?.relatedSlugs
      ?.map(s => articles[s] ? { slug: s, ...articles[s] } : null)
      .filter(Boolean) ?? []
  );
</script>

<svelte:head>
  {#if article}
    <title>{article.title} — Telomere.ai Blog</title>
    <meta name="description" content={article.description} />
    <meta property="og:title" content={article.title} />
    <meta property="og:description" content={article.description} />
    <meta property="og:type" content="article" />
  {:else}
    <title>Article Not Found — Telomere.ai</title>
  {/if}
</svelte:head>

<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
  <a href="/blog" class="inline-flex items-center gap-1.5 text-text-tertiary hover:text-accent-blue text-sm mb-8 transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
    Back to Blog
  </a>

  {#if article}
    <article>
      <!-- Meta -->
      <div class="flex flex-wrap items-center gap-3 mb-5">
        {#if colors}
          <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium {colors.bg} {colors.text}">
            {article.category}
          </span>
        {/if}
        <span class="text-xs text-text-tertiary">{article.date}</span>
        <span class="text-xs text-text-tertiary">{article.readTime}</span>
      </div>

      <!-- Title -->
      <h1 class="text-3xl sm:text-4xl font-bold text-text-primary mb-10 leading-tight">{article.title}</h1>

      <!-- Content -->
      <div class="prose-custom">
        {#each article.content as block}
          {#if block.type === 'h2'}
            <h2 class="text-2xl font-bold text-text-primary mt-10 mb-4">{block.text}</h2>
          {:else if block.type === 'h3'}
            <h3 class="text-xl font-semibold text-text-primary mt-8 mb-3">{block.text}</h3>
          {:else if block.type === 'list'}
            <ul class="list-disc pl-6 space-y-2 text-text-secondary mb-4">
              {#each block.items as item}
                <li class="leading-relaxed">{item}</li>
              {/each}
            </ul>
          {:else if block.type === 'callout'}
            <div class="rounded-xl bg-blue-50/50 border border-blue-100 p-5 my-6 text-text-secondary leading-relaxed whitespace-pre-line">{block.text}</div>
          {:else if block.html}
            <p class="text-text-secondary mb-4 leading-relaxed">{@html block.text}</p>
          {:else}
            <p class="text-text-secondary mb-4 leading-relaxed">{block.text}</p>
          {/if}
        {/each}
      </div>
    </article>

    <!-- Related Articles -->
    {#if relatedArticles.length > 0}
      <div class="mt-16 pt-10 border-t border-black/5">
        <h2 class="text-xl font-bold text-text-primary mb-6">Related Articles</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each relatedArticles as related}
            <a href="/blog/{related.slug}" class="card border border-black/5 hover:shadow-md transition-shadow group">
              <div class="flex items-center gap-2 mb-2">
                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium {categoryColors[related.category]?.bg ?? 'bg-blue-50'} {categoryColors[related.category]?.text ?? 'text-blue-700'}">
                  {related.category}
                </span>
                <span class="text-xs text-text-tertiary">{related.readTime}</span>
              </div>
              <h3 class="text-sm font-semibold text-text-primary group-hover:text-accent-blue transition-colors leading-snug">{related.title}</h3>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  {:else}
    <div class="card text-center py-16">
      <h1 class="text-2xl font-bold text-text-primary mb-3">Article Not Found</h1>
      <p class="text-text-secondary mb-6">The article you're looking for doesn't exist or has been moved.</p>
      <a href="/blog" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-blue text-white font-medium text-sm hover:opacity-90 transition-opacity">Back to Blog</a>
    </div>
  {/if}
</div>
