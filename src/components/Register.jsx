import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaLinkedin,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import { PiReadCvLogoFill } from "react-icons/pi";
import { authAPI, candidateAPI, companyAPI, saveSession } from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    city: "",
    country: "",
    phoneNumber: "",
    role: "candidate",
  });
  const [cvFile, setCvFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    companyAPI
      .getAll()
      .then(console.log)
      .then((data) => {
        console.log("Companies:", data);
        setCompanies(data);
      })
      .catch(console.error);
  }, []);
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;

      if (form.role === "recruiter") {
        data = await authAPI.recruiterRegister({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          address: form.address,
          city: form.city,
          country: form.country,
          phoneNumber: form.phoneNumber,
          companyId,
        });
      } else {
        data = await authAPI.candidateRegister({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          address: form.address,
          city: form.city,
          country: form.country,
          phoneNumber: form.phoneNumber,
        });

        saveSession(data);

        if (cvFile) {
          const fd = new FormData();
          fd.append("cv", cvFile);
          await candidateAPI.uploadCV(fd);
        }

        if (photoFile) {
          const fd = new FormData();
          fd.append("photo", photoFile);
          await candidateAPI.uploadPhoto(fd);
        }
      }

      navigate(form.role === "recruiter" ? "/hr-dashboard" : "/candidate");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };
  const handleResendVerification = async () => {
    if (!form.email) {
      setResendMessage("Please enter your email first.");
      return;
    }

    try {
      setResendLoading(true);
      setResendMessage("");

      await authAPI.resendVerification(form.email);

      setResendMessage("Verification email has been sent successfully.");
    } catch (err) {
      setResendMessage(err.message || "Failed to resend verification email.");
    } finally {
      setResendLoading(false);
    }
  };
  return (
    <div className="form-box register">
      <form onSubmit={handleSubmit}>
        <span className="auth-kicker">Create profile</span>
        <h1>Registration</h1>
        <p className="auth-subtitle">Build your candidate profile in minutes</p>

        {error && (
          <p style={{ color: "red", fontSize: "0.85rem", marginBottom: "8px" }}>
            {error}
          </p>
        )}

        <div className="input-box">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <i>
            <FaUser />
          </i>
        </div>

        <div className="input-box">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <i>
            <FaEnvelope />
          </i>
        </div>

        <div className="input-box">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <i>
            <FaLock />
          </i>
        </div>

        <div className="input-box">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
          />
          <i>
            <FaUser />
          </i>
        </div>

        <div className="input-box">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />
          <i>
            <FaUser />
          </i>
        </div>

        <div className="input-box">
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
          />
          <i>
            <FaUser />
          </i>
        </div>

        <div className="input-box">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">HR Recruiter</option>
          </select>
        </div>

        {form.role === "recruiter" && (
          <div className="input-box">
            {/* <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
            >
              <option value="">Select Company</option>

              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select> */}
            <select
              name="companyId"
              value={form.companyId}
              onChange={handleChange}
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {form.role === "candidate" && (
          <>
            <div className="input-box file-input">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setCvFile(e.target.files[0])}
              />
              <i>
                <PiReadCvLogoFill />
              </i>
            </div>

            <div className="input-box file-input">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
              />
              <i>
                <MdAddPhotoAlternate />
              </i>
            </div>
          </>
        )}
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={resendLoading}
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.85rem",
            }}
          >
            {resendLoading ? "Sending..." : "Resend Verification Email"}
          </button>
        </div>

        {resendMessage && (
          <p
            style={{
              color: resendMessage.includes("successfully") ? "#22c55e" : "red",
              fontSize: "0.8rem",
              marginTop: "8px",
              textAlign: "center",
            }}
          >
            {resendMessage}
          </p>
        )}

        <p className="auth-divider">or register with social platforms</p>
        <div className="social-icons">
          <a href="##" aria-label="Register with Google">
            <FaGoogle />
          </a>
          <a href="##" aria-label="Register with Facebook">
            <FaFacebook />
          </a>
          <a href="##" aria-label="Register with GitHub">
            <FaGithub />
          </a>
          <a href="##" aria-label="Register with LinkedIn">
            <FaLinkedin />
          </a>
        </div>
      </form>
    </div>
  );
}
