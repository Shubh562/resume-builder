import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./App.css";

const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;
const A4_HEIGHT_PX = 1123;

type Experience = {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
};

type Project = {
  name: string;
  link: string;
  bullets: string[];
};

type Education = {
  school: string;
  location: string;
  year: string;
  degree: string;
};

type ResumeData = {
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  location: string;
  summary: string;
  skills: string;
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  awards: string;
};

const initialResume: ResumeData = {
  name: "Shubham Soni",
  title: "Senior Member Of Technical Staff",
  phone: "+91-7870577070",
  email: "kumarshubham562@gmail.com",
  linkedin: "linkedin.com/in/shubham-soni",
  location: "Bhubaneswar, India",
  summary:
    "Backend-focused engineer with experience in scalable systems, ITSM workflows, and full-stack delivery.",
  skills:
    "Java, SQL, Spring Boot, Microservices, React, HTML, CSS, MongoDB, MySQL, JavaScript, Jenkins, Generative AI, Prompt Engineering, Oracle Cloud (OCI), Splunk, HTTP, SQL Server, Machine Learning, TypeScript, Python",
  experiences: [
    {
      title: "Senior Member Of Technical Staff",
      company: "Salesforce",
      dates: "Nov 2024 - Present",
      bullets: [
        "Owned technical design and end-to-end implementation of Incident Management service operations for Salesforce ITSM.",
        "Implemented Major Incident Management workflows for faster critical incident handling and resolution.",
        "Designed parent-child incident relationships with automated closure using message queues.",
        "Built core data model entities for the Major Incident module, aligned with platform standards.",
      ],
    },
    {
      title: "Senior Member Of Technical Staff",
      company: "Oracle",
      dates: "Sep 2024 - Oct 2024",
      bullets: [
        "Designed a Java-based system for dynamic allocation and deallocation of cloud services based on requirements.",
      ],
    },
  ],
  projects: [
    {
      name: "Robust Banking System for Secure and Efficient Financial Transactions",
      link: "https://github.com/Shubh562/DBS-Ledger",
      bullets: [
        "Built a Spring Boot application with REST APIs for account management, deposits/withdrawals, and funds transfer.",
        "Used repository, factory, and strategy patterns for maintainable code.",
        "Implemented JWT authentication and authorization to protect sensitive data.",
      ],
    },
  ],
  education: [
    {
      school: "Institute of Technical Education and Research",
      location: "Bhubaneshwar",
      year: "2020",
      degree: "BE/B.Tech/BS",
    },
  ],
  awards:
    "Team Spotlight Award - WellsFargo - 2024\nTeam Spotlight Award - WellsFargo - 2023\nWorking as One Award - Cognizant - 2021",
};

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const App = () => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const resumeContentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [scale, setScale] = useState(1);

  const recomputeScale = useCallback(() => {
    const sheet = resumeRef.current;
    const content = resumeContentRef.current;
    if (!sheet || !content) return;
    const sheetHeight = sheet.clientHeight || A4_HEIGHT_PX;
    const availableHeight = Math.min(sheetHeight, A4_HEIGHT_PX) - 32;
    const contentHeight = content.scrollHeight;
    if (!contentHeight) return;
    const nextScale = Math.min(1, availableHeight / contentHeight);
    if (Math.abs(nextScale - scale) > 0.01) {
      setScale(nextScale);
    }
  }, [scale]);

  useLayoutEffect(() => {
    recomputeScale();
  }, [resume, recomputeScale]);

  useEffect(() => {
    const handleResize = () => recomputeScale();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [recomputeScale]);

  const handleDownload = async () => {
    const element = resumeRef.current;
    if (!element || isDownloading) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgWidth = A4_WIDTH_PT;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= A4_HEIGHT_PT) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        let remainingHeight = imgHeight;
        let position = 0;

        while (remainingHeight > 0) {
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          remainingHeight -= A4_HEIGHT_PT;
          if (remainingHeight > 0) {
            pdf.addPage();
            position -= A4_HEIGHT_PT;
          }
        }
      }

      const safeName = resume.name.trim().replace(/\s+/g, "_") || "Resume";
      pdf.save(`${safeName}_Resume.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string | string[]
  ) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((experience, i) =>
        i === index ? { ...experience, [field]: value } : experience
      ),
    }));
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string | string[]
  ) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      ),
    }));
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const contactLine = [
    resume.phone,
    resume.email,
    resume.linkedin,
    resume.location,
  ]
    .filter(Boolean)
    .join(" · ");

  const skillList = resume.skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const awardList = splitLines(resume.awards);

  return (
    <div className="app">
      <div className="toolbar">
        <div>
          <h1>Resume Builder</h1>
          <p>Fill the form, preview live, and export a single-page resume.</p>
        </div>
        <div className="toolbar-actions">
          <div className="scale-indicator">
            Auto-fit: {(scale * 100).toFixed(0)}%
          </div>
          <button
            type="button"
            className="download-button"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? "Preparing..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="content">
        <aside className="editor">
          <section className="form-section">
            <h3>Basic Details</h3>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                value={resume.name}
                onChange={(event) =>
                  setResume((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </div>
            <div className="field">
              <label htmlFor="title">Headline / Role</label>
              <input
                id="title"
                type="text"
                value={resume.title}
                onChange={(event) =>
                  setResume((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="text"
                  value={resume.phone}
                  onChange={(event) =>
                    setResume((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={resume.email}
                  onChange={(event) =>
                    setResume((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="linkedin">LinkedIn / Portfolio</label>
                <input
                  id="linkedin"
                  type="text"
                  value={resume.linkedin}
                  onChange={(event) =>
                    setResume((prev) => ({
                      ...prev,
                      linkedin: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  value={resume.location}
                  onChange={(event) =>
                    setResume((prev) => ({
                      ...prev,
                      location: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="summary">Summary</label>
              <textarea
                id="summary"
                rows={3}
                value={resume.summary}
                onChange={(event) =>
                  setResume((prev) => ({
                    ...prev,
                    summary: event.target.value,
                  }))
                }
              />
            </div>
            <div className="field">
              <label htmlFor="skills">Skills (comma separated)</label>
              <textarea
                id="skills"
                rows={3}
                value={resume.skills}
                onChange={(event) =>
                  setResume((prev) => ({
                    ...prev,
                    skills: event.target.value,
                  }))
                }
              />
            </div>
          </section>

          <section className="form-section">
            <div className="section-header">
              <h3>Experience</h3>
              <button
                type="button"
                className="ghost-button"
                onClick={() =>
                  setResume((prev) => ({
                    ...prev,
                    experiences: [
                      ...prev.experiences,
                      { title: "", company: "", dates: "", bullets: [] },
                    ],
                  }))
                }
              >
                + Add
              </button>
            </div>
            {resume.experiences.map((experience, index) => (
              <div className="card" key={`experience-${index}`}>
                <div className="field">
                  <label>Role</label>
                  <input
                    type="text"
                    value={experience.title}
                    onChange={(event) =>
                      updateExperience(index, "title", event.target.value)
                    }
                  />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Company</label>
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(event) =>
                        updateExperience(index, "company", event.target.value)
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Dates</label>
                    <input
                      type="text"
                      value={experience.dates}
                      onChange={(event) =>
                        updateExperience(index, "dates", event.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Highlights (one per line)</label>
                  <textarea
                    rows={4}
                    value={experience.bullets.join("\n")}
                    onChange={(event) =>
                      updateExperience(
                        index,
                        "bullets",
                        splitLines(event.target.value)
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  className="danger-button"
                  onClick={() =>
                    setResume((prev) => ({
                      ...prev,
                      experiences: prev.experiences.filter(
                        (_, i) => i !== index
                      ),
                    }))
                  }
                  disabled={resume.experiences.length === 1}
                >
                  Remove Experience
                </button>
              </div>
            ))}
          </section>

          <section className="form-section">
            <div className="section-header">
              <h3>Projects</h3>
              <button
                type="button"
                className="ghost-button"
                onClick={() =>
                  setResume((prev) => ({
                    ...prev,
                    projects: [
                      ...prev.projects,
                      { name: "", link: "", bullets: [] },
                    ],
                  }))
                }
              >
                + Add
              </button>
            </div>
            {resume.projects.map((project, index) => (
              <div className="card" key={`project-${index}`}>
                <div className="field">
                  <label>Project name</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(event) =>
                      updateProject(index, "name", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Link</label>
                  <input
                    type="text"
                    value={project.link}
                    onChange={(event) =>
                      updateProject(index, "link", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Highlights (one per line)</label>
                  <textarea
                    rows={4}
                    value={project.bullets.join("\n")}
                    onChange={(event) =>
                      updateProject(
                        index,
                        "bullets",
                        splitLines(event.target.value)
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  className="danger-button"
                  onClick={() =>
                    setResume((prev) => ({
                      ...prev,
                      projects: prev.projects.filter((_, i) => i !== index),
                    }))
                  }
                  disabled={resume.projects.length === 1}
                >
                  Remove Project
                </button>
              </div>
            ))}
          </section>

          <section className="form-section">
            <div className="section-header">
              <h3>Education</h3>
              <button
                type="button"
                className="ghost-button"
                onClick={() =>
                  setResume((prev) => ({
                    ...prev,
                    education: [
                      ...prev.education,
                      { school: "", location: "", year: "", degree: "" },
                    ],
                  }))
                }
              >
                + Add
              </button>
            </div>
            {resume.education.map((entry, index) => (
              <div className="card" key={`education-${index}`}>
                <div className="field">
                  <label>School</label>
                  <input
                    type="text"
                    value={entry.school}
                    onChange={(event) =>
                      updateEducation(index, "school", event.target.value)
                    }
                  />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Location</label>
                    <input
                      type="text"
                      value={entry.location}
                      onChange={(event) =>
                        updateEducation(index, "location", event.target.value)
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Year</label>
                    <input
                      type="text"
                      value={entry.year}
                      onChange={(event) =>
                        updateEducation(index, "year", event.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Degree</label>
                  <input
                    type="text"
                    value={entry.degree}
                    onChange={(event) =>
                      updateEducation(index, "degree", event.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  className="danger-button"
                  onClick={() =>
                    setResume((prev) => ({
                      ...prev,
                      education: prev.education.filter((_, i) => i !== index),
                    }))
                  }
                  disabled={resume.education.length === 1}
                >
                  Remove Education
                </button>
              </div>
            ))}
          </section>

          <section className="form-section">
            <h3>Awards</h3>
            <div className="field">
              <label htmlFor="awards">Awards (one per line)</label>
              <textarea
                id="awards"
                rows={4}
                value={resume.awards}
                onChange={(event) =>
                  setResume((prev) => ({
                    ...prev,
                    awards: event.target.value,
                  }))
                }
              />
            </div>
          </section>
        </aside>

        <div className="preview-panel">
          <div className="preview-header">
            <h2>Live Preview</h2>
            <span>Auto-fit keeps everything on one page.</span>
          </div>
          <div className="resume-wrapper">
            <div className="resume-sheet" ref={resumeRef}>
              <div
                className="resume-content"
                ref={resumeContentRef}
                style={{ transform: `scale(${scale})` }}
              >
                <header className="resume-header">
                  <div>
                    <h2>{resume.name}</h2>
                    {resume.title && <p className="headline">{resume.title}</p>}
                    {contactLine && <p className="contact-line">{contactLine}</p>}
                  </div>
                </header>

                {resume.summary && (
                  <section className="resume-section">
                    <h3>Summary</h3>
                    <p>{resume.summary}</p>
                  </section>
                )}

                <section className="resume-section">
                  <h3>Skills</h3>
                  <p>{skillList.join(", ")}</p>
                </section>

                <section className="resume-section">
                  <h3>Experience</h3>
                  {resume.experiences.map((experience, index) => (
                    <div className="role" key={`preview-experience-${index}`}>
                      <div className="role-header">
                        <div>
                          <strong>{experience.title || "Role"}</strong>
                          <span>{experience.company || "Company"}</span>
                        </div>
                        <span className="role-dates">{experience.dates}</span>
                      </div>
                      {experience.bullets.length > 0 && (
                        <ul>
                          {experience.bullets.map((bullet, bulletIndex) => (
                            <li key={`exp-${index}-bullet-${bulletIndex}`}>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </section>

                <section className="resume-section">
                  <h3>Projects</h3>
                  {resume.projects.map((project, index) => (
                    <div className="project" key={`preview-project-${index}`}>
                      <div className="project-title">
                        {project.name || "Project name"}
                      </div>
                      {project.link && <a href={project.link}>{project.link}</a>}
                      {project.bullets.length > 0 && (
                        <ul>
                          {project.bullets.map((bullet, bulletIndex) => (
                            <li key={`project-${index}-bullet-${bulletIndex}`}>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </section>

                <section className="resume-section">
                  <h3>Education</h3>
                  {resume.education.map((entry, index) => (
                    <div className="education" key={`preview-education-${index}`}>
                      <div className="role-header">
                        <div>
                          <strong>{entry.school || "School"}</strong>
                          <span>{entry.location}</span>
                        </div>
                        <span className="role-dates">{entry.year}</span>
                      </div>
                      {entry.degree && <p>{entry.degree}</p>}
                    </div>
                  ))}
                </section>

                <section className="resume-section">
                  <h3>Awards</h3>
                  {awardList.length > 0 && (
                    <ul className="award-list">
                      {awardList.map((award, index) => (
                        <li key={`award-${index}`}>{award}</li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

