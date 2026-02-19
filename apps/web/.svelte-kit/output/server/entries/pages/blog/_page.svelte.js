import { h as head, a as ensure_array_like, d as attr, s as stringify, e as escape_html } from "../../../chunks/index.js";
function _page($$renderer) {
  const posts = [
    {
      slug: "understanding-snps",
      title: "Understanding SNPs: The Building Blocks of Genetic Variation",
      date: "February 15, 2026",
      excerpt: "Single nucleotide polymorphisms (SNPs) are the most common type of genetic variation. Learn how these tiny changes in your DNA can influence everything from disease risk to caffeine metabolism.",
      readTime: "5 min read"
    },
    {
      slug: "mthfr-explained",
      title: "MTHFR C677T: What It Actually Means for Your Health",
      date: "February 10, 2026",
      excerpt: "The MTHFR gene variant is one of the most discussed in nutrigenomics. We break down the science behind methylation, folate metabolism, and what your genotype actually means.",
      readTime: "7 min read"
    },
    {
      slug: "pharmacogenomics-guide",
      title: "A Beginner's Guide to Pharmacogenomics",
      date: "February 5, 2026",
      excerpt: "Why do some people need different drug doses? How can your DNA predict medication side effects? An introduction to the science of pharmacogenomics.",
      readTime: "6 min read"
    }
  ];
  head("u4k2t", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Blog — Telomere AI</title>`);
    });
  });
  $$renderer.push(`<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24"><h1 class="text-4xl font-bold mb-2">Blog</h1> <p class="text-text-secondary mb-12">Insights on genetics, longevity, and personal genomics.</p> <div class="space-y-6"><!--[-->`);
  const each_array = ensure_array_like(posts);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let post = each_array[$$index];
    $$renderer.push(`<a${attr("href", `/blog/${stringify(post.slug)}`)} class="card block group"><div class="flex items-center gap-3 mb-2 text-sm text-text-tertiary"><span>${escape_html(post.date)}</span> <span>•</span> <span>${escape_html(post.readTime)}</span></div> <h2 class="text-xl font-bold mb-2 group-hover:text-accent-cyan transition-colors">${escape_html(post.title)}</h2> <p class="text-text-secondary text-sm">${escape_html(post.excerpt)}</p></a>`);
  }
  $$renderer.push(`<!--]--></div></div>`);
}
export {
  _page as default
};
