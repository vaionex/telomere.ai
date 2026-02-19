import { e as escape_html, a as ensure_array_like } from "./index.js";
import { S as SnpCard } from "./SnpCard.js";
function ReportSection($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      title = "",
      description = "",
      icon = "",
      snps = [],
      color = "accent-cyan"
    } = $$props;
    $$renderer2.push(`<section class="space-y-6"><div class="flex items-center gap-3">`);
    if (icon) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="text-2xl">${escape_html(icon)}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div><h2 class="text-xl font-bold">${escape_html(title)}</h2> `);
    if (description) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-text-secondary text-sm">${escape_html(description)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (snps.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(snps);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let snp = each_array[$$index];
        SnpCard($$renderer2, { snp });
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="card text-center py-8"><p class="text-text-tertiary">No matching SNPs found in your data for this category.</p> <p class="text-text-tertiary text-sm mt-1">Upload your genetic data to see results.</p></div>`);
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
export {
  ReportSection as R
};
