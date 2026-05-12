export const INTERNSHIPS = [
  {
    id: 1,
    company: "TechNova Solutions",
    role: "Frontend Developer Intern",
    skills: ["React", "JavaScript", "Tailwind CSS", "HTML", "CSS"],
    description: "Build modern web interfaces using React and modern CSS frameworks.",
    location: "Remote",
    type: "Full-time"
  },
  {
    id: 2,
    company: "DataStream AI",
    role: "Machine Learning Intern",
    skills: ["Python", "PyTorch", "NumPy", "Data Analysis", "SQL"],
    description: "Assist in developing and training deep learning models for predictive analytics.",
    location: "San Francisco, CA",
    type: "Hybrid"
  },
  {
    id: 3,
    company: "SecureNet Systems",
    role: "Cybersecurity Analyst Intern",
    skills: ["Linux", "Networking", "Python", "Security Auditing", "SQL"],
    description: "Help identify vulnerabilities and improve network security protocols.",
    location: "New York, NY",
    type: "In-person"
  },
  {
    id: 4,
    company: "CloudScale Inc.",
    role: "DevOps Engineer Intern",
    skills: ["AWS", "Docker", "Kubernetes", "Linux", "Bash"],
    description: "Learn to manage scalable infrastructure and CI/CD pipelines.",
    location: "Remote",
    type: "Full-time"
  },
  {
    id: 5,
    company: "CreativeFlow",
    role: "UI/UX Design Intern",
    skills: ["Figma", "Adobe XD", "HTML", "CSS", "User Research"],
    description: "Design intuitive user experiences and interactive prototypes.",
    location: "Austin, TX",
    type: "Hybrid"
  },
  {
    id: 6,
    company: "LogicCraft",
    role: "Backend Developer Intern",
    skills: ["Node.js", "Express", "MongoDB", "JavaScript", "REST APIs"],
    description: "Develop robust server-side logic and database schemas.",
    location: "Seattle, WA",
    type: "In-person"
  },
  {
    id: 7,
    company: "QuantTrade",
    role: "Quantitative Research Intern",
    skills: ["Python", "C++", "Statistics", "Algorithms", "SQL"],
    description: "Apply mathematical models to financial market data.",
    location: "Chicago, IL",
    type: "Full-time"
  },
  {
    id: 8,
    company: "MobileEdge",
    role: "iOS Developer Intern",
    skills: ["Swift", "SwiftUI", "Git", "Mobile Design", "Xcode"],
    description: "Create sleek and performant mobile applications for iOS.",
    location: "Remote",
    type: "Full-time"
  },
  {
    id: 9,
    company: "StackBuilders",
    role: "Full Stack Developer Intern",
    skills: ["React", "Node.js", "PostgreSQL", "JavaScript", "Docker"],
    description: "Work on both frontend and backend components of large-scale web apps.",
    location: "Denver, CO",
    type: "Hybrid"
  },
  {
    id: 10,
    company: "BioCode Labs",
    role: "Bioinformatics Intern",
    skills: ["Python", "R", "Data Science", "Statistics", "Git"],
    description: "Analyze genomic sequences using computational tools and algorithms.",
    location: "Boston, MA",
    type: "In-person"
  }
];

export const ALL_SKILLS = Array.from(
  new Set(INTERNSHIPS.flatMap((internship) => internship.skills))
).sort();
