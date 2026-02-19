import { h as head, i as store_get, j as unsubscribe_stores, f as derived } from "../../../../chunks/index.js";
import { r as reportsByCategory } from "../../../../chunks/SnpCard.js";
import { i as isLoaded } from "../../../../chunks/genetic-data.js";
import { R as ReportSection } from "../../../../chunks/ReportSection.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const findings = derived(() => store_get($$store_subs ??= {}, "$reportsByCategory", reportsByCategory)["carrier"] || []);
    head("tmjfda", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Carrier Status Report — Telomere AI</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24"><div class="mb-8"><a href="/dashboard" class="text-text-tertiary hover:text-text-secondary text-sm mb-4 inline-block">← Back to Dashboard</a> <div class="flex items-center gap-3 mb-2"><span class="text-3xl">🧪</span> <h1 class="text-3xl font-bold">Carrier Status</h1></div> <p class="text-text-secondary">Recessive condition carrier screening for cystic fibrosis, sickle cell disease, Tay-Sachs, hearing loss, PKU, SMA, and other conditions relevant to family planning.</p></div> `);
    if (!store_get($$store_subs ??= {}, "$isLoaded", isLoaded)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="card text-center py-12"><p class="text-text-tertiary mb-4">No genetic data loaded.</p> <a href="/upload" class="btn-primary">Open File</a></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="card mb-8 bg-accent-amber/5 border-accent-amber/20"><p class="text-sm text-text-secondary"><strong class="text-accent-amber">🧬 Family Planning Note:</strong> Being a carrier of a recessive condition typically means you are unaffected but could pass the variant to your children. If both parents carry the same recessive mutation, each child has a 25% chance of being affected. Genetic counseling is recommended if carrier status is identified.</p></div> `);
      ReportSection($$renderer2, {
        title: "Carrier Status Findings",
        description: "Recessive condition carrier variants",
        icon: "🧪",
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
