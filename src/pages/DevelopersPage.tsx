// src/pages/DevelopersPage.tsx
import React from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Globe,
  Code,
  Database,
  Layout,
  Shield
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';

const developers = [
  {
    name: "Binary Hub Team",
    role: "Development Team",
    image: "/binary-hub-logo.png", // Add your logo
    bio: "Passionate about creating innovative solutions that make a difference.",
    skills: ["React", "TypeScript", "Node.js", "UI/UX", "System Architecture"],
    contact: {
      email: "team@binaryhub.rw",
      github: "https://github.com/binaryhub",
      linkedin: "https://linkedin.com/company/binaryhub",
      website: "https://binaryhub.rw"
    }
  },
  // Add more team members as needed
];

const technologies = [
  {
    icon: <Code className="h-6 w-6 text-blue-500" />,
    name: "Frontend",
    description: "Built with React, TypeScript, and Tailwind CSS for a modern and responsive user interface.",
    techs: ["React", "TypeScript", "Tailwind CSS", "React Router", "Recharts"]
  },
  {
    icon: <Database className="h-6 w-6 text-green-500" />,
    name: "Backend",
    description: "Powered by a robust backend system ensuring data integrity and smooth operations.",
    techs: ["Node.js", "Express", "PostgreSQL", "Redis", "RESTful APIs"]
  },
  {
    icon: <Layout className="h-6 w-6 text-purple-500" />,
    name: "Design",
    description: "User-centered design approach focusing on simplicity and efficiency.",
    techs: ["Responsive Design", "Accessibility", "User Experience", "Modern UI"]
  },
  {
    icon: <Shield className="h-6 w-6 text-red-500" />,
    name: "Security",
    description: "Implemented with industry-standard security practices to protect sensitive data.",
    techs: ["JWT", "Role-based Access", "Data Encryption", "Secure Authentication"]
  }
];

const DevelopersPage = () => {
  return (
    <div className="space-y-6 m-16 space-x-10  "> 
      <PageHeader
        title="Meet the Developers"
        subtitle="The team behind UR HG Stock Management System"
      />

      {/* Team Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {developers.map((dev, index) => (
          <Card key={index} className="p-6">
            <div className="text-center">
              <img
                src={dev.image}
                alt={dev.name}
                className="w-32 h-32 mx-auto rounded-full"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{dev.name}</h3>
              <p className="text-sm text-gray-500">{dev.role}</p>
              <p className="mt-2 text-sm text-gray-600">{dev.bio}</p>

              {/* Skills */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {dev.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Contact Links */}
              <div className="mt-4 flex justify-center gap-4">
                <a
                  href={`mailto:${dev.contact.email}`}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <a
                  href={dev.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href={dev.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={dev.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Technologies Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Technologies Used</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <Card key={index} className="p-6">
              <div className="flex flex-col items-center text-center">
                {tech.icon}
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{tech.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{tech.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {tech.techs.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <Card className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-6">
          Interested in working with us? We'd love to hear from you!
        </p>
        <div className="flex justify-center gap-6">
          <a
            href="mailto:team@binaryhub.rw"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            <Mail className="h-4 w-4" />
            Contact Us
          </a>
          <a
            href="https://binaryhub.rw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Globe className="h-4 w-4" />
            Visit Our Website
          </a>
        </div>
      </Card>
    </div>
  );
};

export default DevelopersPage;