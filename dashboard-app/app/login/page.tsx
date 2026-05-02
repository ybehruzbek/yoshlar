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
      <div className="login-card">
        <div className="login-card-header">
          <Image src="/logo.png" alt="Logo" width={120} height={34} priority style={{ height: 'auto' }} />
          <div className="login-card-title">Tizimga kirish</div>
          <div className="login-card-sub">Qarz monitoring tizimiga kirish uchun ma'lumotlaringizni kiriting</div>
        </div>

        {error && (
          <div className="login-error">
            <span className="login-error-icon">!</span>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">Email</label>
            <div className="login-input-wrap">
              <EnvelopeSimple size={18} className="login-input-icon" />
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
              <Lock size={18} className="login-input-icon" />
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
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit" disabled={loading || !email || !password}>
            {loading ? (
              <>
                <CircleNotch size={18} className="spin" />
                Kirish...
              </>
            ) : (
              "Kirish"
            )}
          </button>
        </form>

        <div className="login-footer-info">
          Parolni unutdingizmi? Administratorga murojaat qiling.
        </div>
      </div>
    </div>
  );
}
