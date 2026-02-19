import { a as ensure_array_like, d as attr, b as attr_style, c as attr_class, e as escape_html, s as stringify, h as head, i as store_get, j as unsubscribe_stores, f as derived } from "../../../chunks/index.js";
import { r as rawSnps, i as isLoaded, f as fileMetadata } from "../../../chunks/genetic-data.js";
import { c as categoryMeta, S as SnpCard, r as reportsByCategory, t as topFindings, m as matchedSnps } from "../../../chunks/SnpCard.js";
function ChromosomeMap($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { chromosomes = /* @__PURE__ */ new Set() } = $$props;
    const chrList = [...Array(22).keys()].map((i) => String(i + 1)).concat(["X", "Y"]);
    const sizes = [
      249,
      243,
      198,
      191,
      182,
      171,
      159,
      145,
      138,
      134,
      135,
      133,
      114,
      107,
      102,
      90,
      83,
      80,
      59,
      64,
      47,
      51,
      156,
      57
    ];
    $$renderer2.push(`<div class="flex flex-wrap gap-2 items-end justify-center"><!--[-->`);
    const each_array = ensure_array_like(chrList);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let chr = each_array[i];
      const active = chromosomes.has(chr);
      const h = Math.max(20, sizes[i] / 249 * 60);
      $$renderer2.push(`<div class="flex flex-col items-center gap-1 group cursor-default"${attr("title", `Chromosome ${stringify(chr)}`)}><div class="w-3 rounded-full transition-all duration-200"${attr_style(`height: ${stringify(h)}px; background: ${stringify(active ? "linear-gradient(to top, #00E5CC, #3B82F6)" : "rgba(255,255,255,0.08)")}; box-shadow: ${stringify(active ? "0 0 8px rgba(0,229,204,0.4)" : "none")}`)}></div> <span${attr_class(`text-[10px] font-mono ${stringify(active ? "text-accent-cyan" : "text-text-tertiary")}`)}>${escape_html(chr)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const chromosomes = derived(() => new Set([
      ...store_get($$store_subs ??= {}, "$rawSnps", rawSnps).values()
    ].map((s) => s.chromosome)));
    const catList = [
      "health",
      "longevity",
      "nutrition",
      "pharma",
      "traits",
      "carrier"
    ];
    head("x1i5gj", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard — Telomere AI</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">`);
    if (!store_get($$store_subs ??= {}, "$isLoaded", isLoaded)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-24"><span class="text-5xl mb-4 block">🧬</span> <h1 class="text-3xl font-bold mb-4">No Genetic Data Loaded</h1> <p class="text-text-secondary mb-8">Upload your raw genetic data to see your personalized dashboard.</p> <a href="/upload" class="btn-primary">Upload DNA Data</a></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="mb-8"><h1 class="text-3xl font-bold mb-2">Your Genetic <span class="gradient-text">Dashboard</span></h1> `);
      if (store_get($$store_subs ??= {}, "$fileMetadata", fileMetadata)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-text-secondary text-sm"><span class="font-mono text-accent-cyan">${escape_html(store_get($$store_subs ??= {}, "$fileMetadata", fileMetadata).totalSnps.toLocaleString())}</span> SNPs from <span class="font-mono">${escape_html(store_get($$store_subs ??= {}, "$fileMetadata", fileMetadata).fileName)}</span> (${escape_html(store_get($$store_subs ??= {}, "$fileMetadata", fileMetadata).format)}) • Build ${escape_html(store_get($$store_subs ??= {}, "$fileMetadata", fileMetadata).buildVersion)}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"><div class="card text-center"><div class="text-2xl font-bold gradient-text">${escape_html(store_get($$store_subs ??= {}, "$rawSnps", rawSnps).size.toLocaleString())}</div> <div class="text-text-tertiary text-xs">Total SNPs</div></div> <div class="card text-center"><div class="text-2xl font-bold gradient-text">${escape_html(store_get($$store_subs ??= {}, "$matchedSnps", matchedSnps).length)}</div> <div class="text-text-tertiary text-xs">Matched Markers</div></div> <div class="card text-center"><div class="text-2xl font-bold gradient-text">${escape_html(chromosomes().size)}</div> <div class="text-text-tertiary text-xs">Chromosomes</div></div> <div class="card text-center"><div class="text-2xl font-bold gradient-text">${escape_html(Math.round(store_get($$store_subs ??= {}, "$matchedSnps", matchedSnps).length / 100 * 100))}%</div> <div class="text-text-tertiary text-xs">Database Coverage</div></div></div> <div class="card mb-8"><h2 class="font-semibold mb-4">Chromosome Coverage</h2> `);
      ChromosomeMap($$renderer2, { chromosomes: chromosomes() });
      $$renderer2.push(`<!----></div> <h2 class="text-xl font-bold mb-4">Reports</h2> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"><!--[-->`);
      const each_array = ensure_array_like(catList);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cat = each_array[$$index];
        const meta = categoryMeta[cat];
        const findings = store_get($$store_subs ??= {}, "$reportsByCategory", reportsByCategory)[cat] || [];
        const highRisk = findings.filter((f) => f.riskLevel === "high").length;
        $$renderer2.push(`<a${attr("href", `/report/${stringify(cat)}`)} class="card group flex items-start gap-4"><span class="text-3xl">${escape_html(meta.icon)}</span> <div class="flex-1"><h3 class="font-semibold group-hover:text-accent-cyan transition-colors">${escape_html(meta.title)}</h3> <p class="text-text-tertiary text-xs mt-1">${escape_html(findings.length)} findings</p> `);
        if (highRisk > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-accent-red/10 text-accent-red">${escape_html(highRisk)} high risk</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div> <svg class="w-4 h-4 text-text-tertiary group-hover:text-accent-cyan group-hover:translate-x-1 transition-all mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (store_get($$store_subs ??= {}, "$topFindings", topFindings).length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<h2 class="text-xl font-bold mb-4">Top Findings</h2> <div class="space-y-3"><!--[-->`);
        const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$topFindings", topFindings));
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let snp = each_array_1[$$index_1];
          SnpCard($$renderer2, { snp });
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
