import { useEffect, useState } from "react";
import HRSidebar from "./HRSidebar";
import { jobsAPI } from "../../api";
import { Link } from "react-router-dom";

const statusLabel = (status) => {
  const s = String(status ?? "").toLowerCase();
  if (s === "1" || s === "approved") return "Approved";
  if (s === "2" || s === "rejected") return "Rejected";
  return "Pending";
};

export default function HRJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsAPI
      .getAll({
        pageNumber: 1,
        sortBy: "",
        sortOrder: "",
        search: "",
        location: "",
        company: "",
        status: "",
        employmentType: "",
        experienceLevel: "",
      })
      .then((data) => {
        const jobs = Array.isArray(data) ? data : (data?.items ?? []);

        if (jobs.length === 0) return [];

        return Promise.all(
          jobs.map((j) => applicationsAPI.getByJob(j.id).catch(() => [])),
        );
      })
      .then((results) => {
        const all = (results || []).flat();

        const mapped = all.map((app, idx) => ({
          id: app.id ?? idx + 1,
          name: app.candidateName ?? app.candidate?.fullName ?? "Candidate",
          email: app.candidateEmail ?? app.candidate?.email ?? "",
          matchScore: app.totalScore ?? app.matchScore ?? 0,
          status: app.status ?? "Pending",
          jobTitle: app.jobTitle ?? app.job?.title ?? "",
        }));

        setCandidates(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await jobsAPI.delete(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete job.");
    }
  };

  return (
    <div className="candidate-shell">
      <HRSidebar />

      <main className="candidate-main">
        <header className="candidate-topbar">
          <div>
            <h1>My Jobs</h1>
            <p>Manage your job posts</p>
          </div>
          <Link
            to="/hr-dashboard/create-job"
            className="candidate-wide-button"
            style={{
              textDecoration: "none",
              display: "inline-block",
              padding: "0.5rem 1.2rem",
            }}
          >
            + New Job
          </Link>
        </header>

        <section className="candidate-view">
          {loading ? (
            <p style={{ padding: "1rem" }}>Loading jobs…</p>
          ) : jobs.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", opacity: 0.6 }}>
              <p>No job posts yet.</p>
              <Link
                to="/hr-dashboard/create-job"
                className="candidate-wide-button"
                style={{
                  marginTop: "1rem",
                  display: "inline-block",
                  textDecoration: "none",
                }}
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="candidate-actions">
              {jobs.map((job) => (
                <article className="candidate-action-card" key={job.id}>
                  <div className="candidate-action-copy">
                    <span>
                      <i className="bx bx-briefcase"></i>
                    </span>
                    <div>
                      <h3>{job.title}</h3>
                      <p>
                        {job.employmentType} · {job.experienceLevel}
                      </p>
                      <small>Status: {statusLabel(job.status)}</small>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="candidate-wide-button"
                      onClick={() => handleDelete(job.id)}
                      style={{
                        background: "rgba(239,68,68,0.15)",
                        color: "#ef4444",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
