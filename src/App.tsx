import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import "./App.css";

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

const createPdfStyles = (scaleValue: number) => {
  const scale = scaleValue || 1;
  return StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
      paddingTop: 26 * scale,
      paddingBottom: 24 * scale,
      paddingHorizontal: 34 * scale,
      fontFamily: "Helvetica",
      fontSize: 9 * scale,
      color: "#0f172a",
    },
    header: {
      borderBottomWidth: 2 * scale,
      borderBottomColor: "#e2e8f0",
      paddingBottom: 8 * scale,
      marginBottom: 10 * scale,
    },
    name: {
      fontSize: 20 * scale,
      fontWeight: 700,
      marginBottom: 4 * scale,
    },
    title: {
      fontSize: 11 * scale,
      fontWeight: 600,
      color: "#1e293b",
      marginBottom: 4 * scale,
    },
    contact: {
      fontSize: 9 * scale,
      color: "#475569",
    },
    section: {
      marginBottom: 8 * scale,
    },
    sectionTitle: {
      fontSize: 10 * scale,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5 * scale,
      marginBottom: 4 * scale,
      color: "#1e293b",
    },
    paragraph: {
      fontSize: 9 * scale,
      lineHeight: 1.4,
    },
    role: {
      marginBottom: 5 * scale,
    },
    roleHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8 * scale,
      fontSize: 9 * scale,
    },
    roleCompany: {
      color: "#64748b",
      fontSize: 8.5 * scale,
      marginTop: 2 * scale,
    },
    roleDates: {
      color: "#475569",
      fontWeight: 600,
      fontSize: 8.5 * scale,
    },
    list: {
      marginTop: 4 * scale,
      paddingLeft: 10 * scale,
    },
    listItem: {
      fontSize: 8.5 * scale,
      lineHeight: 1.35,
      marginBottom: 2 * scale,
    },
    projectTitle: {
      fontWeight: 600,
      fontSize: 9 * scale,
      marginBottom: 1 * scale,
    },
    projectLink: {
      color: "#2563eb",
      fontSize: 8.5 * scale,
      marginBottom: 1 * scale,
    },
    education: {
      marginBottom: 5 * scale,
    },
  });
};

type ResumeDocumentProps = {
  data: ResumeData;
  scale: number;
};

const ResumeDocument = ({ data, scale }: ResumeDocumentProps) => {
  const styles = createPdfStyles(scale);
  const contactLine = [
    data.phone,
    data.email,
    data.linkedin,
    data.location,
  ]
    .filter(Boolean)
    .join(" · ");
  const skillList = data.skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const awardList = splitLines(data.awards);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          {data.title && <Text style={styles.title}>{data.title}</Text>}
          {contactLine && <Text style={styles.contact}>{contactLine}</Text>}
        </View>

        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.paragraph}>{data.summary}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.paragraph}>{skillList.join(", ")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experiences.map((experience, index) => (
            <View style={styles.role} key={`pdf-experience-${index}`}>
              <View style={styles.roleHeader}>
                <View>
                  <Text>{experience.title || "Role"}</Text>
                  <Text style={styles.roleCompany}>
                    {experience.company || "Company"}
                  </Text>
                </View>
                <Text style={styles.roleDates}>{experience.dates}</Text>
              </View>
              {experience.bullets.length > 0 && (
                <View style={styles.list}>
                  {experience.bullets.map((bullet, bulletIndex) => (
                    <Text
                      style={styles.listItem}
                      key={`pdf-exp-${index}-${bulletIndex}`}
                    >
                      • {bullet}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {data.projects.map((project, index) => (
            <View style={styles.role} key={`pdf-project-${index}`}>
              <Text style={styles.projectTitle}>
                {project.name || "Project name"}
              </Text>
              {project.link && (
                <Link style={styles.projectLink} src={project.link}>
                  {project.link}
                </Link>
              )}
              {project.bullets.length > 0 && (
                <View style={styles.list}>
                  {project.bullets.map((bullet, bulletIndex) => (
                    <Text
                      style={styles.listItem}
                      key={`pdf-project-${index}-${bulletIndex}`}
                    >
                      • {bullet}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((entry, index) => (
            <View style={styles.education} key={`pdf-education-${index}`}>
              <View style={styles.roleHeader}>
                <View>
                  <Text>{entry.school || "School"}</Text>
                  <Text style={styles.roleCompany}>{entry.location}</Text>
                </View>
                <Text style={styles.roleDates}>{entry.year}</Text>
              </View>
              {entry.degree && (
                <Text style={styles.paragraph}>{entry.degree}</Text>
              )}
            </View>
          ))}
        </View>

        {awardList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards</Text>
            <View style={styles.list}>
              {awardList.map((award, index) => (
                <Text style={styles.listItem} key={`pdf-award-${index}`}>
                  • {award}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

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
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const safeName = resume.name.trim().replace(/\s+/g, "_") || "Resume";
      const pdfScale = scale || 1;
      const blob = await pdf(
        <ResumeDocument data={resume} scale={pdfScale} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${safeName}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
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

