<script>
  import { page } from '$app/stores';

  let selectedCategory = $state('All');

  const categories = ['All', 'Genetics 101', 'Pharmacogenomics', 'Nutrigenomics', 'Longevity', 'Privacy', 'Guides'];

  const categoryColors = {
    'Genetics 101': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Pharmacogenomics': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    'Nutrigenomics': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Longevity': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Privacy': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    'Guides': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  };

  const articles = [
    {
      slug: 'pharmacogenomics-complete-guide',
      title: 'The Complete Guide to Pharmacogenomics: How Your DNA Affects Drug Response',
      excerpt: 'From CYP2D6 to VKORC1, learn how genetic variants determine whether a medication will work for you, cause side effects, or have no effect at all. A comprehensive look at the science reshaping prescribing.',
      category: 'Pharmacogenomics',
      date: 'February 15, 2026',
      readTime: '12 min read',
    },
    {
      slug: 'understanding-snps',
      title: 'Understanding SNPs: The Building Blocks of Genetic Variation',
      excerpt: 'Single nucleotide polymorphisms are the most common type of genetic variation in humans. Learn what they are, how they are classified, and why they matter for health and disease risk.',
      category: 'Genetics 101',
      date: 'February 12, 2026',
      readTime: '8 min read',
    },
    {
      slug: 'mthfr-explained',
      title: 'MTHFR C677T and A1298C: What Your Variants Actually Mean',
      excerpt: 'MTHFR variants are among the most discussed in consumer genetics. Separate the science from the hype with a detailed look at enzyme function, methylation, and evidence-based supplementation.',
      category: 'Nutrigenomics',
      date: 'February 10, 2026',
      readTime: '10 min read',
    },
    {
      slug: 'apoe-alzheimers-risk',
      title: 'APOE Gene Variants: Understanding Your Alzheimer\'s and Cardiovascular Risk',
      excerpt: 'The APOE gene has three common alleles with dramatically different risk profiles. Understand the e2/e3/e4 system, what each genotype means, and the ethical complexities of knowing your status.',
      category: 'Longevity',
      date: 'February 7, 2026',
      readTime: '9 min read',
    },
    {
      slug: 'brca-genes-explained',
      title: 'BRCA1 and BRCA2: Beyond the Headlines',
      excerpt: 'BRCA genes play a critical role in DNA repair. Learn about pathogenic variants, cancer risk statistics, founder mutations, screening recommendations, and the limitations of consumer testing.',
      category: 'Genetics 101',
      date: 'February 4, 2026',
      readTime: '10 min read',
    },
    {
      slug: 'nutrigenomics-diet-dna',
      title: 'Nutrigenomics: How Your Genes Shape Your Ideal Diet',
      excerpt: 'From lactose tolerance to caffeine metabolism, your DNA influences how you respond to different foods. Explore eight key gene-diet interactions backed by research.',
      category: 'Nutrigenomics',
      date: 'February 1, 2026',
      readTime: '11 min read',
    },
    {
      slug: 'longevity-genes',
      title: 'The Genetics of Longevity: What Centenarian Studies Reveal',
      excerpt: 'Centenarian studies from Okinawa to Sardinia have identified key genes associated with exceptional lifespan. Explore FOXO3, telomere biology, epigenetic clocks, and what you can actually control.',
      category: 'Longevity',
      date: 'January 28, 2026',
      readTime: '9 min read',
    },
    {
      slug: 'carrier-screening-guide',
      title: 'Carrier Screening: What It Means and Why It Matters',
      excerpt: 'Carrier screening identifies individuals who carry one copy of a gene variant associated with recessive conditions. Understand when it matters and what the results mean for family planning.',
      category: 'Guides',
      date: 'January 25, 2026',
      readTime: '8 min read',
    },
    {
      slug: 'privacy-genetic-data',
      title: 'Your Genetic Data: Privacy Risks and How to Protect Yourself',
      excerpt: 'From the limits of GINA to re-identification attacks and data breaches, genetic privacy is more complex than most people realize. Learn the real risks and how to mitigate them.',
      category: 'Privacy',
      date: 'January 22, 2026',
      readTime: '9 min read',
    },
    {
      slug: 'raw-data-formats',
      title: 'Understanding Your Raw Genetic Data: File Formats Explained',
      excerpt: 'A technical guide to 23andMe, AncestryDNA, VCF, and MyHeritage file formats. Understand what is in your raw data file, what is missing, and how to work with it.',
      category: 'Guides',
      date: 'January 19, 2026',
      readTime: '7 min read',
    },
    {
      slug: 'gut-microbiome-genetics',
      title: 'The Gut-Gene Connection: How Your DNA Shapes Your Microbiome',
      excerpt: 'Emerging research reveals genetic variants that influence gut microbiome composition, probiotic response, and digestive health. Discover the intersection of genomics and gut health.',
      category: 'Nutrigenomics',
      date: 'January 16, 2026',
      readTime: '10 min read',
    },
    {
      slug: 'genetic-health-optimization',
      title: 'From Genotype to Action: A Practical Guide to Genetic Health Optimization',
      excerpt: 'Your genetic data is just the starting point. Learn how to translate SNP results into actionable health strategies for supplementation, exercise, diet, and preventive screening.',
      category: 'Guides',
      date: 'January 13, 2026',
      readTime: '11 min read',
    },
    {
      slug: 'probiotics-and-your-genes',
      title: 'Probiotics and Pharmacogenomics: Why the Same Supplement Works Differently for Everyone',
      excerpt: 'From lactobacillus to bifidobacterium, your genetic makeup determines how effectively probiotics colonize your gut and influence your health outcomes.',
      category: 'Nutrigenomics',
      date: 'January 10, 2026',
      readTime: '9 min read',
    },
  ];

  let filteredArticles = $derived(
    selectedCategory === 'All' ? articles : articles.filter(a => a.category === selectedCategory)
  );

  let featuredArticle = $derived(filteredArticles[0]);
  let remainingArticles = $derived(filteredArticles.slice(1));
</script>

<svelte:head>
  <title>Blog — Telomere.ai</title>
  <meta name="description" content="In-depth articles on genetics, pharmacogenomics, nutrigenomics, longevity, and genetic privacy. Evidence-based insights from the Telomere.ai research team." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden pt-32 pb-16">
  <div class="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#3B82F6] opacity-[0.12] blur-[160px] animate-blob"></div>
  <div class="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full bg-[#7C3AED] opacity-[0.08] blur-[140px] animate-blob animation-delay-2000"></div>

  <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-accent-blue mb-6">
      <span class="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
      Research &amp; Insights
    </div>
    <h1 class="text-5xl sm:text-6xl font-bold tracking-tight mb-6">Blog</h1>
    <p class="text-xl text-text-secondary max-w-2xl mx-auto">
      Evidence-based articles on genetics, pharmacogenomics, and longevity research — written for curious minds, not just scientists.
    </p>
  </div>
</section>

<!-- Category Filters -->
<section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
  <div class="flex flex-wrap gap-2 justify-center">
    {#each categories as cat}
      <button
        class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 {selectedCategory === cat ? 'bg-accent-blue text-white shadow-md' : 'bg-white/60 text-text-secondary border border-black/5 hover:bg-white hover:shadow-sm'}"
        onclick={() => selectedCategory = cat}
      >
        {cat}
      </button>
    {/each}
  </div>
</section>

<!-- Articles -->
<section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
  {#if featuredArticle}
    <!-- Featured Article -->
    <a href="/blog/{featuredArticle.slug}" class="block mb-10 group">
      <article class="card relative overflow-hidden border border-black/5">
        <div class="absolute top-0 left-0 w-1 h-full {categoryColors[featuredArticle.category]?.bg ?? 'bg-blue-50'} rounded-l-lg" style="background: {featuredArticle.category === 'Pharmacogenomics' ? '#7C3AED' : featuredArticle.category === 'Genetics 101' ? '#3B82F6' : featuredArticle.category === 'Nutrigenomics' ? '#10B981' : featuredArticle.category === 'Longevity' ? '#F59E0B' : featuredArticle.category === 'Privacy' ? '#F43F5E' : '#0EA5E9'};"></div>
        <div class="pl-6 py-2">
          <div class="flex flex-wrap items-center gap-3 mb-3">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium {categoryColors[featuredArticle.category]?.bg ?? 'bg-blue-50'} {categoryColors[featuredArticle.category]?.text ?? 'text-blue-700'}">
              {featuredArticle.category}
            </span>
            <span class="text-xs text-text-tertiary">{featuredArticle.date}</span>
            <span class="text-xs text-text-tertiary">{featuredArticle.readTime}</span>
            <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-accent-blue/10 text-accent-blue">Featured</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-accent-blue transition-colors">{featuredArticle.title}</h2>
          <p class="text-text-secondary text-base mb-4 max-w-3xl">{featuredArticle.excerpt}</p>
          <span class="text-accent-blue font-medium text-sm">Read more &rarr;</span>
        </div>
      </article>
    </a>
  {/if}

  {#if remainingArticles.length > 0}
    <div class="grid md:grid-cols-2 gap-6">
      {#each remainingArticles as article}
        <a href="/blog/{article.slug}" class="block group">
          <article class="card h-full border border-black/5">
            <div class="flex flex-wrap items-center gap-3 mb-3">
              <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium {categoryColors[article.category]?.bg ?? 'bg-blue-50'} {categoryColors[article.category]?.text ?? 'text-blue-700'}">
                {article.category}
              </span>
              <span class="text-xs text-text-tertiary">{article.date}</span>
              <span class="text-xs text-text-tertiary">{article.readTime}</span>
            </div>
            <h3 class="text-lg font-bold mb-2 group-hover:text-accent-blue transition-colors">{article.title}</h3>
            <p class="text-text-secondary text-sm mb-4">{article.excerpt}</p>
            <span class="text-accent-blue font-medium text-sm">Read more &rarr;</span>
          </article>
        </a>
      {/each}
    </div>
  {/if}

  {#if filteredArticles.length === 0}
    <div class="text-center py-20">
      <p class="text-text-secondary text-lg">No articles found in this category yet.</p>
    </div>
  {/if}
</section>
