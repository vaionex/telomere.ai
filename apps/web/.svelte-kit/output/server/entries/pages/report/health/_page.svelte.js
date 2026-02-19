import { h as head, i as store_get, e as escape_html, j as unsubscribe_stores, f as derived } from "../../../../chunks/index.js";
import { r as reportsByCategory } from "../../../../chunks/SnpCard.js";
import { i as isLoaded } from "../../../../chunks/genetic-data.js";
import { R as ReportSection } from "../../../../chunks/ReportSection.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const findings = derived(() => store_get($$store_subs ??= {}, "$reportsByCategory", reportsByCategory)["health"] || []);
    head("16nj6ia", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Health Risks Report — Telomere AI</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24"><div class="mb-8"><a href="/dashboard" class="text-text-tertiary hover:text-text-secondary text-sm mb-4 inline-block">← Back to Dashboard</a> <div class="flex items-center gap-3 mb-2"><span class="text-3xl">🏥</span> <h1 class="text-3xl font-bold">Health Risks</h1></div> <p class="text-text-secondary">Cardiovascular, cancer, diabetes, thrombophilia, and other health risk factors identified in your genetic data.</p></div> `);
    if (!store_get($$store_subs ??= {}, "$isLoaded", isLoaded)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="card text-center py-12"><p class="text-text-tertiary mb-4">No genetic data loaded.</p> <a href="/upload" class="btn-primary">Open File</a></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="space-y-4 mb-8"><div class="grid grid-cols-3 gap-4"><div class="card text-center"><div class="text-2xl font-bold text-accent-red">${escape_html(findings().filter((f) => f.riskLevel === "high").length)}</div> <div class="text-xs text-text-tertiary">High Risk</div></div> <div class="card text-center"><div class="text-2xl font-bold text-accent-amber">${escape_html(findings().filter((f) => f.riskLevel === "moderate").length)}</div> <div class="text-xs text-text-tertiary">Moderate</div></div> <div class="card text-center"><div class="text-2xl font-bold text-accent-green">${escape_html(findings().filter((f) => f.riskLevel === "low").length)}</div> <div class="text-xs text-text-tertiary">Low Risk</div></div></div></div> `);
      ReportSection($$renderer2, {
        title: "Health Risk Findings",
        description: "SNPs associated with disease risk and health conditions",
        icon: "🏥",
        snps: findings()
      });
      $$renderer2.push(`<!----> <div class="mt-8 card bg-accent-amber/5 border-accent-amber/20"><p class="text-sm text-text-secondary"><strong class="text-accent-amber">⚠️ Important:</strong> These results are for informational purposes only. Having a risk allele does not mean you will develop a condition. Always consult with a healthcare provider or genetic counselor for medical advice.</p></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
