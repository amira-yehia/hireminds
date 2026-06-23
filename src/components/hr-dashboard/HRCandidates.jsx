import { useState, useEffect } from "react";
import HRSidebar from "./HRSidebar";
import { applicationsAPI, jobsAPI } from "../../api";
import { Link } from "react-router-dom";

export default function HRCandidates() {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load jobs, then fetch applications for each job
    jobsAPI.getAll()
      .then((data) => {
        const jobs = Array.isArray(data) ? data : data?.items ?? [];
        if (jobs.length === 0) return [];
        return Promise.all(jobs.map((j) => applicationsAPI.getByJob(j.id).catch(() => [])));
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
          _raw: app,
        }));
        setCandidates(mapped);
      })
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="candidate-shell">
      <HRSidebar />

      <main className="candidate-main">
        <header className="candidate-topbar">
          <div>
            <h1>Candidates</h1>
            <p>Review candidates and AI reports</p>
          </div>
        </header>

        <section className="candidate-view">
          <div className="candidate-profile-card">
            <h2>Search Candidates</h2>
            <div className="input-box">
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <p style={{ padding: "1rem" }}>Loading candidates…</p>
          ) : filteredCandidates.length === 0 ? (
            <p style={{ padding: "1rem", opacity: 0.6 }}>No candidates found.</p>
          ) : (
            <div className="candidate-actions">
              {filteredCandidates.map((candidate) => (
                <article className="candidate-action-card" key={candidate.id}>
                  <div className="candidate-action-copy">
                    <span>
                      <i className="bx bx-user"></i>
                    </span>
                    <div>
                      <h3>{candidate.name}</h3>
                      <p>{candidate.email}</p>
                      {candidate.jobTitle && <small>Applied for: {candidate.jobTitle}</small>}
                      {candidate.matchScore > 0 && (
                        <small style={{ display: "block" }}>
                          Match Score: {candidate.matchScore}%
                        </small>
                      )}
                    </div>
                  </div>
                  <Link to={`/hr-dashboard/reports/${candidate.id}`}>
                    View Report
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
