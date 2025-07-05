'use client';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa';
import * as motion from "motion/react-client";
import { useEffect, useState } from "react";

interface Contact {
  email: string;
  github: string;
  linkedin: string;
  phone: string;
  medium: string;
  location: string;
}

interface Project {
  name: string;
  description: string;
  link: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Content {
  hero: { name: string; title: string; description: string; };
  about: { heading: string; content: string; };
  skills: string[];
  projects: Project[];
  education: Education[];
  contact: Contact;
}

export default function ResumePage() {
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    fetch('/content.json')
      .then(res => res.json())
      .then(data => setContent(data));
  }, []);

  useEffect(() => {
    if (window.location.hash === "#contact") {
      const el = document.getElementById("contact");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  return (
    <main className="max-w-3xl mx-auto py-12 px-4 text-white">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">
        {content?.hero.name || "Aziz ur Rehman Khan"}
      </h1>
      <h2 className="text-2xl font-semibold mb-2 text-purple-300">
        {content?.hero.title || "DevOps Engineer | Cloud & IaC Specialist"}
      </h2>
      <p className="mb-6 text-gray-300">
        {content?.hero.description ||
          "Experienced DevOps Engineer with nearly 3 years of expertise in optimizing CI/CD pipelines, ensuring application security, and delivering scalable solutions on AWS, GCP, and Azure. Proficient in Terraform and Bicep for infrastructure as code (IaC), automating infrastructure, and transitioning from monolithic to microservices architectures."
        }
      </p>

      {/* About Section */}
      {content && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-blue-300 mb-4">{content.about.heading}</h3>
          <p className="text-gray-300">{content.about.content}</p>
        </motion.section>
      )}

      {/* Contact Details */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <h3 className="text-xl font-bold text-blue-300 mb-4">Contact Details</h3>
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <EnvelopeIcon className="w-5 h-5 text-blue-400" />
              <a
                href={`mailto:${content?.contact.email || "azizurehmankhan.dev@gmail.com"}`}
                className="text-blue-400 hover:underline"
              >
                {content?.contact.email || "azizurehmankhan.dev@gmail.com"}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">{content?.contact.phone || "+92-XXX-XXXXXXX"}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPinIcon className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">{content?.contact.location || "Lahore, Pakistan"}</span>
            </div>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href={content?.contact.github || "https://github.com/Aziz-ur-Rehman-Khan"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <a
              href={content?.contact.linkedin || "https://www.linkedin.com/in/aziz-ur-rehman-khan/"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a
              href={content?.contact.medium || "https://medium.com/@azizr5050"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              <FaMedium className="w-6 h-6" />
            </a>
          </div>
        </div>
      </motion.section>

      {/* Skills */}
      {content && (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-xl font-bold text-blue-300 mb-2">Skills</h3>
        <ul className="list-disc ml-6 text-gray-300">
            {content.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
        </ul>
      </motion.section>
      )}

      {/* Projects */}
      {content && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-blue-300 mb-2">Projects</h3>
          <ul className="space-y-4">
            {content.projects.map((project, idx) => (
              <li key={idx} className="bg-gray-800 rounded-lg p-4">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 font-semibold "
                >
                  {project.name}
                </a>
                <p className="text-gray-300">{project.description}</p>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {/* Education */}
      {content && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-blue-300 mb-2">Education</h3>
          {content.education.map((edu, idx) => (
            <div key={idx} className="mb-4">
              <h4 className="font-semibold text-lg">{edu.degree}</h4>
              <span className="text-gray-400 text-sm">{edu.institution}, {edu.year}</span>
            </div>
          ))}
        </motion.section>
      )}

      {/* Download Button */}
      <motion.a
        href="/resume/resume.pdf"
        download
        className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        whileHover={{ scale: 1.05 }}
      >
        Download PDF
      </motion.a>
    </main>
  );
}
