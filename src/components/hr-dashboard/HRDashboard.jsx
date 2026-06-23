import HRSidebar from "./HRSidebar";

export default function HRDashboard() {
  return (
    <div className="candidate-shell">
      <HRSidebar />

      <main className="candidate-main">
        <header className="candidate-topbar">
          <div>
            <h1>Welcome back, Recruiter</h1>
            <p>Manage jobs and candidates</p>
          </div>
        </header>

        <section className="candidate-view">
          <div className="candidate-dashboard-grid">
            {/* Profile */}
            <article className="candidate-profile-card">
              <h2>Your Profile</h2>

              <div className="candidate-profile-row">
                <div className="candidate-avatar">HR</div>

                <div>
                  <h3>Amira Yehia</h3>
                  <p>HR Recruiter</p>
                  <span>amira.yehia41122@gmail.com</span>
                </div>
              </div>

              <p className="candidate-card-label">Company</p>

              <div className="candidate-skill-list">
                <span>HireMinds</span>
                <span>Cairo</span>
                <span>Software</span>
              </div>

              <button className="candidate-wide-button">Edit Profile</button>
            </article>

            {/* Actions */}
            <div className="candidate-actions">
              <article className="candidate-action-card">
                <div className="candidate-action-copy">
                  <span>
                    <i className="bx bx-plus-circle"></i>
                  </span>

                  <div>
                    <h3>Create Job Post</h3>
                    <p>Create a new opportunity</p>
                  </div>
                </div>

                <a href="/#/hr-dashboard/create-job">Create</a>
              </article>

              <article className="candidate-action-card">
                <div className="candidate-action-copy">
                  <span>
                    <i className="bx bx-group"></i>
                  </span>

                  <div>
                    <h3>Candidates</h3>
                    <p>View applicants and reports</p>
                  </div>
                </div>

                <a href="/#/hr-dashboard/candidates">View</a>
              </article>

              <article className="candidate-action-card">
                <div className="candidate-action-copy">
                  <span>
                    <i className="bx bx-bar-chart-alt"></i>
                  </span>

                  <div>
                    <h3>Reports</h3>
                    <p>AI scores and interview results</p>
                  </div>
                </div>

                <a href="/#/hr-dashboard/reports">Open</a>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
