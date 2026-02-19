import { c as attr_class, e as escape_html, s as stringify, h as head } from "../../../chunks/index.js";
import "../../../chunks/genetic-data.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
function FileUpload($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div${attr_class(`relative rounded-xl border-2 border-dashed transition-all duration-200 p-12 text-center cursor-pointer ${stringify("border-white/10 hover:border-white/20")}`)} role="button" tabindex="0"><input id="file-input" type="file" accept=".txt,.csv,.vcf,.tsv,.zip" class="hidden"/> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="space-y-4"><div class="w-16 h-16 mx-auto rounded-full glass flex items-center justify-center"><svg class="w-8 h-8 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg></div> <div><p class="text-text-primary font-semibold text-lg">${escape_html("Drop your genetic data file here")}</p> <p class="text-text-secondary text-sm mt-1">${escape_html("or click to browse")} • 23andMe, AncestryDNA, MyHeritage, VCF supported</p></div> <div class="flex items-center justify-center gap-4 text-text-tertiary text-xs"><span>🔒 100% local processing</span> <span>•</span> <span>📁 .txt, .csv, .vcf</span> <span>•</span> <span>⚡ Instant parsing</span></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer) {
  head("tziouu", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Open Genetic Data — Telomere AI</title>`);
    });
  });
  $$renderer.push(`<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24"><div class="text-center mb-12"><h1 class="text-4xl font-bold mb-4">Open Your <span class="gradient-text">Genetic Data</span></h1> <p class="text-text-secondary max-w-xl mx-auto">Your file is processed entirely on this device. Nothing is ever sent to any server.</p></div> `);
  FileUpload($$renderer);
  $$renderer.push(`<!----> <div class="mt-12 grid sm:grid-cols-3 gap-6"><div class="card text-center"><span class="text-2xl mb-2 block">🖥️</span> <h3 class="font-semibold text-sm mb-1">100% Local</h3> <p class="text-text-tertiary text-xs">Processed on your computer. Works offline.</p></div> <div class="card text-center"><span class="text-2xl mb-2 block">⚡</span> <h3 class="font-semibold text-sm mb-1">Instant Analysis</h3> <p class="text-text-tertiary text-xs">Parse 500,000+ SNPs in seconds.</p></div> <div class="card text-center"><span class="text-2xl mb-2 block">📊</span> <h3 class="font-semibold text-sm mb-1">6 Report Types</h3> <p class="text-text-tertiary text-xs">Health, longevity, nutrition, pharma, traits, and carrier status.</p></div></div> <div class="mt-12 card"><h3 class="font-semibold mb-3">How to get your raw data</h3> <div class="space-y-2 text-sm text-text-secondary"><p><strong class="text-text-primary">23andMe:</strong> Settings → 23andMe Data → Download Raw Data</p> <p><strong class="text-text-primary">AncestryDNA:</strong> Settings → Download DNA Data → Confirm &amp; Download</p> <p><strong class="text-text-primary">MyHeritage:</strong> DNA → Manage DNA kits → Download raw DNA data</p> <p><strong class="text-text-primary">VCF:</strong> Any VCF 4.x file from a genetic testing provider or research study.</p></div></div></div>`);
}
export {
  _page as default
};
