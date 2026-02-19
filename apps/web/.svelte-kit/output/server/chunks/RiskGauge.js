import { d as attr, b as attr_style, s as stringify, e as escape_html, f as derived } from "./index.js";
function RiskGauge($$renderer, $$props) {
  let { percent = 50, size = 80, label = "" } = $$props;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = derived(() => circumference - percent / 100 * circumference);
  const color = derived(() => percent >= 70 ? "#EF4444" : percent >= 40 ? "#F59E0B" : "#10B981");
  $$renderer.push(`<div class="inline-flex flex-col items-center gap-1"><svg${attr("width", size)}${attr("height", size)} viewBox="0 0 80 80" class="transform -rotate-90"><circle cx="40" cy="40"${attr("r", radius)} fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="6"></circle><circle cx="40" cy="40"${attr("r", radius)} fill="none"${attr("stroke", color())} stroke-width="6"${attr("stroke-dasharray", circumference)}${attr("stroke-dashoffset", offset())} stroke-linecap="round" class="transition-all duration-1000 ease-out"${attr_style(`filter: drop-shadow(0 0 6px ${stringify(color())}80)`)}></circle></svg> <span class="text-xs font-mono"${attr_style(`color: ${stringify(color())}`)}>${escape_html(percent)}%</span> `);
  if (label) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<span class="text-xs text-text-tertiary">${escape_html(label)}</span>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
export {
  RiskGauge as R
};
