// Mock data for Devang Shah's portfolio

export const personalInfo = {
  name: "Devang Shah",
  email: "shahdevang1910@gmail.com",
  tagline: "Building playful, human-centered tools with clean code and curiosity.",
  about: "I'm a developer who loves turning fuzzy ideas into crisp, shippable experiences. My happy place: dark mode UIs, tiny details, and shipping fast.",
  location: "India",
  github: "https://github.com",
  linkedin: "https://linkedin.com/in/devang-shah"
};

export const skills = {
  languages: ["TypeScript", "Python", "JavaScript", "SQL"],
  frontend: ["React", "Next.js", "Tailwind", "shadcn/ui"],
  backend: ["Node.js", "Express", "FastAPI", "REST"],
  cloud: ["AWS", "Vercel", "GitHub Actions", "Supabase"],
  data: ["Pandas", "scikit-learn", "OpenAI API"]
};

export const projects = [
  {
    id: "apex-f1-supply-chain",
    title: "Apex: F1 Supply Chain Explorer",
    summary: "Interactive visualizations of logistics, parts flow, and team operations.",
    description: "Built comprehensive supply chain visualization platform for Formula 1 teams, mapping entire lifecycle from suppliers to race day operations.",
    period: "2024",
    stack: ["Next.js", "Tailwind", "Recharts", "TypeScript"],
    tags: ["Web", "DataViz"],
    category: "Web",
    cover: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop",
    links: { 
      repo: "https://github.com/devang-shah/apex-f1", 
      live: "https://apex-f1.vercel.app", 
      case: "#" 
    },
    details: {
      problem: "Fans and teams lack visibility into complex supply chain dynamics behind race day operations.",
      approach: "Mapped entire lifecycle and supplier networks with interactive charts and real-time data visualization.",
      result: "Clear, explorable interface that makes complex logistics accessible to non-technical audiences.",
      features: ["Real-time supplier tracking", "Interactive flow diagrams", "Performance analytics"]
    }
  },
  {
    id: "valet-flow-simplifier",
    title: "Valet Flow Simplifier",
    summary: "Prototype valet operations dashboard with auth, tickets, and analytics.",
    description: "Streamlined valet service operations with comprehensive dashboard for ticket management and customer analytics.",
    period: "2024",
    stack: ["React", "Supabase", "Node.js", "Chart.js"],
    tags: ["Web", "Dashboard"],
    category: "Web",
    cover: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    links: { 
      repo: "https://github.com/devang-shah/valet-flow", 
      live: "#", 
      case: "#" 
    },
    details: {
      problem: "Valet services struggled with manual ticket tracking and lacked operational insights.",
      approach: "Built integrated dashboard with authentication, automated ticket lifecycle, and analytics.",
      result: "Reduced processing time by 60% and improved customer satisfaction through better tracking.",
      features: ["Automated ticket system", "Real-time analytics", "Customer portal"]
    }
  },
  {
    id: "workout-logger",
    title: "Workout Logger",
    summary: "Minimalist fitness tracker with charts and progress streaks.",
    description: "Clean, intuitive workout tracking app focused on simplicity and visual progress representation.",
    period: "2023",
    stack: ["Next.js", "SQLite", "Chart.js", "Tailwind"],
    tags: ["Web", "Mobile"],
    category: "Web",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    links: { 
      repo: "https://github.com/devang-shah/workout-logger", 
      live: "https://workout-logger.vercel.app", 
      case: "#" 
    },
    details: {
      problem: "Existing fitness apps were overcomplicated with too many features and poor UX.",
      approach: "Designed minimalist interface focusing on core tracking with visual progress indicators.",
      result: "Achieved 95% user retention rate with clean, distraction-free workout logging.",
      features: ["Streak tracking", "Progress charts", "Workout templates"]
    }
  },
  {
    id: "code-snippet-manager",
    title: "Code Snippet Manager",
    summary: "Developer tool for organizing and sharing code snippets across teams.",
    description: "Collaborative platform for developers to store, organize, and share reusable code snippets.",
    period: "2023",
    stack: ["React", "MongoDB", "Express", "Prism.js"],
    tags: ["Web", "DevTools"],
    category: "Web",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    links: { 
      repo: "https://github.com/devang-shah/snippet-manager", 
      live: "#", 
      case: "#" 
    },
    details: {
      problem: "Developers waste time searching for previously written code across projects.",
      approach: "Created centralized snippet management with tagging, search, and team collaboration.",
      result: "Teams reported 40% faster development cycles with improved code reusability.",
      features: ["Syntax highlighting", "Team sharing", "Advanced search"]
    }
  }
];

export const experience = [
  {
    company: "Tech Innovations Co.",
    title: "Full Stack Developer",
    period: "2023 - Present",
    location: "Remote",
    achievements: [
      "Built scalable web applications serving 10K+ daily active users",
      "Reduced page load times by 40% through optimization techniques",
      "Led migration from legacy PHP to modern React/Node.js stack",
      "Mentored 3 junior developers on best practices and code quality"
    ]
  },
  {
    company: "Startup Hub",
    title: "Frontend Developer",
    period: "2022 - 2023",
    location: "Mumbai, India",
    achievements: [
      "Developed responsive React applications with 98% mobile compatibility",
      "Implemented design system reducing development time by 30%",
      "Collaborated with UX team to improve user engagement by 25%",
      "Integrated third-party APIs and payment processing systems"
    ]
  },
  {
    company: "Digital Agency",
    title: "Junior Developer",
    period: "2021 - 2022",
    location: "Pune, India",
    achievements: [
      "Created 15+ client websites using modern web technologies",
      "Maintained 99% uptime across all deployed applications",
      "Implemented automated testing reducing bugs by 50%",
      "Participated in code reviews and improved team coding standards"
    ]
  }
];

export const education = [
  {
    degree: "Bachelor of Computer Science",
    school: "University of Technology",
    period: "2017 - 2021",
    location: "Mumbai, India"
  }
];

export const funFacts = [
  "Coffee enthusiast ☕",
  "Open source contributor",
  "Photography hobbyist 📸",
  "Loves solving puzzles 🧩"
];