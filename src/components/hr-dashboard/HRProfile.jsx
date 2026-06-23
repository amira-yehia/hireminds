import { useEffect, useState } from "react";
import HRSidebar from "./HRSidebar";
import { recruitersAPI, getSession } from "../../api";

export default function HRProfile() {
  const { userId } = getSession();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    recruitersAPI
      .getProfile(userId)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="candidate-shell">
        <HRSidebar />
        <main
          className="candidate-main"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="candidate-shell">
      <HRSidebar />

      <main className="candidate-main">
        <header className="candidate-topbar">
          <div>
            <h1>My Profile</h1>
            <p>Manage your personal and company information</p>
          </div>
        </header>

        <section className="candidate-view">
          <div className="candidate-dashboard-grid">
            {/* Personal Information */}
            <article className="candidate-profile-card">
              <h2>Personal Information</h2>

              <div className="candidate-profile-row">
                <div className="candidate-avatar">
                  {user?.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt="avatar"
                      style={{
                        width: "100%",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    (user?.fullName || "HR")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  )}
                </div>

                <div>
                  <h3>{user?.fullName}</h3>
                  <p>HR Recruiter</p>
                  <span>{user?.email}</span>
                </div>
              </div>

              <p className="candidate-card-label">Contact Details</p>

              <div className="candidate-skill-list">
                <span>{user?.phoneNumber || "No phone"}</span>
                <span>{user?.city || "No city"}</span>
                <span>{user?.country || "No country"}</span>
              </div>
            </article>

            {/* Company Information */}
            <article className="candidate-profile-card">
              <h2>Company Information</h2>

              <p className="candidate-card-label">Company Name</p>

              <div className="candidate-skill-list">
                <span>{user?.companyName || "No company assigned"}</span>
              </div>

              <p className="candidate-card-label">Industry</p>

              <div className="candidate-skill-list">
                <span>{user?.industry || "Unknown"}</span>
              </div>

              <p className="candidate-card-label">Location</p>

              <div className="candidate-skill-list">
                <span>{user?.companyLocation || "Unknown"}</span>
              </div>

              <button type="button" className="candidate-wide-button">
                Edit Profile
              </button>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
