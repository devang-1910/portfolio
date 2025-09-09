// frontend/src/components/Footer.jsx
import React, { useEffect, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import api from "../services/api";

const isReal = (v) => typeof v === "string" && v.trim() && v.trim() !== "#";

export default function Footer() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.profile.get(); // GET /api/profile
        if (mounted) setProfile(res.data || null);
      } catch (e) {
        console.error("Footer: failed to load profile", e);
        if (mounted) setProfile(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const name = profile?.name || "Your Name";

  const socialLinks = [
    isReal(profile?.github) && { name: "GitHub", icon: Github, href: profile.github },
    isReal(profile?.linkedin) && { name: "LinkedIn", icon: Linkedin, href: profile.linkedin },
    isReal(profile?.email) && { name: "Email", icon: Mail, href: `mailto:${profile.email}` },
  ].filter(Boolean);

  return (
    <footer className="bg-slate-900/50 border-t border-slate-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Social Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            {socialLinks.length > 0 ? (
              socialLinks.map((link) => {
                const Icon = link.icon;
                const isEmail = link.name === "Email";
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={isEmail ? undefined : "_blank"}
                    rel={isEmail ? undefined : "noopener noreferrer"}
                    className="text-slate-400 hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-slate-800"
                    aria-label={link.name}
                  >
                    <Icon size={20} />
                  </a>
                );
              })
            ) : (
              // subtle placeholder while loading or if empty
              <div className="h-5 w-40 bg-slate-800/60 rounded animate-pulse" />
            )}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} {name}</p>
            <p className="text-xs mt-1">
              Built with React & <span className="text-purple-400">♥</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
