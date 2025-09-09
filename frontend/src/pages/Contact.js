import React, { useState, useEffect } from 'react';
import { Send, Github, Linkedin, Mail, MapPin, Clock, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '' // spam guard
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.profile.get();
        setProfileData(response.data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        // Use fallback data
        setProfileData({
          name: 'Devang Shah',
          email: 'shahdevang1910@gmail.com',
          location: 'India',
          github: 'https://github.com',
          linkedin: 'https://linkedin.com/in/devang-shah'
        });
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple spam guard
    if (formData.honeypot) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      };

      await api.contact.submit(submitData);
      
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        honeypot: ''
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error sending message",
        description: "Something went wrong. Please try again or email me directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profileData) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-slate-400">Loading contact information...</p>
          </div>
        </div>
      </div>
    );
  }

  const socialLinks = [
    { 
      name: 'GitHub', 
      icon: Github, 
      href: profileData.github,
      description: 'Check out my code'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: profileData.linkedin,
      description: 'Let\'s connect professionally'
    },
    { 
      name: 'Email', 
      icon: Mail, 
      href: `mailto:${profileData.email}`,
      description: 'Send me an email directly'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">Get In Touch</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? I'd love to hear from you. 
          Let's build something amazing together!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Send me a message</CardTitle>
              <CardDescription className="text-slate-400">
                Fill out the form below and I'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field for spam protection */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-200">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-slate-800 border-slate-600 text-white focus:border-purple-500"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-slate-800 border-slate-600 text-white focus:border-purple-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-200">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-slate-800 border-slate-600 text-white focus:border-purple-500"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-200">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="bg-slate-800 border-slate-600 text-white focus:border-purple-500 resize-none"
                    placeholder="Tell me about your project or idea..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info & Social Links */}
        <div className="space-y-6">
          {/* Direct Contact */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-slate-200 font-medium">Email</p>
                  <a 
                    href={`mailto:${profileData.email}`}
                    className="text-slate-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {profileData.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-slate-200 font-medium">Location</p>
                  <p className="text-slate-400 text-sm">{profileData.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-slate-200 font-medium">Response Time</p>
                  <p className="text-slate-400 text-sm">Within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Connect with me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={link.name !== 'Email' ? '_blank' : undefined}
                    rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all group"
                  >
                    <Icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                    <div>
                      <p className="text-slate-200 font-medium group-hover:text-white">
                        {link.name}
                      </p>
                      <p className="text-slate-400 text-sm group-hover:text-slate-300">
                        {link.description}
                      </p>
                    </div>
                  </a>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="bg-gradient-to-br from-purple-600/20 to-slate-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-2">Let's build together!</h3>
              <p className="text-slate-300 text-sm">
                I'm always excited to work on interesting projects and collaborate 
                with passionate people. Don't hesitate to reach out!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;