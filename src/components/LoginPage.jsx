import React, { useState } from 'react';

const features = [
  { icon: '🌿', text: 'Accès à plus de 2,400 producteurs certifiés' },
  { icon: '🚚', text: 'Livraison express en 24h partout au Cameroun' },
  { icon: '🔒', text: 'Paiements sécurisés Mobile Money & carte bancaire' },
  { icon: '📊', text: 'Tableau de bord analytique en temps réel' },
];

export default function LoginPage({ onLoginSuccess, onNavigateToRecovery, onNavigateToRegister }) {
  const [role, setRole] = useState('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "L'adresse e-mail est requise.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format d'e-mail invalide.";
    if (!password) errs.password = 'Le mot de passe est requis.';
    else if (password.length < 6) errs.password = 'Au moins 6 caractères requis.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // ===== VÉRIFICATION DU COMPTE DANS LOCALSTORAGE =====
      const comptes = JSON.parse(localStorage.getItem('comptes') || '[]');
      const compte = comptes.find(c => c.email === email && c.password === password);

      if (!compte) {
        // Aucun compte trouvé
        setErrors({
          email: 'Email ou mot de passe incorrect. Vous n\'avez pas encore de compte ?',
        });
        return;
      }

      // Vérifier si le rôle correspond
      if (compte.role !== role) {
        setErrors({
          email: `Ce compte est un compte "${compte.role === 'client' ? 'Client' : 'Vendeur'}". Sélectionnez le bon rôle.`,
        });
        return;
      }

      // ✅ Connexion réussie
      if (rememberMe) {
        localStorage.setItem('utilisateurConnecte', JSON.stringify(compte));
      }

      if (onLoginSuccess) {
        onLoginSuccess({
          role: compte.role,
          prenom: compte.prenom,
          nom: compte.nom,
          email: compte.email,
          plan: compte.plan,
        });
      }
    }, 1000);
  };

  return (
    <div style={styles.wrapper}>
      {/* Toast */}
      {toast && (
        <div style={styles.toast}>{toast}</div>
      )}

      {/* ── Left Panel ── */}
      <div style={styles.leftPanel}>
        <div style={styles.orb1} />
        <div style={styles.orb2} />
        <div style={styles.orb3} />

        <div style={styles.leftContent}>
          <div style={styles.brand}>
            <div style={styles.brandLogo}>
              <span style={styles.brandLogoText}>AM</span>
            </div>
            <span style={styles.brandName}>AgroMarket</span>
          </div>

          <div style={styles.leftHero}>
            <h1 style={styles.heroTitle}>
              La plateforme agricole<br />
              <span style={styles.heroAccent}>de confiance</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Connectez producteurs et acheteurs à travers une expérience digitale moderne, sécurisée et efficace.
            </p>
          </div>

          <div style={styles.featureList}>
            {features.map((f, i) => (
              <div key={i} style={styles.featureItem}>
                <div style={styles.featureIcon}>{f.icon}</div>
                <span style={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>

          <div style={styles.statsStrip}>
            {[
              { val: '12K+', label: 'Utilisateurs' },
              { val: '2.4K', label: 'Producteurs' },
              { val: '98%', label: 'Satisfaction' },
            ].map(({ val, label }) => (
              <div key={label} style={styles.statItem}>
                <span style={styles.statVal}>{val}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Connexion</h2>
            <p style={styles.formSubtitle}>Accédez à votre espace AgroMarket</p>
          </div>

          {/* Role selector */}
          <div style={styles.roleRow}>
            <button
              type="button"
              style={{ ...styles.roleBtn, ...(role === 'client' ? styles.roleBtnActive : {}) }}
              onClick={() => setRole('client')}
            >
              🛒 Client
            </button>
            <button
              type="button"
              style={{ ...styles.roleBtn, ...(role === 'vendeur' ? styles.roleBtnActive : {}) }}
              onClick={() => setRole('vendeur')}
            >
              🌾 Vendeur
            </button>
          </div>

          {/* Social login buttons */}
          <div style={styles.socialRow}>
            <button style={styles.socialBtn} onClick={() => showToast('🔗 Connexion via Google en cours...')}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button style={styles.socialBtn} onClick={() => showToast('🔗 Connexion via Facebook en cours...')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          <div style={styles.dividerRow}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>ou par e-mail</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Adresse e-mail</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: null })); }}
                  style={{ ...styles.input, ...(errors.email ? styles.inputErr : {}) }}
                />
              </div>
              {errors.email && <span style={styles.errorMsg}>{errors.email}</span>}
            </div>

            {/* Password */}
            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <label style={styles.label}>Mot de passe</label>
                <button
                  type="button"
                  style={styles.forgotLink}
                  onClick={() => onNavigateToRecovery ? onNavigateToRecovery() : showToast('→ Redirection récupération...')}
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: null })); }}
                  style={{ ...styles.input, ...(errors.password ? styles.inputErr : {}), paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <span style={styles.errorMsg}>{errors.password}</span>}
            </div>

            {/* Remember me */}
            <div style={styles.rememberRow}>
              <label style={styles.checkboxLabel}>
                <div
                  style={{
                    ...styles.checkbox,
                    backgroundColor: rememberMe ? '#1b4d3e' : 'transparent',
                    borderColor: rememberMe ? '#1b4d3e' : '#dee2e6',
                  }}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span style={styles.checkboxText}>Se souvenir de moi</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnLoading : {}) }}
            >
              {loading ? (
                <span style={styles.spinnerWrap}>
                  <span style={styles.spinner} />
                  Vérification en cours...
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

          {/* Register link */}
          <p style={styles.registerText}>
            Pas encore inscrit ?{' '}
            <button
              style={styles.registerLink}
              onClick={() => onNavigateToRegister ? onNavigateToRegister() : showToast("→ Redirection vers l'inscription...")}
            >
              Créer un compte gratuit
            </button>
          </p>

          {/* Trust badges */}
          <div style={styles.trustRow}>
            <span style={styles.trustBadge}>🔒 SSL Sécurisé</span>
            <span style={styles.trustBadge}>✅ RGPD Conforme</span>
            <span style={styles.trustBadge}>🏆 Certifié Agri</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh', width: '100%', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
  toast: { position: 'fixed', top: '24px', right: '24px', backgroundColor: '#1b4d3e', color: '#ffffff', padding: '14px 20px', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 9999, fontSize: '13px', fontWeight: '700' },
  leftPanel: { width: '44%', position: 'relative', background: 'linear-gradient(135deg, #0d2b22 0%, #1b4d3e 40%, #2d6a4f 75%, #40916c 100%)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' },
  orb1: { position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(64,145,108,0.35) 0%, transparent 70%)', pointerEvents: 'none' },
  orb2: { position: 'absolute', bottom: '-60px', left: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,106,79,0.4) 0%, transparent 70%)', pointerEvents: 'none' },
  orb3: { position: 'absolute', top: '50%', left: '30%', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' },
  leftContent: { position: 'relative', zIndex: 1, width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '36px' },
  brand: { display: 'flex', alignItems: 'center', gap: '14px' },
  brandLogo: { width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' },
  brandLogoText: { fontSize: '16px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.05em' },
  brandName: { fontSize: '22px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' },
  leftHero: { display: 'flex', flexDirection: 'column', gap: '14px' },
  heroTitle: { fontSize: '34px', fontWeight: '800', color: '#ffffff', lineHeight: '1.15', letterSpacing: '-0.03em', margin: 0 },
  heroAccent: { color: '#95d5b2' },
  heroSubtitle: { fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: '1.6', fontWeight: '400' },
  featureList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '14px' },
  featureIcon: { fontSize: '20px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', flexShrink: 0 },
  featureText: { fontSize: '13.5px', color: 'rgba(255,255,255,0.82)', fontWeight: '500', lineHeight: '1.4' },
  statsStrip: { display: 'flex', gap: '0', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px 24px', border: '1px solid rgba(255,255,255,0.12)' },
  statItem: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', borderRight: '1px solid rgba(255,255,255,0.12)' },
  statVal: { fontSize: '22px', fontWeight: '800', color: '#95d5b2', letterSpacing: '-0.02em' },
  statLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' },
  rightPanel: { flex: 1, backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' },
  formContainer: { width: '100%', maxWidth: '400px' },
  formHeader: { marginBottom: '20px', textAlign: 'center' },
  formTitle: { fontSize: '28px', fontWeight: '800', color: '#212529', letterSpacing: '-0.03em', marginBottom: '6px' },
  formSubtitle: { fontSize: '14px', color: '#6c757d', fontWeight: '500' },
  roleRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' },
  roleBtn: { padding: '11px 16px', borderRadius: '10px', border: '1.5px solid #e9ecef', backgroundColor: '#f8f9fa', color: '#495057', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer' },
  roleBtnActive: { borderColor: '#1b4d3e', backgroundColor: '#e9f5ee', color: '#1b4d3e' },
  socialRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' },
  socialBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px 16px', borderRadius: '10px', border: '1.5px solid #e9ecef', backgroundColor: '#ffffff', color: '#343a40', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  dividerRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
  dividerLine: { flex: 1, height: '1px', backgroundColor: '#e9ecef' },
  dividerText: { fontSize: '12px', fontWeight: '600', color: '#adb5bd', whiteSpace: 'nowrap' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: '13px', fontWeight: '700', color: '#343a40' },
  forgotLink: { fontSize: '12px', fontWeight: '700', color: '#1b4d3e', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '14px', flexShrink: 0, pointerEvents: 'none' },
  input: { width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px', border: '1.5px solid #dee2e6', fontSize: '14px', color: '#212529', backgroundColor: '#f8f9fa', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  inputErr: { borderColor: '#dc3545', backgroundColor: '#fff8f8' },
  eyeBtn: { position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' },
  errorMsg: { fontSize: '11.5px', color: '#dc3545', fontWeight: '600' },
  rememberRow: { display: 'flex', alignItems: 'center', marginTop: '-4px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  checkbox: { width: '18px', height: '18px', borderRadius: '5px', border: '1.5px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
  checkboxText: { fontSize: '13px', fontWeight: '600', color: '#495057' },
  submitBtn: { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #1b4d3e 0%, #2d6a4f 100%)', border: 'none', color: '#ffffff', fontSize: '15px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 6px 20px rgba(27,77,62,0.25)', marginTop: '4px' },
  submitBtnLoading: { opacity: 0.85, cursor: 'not-allowed' },
  spinnerWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  spinner: { width: '16px', height: '16px', borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', animation: 'spin 0.7s linear infinite', display: 'inline-block' },
  registerText: { textAlign: 'center', fontSize: '13px', color: '#6c757d', marginTop: '20px' },
  registerLink: { color: '#1b4d3e', fontWeight: '800', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' },
  trustRow: { display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' },
  trustBadge: { fontSize: '11px', fontWeight: '700', color: '#868e96', padding: '4px 10px', backgroundColor: '#f8f9fa', borderRadius: '20px', border: '1px solid #e9ecef' },
};