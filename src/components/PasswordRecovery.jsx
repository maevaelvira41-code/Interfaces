import React, { useState } from 'react';

export default function PasswordRecovery({ onBack }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez entrer une adresse e-mail valide.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format d’adresse e-mail invalide.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div style={styles.pageContainer} className="fade-in">
      <div style={styles.cardContainer}>
        {/* Left Side: Brand Panel */}
        <div style={styles.leftPanel}>
          <div style={styles.brandContainer}>
            <div style={styles.logoCircle}>🌱</div>
            <span style={styles.brandName}>AgroMarket</span>
          </div>
          <div style={styles.leftContent}>
            <h1 style={styles.leftTitle}>Récupération</h1>
            <h2 style={styles.leftSubtitle}>Mot de passe</h2>
            <div style={styles.divider}></div>
            <p style={styles.leftText}>
              Nous vous enverrons un lien de récupération sécurisé pour réinitialiser votre accès.
            </p>
          </div>
          <div style={styles.leftFooter}>
            © 2026 AgroMarket — Système de Sécurité
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div style={styles.rightPanel}>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} style={styles.form} noValidate>
              <div style={styles.formHeader}>
                <h3 style={styles.formTitle}>Réinitialiser votre mot de passe</h3>
                <p style={styles.formDescription}>
                  Entrez l'adresse email associée à votre compte pour continuer.
                </p>
              </div>

              {/* Input Group */}
              <div style={styles.inputGroup}>
                <label htmlFor="recovery-email" style={styles.label}>
                  Email ou Nom d'utilisateur
                </label>
                <div style={styles.inputWrapper}>
                  <svg style={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="14" rx="2" ry="2"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    id="recovery-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    style={{
                      ...styles.input,
                      ...(error ? styles.inputError : {})
                    }}
                    disabled={isLoading}
                  />
                </div>
                {error && <span style={styles.errorText} className="fade-in">{error}</span>}
              </div>

              {/* Information Alert Box */}
              <div style={styles.alertBox}>
                <div style={styles.alertIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
                <div style={styles.alertContent}>
                  <p style={styles.alertText}>
                    Vous recevrez un email avec un lien pour réinitialiser votre mot de passe.
                  </p>
                  <p style={styles.alertSubtext}>
                    Le lien sera valide pendant 24 heures.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                style={{
                  ...styles.submitBtn,
                  ...(isLoading ? styles.submitBtnLoading : {})
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span style={styles.spinner}></span>
                ) : (
                  <>
                    <span>Envoyer le lien</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>

              {/* Back to Login Link */}
              <button type="button" onClick={onBack} style={styles.backLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                <span>Retour connexion</span>
              </button>
            </form>
          ) : (
            /* Success State */
            <div style={styles.successContainer} className="fade-in">
              <div style={styles.successIconWrapper}>
                <div style={styles.successIconPulse}></div>
                <div style={styles.successIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
              
              <h3 style={styles.successTitle}>E-mail Envoyé !</h3>
              <p style={styles.successDescription}>
                Un lien de réinitialisation sécurisé a été envoyé à l'adresse :
                <br />
                <strong style={styles.successEmail}>{email}</strong>
              </p>
              
              <div style={styles.successAlert}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px', flexShrink: 0}}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>Pensez à vérifier votre dossier de courriers indésirables (spams) si vous ne recevez rien dans les 5 minutes.</span>
              </div>

              <button type="button" onClick={() => setIsSubmitted(false)} style={styles.retryBtn}>
                Ressayer avec une autre adresse
              </button>

              <button type="button" onClick={onBack} style={styles.backToLoginBtn}>
                Retourner à la connexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 120px)',
    padding: '40px 20px',
    backgroundColor: '#f8f9fa',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    width: '100%',
    maxWidth: '1000px',
    minHeight: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    }
  },
  // Left Panel
  leftPanel: {
    background: 'linear-gradient(135deg, #1b4d3e 0%, #133c30 100%)',
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoCircle: {
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(8px)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  brandName: {
    fontSize: '20px',
    fontWeight: '800',
    letterSpacing: '0.03em',
    color: '#ffffff',
  },
  leftContent: {
    margin: '60px 0',
  },
  leftTitle: {
    fontSize: '44px',
    fontWeight: '800',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    color: '#ffffff',
  },
  leftSubtitle: {
    fontSize: '36px',
    fontWeight: '400',
    lineHeight: '1.2',
    color: '#a3c2b8',
    marginBottom: '24px',
  },
  divider: {
    width: '60px',
    height: '4px',
    backgroundColor: '#e07a5f',
    borderRadius: '2px',
    marginBottom: '24px',
  },
  leftText: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#e2f0ec',
    fontWeight: '400',
    maxWidth: '320px',
  },
  leftFooter: {
    fontSize: '12px',
    color: '#a3c2b8',
    opacity: 0.8,
  },
  // Right Panel
  rightPanel: {
    padding: '60px 48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  form: {
    width: '100%',
    maxWidth: '420px',
  },
  formHeader: {
    marginBottom: '32px',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#212529',
    marginBottom: '8px',
    letterSpacing: '-0.01em',
  },
  formDescription: {
    fontSize: '14px',
    color: '#6c757d',
    lineHeight: '1.5',
  },
  inputGroup: {
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#343a40',
    letterSpacing: '0.01em',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: '#adb5bd',
    transition: 'color 0.2s',
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 48px',
    borderRadius: '12px',
    border: '1.5px solid #dee2e6',
    fontSize: '15px',
    fontWeight: '500',
    color: '#212529',
    backgroundColor: '#f8f9fa',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    ':focus': {
      border: '1.5px solid #1b4d3e',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 4px rgba(27, 77, 62, 0.12)',
    }
  },
  inputError: {
    border: '1.5px solid #dc3545',
    backgroundColor: '#fff8f8',
    ':focus': {
      boxShadow: '0 0 0 4px rgba(220, 53, 69, 0.15)',
    }
  },
  errorText: {
    fontSize: '12px',
    color: '#dc3545',
    fontWeight: '600',
    marginTop: '4px',
  },
  // Alert Box
  alertBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#ebf8ff',
    border: '1px solid #bee3f8',
    marginBottom: '32px',
  },
  alertIcon: {
    flexShrink: 0,
    marginTop: '2px',
  },
  alertContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  alertText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2b6cb0',
    lineHeight: '1.4',
  },
  alertSubtext: {
    fontSize: '12px',
    color: '#495057',
    fontWeight: '500',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '700',
    border: 'none',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(27, 77, 62, 0.2)',
    ':hover': {
      backgroundColor: '#2d6a4f',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(27, 77, 62, 0.3)',
    },
    ':active': {
      transform: 'translateY(0)',
    }
  },
  submitBtnLoading: {
    backgroundColor: '#2d6a4f',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid #ffffff',
    borderRadius: '50%',
    animation: 'pulse 1s linear infinite', // simplified spinning animation
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    marginTop: '24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1b4d3e',
    border: 'none',
    backgroundColor: 'transparent',
    transition: 'color 0.2s',
    ':hover': {
      color: '#e07a5f',
    }
  },
  // Success state styles
  successContainer: {
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  successIconWrapper: {
    position: 'relative',
    marginBottom: '28px',
  },
  successIconPulse: {
    position: 'absolute',
    top: '-8px',
    left: '-8px',
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    animation: 'pulse 2s infinite',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#2d6a4f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(45, 106, 79, 0.3)',
    zIndex: 1,
    position: 'relative',
  },
  successTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#2d6a4f',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },
  successDescription: {
    fontSize: '15px',
    color: '#495057',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  successEmail: {
    color: '#1b4d3e',
    fontWeight: '700',
    wordBreak: 'break-all',
  },
  successAlert: {
    display: 'flex',
    alignItems: 'flex-start',
    textAlign: 'left',
    padding: '14px',
    borderRadius: '12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    fontSize: '12px',
    color: '#6c757d',
    lineHeight: '1.5',
    marginBottom: '32px',
  },
  retryBtn: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: '16px',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: '2px',
    transition: 'color 0.2s',
    ':hover': {
      color: '#1b4d3e',
      borderBottomColor: '#1b4d3e',
    }
  },
  backToLoginBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    backgroundColor: '#f1f3f5',
    color: '#343a40',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#e2e5e9',
    }
  }
};
