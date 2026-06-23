import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import AuthPage from "./AuthPage";

import CandidateDashboard from "./CandidateDashboard";
import CandidateAssessment from "./CandidateAssessment";
import CandidateInterview from "./CandidateInterview";
import CandidateReportPage from "./hr-dashboard/CandidateReportPage";
import AdminDashboardApp from "./admin-dashboard/AdminDashboardApp";

import ForgetPassword from "./ForgetPassword";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";
import ChangePassword from "./ChangePassword";

// HR Pages
import HRDashboard from "./hr-dashboard/HRDashboard";
import HRProfile from "./hr-dashboard/HRProfile";
import HRJobs from "./hr-dashboard/HRJobs";
import HRCandidates from "./hr-dashboard/HRCandidates";
import CreateJob from "./hr-dashboard/CreateJob";

export default function App() {
  return (
    <Routes>
      {/* ── Landing ── */}
      <Route path="/" element={<Home />} />

      {/* ── Authentication ── */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />

      {/* ── Password Recovery ── */}
      {/* Email link format: /forget-password */}
      <Route path="/forget-password" element={<ForgetPassword />} />
      {/* Email link format: /reset-password?userId=...&resetToken=... */}
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ── Email Verification ── */}
      {/* Email link format: /verify-email?userId=...&token=... */}
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ── Change Password (authenticated) ── */}
      <Route path="/change-password" element={<ChangePassword />} />

      {/* ── Candidate Portal ── */}
      <Route path="/candidate" element={<CandidateDashboard />} />
      <Route path="/candidate/assessment" element={<CandidateAssessment />} />
      <Route path="/candidate/interview" element={<CandidateInterview />} />
      <Route
        path="/hr-dashboard/reports/:id"
        element={<CandidateReportPage />}
      />
      {/* ── HR Portal ── */}
      <Route path="/hr-dashboard" element={<HRDashboard />} />
      <Route path="/hr-dashboard/profile" element={<HRProfile />} />
      <Route path="/hr-dashboard/create-job" element={<CreateJob />} />
      <Route path="/hr-dashboard/jobs" element={<HRJobs />} />
      <Route path="/hr-dashboard/candidates" element={<HRCandidates />} />
      {/* /hr-dashboard/reports/:id — add HRReportPage here when ready */}

      {/* ── Admin Portal ── */}
      <Route path="/admin-dashboard" element={<AdminDashboardApp />} />
      <Route path="/admin" element={<AdminDashboardApp />} />
    </Routes>
  );
}
