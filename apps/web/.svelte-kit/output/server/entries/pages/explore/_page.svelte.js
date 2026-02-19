import { h as head, e as escape_html, d as attr, a as ensure_array_like, i as store_get, c as attr_class, s as stringify, j as unsubscribe_stores, f as derived } from "../../../chunks/index.js";
import { g as getCategories, a as getAllSnps, s as searchSnps, m as matchSnps } from "../../../chunks/index3.js";
import { i as isLoaded, r as rawSnps } from "../../../chunks/genetic-data.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let query = "";
    let selectedCategory = "all";
    let selectedChromosome = "all";
    const allSnps = getAllSnps();
    const categories = ["all", ...getCategories()];
    const chromosomes = [
      "all",
      ...[...new Set(allSnps.map((s) => s.chromosome))].sort((a, b) => {
        const na = parseInt(a), nb = parseInt(b);
        if (!isNaN(na) && !isNaN(nb)) return na - nb;
        if (!isNaN(na)) return -1;
        if (!isNaN(nb)) return 1;
        return a.localeCompare(b);
      })
    ];
    const matched = derived(() => store_get($$store_subs ??= {}, "$isLoaded", isLoaded) ? matchSnps(store_get($$store_subs ??= {}, "$rawSnps", rawSnps)) : []);
    const matchedMap = derived(() => new Map(matched().map((s) => [s.rsid, s])));
    const filtered = derived(() => () => {
      let results = query.length > 1 ? searchSnps(query) : allSnps;
      return results;
    });
    head("1w567vk", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>SNP Explorer — Telomere AI</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"><div class="mb-8"><h1 class="text-3xl font-bold mb-2">SNP <span class="gradient-text">Explorer</span></h1> <p class="text-text-secondary">Browse and search our curated database of ${escape_html(allSnps.length)} health-relevant SNPs.</p></div> <div class="flex flex-col sm:flex-row gap-4 mb-6"><div class="flex-1 relative"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> <input type="text"${attr("value", query)} placeholder="Search by rsID, gene, or trait..." class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-white/10 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-cyan/50 font-mono text-sm"/></div> `);
    $$renderer2.select(
      {
        value: selectedCategory,
        class: "px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-text-primary text-sm focus:outline-none focus:border-accent-cyan/50"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(categories);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cat = each_array[$$index];
          $$renderer3.option({ value: cat }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1))}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(` `);
    $$renderer2.select(
      {
        value: selectedChromosome,
        class: "px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-text-primary text-sm focus:outline-none focus:border-accent-cyan/50"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(chromosomes);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let chr = each_array_1[$$index_1];
          $$renderer3.option({ value: chr }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(chr === "all" ? "All Chromosomes" : `Chr ${chr}`)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <p class="text-text-tertiary text-sm mb-4">${escape_html(filtered()().length)} SNPs</p> <div class="overflow-x-auto rounded-xl border border-white/10"><table class="w-full text-sm"><thead><tr class="bg-white/[0.03] border-b border-white/10"><th class="text-left py-3 px-4 font-medium text-text-secondary">rsID</th><th class="text-left py-3 px-4 font-medium text-text-secondary">Gene</th><th class="text-left py-3 px-4 font-medium text-text-secondary hidden sm:table-cell">Chr</th><th class="text-left py-3 px-4 font-medium text-text-secondary">Trait</th>`);
    if (store_get($$store_subs ??= {}, "$isLoaded", isLoaded)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<th class="text-center py-3 px-4 font-medium text-text-secondary">Genotype</th> <th class="text-center py-3 px-4 font-medium text-text-secondary">Risk</th>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--><th class="text-left py-3 px-4 font-medium text-text-secondary hidden md:table-cell">Category</th></tr></thead><tbody><!--[-->`);
    const each_array_2 = ensure_array_like(filtered()().slice(0, 100));
    for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
      let snp = each_array_2[$$index_3];
      const m = matchedMap().get(snp.rsid);
      $$renderer2.push(`<tr class="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"><td class="py-3 px-4 font-mono text-accent-cyan text-xs">${escape_html(snp.rsid)}</td><td class="py-3 px-4 font-medium">${escape_html(snp.gene)}</td><td class="py-3 px-4 text-text-tertiary hidden sm:table-cell">${escape_html(snp.chromosome)}</td><td class="py-3 px-4 text-text-secondary text-xs max-w-xs truncate">${escape_html(snp.trait)}</td>`);
      if (store_get($$store_subs ??= {}, "$isLoaded", isLoaded)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<td${attr_class(`py-3 px-4 text-center font-mono font-bold ${stringify(m ? "text-accent-cyan" : "text-text-tertiary")}`)}>${escape_html(m?.userGenotype || "—")}</td> <td class="py-3 px-4 text-center">`);
        if (m) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span${attr_class(`px-2 py-0.5 rounded-full text-xs ${stringify(m.riskLevel === "high" ? "bg-accent-red/10 text-accent-red" : m.riskLevel === "moderate" ? "bg-accent-amber/10 text-accent-amber" : "bg-accent-green/10 text-accent-green")}`)}>${escape_html(m.riskLevel)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<span class="text-text-tertiary">—</span>`);
        }
        $$renderer2.push(`<!--]--></td>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--><td class="py-3 px-4 hidden md:table-cell"><div class="flex gap-1 flex-wrap"><!--[-->`);
      const each_array_3 = ensure_array_like(snp.categories);
      for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
        let cat = each_array_3[$$index_2];
        $$renderer2.push(`<span class="px-2 py-0.5 rounded-full text-xs glass text-text-tertiary">${escape_html(cat)}</span>`);
      }
      $$renderer2.push(`<!--]--></div></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div> `);
    if (filtered()().length > 100) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-text-tertiary text-sm text-center mt-4">Showing first 100 of ${escape_html(filtered()().length)} results. Refine your search to see more.</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
