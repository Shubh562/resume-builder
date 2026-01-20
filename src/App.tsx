import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./App.css";

const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;

const App = () => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

      pdf.save("Shubham_Soni_Resume.pdf");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="app">
      <div className="toolbar">
        <div>
          <h1>Resume Builder</h1>
          <p>Download a PDF in the same one-page format.</p>
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

      <div className="resume-wrapper">
        <div className="resume-sheet" ref={resumeRef}>
          <header className="resume-header">
            <div>
              <h2>Shubham Soni</h2>
              <p className="contact-line">
                +91-7870577070 · LinkedIn: linkedin.com/in/shubham-soni ·
                kumarshubham562@gmail.com
              </p>
            </div>
          </header>

          <section className="resume-section">
            <h3>Skills</h3>
            <p>
              Java, SQL, Spring Boot, Microservices, React, HTML, CSS, MongoDB,
              MySQL, JavaScript, Jenkins, Generative AI, Prompt Engineering,
              Oracle Cloud (OCI), Splunk, HTTP, SQL Server, Machine Learning,
              TypeScript, Python
            </p>
          </section>

          <section className="resume-section">
            <h3>Experience</h3>

            <div className="role">
              <div className="role-header">
                <div>
                  <strong>Senior Member Of Technical Staff</strong>
                  <span>Salesforce</span>
                </div>
                <span className="role-dates">Nov 2024 - Present</span>
              </div>
              <ul>
                <li>
                  Owned technical design and end-to-end implementation of
                  Incident Management service operations for Salesforce ITSM.
                </li>
                <li>
                  Implemented Major Incident Management workflows for faster
                  critical incident handling and resolution.
                </li>
                <li>
                  Designed parent-child incident relationships with automated
                  closure using message queues.
                </li>
                <li>
                  Built core data model entities for the Major Incident module,
                  aligned with platform standards.
                </li>
                <li>
                  Delivered setup configuration LWC components integrated with
                  Aura components.
                </li>
                <li>
                  Enhanced Incident and Problem Management dashboards for better
                  visibility and actionable insights.
                </li>
                <li>
                  Contributed to Agentforce by adding AI-powered suggestions and
                  proactive action buttons for ITSM workflows.
                </li>
              </ul>
            </div>

            <div className="role">
              <div className="role-header">
                <div>
                  <strong>Senior Member Of Technical Staff</strong>
                  <span>Oracle</span>
                </div>
                <span className="role-dates">Sep 2024 - Oct 2024</span>
              </div>
              <ul>
                <li>
                  Designed a Java-based system for dynamic allocation and
                  deallocation of cloud services based on requirements.
                </li>
              </ul>
            </div>

            <div className="role">
              <div className="role-header">
                <div>
                  <strong>Software Engineer (Assistant Vice President)</strong>
                  <span>Wells Fargo</span>
                </div>
                <span className="role-dates">Feb 2022 - Sep 2024</span>
              </div>
              <ul>
                <li>
                  Built scalable backend systems using Spring Boot, Java, and
                  MongoDB, improving efficiency by 30%.
                </li>
                <li>
                  Improved performance with caching and indexing, reducing
                  response times by 25%.
                </li>
                <li>
                  Led a blockchain securitization platform using Corda and DLT.
                </li>
                <li>
                  Applied complex data structures and algorithms for blockchain
                  development.
                </li>
                <li>
                  Delivered a React user interface for the Corda project.
                </li>
              </ul>
            </div>

            <div className="role">
              <div className="role-header">
                <div>
                  <strong>Application Engineer 2</strong>
                  <span>Oracle</span>
                </div>
                <span className="role-dates">Mar 2022 - Feb 2023</span>
              </div>
              <ul>
                <li>
                  Spearheaded full lifecycle initiatives including database
                  architecture, application design, and integration.
                </li>
                <li>
                  Applied Spring Framework, Oracle Application Framework, PL/SQL,
                  and SQL in enterprise applications.
                </li>
                <li>
                  Improved E-Business Suite applications, boosting efficiency by
                  20%.
                </li>
              </ul>
            </div>

            <div className="role">
              <div className="role-header">
                <div>
                  <strong>Programmer Analyst</strong>
                  <span>Cognizant</span>
                </div>
                <span className="role-dates">Jan 2020 - Mar 2022</span>
              </div>
              <ul>
                <li>
                  Developed Java applications aligned to business needs,
                  improving satisfaction.
                </li>
                <li>
                  Analyzed requirements and drove design for a 20% improvement
                  in user engagement.
                </li>
                <li>
                  Built intuitive web pages and user experiences.
                </li>
                <li>
                  Delivered robust backend web applications, improving
                  reliability by 15%.
                </li>
              </ul>
            </div>
          </section>

          <section className="resume-section">
            <h3>Projects</h3>
            <div className="project">
              <div className="project-title">
                Robust Banking System for Secure and Efficient Financial
                Transactions
              </div>
              <a href="https://github.com/Shubh562/DBS-Ledger">
                https://github.com/Shubh562/DBS-Ledger
              </a>
              <ul>
                <li>
                  Built a Spring Boot application with REST APIs for account
                  management, deposits/withdrawals, and funds transfer.
                </li>
                <li>
                  Used repository, factory, and strategy patterns for
                  maintainable code.
                </li>
                <li>
                  Implemented JWT authentication and authorization to protect
                  sensitive data.
                </li>
              </ul>
            </div>
          </section>

          <section className="resume-section">
            <h3>Education</h3>
            <div className="role-header">
              <div>
                <strong>Institute of Technical Education and Research</strong>
                <span>Bhubaneshwar</span>
              </div>
              <span className="role-dates">2020</span>
            </div>
            <p>BE/B.Tech/BS</p>
          </section>

          <section className="resume-section">
            <h3>Awards</h3>
            <ul className="award-list">
              <li>Team Spolight Award - WellsFargo - 2024</li>
              <li>Team Spolight Award - WellsFargo - 2023</li>
              <li>Working as One Award - Cognizant - 2021</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default App;

