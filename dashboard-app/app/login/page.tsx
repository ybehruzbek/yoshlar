"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EnvelopeSimple, Lock, Eye, EyeSlash, CircleNotch } from "@phosphor-icons/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email yoki parol noto'g'ri");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Tizim xatoligi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-gradient" />
        <div className="login-bg-grid" />
        <div className="login-bg-glow login-bg-glow-1" />
        <div className="login-bg-glow login-bg-glow-2" />
      </div>

      <div className="login-container">
        {/* Left — branding */}
        <div className="login-brand">
          <div className="login-brand-content">
            <Image src="/logo.png" alt="Logo" width={200} height={56} priority className="login-logo" />
            <h1 className="login-brand-title">Qarz Monitoring<br />Tizimi</h1>
            <p className="login-brand-desc">
              O&apos;zbekiston Yoshlar Ittifoqi Toshkent Shahar Hududiy Kengashi uy-joy qarz monitoring platformasi
            </p>
            <div className="login-stats-row">
              <div className="login-stat">
                <div className="login-stat-val">~900</div>
                <div className="login-stat-label">Qarzdorlar</div>
              </div>
              <div className="login-stat">
                <div className="login-stat-val">63 mlrd</div>
                <div className="login-stat-label">Jami qarz</div>
              </div>
              <div className="login-stat">
                <div className="login-stat-val">24/7</div>
                <div className="login-stat-label">Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — login form */}
        <div className="login-form-side">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-header">
              <h2 className="login-form-title">Tizimga kirish</h2>
              <p className="login-form-subtitle">Hisobingiz bilan kiring</p>
            </div>

            {error && (
              <div className="login-error">
                <span className="login-error-icon">!</span>
                {error}
              </div>
            )}

            <div className="login-field">
              <label className="login-label">Email</label>
              <div className="login-input-wrap">
                <EnvelopeSimple size={20} className="login-input-icon" />
                <input
                  type="email"
                  placeholder="admin@yoshlar.uz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Parol</label>
              <div className="login-input-wrap">
                <Lock size={20} className="login-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading || !email || !password}>
              {loading ? (
                <>
                  <CircleNotch size={20} className="spin" />
                  Kirish...
                </>
              ) : (
                "Kirish"
              )}
            </button>

            <div className="login-footer-info">
              <p>Parolni unutdingizmi? Administratorga murojaat qiling.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
