import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';
import api from '../services/api';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    tagline: '',
    about: '',
    location: '',
    github: '',
    linkedin: ''
  });

  const [skills, setSkills] = useState({});
  const [newSkill, setNewSkill] = useState({ category: '', name: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, skillsRes] = await Promise.all([
        api.profile.get(),
        api.skills.getAll()
      ]);
      
      setProfileData(profileRes.data);
      setSkills(skillsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      await api.profile.update(profileData);
      toast({
        title: "Success!",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill.category || !newSkill.name) return;
    
    try {
      await api.skills.create(newSkill);
      setNewSkill({ category: '', name: '' });
      fetchData(); // Refresh skills
      toast({
        title: "Success!",
        description: "Skill added successfully"
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-slate-400">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-slate-400">Manage your portfolio content</p>
      </div>

      {/* Profile Section */}
      <Card className="bg-slate-900/50 border-slate-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
          <CardDescription className="text-slate-400">
            Update your basic profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-200">Full Name</Label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label className="text-slate-200">Email</Label>
              <Input
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <Label className="text-slate-200">Tagline</Label>
            <Input
              value={profileData.tagline}
              onChange={(e) => setProfileData({...profileData, tagline: e.target.value})}
              className="bg-slate-800 border-slate-600 text-white"
              placeholder="Your professional tagline"
            />
          </div>

          <div>
            <Label className="text-slate-200">About</Label>
            <Textarea
              value={profileData.about}
              onChange={(e) => setProfileData({...profileData, about: e.target.value})}
              className="bg-slate-800 border-slate-600 text-white"
              rows={4}
              placeholder="Tell people about yourself"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="text-slate-200">Location</Label>
              <Input
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="Your location"
              />
            </div>
            <div>
              <Label className="text-slate-200">GitHub URL</Label>
              <Input
                value={profileData.github}
                onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div>
              <Label className="text-slate-200">LinkedIn URL</Label>
              <Input
                value={profileData.linkedin}
                onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>
          </div>

          <Button 
            onClick={saveProfile}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card className="bg-slate-900/50 border-slate-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Skills Management</CardTitle>
          <CardDescription className="text-slate-400">
            Add and manage your technical skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add New Skill */}
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-white font-medium mb-3">Add New Skill</h4>
            <div className="flex gap-3">
              <Input
                placeholder="Category (e.g., frontend, backend)"
                value={newSkill.category}
                onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Input
                placeholder="Skill name (e.g., React, Python)"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button 
                onClick={addSkill}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!newSkill.category || !newSkill.name}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Current Skills */}
          <div className="space-y-4">
            {Object.entries(skills).map(([category, skillList]) => (
              <div key={category}>
                <h4 className="text-purple-400 font-medium mb-2 uppercase tracking-wide">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill) => (
                    <Badge 
                      key={skill} 
                      className="bg-purple-600/20 text-purple-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects Note */}
      <Card className="bg-blue-900/20 border-blue-700/50">
        <CardContent className="p-6">
          <h3 className="text-blue-300 font-semibold mb-2">Project Management</h3>
          <p className="text-blue-200/80 text-sm mb-3">
            For now, projects can be managed through API calls. A visual project editor will be added in the next version.
          </p>
          <p className="text-blue-200/60 text-xs">
            Current projects are loaded from the database and display properly on your homepage and projects page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;