import { h as head, i as store_get, j as unsubscribe_stores, f as derived } from "../../../../chunks/index.js";
import { r as reportsByCategory } from "../../../../chunks/SnpCard.js";
import { i as isLoaded } from "../../../../chunks/genetic-data.js";
import { R as ReportSection } from "../../../../chunks/ReportSection.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const findings = derived(() => store_get($$store_subs ??= {}, "$reportsByCategory", reportsByCategory)["traits"] || []);
    head("rkeox5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Physical Traits Report — Telomere AI</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24"><div class="mb-8"><a href="/dashboard" class="text-text-tertiary hover:text-text-secondary text-sm mb-4 inline-block">← Back to Dashboard</a> <div class="flex items-center gap-3 mb-2"><span class="text-3xl">👤</span> <h1 class="text-3xl font-bold">Physical Traits</h1></div> <p class="text-text-secondary">Eye color, hair color, muscle fiber type, sleep chronotype, taste perception, empathy, and other genetically-influenced traits.</p></div> `);
    if (!store_get($$store_subs ??= {}, "$isLoaded", isLoaded)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="card text-center py-12"><p class="text-text-tertiary mb-4">No genetic data loaded.</p> <a href="/upload" class="btn-primary">Open File</a></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      ReportSection($$renderer2, {
        title: "Trait Findings",
        description: "Variants associated with physical and behavioral traits",
        icon: "👤",
        snps: findings()
      });
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
