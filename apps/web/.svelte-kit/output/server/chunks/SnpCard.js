import { d as derived } from "./index2.js";
import { r as rawSnps } from "./genetic-data.js";
import { m as matchSnps } from "./index3.js";
import { d as attr, s as stringify, c as attr_class, e as escape_html, f as derived$1 } from "./index.js";
import { R as RiskGauge } from "./RiskGauge.js";
const matchedSnps = derived(rawSnps, ($snps) => {
  if ($snps.size === 0) return [];
  return matchSnps($snps);
});
const reportsByCategory = derived(matchedSnps, ($matched) => {
  const cats = {};
  for (const snp of $matched) {
    for (const cat of snp.categories) {
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(snp);
    }
  }
  return cats;
});
const topFindings = derived(matchedSnps, ($matched) => {
  return [...$matched].sort((a, b) => b.riskPercent - a.riskPercent).slice(0, 5);
});
const categoryMeta = {
  health: { title: "Health Risks", icon: "🏥", description: "Cardiovascular, cancer, diabetes, and other health risk factors", color: "accent-red" },
  longevity: { title: "Longevity & Aging", icon: "🧬", description: "Telomere length, biological aging, and longevity-associated variants", color: "accent-cyan" },
  nutrition: { title: "Nutrigenomics", icon: "🥗", description: "How your genes affect nutrient metabolism, dietary needs, and food sensitivities", color: "accent-green" },
  pharma: { title: "Pharmacogenomics", icon: "💊", description: "Drug metabolism and medication response predictions", color: "accent-violet" },
  traits: { title: "Physical Traits", icon: "👤", description: "Eye color, muscle type, sleep patterns, and other genetic traits", color: "accent-blue" },
  carrier: { title: "Carrier Status", icon: "🧪", description: "Recessive condition carrier screening for family planning", color: "accent-amber" }
};
function SnpCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { snp } = $$props;
    const borderColor = derived$1(() => snp.riskLevel === "high" ? "border-l-accent-red" : snp.riskLevel === "moderate" ? "border-l-accent-amber" : "border-l-accent-green");
    const desc = derived$1(() => snp.riskLevel === "high" ? snp.riskDescription : snp.riskLevel === "moderate" ? snp.heterozygousDescription || snp.riskDescription : snp.normalDescription);
    $$renderer2.push(`<a${attr("href", `/snp/${stringify(snp.rsid)}`)}${attr_class(`card border-l-4 ${stringify(borderColor())} flex items-start gap-4 group`)}><div class="flex-1 min-w-0"><div class="flex items-center gap-3 mb-1"><span class="font-mono text-accent-cyan text-sm">${escape_html(snp.rsid)}</span> <span class="text-text-secondary text-sm">${escape_html(snp.gene)}</span> <span${attr_class(`px-2 py-0.5 rounded-full text-xs glass ${stringify(snp.riskLevel === "high" ? "text-accent-red" : snp.riskLevel === "moderate" ? "text-accent-amber" : "text-accent-green")}`)}>${escape_html(snp.riskLevel)}</span></div> <h3 class="font-semibold text-sm mb-1 group-hover:text-accent-cyan transition-colors">${escape_html(snp.trait)}</h3> <p class="text-text-secondary text-xs leading-relaxed">${escape_html(desc())}</p> `);
    if (snp.userGenotype) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mt-2 flex items-center gap-2"><span class="text-xs text-text-tertiary">Your genotype:</span> <span class="font-mono text-sm font-bold text-accent-cyan">${escape_html(snp.userGenotype)}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    RiskGauge($$renderer2, { percent: snp.riskPercent, size: 64 });
    $$renderer2.push(`<!----></a>`);
  });
}
export {
  SnpCard as S,
  categoryMeta as c,
  matchedSnps as m,
  reportsByCategory as r,
  topFindings as t
};
