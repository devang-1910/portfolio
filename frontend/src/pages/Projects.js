// frontend/src/pages/Projects.js
import React, { useEffect, useMemo, useState } from "react";
import { ExternalLink, Github, Eye, Filter, Loader2, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import api from "../services/api";



const isComingSoon = (p) =>
  (p?.category || "").toLowerCase().trim() === "coming soon";


const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchProjects = async (category = "All") => {
    try {
      setLoading(true);
      const res = await api.projects.getAll({
        category: category === "All" ? undefined : category,
      });
      const normalize = (arr=[]) =>
        arr.map(p => ({
          ...p,
          repo: p.repo || p.links?.repo || "",
          live: p.live || p.links?.live || "",
          caseLink: p.caseLink || p.links?.case || "",
        }));
      
      setProjects(normalize(res.data || []));
      setErr("");
    } catch (e) {
      console.error(e);
      setErr(api.handleAPIError(e, "Failed to load projects"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(selectedCategory);
  }, [selectedCategory]);

  const categories = useMemo(() => {
    const set = new Set(["All"]);
    projects.forEach((p) => p?.category && set.add(p.category));
    return Array.from(set);
  }, [projects]);

  const filteredProjects =
  selectedCategory === "All"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

// sort by numeric period descending
const sortedProjects = [...filteredProjects].sort((a, b) => {
  const ya = parseInt(a.period, 10) || -Infinity;
  const yb = parseInt(b.period, 10) || -Infinity;
  return yb - ya;
});


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-2 text-white">My Projects</h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            A collection of projects I’ve built using various technologies and frameworks.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-800"
          onClick={() => fetchProjects(selectedCategory)}
          title="Refresh from API"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center sm:justify-start">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={
              selectedCategory === category
                ? "bg-purple-600 hover:bg-purple-700"
                : "border-slate-600 text-slate-300 hover:bg-slate-800"
            }
            onClick={() => setSelectedCategory(category)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {category}
          </Button>
        ))}
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          <span className="ml-3 text-slate-400">Loading projects…</span>
        </div>
      )}
      {!!err && !loading && (
        <div className="text-center py-12">
          <p className="text-red-400 mb-3">{err}</p>
          <Button variant="outline" onClick={() => fetchProjects(selectedCategory)}>
            Try again
          </Button>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && !err && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map((project) => (
              <Card
                key={project.id || project._id}
                className="bg-slate-900/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group"
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={project.cover}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  {project.period && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-purple-600/80 text-white">{project.period}</Badge>
                    </div>
                  )}
                </div>

                {/* MIDDLE: content (flex-1 so it grows) */}
  <div className="flex-1 flex flex-col">
    <CardHeader className="pb-3">
      <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
        {project.title}
      </CardTitle>

      {/* clamp summary to avoid big height variance */}
      <CardDescription className="text-slate-400 line-clamp-3">
        {project.summary}
      </CardDescription>
    </CardHeader>

    <CardContent className="flex-1 flex flex-col">
      {/* tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {(project.stack || []).map((tech) => (
          <Badge key={tech} variant="outline" className="text-xs border-slate-600 text-slate-400">
            {tech}
          </Badge>
        ))}
      </div>

      {/* BOTTOM: actions (mt-auto pins this row to bottom) */}
      <div className="mt-auto flex justify-between items-center pt-2">
        <div className="flex gap-2">
          {project.repo && (
            <Button size="sm" variant="ghost" asChild className="p-1 h-auto text-purple-400 hover:text-purple-300">
              <a href={project.repo} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.live && (
            <Button size="sm" variant="ghost" asChild className="p-1 h-auto text-purple-400 hover:text-purple-300">
              <a href={project.live} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>

                    {isComingSoon(project) ? (
  // Coming soon → just show toast / alert instead of opening sheet
  <Button
    size="sm"
    variant="outline"
    className="border-amber-500 text-amber-400 hover:bg-amber-500/10"
    onClick={() => {
      // simplest: use browser alert
      alert("🚧 This project is still in development. Stay tuned!");
      
      // OR if you have a toast system (shadcn/ui, react-hot-toast):
      // toast.info("🚧 This project is still in development. Stay tuned!");
    }}
  >
    <Eye className="w-4 h-4 mr-1" />
    Details
  </Button>
) : (

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="bg-slate-950 border-slate-800 w-full sm:max-w-lg overflow-y-auto">
                        {selectedProject && (
                          <>
                            <SheetHeader>
                              <SheetTitle className="text-white">{selectedProject.title}</SheetTitle>
                              <SheetDescription className="text-slate-400">{selectedProject.description}</SheetDescription>
                            </SheetHeader>

                            <div className="py-6 space-y-6">
                              <div className="aspect-video rounded-lg overflow-hidden">
                                <img src={selectedProject.cover} alt={selectedProject.title} className="w-full h-full object-cover" />
                              </div>

                              {selectedProject.details?.problem && (
                                <div>
                                  <h3 className="text-lg font-semibold text-white mb-2">Problem</h3>
                                  <p className="text-slate-300">{selectedProject.details.problem}</p>
                                </div>
                              )}

                              {selectedProject.details?.approach && (
                                <div>
                                  <h3 className="text-lg font-semibold text-white mb-2">Approach</h3>
                                  <p className="text-slate-300">{selectedProject.details.approach}</p>
                                </div>
                              )}

                              {selectedProject.details?.result && (
                                <div>
                                  <h3 className="text-lg font-semibold text-white mb-2">Result</h3>
                                  <p className="text-slate-300">{selectedProject.details.result}</p>
                                </div>
                              )}

                              {Array.isArray(selectedProject.details?.features) && (
                                <div>
                                  <h3 className="text-lg font-semibold text-white mb-2">Key Features</h3>
                                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                                    {selectedProject.details.features.map((f, i) => (
                                      <li key={i}>{f}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="flex gap-3 pt-4">
                                {selectedProject.repo && (
                                  <Button asChild className="bg-purple-600 hover:bg-purple-700 flex-1">
                                    <a href={selectedProject.repo} target="_blank" rel="noreferrer">
                                      <Github className="w-4 h-4 mr-2" />
                                      View Code
                                    </a>
                                  </Button>
                                )}
                                {selectedProject.live && (
                                  <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 flex-1">
                                    <a href={selectedProject.live} target="_blank" rel="noreferrer">
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      Live Demo
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </SheetContent>
                    </Sheet>
                    )}
                  </div>
                </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No projects found in this category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;
