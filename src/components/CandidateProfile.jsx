import { useEffect, useMemo, useState } from "react";
import CandidateSidebar from "./CandidateSidebar";
import { candidateAPI, getSession } from "../api";

const fallbackProfile = {
  fullName: "Sarah Chen",
  jobTitle: "Full Stack Developer",
  email: "sarah.chen@email.com",
  location: "San Francisco, CA",
  phone: "+1 (555) 013-4829",
  bio: "Passionate full-stack engineer with 5+ years of experience building scalable web applications, specializing in React, Node.js, and cloud architecture.",
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "PostgreSQL",
    "AWS",
    "Docker",
    "GraphQL",
    "Next.js",
    "Tailwind CSS",
  ],
  projects: [
    {
      title: "DataFlow Analytics Platform",
      description:
        "Real-time data visualization platform processing 10M+ events daily.",
      stack: ["React", "D3.js", "Kafka", "Python"],
    },
    {
      title: "EcoTrack Mobile App",
      description:
        "Carbon footprint tracking app with recommendations and social features.",
      stack: ["React Native", "Node.js", "TensorFlow"],
    },
    {
      title: "DevTools CLI",
      description:
        "Open-source CLI tool for developer productivity with an active community.",
      stack: ["TypeScript", "Node.js", "OCLIF"],
    },
  ],
  experience: [
    {
      role: "Senior Full Stack Developer",
      company: "TechCorp Inc.",
      date: "2022 - Present",
      details:
        "Lead a team of 6 engineers building enterprise SaaS products. Reduced API latency by 60%.",
    },
    {
      role: "Full Stack Developer",
      company: "StartupX",
      date: "2020 - 2022",
      details:
        "Built core platform features from scratch, scaling user base from 1K to 100K+ active users.",
    },
    {
      role: "Software Engineer",
      company: "WebStudio",
      date: "2019 - 2020",
      details:
        "Developed client web applications using React and Node.js across various industries.",
    },
  ],
  education: {
    degree: "B.Sc Computer Science",
    school: "Stanford University",
    date: "2015 - 2019",
  },
  certifications: [
    "AWS Solutions Architect",
    "Google Cloud Professional",
    "Certified Kubernetes Administrator",
  ],
};

const getInitials = (name = "Candidate") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const normalizeSkills = (skills) =>
  Array.isArray(skills) && skills.length
    ? skills.map((skill) => skill?.name ?? skill).filter(Boolean)
    : fallbackProfile.skills;

export default function CandidateProfile() {
  const { userId } = getSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    candidateAPI
      .getProfile(userId)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const data = useMemo(
    () => ({
      ...fallbackProfile,
      ...profile,
      skills: normalizeSkills(profile?.skills),
    }),
    [profile],
  );

  const initials = getInitials(data.fullName);

  if (loading) {
    return (
      <div className="candidate-shell">
        <CandidateSidebar />
        <main className="candidate-main candidate-profile-loading">
          <p>Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="candidate-shell">
      <CandidateSidebar />
      <main className="candidate-main">
        <header className="candidate-topbar">
          <div>
            <h1>My Profile</h1>
            <p>Review your public candidate profile and portfolio details.</p>
          </div>
        </header>

        <section className="candidate-view candidate-profile-page">
          <article className="candidate-profile-hero">
            <div className="candidate-profile-identity">
              <div className="candidate-profile-avatar">
                {data.photoUrl ? (
                  <img src={data.photoUrl} alt={`${data.fullName} avatar`} />
                ) : (
                  initials
                )}
              </div>

              <div className="candidate-profile-intro">
                <h2>{data.fullName || "Candidate"}</h2>
                <p>{data.jobTitle || "Candidate"}</p>
                <div className="candidate-profile-meta">
                  <span>
                    <i className="bx bx-map"></i>
                    {data.location}
                  </span>
                  <span>
                    <i className="bx bx-envelope"></i>
                    {data.email}
                  </span>
                  <span>
                    <i className="bx bx-phone"></i>
                    {data.phone}
                  </span>
                </div>
                <p className="candidate-profile-bio">{data.bio}</p>
              </div>
            </div>
          </article>

          <ProfileSection icon="bx-code-alt" title="Technical Skills">
            <div className="candidate-profile-skill-grid">
              {data.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </ProfileSection>

          <ProfileSection icon="bx-briefcase-alt-2" title="Featured Projects">
            <div className="candidate-profile-projects">
              {fallbackProfile.projects.map((project) => (
                <article
                  className="candidate-profile-project"
                  key={project.title}
                >
                  <div>
                    <h3>{project.title}</h3>
                    <i className="bx bx-link-external"></i>
                  </div>
                  <p>{project.description}</p>
                  <div className="candidate-profile-mini-tags">
                    {project.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </ProfileSection>

          <ProfileSection icon="bx-briefcase" title="Experience">
            <div className="candidate-profile-timeline">
              {fallbackProfile.experience.map((item) => (
                <article
                  className="candidate-profile-timeline-item"
                  key={item.role}
                >
                  <div>
                    <h3>{item.role}</h3>
                    <span>{item.date}</span>
                  </div>
                  <strong>{item.company}</strong>
                  <p>{item.details}</p>
                </article>
              ))}
            </div>
          </ProfileSection>

          <div className="candidate-profile-bottom-grid">
            <ProfileSection icon="bx-book-open" title="Education">
              <div className="candidate-profile-compact">
                <h3>{fallbackProfile.education.degree}</h3>
                <strong>{fallbackProfile.education.school}</strong>
                <p>{fallbackProfile.education.date}</p>
              </div>
            </ProfileSection>

            <ProfileSection icon="bx-certification" title="Certifications">
              <ul className="candidate-profile-certifications">
                {fallbackProfile.certifications.map((certification) => (
                  <li key={certification}>{certification}</li>
                ))}
              </ul>
            </ProfileSection>
          </div>
        </section>
      </main>
    </div>
  );
}

function ProfileSection({ children, icon, title }) {
  return (
    <article className="candidate-profile-section">
      <h2>
        <i className={`bx ${icon}`}></i>
        {title}
      </h2>
      {children}
    </article>
  );
}
