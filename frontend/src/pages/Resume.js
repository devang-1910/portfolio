// frontend/src/pages/Resume.js
import React, { useEffect, useState } from 'react';
import { Download, MapPin, Mail, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import api from '../services/api';

export default function Resume() {
  console.log("Resume page reloaded");
  const [profile, setProfile] = useState(null);
  const [skillsMap, setSkillsMap] = useState(null);           // { category: [skills] }
  const [experience, setExperience] = useState([]);           // [{...}]
  const [education, setEducation] = useState([]);             // [{...}]
  const [papers, setPapers] = useState([]);                   // [{...}]
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [pRes, sRes, xRes, eRes, papersRes] = await Promise.all([
          api.profile.get(),        // GET /api/profile
          api.skills.getAll(),      // GET /api/skills  -> {category:[...]}
          api.experience.getAll(),  // GET /api/experience
          api.education.getAll(),   // GET /api/education
          api.papers.getAll(),      // GET /api/papers
        ]);
        if (!mounted) return;
        setProfile(pRes.data || null);
        setSkillsMap(sRes.data || {});
        setExperience(Array.isArray(xRes.data) ? xRes.data : []);
        setEducation(Array.isArray(eRes.data) ? eRes.data : []);
        setPapers(Array.isArray(papersRes.data) ? papersRes.data : []);
        setErr(null);
      } catch (e) {
        console.error('Resume load failed', e);
        setErr('Failed to load resume data.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleDownload = () => {
    // Open resume PDF from Google Drive
    window.open('https://drive.google.com/file/d/1mZb0guGKxMQwhA55NZqVyJktG3AtdtgF/view?usp=sharing', '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Loader2 className="h-7 w-7 animate-spin mx-auto mb-3 text-purple-400" />
        <p className="text-slate-400">Loading resume…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-red-400 mb-4">{err}</p>
        <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white">Resume</h1>
        <p className="text-lg text-slate-400 mb-6">
          My professional experience and qualifications
        </p>
        <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Info */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-sm">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-sm">{profile?.location}</span>
              </div>
              {profile?.github && (
                <div className="flex items-center gap-3 text-slate-300">
                  <ExternalLink className="w-4 h-4 text-purple-400" />
                  <a href={profile.github} target="_blank" rel="noreferrer" className="text-sm hover:text-purple-400 transition-colors">
                    GitHub Profile
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Education</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                My academic journey and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu, index) => (
                <div key={edu._id || edu.id} className={index === 0 ? "border-l-2 border-purple-400 pl-3" : ""}>
                  <h4 className="font-semibold text-white text-sm">{edu.degree}</h4>
                  <p className="text-purple-400 text-sm">{edu.school}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{edu.period}</span>
                    <span>•</span>
                    <span>{edu.location}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          

          {/* Skills */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Technical Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillsMap && Object.entries(skillsMap).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold mb-2 text-purple-400 uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {items.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs border-slate-600 text-slate-400"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          
        </div>

        {/* Right Column - Research Papers & Experience */}
        <div className="lg:col-span-2 space-y-6">
          {/* Research Papers Section */}
          {papers.length > 0 && (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Research Papers</CardTitle>
                <CardDescription className="text-slate-400">
                  Published research and academic contributions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {papers.map((paper, index) => (
                  <div key={paper._id || index}>
                    {index > 0 && <Separator className="bg-slate-700 mb-6" />}

                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{paper.name}</h3>
                        {paper.link ? (
                          <a 
                            href={paper.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-400 font-medium hover:text-purple-300 transition-colors underline"
                          >
                            {paper.journal}
                          </a>
                        ) : (
                          <p className="text-purple-400 font-medium">{paper.journal}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{paper.period}</span>
                        </div>
                      </div>

                      {Array.isArray(paper.key_highlights) && paper.key_highlights.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-slate-200">Key Highlights:</h4>
                          <ul className="space-y-1">
                            {paper.key_highlights.map((highlight, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-purple-400 mt-1.5 text-xs">▸</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Experience Section */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-xl">Professional Experience</CardTitle>
              <CardDescription className="text-slate-400">
                My career journey and key accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {experience.map((job, index) => (
                <div key={job._id || index}>
                  {index > 0 && <Separator className="bg-slate-700 mb-6" />}

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{job.title}</h3>
                      <p className="text-purple-400 font-medium">{job.company}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{job.period}</span>
                        <span>•</span>
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    {Array.isArray(job.achievements) && job.achievements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-200">Key Achievements:</h4>
                        <ul className="space-y-1">
                          {job.achievements.map((achievement, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                              <span className="text-purple-400 mt-1.5 text-xs">▸</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .print-friendly { background: white !important; color: black !important; }
          .print-friendly .bg-slate-900\\/50 { background: white !important; border: 1px solid #e5e7eb !important; }
          .print-friendly .text-white { color: black !important; }
          .print-friendly .text-purple-400 { color: #7c3aed !important; }
          .print-friendly .text-slate-300, .print-friendly .text-slate-400 { color: #374151 !important; }
        }
      `}</style>
    </div>
  );
}
