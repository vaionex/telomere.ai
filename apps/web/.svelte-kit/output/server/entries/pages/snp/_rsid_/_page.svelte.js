import { h as head, e as escape_html, c as attr_class, s as stringify, i as store_get, a as ensure_array_like, b as attr_style, d as attr, j as unsubscribe_stores, f as derived } from "../../../../chunks/index.js";
import { p as page } from "../../../../chunks/stores.js";
import { l as lookupSnp } from "../../../../chunks/index3.js";
import { i as isLoaded, r as rawSnps } from "../../../../chunks/genetic-data.js";
import { R as RiskGauge } from "../../../../chunks/RiskGauge.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const rsid = derived(() => store_get($$store_subs ??= {}, "$page", page).params.rsid);
    const snp = derived(() => lookupSnp(rsid()));
    const userData = derived(() => store_get($$store_subs ??= {}, "$rawSnps", rawSnps).get(rsid()));
    const userGenotype = derived(() => userData() ? userData().genotype || userData().allele1 + userData().allele2 : null);
    function getRiskLevel(snpInfo, genotype) {
      if (!snpInfo || !genotype) return null;
      const alleles = genotype.split("");
      const riskCount = alleles.filter((a) => a === snpInfo.riskAllele).length;
      if (riskCount === 2) return { level: "high", percent: 85 };
      if (riskCount === 1) return { level: "moderate", percent: 55 };
      return { level: "low", percent: 20 };
    }
    const risk = derived(() => getRiskLevel(snp(), userGenotype()));
    head("i654yz", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(rsid())} — ${escape_html(snp()?.gene || "SNP")} — Telomere AI</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24"><a href="/explore" class="text-text-tertiary hover:text-text-secondary text-sm mb-6 inline-block">← Back to Explorer</a> `);
    if (!snp()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="card text-center py-12"><h1 class="text-2xl font-bold mb-2">SNP Not Found</h1> <p class="text-text-tertiary mb-4"><span class="font-mono">${escape_html(rsid())}</span> is not in our curated database.</p> <a href="/explore" class="btn-primary">Browse SNPs</a></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="card glow-border mb-6"><div class="flex items-start justify-between gap-4"><div><div class="flex items-center gap-3 mb-1"><h1 class="text-2xl font-mono font-bold text-accent-cyan">${escape_html(snp().rsid)}</h1> <span class="px-2 py-0.5 rounded-full text-xs glass text-text-secondary">${escape_html(snp().significance)}</span></div> <p class="text-lg font-semibold mb-1">${escape_html(snp().gene)} — ${escape_html(snp().trait)}</p> <p class="text-text-tertiary text-sm">Chromosome ${escape_html(snp().chromosome)} • Position ${escape_html(snp().position.toLocaleString())}</p></div> `);
      if (risk()) {
        $$renderer2.push("<!--[-->");
        RiskGauge($$renderer2, { percent: risk().percent, size: 80, label: risk().level });
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div> `);
      if (userGenotype()) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="card mb-6"><h2 class="font-semibold mb-3">Your Genotype</h2> <div class="flex items-center gap-4"><span class="text-4xl font-mono font-bold gradient-text">${escape_html(userGenotype())}</span> <div><p${attr_class(`text-sm ${stringify(risk()?.level === "high" ? "text-accent-red" : risk()?.level === "moderate" ? "text-accent-amber" : "text-accent-green")}`)}>${escape_html(risk()?.level === "high" ? snp().riskDescription : risk()?.level === "moderate" ? snp().heterozygousDescription : snp().normalDescription)}</p></div></div></div>`);
      } else if (store_get($$store_subs ??= {}, "$isLoaded", isLoaded)) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div class="card mb-6 text-center"><p class="text-text-tertiary text-sm">This SNP was not found in your genetic data.</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="grid gap-6"><div class="card"><h2 class="font-semibold mb-3">Allele Information</h2> <div class="grid grid-cols-2 gap-4 text-sm"><div><span class="text-text-tertiary">Risk Allele</span> <p class="font-mono text-lg text-accent-red font-bold">${escape_html(snp().riskAllele)}</p></div> <div><span class="text-text-tertiary">Normal Allele</span> <p class="font-mono text-lg text-accent-green font-bold">${escape_html(snp().normalAllele)}</p></div></div></div> <div class="card"><h2 class="font-semibold mb-3">Population Frequency</h2> <div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(Object.entries(snp().populationFrequency));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let [genotype, freq] = each_array[$$index];
        const pct = Math.round(freq * 100);
        const isUser = userGenotype() === genotype;
        $$renderer2.push(`<div class="flex items-center gap-3"><span${attr_class(`font-mono text-sm w-8 ${stringify(isUser ? "text-accent-cyan font-bold" : "text-text-secondary")}`)}>${escape_html(genotype)}</span> <div class="flex-1 h-3 bg-white/5 rounded-full overflow-hidden"><div${attr_class(`h-full rounded-full transition-all duration-700 ${stringify(isUser ? "bg-gradient-to-r from-accent-cyan to-accent-blue" : "bg-white/10")}`)}${attr_style(`width: ${stringify(pct)}%`)}></div></div> <span class="text-sm text-text-secondary w-12 text-right">${escape_html(pct)}%</span> `);
        if (isUser) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="text-xs text-accent-cyan">You</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div></div> `);
      if (snp().conditions?.length) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="card"><h2 class="font-semibold mb-3">Associated Conditions</h2> <ul class="space-y-2"><!--[-->`);
        const each_array_1 = ensure_array_like(snp().conditions);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let condition = each_array_1[$$index_1];
          $$renderer2.push(`<li class="flex items-center gap-2 text-sm text-text-secondary"><span class="w-1.5 h-1.5 rounded-full bg-accent-cyan flex-shrink-0"></span> ${escape_html(condition)}</li>`);
        }
        $$renderer2.push(`<!--]--></ul></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (snp().recommendations?.length) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="card"><h2 class="font-semibold mb-3">Recommendations</h2> <ul class="space-y-2"><!--[-->`);
        const each_array_2 = ensure_array_like(snp().recommendations);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let rec = each_array_2[$$index_2];
          $$renderer2.push(`<li class="flex items-start gap-2 text-sm text-text-secondary"><span class="text-accent-green mt-0.5">✓</span> ${escape_html(rec)}</li>`);
        }
        $$renderer2.push(`<!--]--></ul></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="card"><h2 class="font-semibold mb-3">Categories</h2> <div class="flex gap-2 flex-wrap"><!--[-->`);
      const each_array_3 = ensure_array_like(snp().categories);
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let cat = each_array_3[$$index_3];
        $$renderer2.push(`<a${attr("href", `/explore?category=${stringify(cat)}`)} class="px-3 py-1.5 rounded-full glass text-sm text-text-secondary hover:text-accent-cyan transition-colors">${escape_html(cat)}</a>`);
      }
      $$renderer2.push(`<!--]--></div></div> `);
      if (snp().references?.length) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="card"><h2 class="font-semibold mb-3">References</h2> <div class="space-y-1"><!--[-->`);
        const each_array_4 = ensure_array_like(snp().references);
        for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
          let ref = each_array_4[$$index_4];
          if (ref.startsWith("PMID:")) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<a${attr("href", `https://pubmed.ncbi.nlm.nih.gov/${stringify(ref.replace("PMID:", ""))}`)} target="_blank" rel="noopener" class="block text-sm text-accent-blue hover:underline font-mono">${escape_html(ref)}</a>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<span class="block text-sm text-text-secondary font-mono">${escape_html(ref)}</span>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
