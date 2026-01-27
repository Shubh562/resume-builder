import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import "./App.css";

const A4_HEIGHT_PX = 1123;

type Experience = {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
};

type Education = {
  school: string;
  location: string;
  year: string;
  degree: string;
};

type CustomSection = {
  title: string;
  content: string;
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
  education: Education[];
  customSections: CustomSection[];
  awards: string;
};

const initialResume: ResumeData = {
  name: "Shubham Soni",
  title: "Senior Member Of Technical Staff",
  phone: "+91-7870577070",
  email: "kumarshubham562@gmail.com",
  linkedin: "https://www.linkedin.com/in/shubsoni/",
  location: "Bhubaneswar, India",
  summary:
    "Backend Software Engineer with 5+ years of experience designing and scaling distributed, high-performance systems using Java, Spring Boot, SQL, and Microservices. Proven expertise in building cloud-native, fault-tolerant platforms, optimizing SLIs/SLOs, working with large-scale data systems, and delivering customer-impacting features. Strong background in system design, A/B experimentation support, and cross-functional collaboration.",
  skills:
    "Java, SQL, Spring Boot, Microservices, React, HTML, CSS, MongoDB, MySQL, JavaScript, Jenkins, Generative AI, Prompt Engineering, Oracle Cloud (OCI), Splunk, HTTP, SQL Server, Machine Learning, TypeScript, Python",
  experiences: [
    {
      title: "Senior Member Of Technical Staff",
      company: "Salesforce",
      dates: "Nov 2024 - Present",
      bullets: [
        "Designed and executed an end-to-end benchmarking framework comparing a fine-tuned Phi-3.5 (QLoRA) Small Language Model against GPT-4o-mini for complex ITSM reasoning tasks, including ticket classification, ontology mapping, and ITIL v4 compliance.",
        "Demonstrated 97.4% BERTScore F1 and 96.7% semantic similarity, establishing functional parity with GPT-4o-mini while reducing model size to ~2.1 GB and inference VRAM to ~9.5 GB.",
        "Worked on Agentforce by creating AI-powered agents and adding proactive action buttons for AI-based suggestions, enabling intelligent recommendations and faster decision-making within ITSM processes.",
        "Designed and implemented Major Incident Management workflows, ensuring efficient handling and resolution of critical incidents.",
        "Designed and developed core data model entities for the Major Incident Management module, aligning with platform standards.",
        "Designed a headless, actor-based background execution framework to support long-running, multi-day ITSM and compliance workflows, decoupled from user sessions and record lifecycles.",
        "Enhanced and customized Incident and Problem Management dashboards, providing improved visibility and actionable insights for ITSM operations.",
      ],
    },
    {
      title: "Senior Member Of Technical Staff",
      company: "Oracle",
      dates: "Sep 2024 - Oct 2024",
      bullets: [
        "Built Java-based distributed services for dynamic cloud resource provisioning and de-provisioning.",
        "Improved system scalability and cost efficiency through optimized scheduling and capacity algorithms.",
      ],
    },
    {
      title: "Software Engineer (AVP)",
      company: "Wells Fargo",
      dates: "Feb 2022 – Sep 2024",
      bullets: [
        "Developed high-throughput backend services using Java, Spring Boot, MongoDB, and REST, serving millions of transactions.",
        "Improved latency by 25% using advanced caching, indexing, and query optimization on relational and NoSQL systems.",
        "Designed fault-tolerant microservice architecture with containerization (Docker) and orchestration (Kubernetes).",
        "Led development of a blockchain-based distributed ledger platform using Corda and DLT.",
        "Supported experimentation frameworks and feature rollouts aligned with A/B testing strategies.",
      ],
    },
    {
      title: "Application Engineer 2",
      company: "Oracle",
      dates: "Mar 2021 – Feb 2022",
      bullets: [
        "Built enterprise-scale backend systems using Java, PL/SQL, Spring, and Oracle E-Business Suite.",
        "Optimized database performance and API throughput, improving system efficiency by 20%.",
      ],
    },
    {
      title: "Programmer Analyst",
      company: "Cognizant",
      dates: "Jan 2020 – Mar 2021",
      bullets: [
        "Developed scalable Java web applications and REST APIs with high availability and security.",
        "Contributed to system design, performance tuning, and frontend integration.",
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
    {
      school: "Woolf",
      location: "Europe",
      year: "2025",
      degree: "Ms in computer science",
    },
  ],
  customSections: [],
  awards:
    "Team Spotlight Award - WellsFargo - 2023, 2024\nWorking as One Award - Cognizant - 2021",
};

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const normalizeUrl = (value: string) => {
  if (!value) return "";
  return value.startsWith("http") ? value : `https://${value}`;
};

type AiTarget = "summary" | "skills" | "experience" | "awards";

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
      marginBottom: 2 * scale,
    },
    roleHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 4 * scale,
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
      marginTop: 1 * scale,
      paddingLeft: 10 * scale,
    },
    listItem: {
      fontSize: 8.5 * scale,
      lineHeight: 1.3,
      marginBottom: 0.5 * scale,
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
  const contactItems = [
    { label: data.phone },
    { label: data.email },
    data.linkedin
      ? { label: data.linkedin, href: normalizeUrl(data.linkedin) }
      : null,
    { label: data.location },
  ].filter(Boolean) as { label: string; href?: string }[];
  const skillList = data.skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const awardList = splitLines(data.awards);
  const customSections = data.customSections.filter(
    (section) => section.title.trim() || section.content.trim()
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          {data.title && <Text style={styles.title}>{data.title}</Text>}
          {contactItems.length > 0 && (
            <Text style={styles.contact}>
              {contactItems.map((item, index) => (
                <Text key={`contact-${index}`}>
                  {item.href ? (
                    <Link src={item.href}>{item.label}</Link>
                  ) : (
                    item.label
                  )}
                  {index < contactItems.length - 1 ? " · " : ""}
                </Text>
              ))}
            </Text>
          )}
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

        {customSections.map((section, index) => {
          const lines = splitLines(section.content);
          return (
            <View style={styles.section} key={`pdf-custom-${index}`}>
              <Text style={styles.sectionTitle}>
                {section.title || "Additional Section"}
              </Text>
              {lines.length > 1 ? (
                <View style={styles.list}>
                  {lines.map((line, lineIndex) => (
                    <Text
                      style={styles.listItem}
                      key={`pdf-custom-${index}-${lineIndex}`}
                    >
                      • {line}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text style={styles.paragraph}>{section.content}</Text>
              )}
            </View>
          );
        })}

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
  const [aiTarget, setAiTarget] = useState<AiTarget>("summary");
  const [aiTargetIndex, setAiTargetIndex] = useState(0);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);
  const [openAiKey, setOpenAiKey] = useState(
    (import.meta.env.VITE_OPENAI_API_KEY as string | undefined) ?? ""
  );
  const openAiModel =
    (import.meta.env.VITE_OPENAI_MODEL as string | undefined) ?? "gpt-4o-mini";

  useEffect(() => {
    const storedKey = localStorage.getItem("resume_builder_openai_key");
    if (storedKey && !openAiKey) {
      setOpenAiKey(storedKey);
    }
  }, [openAiKey]);

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

  const handleDownloadDocx = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
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
      const customSections = resume.customSections.filter(
        (section) => section.title.trim() || section.content.trim()
      );

      const sections: Paragraph[] = [
        new Paragraph({
          children: [
            new TextRun({ text: resume.name, bold: true, size: 32 }),
          ],
        }),
      ];

      if (resume.title) {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: resume.title, bold: true })],
          })
        );
      }
      if (contactLine) {
        sections.push(new Paragraph({ children: [new TextRun(contactLine)] }));
      }

      if (resume.summary) {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: "Summary", bold: true })],
          }),
          new Paragraph(resume.summary)
        );
      }

      sections.push(
        new Paragraph({ children: [new TextRun({ text: "Skills", bold: true })] }),
        new Paragraph(skillList.join(", "))
      );

      sections.push(
        new Paragraph({
          children: [new TextRun({ text: "Experience", bold: true })],
        })
      );
      resume.experiences.forEach((experience) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: experience.title || "Role", bold: true }),
              new TextRun(` — ${experience.company || "Company"}`),
              new TextRun(` (${experience.dates})`),
            ],
          })
        );
        experience.bullets.forEach((bullet) => {
          sections.push(new Paragraph({ text: `• ${bullet}` }));
        });
      });

      sections.push(
        new Paragraph({
          children: [new TextRun({ text: "Education", bold: true })],
        })
      );
      resume.education.forEach((entry) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: entry.school || "School", bold: true }),
              new TextRun(` — ${entry.location}`),
              new TextRun(` (${entry.year})`),
            ],
          })
        );
        if (entry.degree) {
          sections.push(new Paragraph(entry.degree));
        }
      });

      customSections.forEach((section) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.title || "Additional Section",
                bold: true,
              }),
            ],
          })
        );
        const lines = splitLines(section.content);
        if (lines.length > 1) {
          lines.forEach((line) => {
            sections.push(new Paragraph({ text: `• ${line}` }));
          });
        } else if (section.content.trim()) {
          sections.push(new Paragraph(section.content));
        }
      });

      if (awardList.length > 0) {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: "Awards", bold: true })],
          })
        );
        awardList.forEach((award) => {
          sections.push(new Paragraph({ text: `• ${award}` }));
        });
      }

      const doc = new DocxDocument({
        sections: [
          {
            properties: {},
            children: sections,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const safeName = resume.name.trim().replace(/\s+/g, "_") || "Resume";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${safeName}_Resume.docx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const buildAiPrompt = () => {
    const nameLine = resume.name ? `Candidate: ${resume.name}` : "";
    const titleLine = resume.title ? `Target role: ${resume.title}` : "";
    const baseContext = [nameLine, titleLine].filter(Boolean).join("\n");

    if (aiTarget === "summary") {
      return `${baseContext}\nWrite a 2-3 sentence professional resume summary in a confident tone. Avoid buzzwords.`;
    }
    if (aiTarget === "skills") {
      return `${baseContext}\nSuggest a concise, comma-separated skills list relevant to the role.`;
    }
    if (aiTarget === "experience") {
      const experience = resume.experiences[aiTargetIndex];
      const context = experience
        ? `Role: ${experience.title}\nCompany: ${experience.company}\nDates: ${experience.dates}`
        : "Role details not provided.";
      return `${baseContext}\n${context}\nWrite 3-5 achievement-focused bullet points with measurable impact.`;
    }
    return `${baseContext}\nCreate 2-3 resume award entries in a clean format.`;
  };

  const handleGenerateAi = async () => {
    if (!openAiKey) {
      setAiError("Missing VITE_OPENAI_API_KEY in .env.");
      return;
    }
    if (aiLoading) return;
    setAiLoading(true);
    setAiError("");
    try {
      const prompt = [buildAiPrompt(), aiPrompt.trim()]
        .filter(Boolean)
        .join("\n\nAdditional instructions:\n");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: openAiModel,
          messages: [
            {
              role: "system",
              content:
                "You are a resume writing assistant. Provide concise, professional output only.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "OpenAI request failed.");
      }
      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = data.choices?.[0]?.message?.content?.trim() ?? "";
      setAiResult(content);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "AI request failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAi = () => {
    if (!aiResult.trim()) return;
    if (aiTarget === "summary") {
      setResume((prev) => ({ ...prev, summary: aiResult.trim() }));
      return;
    }
    if (aiTarget === "skills") {
      setResume((prev) => ({ ...prev, skills: aiResult.trim() }));
      return;
    }
    if (aiTarget === "awards") {
      setResume((prev) => ({ ...prev, awards: aiResult.trim() }));
      return;
    }
    if (aiTarget === "experience") {
      updateExperience(aiTargetIndex, "bullets", splitLines(aiResult));
      return;
    }
  };

  const openAiModal = (target: AiTarget, index = 0) => {
    setAiTarget(target);
    setAiTargetIndex(index);
    setAiPrompt("");
    setAiResult("");
    setAiError("");
    setAiModalOpen(true);
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

  const contactItems = [
    { label: resume.phone },
    { label: resume.email },
    resume.linkedin
      ? { label: resume.linkedin, href: normalizeUrl(resume.linkedin) }
      : null,
    { label: resume.location },
  ].filter(Boolean) as { label: string; href?: string }[];

  const skillList = resume.skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const awardList = splitLines(resume.awards);

  return (
    <div className="app">
      <div className="toolbar">
        <div>
          <h1>
            <span className="app-icon">📄</span>
            Resume Builder
          </h1>
          <p>Fill the form, preview live, and export a single-page resume.</p>
        </div>
        <div className="toolbar-actions">
          <div className="scale-indicator">
            Auto-fit: {(scale * 100).toFixed(0)}%
        </div>
          <button
            type="button"
            className="ghost-button"
            onClick={() => setAiSettingsOpen(true)}
          >
            AI Settings
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={handleDownloadDocx}
            disabled={isDownloading}
          >
            {isDownloading ? "Preparing..." : "Download DOCX"}
          </button>
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
            <h3>
              <span className="section-icon">👤</span>
              Basic Details
            </h3>
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
              <label htmlFor="summary">
                Summary
                <button
                  type="button"
                  className="inline-ai-button"
                  onClick={() => openAiModal("summary")}
                >
                  Ask AI
                </button>
              </label>
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
              <label htmlFor="skills">
                Skills (comma separated)
                <button
                  type="button"
                  className="inline-ai-button"
                  onClick={() => openAiModal("skills")}
                >
                  Ask AI
                </button>
              </label>
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
              <h3>
                <span className="section-icon">💼</span>
                Experience
              </h3>
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
                <div className="card-header">
                  <strong>Experience {index + 1}</strong>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => openAiModal("experience", index)}
                  >
                    Ask AI
                  </button>
              </div>
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
              <h3>
                <span className="section-icon">🎓</span>
                Education
              </h3>
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
            <h3>
              <span className="section-icon">🏆</span>
              Awards
            </h3>
            <div className="field">
              <label htmlFor="awards">
                Awards (one per line)
                <button
                  type="button"
                  className="inline-ai-button"
                  onClick={() => openAiModal("awards")}
                >
                  Ask AI
                </button>
              </label>
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

          <section className="form-section">
            <div className="section-header">
              <h3>
                <span className="section-icon">➕</span>
                Custom Sections
              </h3>
              <button
                type="button"
                className="ghost-button"
                onClick={() =>
                  setResume((prev) => ({
                    ...prev,
                    customSections: [
                      ...prev.customSections,
                      { title: "", content: "" },
                    ],
                  }))
                }
              >
                + Add
              </button>
              </div>
            {resume.customSections.length === 0 && (
              <p className="ai-note">Add any extra sections you want.</p>
            )}
            {resume.customSections.map((section, index) => (
              <div className="card" key={`custom-${index}`}>
                <div className="card-header">
                  <strong>Section {index + 1}</strong>
                  <button
                    type="button"
                    className="danger-button danger-inline"
                    onClick={() =>
                      setResume((prev) => ({
                        ...prev,
                        customSections: prev.customSections.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                  >
                    Remove
                  </button>
            </div>
                <div className="field">
                  <label>Section title</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(event) =>
                      setResume((prev) => ({
                        ...prev,
                        customSections: prev.customSections.map((item, i) =>
                          i === index
                            ? { ...item, title: event.target.value }
                            : item
                        ),
                      }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Content (one per line)</label>
                  <textarea
                    rows={3}
                    value={section.content}
                    onChange={(event) =>
                      setResume((prev) => ({
                        ...prev,
                        customSections: prev.customSections.map((item, i) =>
                          i === index
                            ? { ...item, content: event.target.value }
                            : item
                        ),
                      }))
                    }
                  />
                </div>
              </div>
            ))}
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
                {contactItems.length > 0 && (
                  <p className="contact-line">
                    {contactItems.map((item, index) => (
                      <span key={`contact-${index}`}>
                        {item.href ? (
                          <a
                            className="contact-link"
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {item.label}
                          </a>
                        ) : (
                          item.label
                        )}
                        {index < contactItems.length - 1 ? " · " : ""}
                      </span>
                    ))}
                  </p>
                )}
                  </div>
                </header>

                {resume.summary && (
                  <section className="resume-section">
                  <h3>
                    <span className="section-icon">📝</span>
                    Summary
                  </h3>
                    <p>{resume.summary}</p>
                  </section>
                )}

                <section className="resume-section">
                  <h3>
                    <span className="section-icon">🧰</span>
                    Skills
                  </h3>
                  <p>{skillList.join(", ")}</p>
                </section>

                <section className="resume-section">
                  <h3>
                    <span className="section-icon">💼</span>
                    Experience
                  </h3>
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
            <h3>
              <span className="section-icon">🎓</span>
              Education
            </h3>
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
            <h3>
              <span className="section-icon">🏆</span>
              Awards
            </h3>
                  {awardList.length > 0 && (
            <ul className="award-list">
                      {awardList.map((award, index) => (
                        <li key={`award-${index}`}>{award}</li>
                      ))}
            </ul>
                  )}
          </section>
          {resume.customSections
            .filter((section) => section.title.trim() || section.content.trim())
            .map((section, index) => {
              const lines = splitLines(section.content);
              return (
                <section
                  className="resume-section"
                  key={`preview-custom-${index}`}
                >
                  <h3>
                    <span className="section-icon">➕</span>
                    {section.title || "Additional Section"}
                  </h3>
                  {lines.length > 1 ? (
                    <ul>
                      {lines.map((line, lineIndex) => (
                        <li key={`custom-${index}-${lineIndex}`}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{section.content}</p>
                  )}
                </section>
              );
            })}
        </div>
      </div>
          </div>
        </div>
      </div>

      {aiModalOpen && (
        <div className="modal-overlay" onClick={() => setAiModalOpen(false)}>
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h3>AI Writing Helper</h3>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setAiModalOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="field">
              <label htmlFor="ai-modal-target">Target section</label>
              <select
                id="ai-modal-target"
                value={aiTarget}
                onChange={(event) =>
                  setAiTarget(event.target.value as AiTarget)
                }
              >
                <option value="summary">Summary</option>
                <option value="skills">Skills</option>
                <option value="experience">Experience bullets</option>
                <option value="awards">Awards</option>
              </select>
            </div>
            {aiTarget === "experience" && (
              <div className="field">
                <label htmlFor="ai-modal-index">Choose item</label>
                <select
                  id="ai-modal-index"
                  value={aiTargetIndex}
                  onChange={(event) =>
                    setAiTargetIndex(Number(event.target.value))
                  }
                >
                  {resume.experiences.map((item, index) => (
                    <option key={`ai-modal-exp-${index}`} value={index}>
                      {`${item.title || "Role"} - ${item.company || "Company"}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="field">
              <label htmlFor="ai-modal-prompt">Extra instructions</label>
              <textarea
                id="ai-modal-prompt"
                rows={3}
                placeholder="Example: Use action verbs and quantify impact."
                value={aiPrompt}
                onChange={(event) => setAiPrompt(event.target.value)}
              />
            </div>
            <div className="ai-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={handleGenerateAi}
                disabled={aiLoading}
              >
                {aiLoading ? "Generating..." : "Generate suggestions"}
              </button>
              <button
                type="button"
                className="download-button"
                onClick={() => {
                  handleApplyAi();
                  setAiModalOpen(false);
                }}
                disabled={!aiResult.trim()}
              >
                Apply to form
              </button>
            </div>
            {aiError && <p className="ai-error">{aiError}</p>}
            {aiResult && (
              <div className="ai-result">
                <strong>Suggestion</strong>
                <pre>{aiResult}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {aiSettingsOpen && (
        <div className="modal-overlay" onClick={() => setAiSettingsOpen(false)}>
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h3>AI Settings</h3>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setAiSettingsOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="field">
              <label htmlFor="ai-key">OpenAI API key</label>
              <input
                id="ai-key"
                type="password"
                placeholder="sk-..."
                value={openAiKey}
                onChange={(event) => {
                  const value = event.target.value.trim();
                  setOpenAiKey(value);
                  if (value) {
                    localStorage.setItem("resume_builder_openai_key", value);
                  } else {
                    localStorage.removeItem("resume_builder_openai_key");
                  }
                }}
              />
              <p className="ai-note">
                Your key is stored locally in your browser. You can also set
                VITE_OPENAI_API_KEY in a .env file.
              </p>
            </div>
            <div className="ai-result">
              <strong>How to generate an OpenAI API key</strong>
              <ol>
                <li>Go to https://platform.openai.com/</li>
                <li>Sign in and open API keys from the sidebar.</li>
                <li>Click "Create new secret key".</li>
                <li>Copy the key and paste it here.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

