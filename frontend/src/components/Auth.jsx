import { useState } from "react";
import api from "../services/api";
import "./Auth.css";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        const { token, data } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));
        onLogin(data);
      } else {
        await api.post("/auth/register", form);
        setIsLogin(true);
        setForm({ username: "", email: form.email, password: "" });
        setError("");
        alert("Ro'yxatdan o'tish muvaffaqiyatli. Endi hisobingizga kiring.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin((value) => !value);
    setError("");
    setForm((current) => ({ ...current, password: "" }));
  };

  return (
    <main className="auth-shell">
      <div className="auth-noise" />
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />

      <a className="auth-brand" href="/" aria-label="TECHZONE bosh sahifa">
        <span className="auth-brand-mark">T</span>
        <span>TECHZONE<span className="auth-brand-dot">.</span></span>
      </a>

      <section className="auth-layout">
        <div className="auth-showcase">
          <div className="auth-kicker"><span /> TEXNOLOGIYA. SIFAT. ISHONCH.</div>
          <h1>Texnologiya<br />sizga <em>yaqinroq.</em></h1>
          <p className="auth-showcase-copy">
            Sevimli qurilmalaringizni kashf eting. TECHZONE hisobingiz orqali
            xaridlaringizni qulay boshqaring.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <span className="auth-feature-icon">✦</span>
              <div><strong>Tanlangan mahsulotlar</strong><small>Eng yaxshi texnologiyalar bir joyda</small></div>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">↗</span>
              <div><strong>Qulay xarid tajribasi</strong><small>Savat va buyurtmalaringiz doim yoningizda</small></div>
            </div>
          </div>

          <div className="auth-showcase-bottom">
            <span className="auth-line" />
            <span>DISCOVER WHAT'S NEXT</span>
          </div>
        </div>

        <div className="auth-form-side">
          <form className="auth-card" onSubmit={handleSubmit}>
            <div className="auth-card-top">
              <span className="auth-card-label">SHAXSIY KABINET</span>
              <span className="auth-secure"><span /> XAVFSIZ KIRISH</span>
            </div>

            <div className="auth-heading">
              <h2>{isLogin ? "Xush kelibsiz" : "Hisob yarating"}<span>.</span></h2>
              <p>{isLogin ? "Davom etish uchun hisobingizga kiring." : "TECHZONE bilan xarid qilishni boshlang."}</p>
            </div>

            <div className="auth-mode-switch">
              <button type="button" className={isLogin ? "selected" : ""} onClick={() => isLogin || switchMode()}>Kirish</button>
              <button type="button" className={!isLogin ? "selected" : ""} onClick={() => !isLogin || switchMode()}>Ro'yxatdan o'tish</button>
            </div>

            {!isLogin && (
              <label className="auth-field">
                <span>FOYDALANUVCHI NOMI</span>
                <input
                  name="username"
                  type="text"
                  placeholder="Ismingizni kiriting"
                  value={form.username}
                  onChange={handleChange}
                  minLength={3}
                  required
                  autoComplete="username"
                />
              </label>
            )}

            <label className="auth-field">
              <span>EMAIL MANZIL</span>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </label>

            <label className="auth-field">
              <span>PAROL</span>
              <div className="auth-password-wrap">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Kamida 8 ta belgi"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button type="button" className="auth-show-password" onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? "YASHIRISH" : "KO'RISH"}
                </button>
              </div>
            </label>

            {error && <div className="auth-error"><span>!</span>{error}</div>}

            <button className="auth-submit" type="submit" disabled={loading}>
              <span>{loading ? "KUTILMOQDA..." : isLogin ? "HISOBGA KIRISH" : "HISOB YARATISH"}</span>
              {!loading && <span className="auth-submit-arrow">↗</span>}
            </button>

            <div className="auth-form-foot">
              <span>Davom etish orqali foydalanish shartlariga rozilik bildirasiz.</span>
            </div>
          </form>
          <div className="auth-copyright">© 2026 TECHZONE. BARCHA HUQUQLAR HIMOYALANGAN.</div>
        </div>
      </section>
    </main>
  );
}

export default Auth;