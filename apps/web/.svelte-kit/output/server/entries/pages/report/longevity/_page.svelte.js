import { h as head, i as store_get, j as unsubscribe_stores, f as derived } from "../../../../chunks/index.js";
import { r as reportsByCategory } from "../../../../chunks/SnpCard.js";
import { i as isLoaded } from "../../../../chunks/genetic-data.js";
import { R as ReportSection } from "../../../../chunks/ReportSection.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const findings = derived(() => store_get($$store_subs ??= {}, "$reportsByCategory", reportsByCategory)["longevity"] || []);
    head("1dchz37", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Longevity &amp; Aging Report — Telomere AI</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24"><div class="mb-8"><a href="/dashboard" class="text-text-tertiary hover:text-text-secondary text-sm mb-4 inline-block">← Back to Dashboard</a> <div class="flex items-center gap-3 mb-2"><span class="text-3xl">🧬</span> <h1 class="text-3xl font-bold">Longevity &amp; Aging</h1></div> <p class="text-text-secondary">Telomere length variants, FOXO3 longevity gene, APOE status, sirtuins, oxidative stress defense, and other aging-related markers.</p></div> `);
    if (!store_get($$store_subs ??= {}, "$isLoaded", isLoaded)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="card text-center py-12"><p class="text-text-tertiary mb-4">No genetic data loaded.</p> <a href="/upload" class="btn-primary">Open File</a></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="card mb-8 p-6 glow-border"><h3 class="font-semibold mb-2 gradient-text">About Longevity Genetics</h3> <p class="text-text-secondary text-sm">Longevity is highly polygenic — influenced by hundreds of genetic variants plus lifestyle. Key pathways include telomere maintenance (TERT, TERC), stress resistance (FOXO3), lipoprotein metabolism (APOE, CETP), inflammation (IL-6, TNF-α), and cellular repair (SIRT1, SOD2). Your genetic variants in these pathways interact with diet, exercise, sleep, and stress management.</p></div> `);
      ReportSection($$renderer2, {
        title: "Longevity Findings",
        description: "Variants associated with biological aging and lifespan",
        icon: "🧬",
        snps: findings()
      });
      $$renderer2.push(`<!---->`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
