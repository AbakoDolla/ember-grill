import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function AuthScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const { t } = useTranslation();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captcha = useRef<any>(null);

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/menu";
      navigate(from, { replace: true });
    }
    console.log("Auth state:", { isLogin, captchaToken, user: !!user });
  }, [user, navigate, location, isLogin, captchaToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) setError(error);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError(t("auth.passwordMismatch"));
          return;
        }
        if (formData.password.length < 8) {
          setError(t("auth.passwordTooShort"));
          return;
        }
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.name
        );
        if (error) {
          if (error.includes("captcha")) {
            setError(
              "Configuration du captcha en cours. Veuillez réessayer dans quelques instants."
            );
          } else {
            setError(error);
          }
        }
      }
    } catch (err) {
      setError(t("auth.unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error);
        setLoading(false);
      }
    } catch (err) {
      setError(t("auth.unexpectedError"));
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{ background: "#FAFAF8", paddingTop: "80px" }}
    >
      {/* Floating background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 blur-2xl"
            style={{
              width: `${Math.random() * 140 + 60}px`,
              height: `${Math.random() * 140 + 60}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background:
                i % 3 === 0
                  ? "#FF5733" /* coral primary */
                  : i % 3 === 1
                  ? "#2ECC71" /* fresh green */
                  : "#FFD700" /* gold accent */,
              animation: `floatBlob ${
                Math.random() * 10 + 10
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes floatBlob {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          25%       { transform: translateY(-30px) translateX(20px) scale(1.1); }
          50%       { transform: translateY(-55px) translateX(-20px) scale(0.9); }
          75%       { transform: translateY(-25px) translateX(15px) scale(1.05); }
        }
        @keyframes shimmer {
          0%   { background-position: -1000px 0; }
          100% { background-position:  1000px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Main card ── */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid rgba(255, 87, 51, 0.2)",
            boxShadow: `
              0 4px 24px rgba(255, 87, 51, 0.08),
              0 20px 60px rgba(0, 0, 0, 0.08),
              0 0 0 1px rgba(255, 87, 51, 0.08)
            `,
          }}
        >
          {/* ── Header ── */}
          <div
            className="relative p-6 sm:p-8 lg:p-10 text-center overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #FF5733 0%, #FF8C42 50%, #FFD700 100%)",
              borderBottom: "1.5px solid rgba(255, 87, 51, 0.15)",
            }}
          >
            <div className="absolute inset-0 shimmer opacity-15" />

            <div className="relative z-10">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                style={{
                  background: "rgba(255,255,255,0.25)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                }}
              >
                <span className="text-4xl">🍽️</span>
              </div>

              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 tracking-tight"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
              >
                BrazaFish<span style={{ color: "#fff8e1" }}>elora</span>
              </h1>
              <p className="text-white/95 text-sm sm:text-base font-semibold">
                {isLogin ? "Bon retour !" : "Rejoignez-nous"}
              </p>
              <p className="text-white/80 text-xs sm:text-sm mt-1">
                {isLogin
                  ? "Connectez-vous pour passer commande"
                  : "Créez votre compte pour commencer"}
              </p>
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
            {error && (
              <div
                className="mb-4 p-3 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(255, 87, 51, 0.08)",
                  border: "1px solid rgba(255, 87, 51, 0.25)",
                  color: "#cc3300",
                }}
              >
                {error}
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <div className="transform transition-all duration-300">
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: "#1a1a2e" }}
                  >
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all"
                    style={{
                      background: "#F8F5F2",
                      color: "#1a1a2e",
                      border:
                        focusedField === "name"
                          ? "2px solid #FF5733"
                          : "2px solid #EDE8E3",
                      boxShadow:
                        focusedField === "name"
                          ? "0 0 0 3px rgba(255, 87, 51, 0.12)"
                          : "none",
                    }}
                    placeholder="Votre nom complet"
                  />
                </div>
              )}

              <div className="transform transition-all duration-300">
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: "#1a1a2e" }}
                >
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all"
                  style={{
                    background: "#F8F5F2",
                    color: "#1a1a2e",
                    border:
                      focusedField === "email"
                        ? "2px solid #FF5733"
                        : "2px solid #EDE8E3",
                    boxShadow:
                      focusedField === "email"
                        ? "0 0 0 3px rgba(255, 87, 51, 0.12)"
                        : "none",
                  }}
                  placeholder="votre@email.com"
                />
              </div>

              <div className="transform transition-all duration-300">
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: "#1a1a2e" }}
                >
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all"
                  style={{
                    background: "#F8F5F2",
                    color: "#1a1a2e",
                    border:
                      focusedField === "password"
                        ? "2px solid #FF5733"
                        : "2px solid #EDE8E3",
                    boxShadow:
                      focusedField === "password"
                        ? "0 0 0 3px rgba(255, 87, 51, 0.12)"
                        : "none",
                  }}
                  placeholder="Votre mot de passe"
                />
              </div>

              {!isLogin && (
                <div className="transform transition-all duration-300">
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: "#1a1a2e" }}
                  >
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all"
                    style={{
                      background: "#F8F5F2",
                      color: "#1a1a2e",
                      border:
                        focusedField === "confirmPassword"
                          ? "2px solid #FF5733"
                          : "2px solid #EDE8E3",
                      boxShadow:
                        focusedField === "confirmPassword"
                          ? "0 0 0 3px rgba(255, 87, 51, 0.12)"
                          : "none",
                    }}
                    placeholder="Confirmez votre mot de passe"
                  />
                </div>
              )}

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm font-bold transition-colors hover:opacity-80"
                    style={{ color: "#FF5733" }}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-base text-white transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: "linear-gradient(135deg, #FF5733, #FF8C42)",
                boxShadow: "0 6px 24px rgba(255, 87, 51, 0.35)",
              }}
            >
              <span className="relative z-10">
                {loading
                  ? "Chargement..."
                  : isLogin
                  ? "Se connecter"
                  : "Créer un compte"}
              </span>
              {!loading && <span className="text-xl relative z-10">🍽️</span>}
              <div className="absolute inset-0 shimmer opacity-20" />
            </button>

            {/* Toggle login/signup */}
            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: "#6b7280" }}>
                {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-bold transition-colors hover:opacity-80"
                  style={{ color: "#FF5733" }}
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: "#EDE8E3" }} />
              <span
                className="text-xs font-bold tracking-wider"
                style={{ color: "#9ca3af" }}
              >
                OU
              </span>
              <div className="flex-1 h-px" style={{ background: "#EDE8E3" }} />
            </div>

            {/* Social buttons */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "#F8F5F2",
                  border: "1.5px solid #EDE8E3",
                  color: "#1a1a2e",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuer avec Google
              </button>

              <button
                type="button"
                className="w-full py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                style={{
                  background: "#F8F5F2",
                  border: "1.5px solid #EDE8E3",
                  color: "#1a1a2e",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continuer avec Apple
              </button>
            </div>
          </form>
        </div>

        {/* Footer tagline */}
        <div className="mt-6 text-center">
          <p
            className="text-xs font-medium tracking-wide"
            style={{ color: "#9ca3af" }}
          >
            Poisson Braisé Camerounais • Livraison à domicile
          </p>
        </div>
      </div>
    </div>
  );
}
