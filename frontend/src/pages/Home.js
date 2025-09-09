import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Github, Eye, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import api from '../services/api';
import Typewriter from '../components/Typewriter';
import SkillCard from "../components/SkillCard";


const Home = () => {
  const [wave, setWave] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    profile: null,
    skills: null,
    projects: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWave(true);
      setTimeout(() => setWave(false), 600);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [profileRes, skillsRes, projectsRes] = await Promise.all([
          api.profile.get(),
          api.skills.getAll(),
          api.projects.getAll({ featured: true, limit: 3 })
        ]);
        const normalize = (arr=[]) =>
          arr.map(p => ({
            ...p,
            repo: p.repo || p.links?.repo || "",
            live: p.live || p.links?.live || "",
            caseLink: p.caseLink || p.links?.case || "",
          }));
        
        setData({
          profile: profileRes.data,
          skills: skillsRes.data,
          projects: normalize(projectsRes.data)
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-slate-400">Loading portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { profile, skills, projects } = data;
  const isReal = (url) => typeof url === "string" && url.trim() !== "" && url.trim() !== "#";

  const funFacts = ["Coffee enthusiast ☕", "Love podcasts 🎧", "Explorer 🌍", "Loves solving puzzles 🧩"];

  return (
    <div className="w-full px-6 md:px-8">
      {/* Hero Section */}
<section className="relative min-h-[calc(100vh-80px)] flex items-center">
  <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6 w-full">
    
    {/* Left: text */}
    <div className="text-center md:text-left">
    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
  Hey{" "}
  <span className="relative inline-block align-baseline">
    Friends
    {/* double curved underline under just "Friends" */}
    <span className="pointer-events-none absolute left-0 right-0 -bottom-3 h-6">
      <svg
        viewBox="0 0 220 40" // taller viewBox so curves aren’t clipped
        preserveAspectRatio="none"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* top stroke */}
        <path
          d="M2 26 C 60 12, 160 36, 218 22"
          stroke="#a78bfa"         // Tailwind violet-400
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* bottom stroke (slightly lower & offset) */}
        <path
          d="M2 32 C 60 18, 160 42, 218 28"
          stroke="#a78bfa"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  </span>{" "}
  <span
    className={`inline-block ml-2 ${wave ? "animate-bounce" : ""}`}
    aria-hidden="true"
  >
    👋
  </span>
      </h1>

      {/* Typewriter roles line */}
      <p className="text-2xl md:text-3xl font-semibold text-purple-300 mb-4">
        <Typewriter
          words={[
            "Full-Stack Developer",
            "Data Analyst",
            "AI Agents Builder",
            "AWS Cloud Developer",
          ]}
          typingSpeed={110}
          deletingSpeed={60}
          holdTime={1100}
        />
      </p>

      {/* Tagline */}
      {/* Subtitle directly below */}

<p className="text-lg md:text-xl text-slate-300 mt-2 max-w-2xl text-center md:text-left">
  
    "I'm <span className="text-purple-400">{profile?.name || "Devang Shah"}</span> Building playful, human-centered tools with clean code and curiosity."
</p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 md:justify-start justify-center mt-4">
        <Button
          asChild
          size="lg"
          className="px-8 py-4 text-lg rounded-xl bg-purple-600 hover:bg-purple-700"
        >
          <Link to="/projects">
            View Projects <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="px-8 py-4 text-lg rounded-xl border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <Link to="/resume">Resume</Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="px-8 py-4 text-lg rounded-xl text-slate-300 hover:bg-slate-800"
        >
          <Link to="/contact">Contact</Link>
        </Button>
      </div>
    </div>

    {/* Right: illustration */}
    <div className="hidden md:flex justify-center relative">
      <img
        src="/illustrations/dev-hero.svg"
        alt="Developer at desk illustration"
        className="w-[95%] max-w-lg md:max-w-xl lg:max-w-2xl h-auto opacity-95 drop-shadow-[0_8px_24px_rgba(124,58,237,0.35)]"
      />
    </div>
  </div>
</section>


      {/* About Me */}
<section className="pt-24 pb-16" id="about">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold mb-6 text-white">About Me</h2>
    <p className="text-lg text-slate-300 mb-6 leading-relaxed">
      {profile?.about || "I love building playful, human-centered tools with clean code and curiosity."}
    </p>

    {/* Fun Facts */}
    <h3 className="text-lg font-semibold mb-3 text-slate-200">Fun Facts</h3>
<div className="flex flex-wrap gap-3">
  {funFacts.map((fact, i) => (
    <Badge
      key={i}
      variant="secondary"
      className="text-base md:text-base px-3 md:px-4 py-1.5 md:py-2.5 rounded-lg bg-slate-800/70 text-slate-200 border border-slate-700 hover:bg-slate-700/70"
    >
      {fact}
    </Badge>
  ))}
</div>
</div>
</section>

{/* Tech Stack */}
<section className="pt-24 pb-16" id="tech-stack">
  <div className="max-w-6xl mx-auto">
    <h3 className="text-2xl font-bold mb-6 text-white">Tech Stack</h3>

    {!skills ? (
      <p className="text-slate-400">Loading skills…</p>
    ) : (
      <div className="space-y-10">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold mb-4 text-purple-400 uppercase tracking-wide">
              {category}
            </h4>

            {/* compact tile grid - auto-fill to avoid big empty column space */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] justify-items-center gap-0 md:gap-1">
              {items.map((skill) => (
                <SkillCard key={skill} name={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>




      {/* Featured Projects */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Featured Projects</h2>
          <p className="text-lg text-slate-400">Some things I've built recently</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id || project._id} 
              className="bg-slate-900/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group cursor-pointer"
            >
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img 
                  src={project.cover} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {project.summary}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.stack.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
  {isReal(project.repo) && (
    <Button size="sm" variant="ghost" asChild className="p-0 h-auto text-purple-400 hover:text-purple-300">
      <a href={project.repo} target="_blank" rel="noopener noreferrer">
        <Github className="h-4 w-4 mr-1" />
        Code
      </a>
    </Button>
  )}

  {isReal(project.live) && (
    <Button size="sm" variant="ghost" asChild className="p-0 h-auto text-purple-400 hover:text-purple-300">
      <a href={project.live} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="h-4 w-4 mr-1" />
        Live
      </a>
    </Button>
  )}

  {isReal(project.caseLink) && (
    <Button size="sm" variant="ghost" asChild className="p-0 h-auto text-purple-400 hover:text-purple-300">
      <a href={project.caseLink} target="_blank" rel="noopener noreferrer">
        <Eye className="h-4 w-4 mr-1" />
        Case
      </a>
    </Button>
  )}
</div>

              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
            <Link to="/projects">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;