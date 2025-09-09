import React from "react";
import SKILL_ICONS from "../assets/skill-icons";

function normalizeKey(name = "") {
  return name.toLowerCase().replace(/\+/g,"plus").replace(/[#.]/g,"").replace(/\s+/g," ").trim();
}
const ALIASES = {
  node: "nodejs", "nodejs": "nodejs", "node.js": "nodejs",
  js: "javascript", ts: "typescript",
  mongodb: "mongodb", mongo: "mongodb",
  tailwindcss: "tailwind", scss: "sass", "reactnative": "react native",
};
function keyForIcon(n){const b=normalizeKey(n).replace(/\s/g,"");return ALIASES[b]||b;}

export default function SkillCard({ name }) {
  const key = keyForIcon(name);
  const icon = SKILL_ICONS[key];

  return (
    <div
      className="
        relative grid place-items-center text-center
        w-full max-w-20 h-16 sm:h-18 lg:h-20
        rounded-xl
        bg-white/[0.06] backdrop-blur-xl
        border border-white/15
        shadow-[0_8px_30px_rgba(0,0,0,0.22)]
        hover:bg-white/[0.08] hover:border-white/20
        transition-all duration-300
        overflow-hidden
      "
    >
      {/* subtle highlight/shine */}
      <div className="pointer-events-none absolute -top-1/2 left-0 right-0 h-full bg-gradient-to-b from-white/[0.15] to-transparent" />
      {/* neon ring on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-0 group-hover:ring-2 ring-purple-500/30" />
      
      {icon ? (
        <img
          src={icon}
          alt={`${name} logo`}
          className="h-7 w-7 sm:h-8 sm:w-8 object-contain drop-shadow-[0_4px_12px_rgba(124,58,237,0.3)]"
          loading="lazy"
        />
      ) : (
        <div className="h-10 w-10 sm:h-12 sm:w-12 grid place-items-center rounded-xl bg-slate-800 text-slate-200 text-base">
          {name?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}

      <div className="mt-0.5 text-[11px] sm:text-xs font-medium text-slate-100">
        {name}
      </div>
    </div>
  );
}
