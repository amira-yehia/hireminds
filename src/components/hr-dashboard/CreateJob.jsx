import { useState, useEffect } from "react";
import HRSidebar from "./HRSidebar";
import { jobsAPI, companyAPI, categoryAPI } from "../../api";

const EXPERIENCE_LEVELS = ["Junior", "MidLevel", "Senior", "Lead", "Manager"];
const EMPLOYMENT_TYPES = [
  "FullTime",
  "PartTime",
  "Contract",
  "Freelance",
  "Internship",
];

export default function CreateJob() {
  const [form, setForm] = useState({
    Title: "",
    Description: "",
    CompanyId: "",
    Categories: [],
    ExperienceLevel: "MidLevel",
    EmploymentType: "FullTime",
    Status: 0,
  });

  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([companyAPI.getAll(), categoryAPI.getAll()])
      .then(([comps, cats]) => {
        setCompanies(Array.isArray(comps) ? comps : (comps?.items ?? []));
        setCategories(Array.isArray(cats) ? cats : (cats?.items ?? []));
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (id) => {
    setForm((prev) => ({
      ...prev,
      Categories: prev.Categories.includes(id)
        ? prev.Categories.filter((c) => c !== id)
        : [...prev.Categories, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.CompanyId) {
      setError("Please select a company.");
      return;
    }
    if (form.Categories.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // API expects PascalCase: Title, Description, CompanyId, Categories, ExperienceLevel, EmploymentType, Status
      // await jobsAPI.create(form);
      await jobsAPI.create({
        dto: form,
      });
      setMessage("Job created successfully!");
      setForm({
        Title: "",
        Description: "",
        CompanyId: "",
        Categories: [],
        ExperienceLevel: "MidLevel",
        EmploymentType: "FullTime",
        Status: 0,
      });
    } catch (err) {
      setError(err.message || "Failed to create job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidate-shell">
      <HRSidebar />

      <main className="candidate-main">
        <header className="candidate-topbar">
          <div>
            <h1>Create Job Post</h1>
            <p>Publish a new opportunity for candidates</p>
          </div>
        </header>

        <section className="candidate-view">
          <article className="candidate-profile-card">
            <h2>Job Information</h2>

            {message && (
              <p style={{ color: "#22c55e", marginBottom: "1rem" }}>
                {message}
              </p>
            )}
            {error && (
              <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
            )}

            {fetching ? (
              <p>Loading form data…</p>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="input-box">
                  <input
                    type="text"
                    name="Title"
                    placeholder="Job Title"
                    value={form.Title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="input-box">
                  <textarea
                    name="Description"
                    placeholder="Job Description"
                    value={form.Description}
                    onChange={handleChange}
                    rows="5"
                    required
                    style={{ resize: "vertical", minHeight: "100px" }}
                  />
                </div>

                {/* Company */}
                <div className="input-box">
                  {companies.length === 0 ? (
                    <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>
                      No companies found — ask an admin to add one.
                    </p>
                  ) : (
                    <select
                      name="CompanyId"
                      value={form.CompanyId}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        background: "transparent",
                        color: "inherit",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                        padding: "0.65rem 0.9rem",
                        fontSize: "0.95rem",
                      }}
                    >
                      <option value="">— Select Company —</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Experience Level */}
                <div className="input-box">
                  <select
                    name="ExperienceLevel"
                    value={form.ExperienceLevel}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      background: "transparent",
                      color: "inherit",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                      padding: "0.65rem 0.9rem",
                      fontSize: "0.95rem",
                    }}
                  >
                    {EXPERIENCE_LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employment Type */}
                <div className="input-box">
                  <select
                    name="EmploymentType"
                    value={form.EmploymentType}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      background: "transparent",
                      color: "inherit",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                      padding: "0.65rem 0.9rem",
                      fontSize: "0.95rem",
                    }}
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categories */}
                <div style={{ marginBottom: "1rem" }}>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      opacity: 0.7,
                      marginBottom: "0.5rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Categories * (select at least one)
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {categories.map((cat) => {
                      const selected = form.Categories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          style={{
                            padding: "0.3rem 0.8rem",
                            borderRadius: "20px",
                            border: "1px solid rgba(255,255,255,0.2)",
                            background: selected
                              ? "var(--accent, #6c63ff)"
                              : "transparent",
                            color: selected ? "#fff" : "inherit",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  className="candidate-wide-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating…" : "Create Job"}
                </button>
              </form>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}
