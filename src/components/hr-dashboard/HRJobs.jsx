// import { useEffect, useState } from "react";
// import HRSidebar from "./HRSidebar";
// import { jobsAPI } from "../../api";
// import { Link } from "react-router-dom";

// const statusLabel = (status) => {
//   const s = String(status ?? "").toLowerCase();
//   if (s === "1" || s === "approved") return "Approved";
//   if (s === "2" || s === "rejected") return "Rejected";
//   return "Pending";
// };

// export default function HRJobs() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     jobsAPI
//       .getAll({
//         pageNumber: 1,
//         sortBy: "",
//         sortOrder: "",
//         search: "",
//         location: "",
//         company: "",
//         status: "",
//         employmentType: "",
//         experienceLevel: "",
//       })
//       .then((data) => {
//         const jobs = Array.isArray(data) ? data : (data?.items ?? []);

//         if (jobs.length === 0) return [];

//         return Promise.all(
//           jobs.map((j) => applicationsAPI.getByJob(j.id).catch(() => [])),
//         );
//       })
//       .then((results) => {
//         const all = (results || []).flat();

//         const mapped = all.map((app, idx) => ({
//           id: app.id ?? idx + 1,
//           name: app.candidateName ?? app.candidate?.fullName ?? "Candidate",
//           email: app.candidateEmail ?? app.candidate?.email ?? "",
//           matchScore: app.totalScore ?? app.matchScore ?? 0,
//           status: app.status ?? "Pending",
//           jobTitle: app.jobTitle ?? app.job?.title ?? "",
//         }));

//         setCandidates(mapped);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this job?")) return;
//     try {
//       await jobsAPI.delete(id);
//       setJobs((prev) => prev.filter((job) => job.id !== id));
//     } catch (err) {
//       alert(err.message || "Failed to delete job.");
//     }
//   };

//   return (
//     <div className="candidate-shell">
//       <HRSidebar />

//       <main className="candidate-main">
//         <header className="candidate-topbar">
//           <div>
//             <h1>My Jobs</h1>
//             <p>Manage your job posts</p>
//           </div>
//           <Link
//             to="/hr-dashboard/create-job"
//             className="candidate-wide-button"
//             style={{
//               textDecoration: "none",
//               display: "inline-block",
//               padding: "0.5rem 1.2rem",
//             }}
//           >
//             + New Job
//           </Link>
//         </header>

//         <section className="candidate-view">
//           {loading ? (
//             <p style={{ padding: "1rem" }}>Loading jobs…</p>
//           ) : jobs.length === 0 ? (
//             <div style={{ padding: "2rem", textAlign: "center", opacity: 0.6 }}>
//               <p>No job posts yet.</p>
//               <Link
//                 to="/hr-dashboard/create-job"
//                 className="candidate-wide-button"
//                 style={{
//                   marginTop: "1rem",
//                   display: "inline-block",
//                   textDecoration: "none",
//                 }}
//               >
//                 Post Your First Job
//               </Link>
//             </div>
//           ) : (
//             <div className="candidate-actions">
//               {jobs.map((job) => (
//                 <article className="candidate-action-card" key={job.id}>
//                   <div className="candidate-action-copy">
//                     <span>
//                       <i className="bx bx-briefcase"></i>
//                     </span>
//                     <div>
//                       <h3>{job.title}</h3>
//                       <p>
//                         {job.employmentType} · {job.experienceLevel}
//                       </p>
//                       <small>Status: {statusLabel(job.status)}</small>
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "8px",
//                       marginTop: "1rem",
//                       flexWrap: "wrap",
//                     }}
//                   >
//                     <button
//                       className="candidate-wide-button"
//                       onClick={() => handleDelete(job.id)}
//                       style={{
//                         background: "rgba(239,68,68,0.15)",
//                         color: "#ef4444",
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import HRSidebar from "./HRSidebar";
// import { jobsAPI } from "../../api";
import { Link } from "react-router-dom";

const EMPLOYMENT_TYPES = [
  "All",
  "FullTime",
  "PartTime",
  "Contract",
  "Freelance",
  "Internship",
];
const EXPERIENCE_LEVELS = [
  "All",
  "Junior",
  "MidLevel",
  "Senior",
  "Lead",
  "Manager",
];

// ─── Mock helpers (remove when backend is ready) ──────────────
const getMockJobs = () => JSON.parse(localStorage.getItem("mock_jobs") || "[]");

const deleteMockJob = (id) => {
  const updated = getMockJobs().filter((j) => j.id !== id);
  localStorage.setItem("mock_jobs", JSON.stringify(updated));
};

const updateMockJob = (id, updates) => {
  const updated = getMockJobs().map((j) =>
    j.id === id ? { ...j, ...updates } : j,
  );
  localStorage.setItem("mock_jobs", JSON.stringify(updated));
};
// ─────────────────────────────────────────────────────────────

const badgeStyle = (bg, color) => ({
  background: bg,
  color,
  borderRadius: "20px",
  padding: "0.2rem 0.7rem",
  fontSize: "0.75rem",
  fontWeight: 600,
});

const filterBtnStyle = (active) => ({
  padding: "0.3rem 0.85rem",
  borderRadius: "20px",
  border: active ? "none" : "1px solid #d1d5db",
  background: active ? "#003566" : "#fff",
  color: active ? "#fff" : "#555",
  fontSize: "0.78rem",
  fontWeight: active ? 700 : 400,
  cursor: "pointer",
  transition: "all 0.15s",
});

export default function HRJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── filters ──
  const [filterType, setFilterType] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");

  // ── edit modal ──
  const [editJob, setEditJob] = useState(null); // null = closed

  // useEffect(() => {
  //   // TODO: replace with real API when backend is ready
  //   // jobsAPI.getAll({...}).then(...).catch(...).finally(...)
  //   setJobs(getMockJobs());
  //   setLoading(false);
  // }, []);
  // useEffect(() => {
  //   const savedJobs = JSON.parse(localStorage.getItem("mock_jobs") || "[]");

  //   setJobs(savedJobs);
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    setJobs(getMockJobs());
    setLoading(false);
  }, []);
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      // TODO: await jobsAPI.delete(id);
      deleteMockJob(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete job.");
    }
  };

  const handleEditSave = () => {
    // TODO: await jobsAPI.update(editJob.id, editJob);
    updateMockJob(editJob.id, editJob);
    setJobs((prev) =>
      prev.map((j) => (j.id === editJob.id ? { ...j, ...editJob } : j)),
    );
    setEditJob(null);
  };

  const filtered = jobs.filter((j) => {
    const typeMatch = filterType === "All" || j.employmentType === filterType;
    const levelMatch =
      filterLevel === "All" || j.experienceLevel === filterLevel;
    return typeMatch && levelMatch;
  });
  // const STORAGE_KEY = "mock_jobs";

  // export const getMockJobs = () => {
  //   return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  // };

  // export const saveMockJobs = (jobs) => {
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  // };

  // export const addMockJob = (job) => {
  //   const jobs = getMockJobs();

  //   jobs.push({
  //     ...job,
  //     id: Date.now(),
  //   });

  //   saveMockJobs(jobs);
  // };
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

        {/* ── Filters ── */}
        {!loading && jobs.length > 0 && (
          <div
            style={{
              padding: "0 1.5rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            {/* Employment Type */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#003566",
                  minWidth: "90px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Job Type
              </span>
              {EMPLOYMENT_TYPES.map((t) => (
                <button
                  key={t}
                  style={filterBtnStyle(filterType === t)}
                  onClick={() => setFilterType(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Experience Level */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#003566",
                  minWidth: "90px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Level
              </span>
              {EXPERIENCE_LEVELS.map((l) => (
                <button
                  key={l}
                  style={filterBtnStyle(filterLevel === l)}
                  onClick={() => setFilterLevel(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        <section className="candidate-view">
          {loading ? (
            <p style={{ padding: "1rem" }}>Loading jobs…</p>
          ) : error ? (
            <p style={{ padding: "1rem", color: "red" }}>{error}</p>
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
          ) : filtered.length === 0 ? (
            <p style={{ padding: "1rem", opacity: 0.6 }}>
              No jobs match the selected filters.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {filtered.map((job) => (
                <article
                  key={job.id}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    border: "1px solid #e8f0fe",
                  }}
                >
                  {/* ── Top row: title + actions ── */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.15rem",
                          fontWeight: 700,
                          color: "#003566",
                        }}
                      >
                        {job.title}
                      </h3>
                      <p
                        style={{
                          margin: "0.25rem 0 0",
                          fontSize: "0.85rem",
                          color: "#555",
                        }}
                      >
                        {job.companyName}
                      </p>
                    </div>

                    <div
                      style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}
                    >
                      {/* Edit */}
                      <button
                        onClick={() => setEditJob({ ...job })}
                        title="Edit job"
                        style={{
                          background: "rgba(0,53,102,0.07)",
                          color: "#003566",
                          border: "1px solid rgba(0,53,102,0.2)",
                          borderRadius: "8px",
                          padding: "0.35rem 0.75rem",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <i className="bx bx-edit-alt" /> Edit
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(job.id)}
                        title="Delete job"
                        style={{
                          background: "rgba(239,68,68,0.08)",
                          color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.25)",
                          borderRadius: "8px",
                          padding: "0.35rem 0.75rem",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <i className="bx bx-trash" /> Delete
                      </button>
                    </div>
                  </div>

                  {/* ── Badges ── */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.4rem",
                      margin: "0.9rem 0",
                    }}
                  >
                    <span style={badgeStyle("#e0f7fa", "#00796b")}>
                      {job.employmentType}
                    </span>
                    <span style={badgeStyle("#e8f5e9", "#2e7d32")}>
                      {job.experienceLevel}
                    </span>
                  </div>

                  {/* ── Description ── */}
                  {job.description && (
                    <p
                      style={{
                        margin: "0 0 1rem",
                        fontSize: "0.88rem",
                        color: "#333",
                        lineHeight: 1.6,
                      }}
                    >
                      {job.description}
                    </p>
                  )}

                  {/* ── Skills ── */}
                  {job.categoryNames?.length > 0 && (
                    <div>
                      <p
                        style={{
                          margin: "0 0 0.4rem",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#003566",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Required Skills
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.35rem",
                        }}
                      >
                        {job.categoryNames.map((name) => (
                          <span
                            key={name}
                            style={badgeStyle("#eef2ff", "#3730a3")}
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ══ Edit Modal ══ */}
      {editJob && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditJob(null);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              width: "100%",
              maxWidth: "540px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <h2 style={{ margin: 0, color: "#003566", fontSize: "1.1rem" }}>
                Edit Job
              </h2>
              <button
                onClick={() => setEditJob(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  color: "#888",
                }}
              >
                &times;
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              {/* Title */}
              <div>
                <label style={labelStyle}>Job Title</label>
                <input
                  value={editJob.title}
                  onChange={(e) =>
                    setEditJob((p) => ({ ...p, title: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={editJob.description}
                  onChange={(e) =>
                    setEditJob((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              {/* Employment Type */}
              <div>
                <label style={labelStyle}>Employment Type</label>
                <select
                  value={editJob.employmentType}
                  onChange={(e) =>
                    setEditJob((p) => ({
                      ...p,
                      employmentType: e.target.value,
                    }))
                  }
                  style={inputStyle}
                >
                  {[
                    "FullTime",
                    "PartTime",
                    "Contract",
                    "Freelance",
                    "Internship",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label style={labelStyle}>Experience Level</label>
                <select
                  value={editJob.experienceLevel}
                  onChange={(e) =>
                    setEditJob((p) => ({
                      ...p,
                      experienceLevel: e.target.value,
                    }))
                  }
                  style={inputStyle}
                >
                  {["Junior", "MidLevel", "Senior", "Lead", "Manager"].map(
                    (l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Save */}
              <button
                onClick={handleEditSave}
                style={{
                  marginTop: "0.5rem",
                  background: "#003566",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.7rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#003566",
  marginBottom: "0.3rem",
  textTransform: "uppercase",
  letterSpacing: "0.03em",
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem 0.85rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.9rem",
  color: "#222",
  background: "#f9fafb",
  boxSizing: "border-box",
};
