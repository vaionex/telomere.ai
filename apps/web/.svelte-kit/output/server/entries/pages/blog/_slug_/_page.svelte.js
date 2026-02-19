import { h as head, e as escape_html, a as ensure_array_like, f as derived, i as store_get, j as unsubscribe_stores } from "../../../../chunks/index.js";
import { p as page } from "../../../../chunks/stores.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const articles = {
      "understanding-snps": {
        title: "Understanding SNPs: The Building Blocks of Genetic Variation",
        date: "February 15, 2026",
        content: [
          'Single nucleotide polymorphisms, or SNPs (pronounced "snips"), are the most common type of genetic variation in the human genome. Each SNP represents a single base pair change — an A instead of a G, a C instead of a T — at a specific position in your DNA.',
          "There are roughly 4-5 million SNPs in each person's genome, but the vast majority have no known effect on health or traits. Telomere AI focuses on the few thousand that have been well-characterized through peer-reviewed research.",
          "SNPs can affect health in several ways. Some alter the amino acid sequence of a protein, changing its function. Others affect gene regulation — how much of a protein gets made. And many SNPs have no direct effect but serve as markers that are inherited alongside nearby functional variants.",
          'When we say you have a "risk allele" for a particular SNP, we mean you carry the version of that base pair that has been statistically associated with a higher probability of a particular trait or condition. But genetics is not destiny — lifestyle, environment, and the combined effects of thousands of other variants all play a role.',
          "The power of consumer genetic testing is that it gives you personalized information about your own variants. Instead of generic health advice, you can understand your specific genetic predispositions and make more informed decisions about diet, exercise, screening, and supplementation."
        ]
      },
      "mthfr-explained": {
        title: "MTHFR C677T: What It Actually Means for Your Health",
        date: "February 10, 2026",
        content: [
          "MTHFR (methylenetetrahydrofolate reductase) is an enzyme that plays a crucial role in folate metabolism and methylation — a fundamental biochemical process that affects DNA synthesis, neurotransmitter production, detoxification, and hundreds of other reactions.",
          "The C677T variant (rs1801133) is one of the most studied SNPs in human genetics. When you have the T allele, your MTHFR enzyme works less efficiently: heterozygous (CT) individuals have about 65% of normal activity, while homozygous (TT) individuals have only about 30%.",
          "This matters because reduced MTHFR activity can lead to elevated homocysteine levels — an amino acid that, when elevated, is associated with cardiovascular disease, stroke, and pregnancy complications. It also means your body is less efficient at converting folic acid (the synthetic form of folate) into its active form, 5-methyltetrahydrofolate (5-MTHF).",
          "If you carry the TT genotype, the most common recommendation is to take methylfolate (5-MTHF) instead of regular folic acid, and to ensure adequate B12 intake. Some practitioners also recommend monitoring homocysteine levels periodically.",
          "It's important to note that having the MTHFR variant is extremely common — about 14% of the population is homozygous TT, and 42% are heterozygous CT. Most people with this variant live perfectly healthy lives, especially with adequate folate intake from diet and appropriate supplementation."
        ]
      },
      "pharmacogenomics-guide": {
        title: "A Beginner's Guide to Pharmacogenomics",
        date: "February 5, 2026",
        content: [
          'Have you ever wondered why a medication works perfectly for one person but causes side effects in another? Or why your doctor might prescribe a higher or lower dose than "standard"? The answer often lies in pharmacogenomics — the study of how your genes affect your response to medications.',
          "The most important genes in pharmacogenomics are the CYP450 family of enzymes, particularly CYP2D6, CYP2C19, and CYP2C9. These enzymes are responsible for metabolizing (breaking down) a large percentage of all prescription medications.",
          "Depending on your genetic variants, you might be classified as a poor metabolizer (drugs stay in your system too long, increasing side effect risk), an intermediate metabolizer, a normal metabolizer, or an ultra-rapid metabolizer (drugs are cleared too quickly to be effective).",
          "One of the most clinically significant examples is CYP2C19 and the blood thinner clopidogrel (Plavix). Poor CYP2C19 metabolizers can't convert clopidogrel into its active form, meaning the drug essentially doesn't work — a potentially life-threatening situation. The FDA has issued a boxed warning about this interaction.",
          "Another important example is VKORC1 and warfarin (Coumadin). Certain VKORC1 variants make individuals much more sensitive to warfarin, requiring significantly lower doses to avoid dangerous bleeding. Pharmacogenomic-guided warfarin dosing is now recommended by the FDA.",
          "The field is rapidly growing. More and more hospitals are implementing pre-emptive pharmacogenomic testing, and the Clinical Pharmacogenetics Implementation Consortium (CPIC) publishes regularly updated guidelines for dozens of drug-gene pairs."
        ]
      }
    };
    const slug = derived(() => store_get($$store_subs ??= {}, "$page", page).params.slug);
    const article = derived(() => articles[slug()]);
    head("1teoznn", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(article()?.title || "Article")} — Telomere AI</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24"><a href="/blog" class="text-text-tertiary hover:text-text-secondary text-sm mb-6 inline-block">← Back to Blog</a> `);
    if (article()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<article><p class="text-text-tertiary text-sm mb-3">${escape_html(article().date)}</p> <h1 class="text-3xl font-bold mb-8">${escape_html(article().title)}</h1> <div class="space-y-4 text-text-secondary leading-relaxed"><!--[-->`);
      const each_array = ensure_array_like(article().content);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let paragraph = each_array[$$index];
        $$renderer2.push(`<p>${escape_html(paragraph)}</p>`);
      }
      $$renderer2.push(`<!--]--></div></article>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="card text-center py-12"><h1 class="text-2xl font-bold mb-2">Article Not Found</h1> <a href="/blog" class="btn-primary mt-4">Back to Blog</a></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
