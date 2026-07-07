import React, { useState, useRef } from 'react';
import { User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle, ArrowRight, Upload, FileText, X, Smartphone } from 'lucide-react';

const plans = [
  { id: 'gratuit', name: 'Gratuit', price: 0, color: '#6c757d', bgColor: '#f8f9fa', borderColor: '#dee2e6', icon: '🆓', features: ['5 produits max', 'Position normale', 'Messagerie client'] },
  { id: 'starter', name: 'Starter', price: 2000, color: '#2d6a4f', bgColor: '#e9f5ee', borderColor: '#b7e4c7', icon: '⭐', badge: 'Populaire', features: ['20 produits', '2 produits sponsorisés', 'Badge ⭐'] },
  { id: 'premium', name: 'Premium', price: 5000, color: '#e07a5f', bgColor: '#fff5f2', borderColor: '#f5d4c8', icon: '🔥', badge: 'Recommandé', features: ['Produits illimités', '5 produits sponsorisés', 'Support prioritaire'] },
  { id: 'gold', name: 'Gold', price: 10000, color: '#f5b041', bgColor: '#fffbea', borderColor: '#f5e4a0', icon: '👑', features: ['Produits illimités', 'Tous sponsorisés', 'Page personnalisée'] },
];

export default function RegisterPage({ onRegisterSuccess, onNavigateToLogin }) {
  // ETAPES:
  // 1 = choix rôle + infos personnelles
  // 2 = documents (vendeur seulement)
  // 3 = choix abonnement (vendeur)
  // 4 = paiement (vendeur plan payant)
  // 5 = succès
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('client');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('gratuit');
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStep, setPaymentStep] = useState('form');
  const [countdown, setCountdown] = useState(30);

  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', password: '', confirm: '' });

  // Documents
  const [cniFile, setCniFile] = useState(null);
  const [cniPreview, setCniPreview] = useState(null);
  const [diplomeFile, setDiplomeFile] = useState(null);
  const [diplomePreview, setDiplomePreview] = useState(null);
  const cniRef = useRef(null);
  const diplomeRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = 'Requis';
    if (!form.nom.trim()) e.nom = 'Requis';
    if (!form.email.trim()) e.email = 'Requis';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    if (!form.telephone.trim()) e.telephone = 'Requis';
    if (!form.password) e.password = 'Requis';
    else if (form.password.length < 6) e.password = 'Minimum 6 caractères';
    if (form.confirm !== form.password) e.confirm = 'Mots de passe différents';
    return e;
  };

  const handleFileUpload = (file, type) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'cni') { setCniFile(file); setCniPreview(e.target.result); }
      else { setDiplomeFile(file); setDiplomePreview(e.target.result); }
    };
    reader.readAsDataURL(file);
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return { label: '', color: '#dee2e6', width: '0%' };
    if (p.length < 4) return { label: 'Faible', color: '#e07a5f', width: '25%' };
    if (p.length < 6) return { label: 'Moyen', color: '#f5b041', width: '50%' };
    if (p.length < 10) return { label: 'Bon', color: '#2d6a4f', width: '75%' };
    return { label: 'Excellent', color: '#1b4d3e', width: '100%' };
  };
  const strength = getPasswordStrength();
  const chosenPlan = plans.find(p => p.id === selectedPlan);

  // Navigation étapes
  const handleStep1 = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (role === 'vendeur') setStep(2);
    else { setLoading(true); setTimeout(() => { setLoading(false); setStep(5); }, 1500); }
  };

  const handleStep2 = () => {
    if (!cniFile) { alert('Veuillez ajouter votre CNI'); return; }
    if (!diplomeFile) { alert('Veuillez ajouter votre diplôme agricole'); return; }
    setStep(3);
  };

  const handleStep3 = () => {
    if (chosenPlan?.price === 0) {
      setLoading(true);
      setTimeout(() => { setLoading(false); setStep(5); }, 1500);
    } else {
      setPhoneNumber(form.telephone);
      setStep(4);
    }
  };

  const handlePay = () => {
    if (!phoneNumber || phoneNumber.length < 9) { alert('Numéro de téléphone invalide'); return; }
    setPaymentStep('processing');
    let count = 30;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setPaymentStep('success');
        setTimeout(() => setStep(5), 1500);
      }
    }, 1000);
  };

  // Indicateur d'étapes
  const steps = role === 'vendeur'
    ? ['Infos', 'Documents', 'Abonnement', ...(chosenPlan?.price > 0 ? ['Paiement'] : []), 'Terminé']
    : ['Infos', 'Terminé'];

  const currentStepIndex = role === 'vendeur'
    ? step - 1
    : step === 1 ? 0 : 1;

  const StepBar = () => (
    <div style={styles.stepBar}>
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <div style={{
            ...styles.stepItem,
            ...(i < currentStepIndex ? styles.stepDone : i === currentStepIndex ? styles.stepActive : styles.stepPending)
          }}>
            {i < currentStepIndex ? '✓' : label}
          </div>
          {i < steps.length - 1 && <div style={styles.stepLine} />}
        </React.Fragment>
      ))}
    </div>
  );

  // ===== SUCCES =====
  if (step === 5) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}><CheckCircle size={64} color="#2d6a4f" /></div>
          <h2 style={styles.successTitle}>Compte créé ! 🎉</h2>
          <p style={styles.successText}>
            Bienvenue, <strong>{form.prenom} {form.nom}</strong> !<br />
            Votre compte <strong>{role === 'client' ? '🛒 Client' : '🌾 Vendeur/Producteur'}</strong> est prêt.
            {role === 'vendeur' && <><br />Plan : <strong>{chosenPlan?.icon} {chosenPlan?.name}</strong></>}
          </p>
          <div style={styles.successInfo}>
            <p style={styles.successInfoText}>
              ✅ Vous pouvez maintenant vous connecter avec votre email et mot de passe.
            </p>
          </div>
          <button style={styles.successBtn} onClick={onNavigateToLogin}>
            Se connecter maintenant <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ===== PAIEMENT =====
  if (step === 4) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}>💳</div>
            <h1 style={styles.title}>Paiement abonnement</h1>
            <p style={styles.subtitle}>{chosenPlan?.icon} {chosenPlan?.name} — {chosenPlan?.price.toLocaleString()} FCFA/mois</p>
          </div>
          <StepBar />

          {paymentStep === 'form' && (
            <div style={styles.form}>
              <div style={{ ...styles.planSummary, borderColor: chosenPlan?.color, backgroundColor: chosenPlan?.bgColor }}>
                <span style={{ fontSize: '32px' }}>{chosenPlan?.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ ...styles.planSummaryName, color: chosenPlan?.color }}>{chosenPlan?.name}</p>
                  <p style={styles.planSummaryPrice}>{chosenPlan?.price.toLocaleString()} FCFA / mois</p>
                </div>
                <p style={{ ...styles.totalAmount, color: chosenPlan?.color }}>{chosenPlan?.price.toLocaleString()} FCFA</p>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Mode de paiement</label>
                <div style={styles.paymentMethods}>
                  {[
                    { id: 'mtn', label: 'MTN Mobile Money', icon: '📱', hint: 'Numéro commençant par 65X, 67X' },
                    { id: 'orange', label: 'Orange Money', icon: '🟠', hint: 'Numéro commençant par 69X' },
                  ].map(pm => (
                    <div key={pm.id} style={{
                      ...styles.paymentMethod,
                      borderColor: paymentMethod === pm.id ? (pm.id === 'mtn' ? '#f5b041' : '#e07a5f') : '#dee2e6',
                      backgroundColor: paymentMethod === pm.id ? (pm.id === 'mtn' ? '#fffbea' : '#fff5f2') : '#ffffff',
                    }} onClick={() => setPaymentMethod(pm.id)}>
                      <span style={{ fontSize: '24px' }}>{pm.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={styles.pmLabel}>{pm.label}</p>
                        <p style={styles.pmHint}>{pm.hint}</p>
                      </div>
                      <div style={{
                        ...styles.radioCircle,
                        borderColor: paymentMethod === pm.id ? '#2d6a4f' : '#dee2e6',
                        backgroundColor: paymentMethod === pm.id ? '#2d6a4f' : 'transparent',
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Numéro Mobile Money</label>
                <div style={styles.inputWrap}>
                  <Smartphone size={16} color="#6c757d" />
                  <input type="tel" placeholder="ex: 677 123 456" style={styles.input} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <p style={styles.payHint}>💡 Vous recevrez une notification pour confirmer le paiement</p>
              </div>

              <div style={styles.secureRow}>
                <span>🔒</span>
                <span style={styles.secureText}>Paiement 100% sécurisé — Données protégées</span>
              </div>

              <div style={styles.actionRow}>
                <button style={styles.backBtn} onClick={() => setStep(3)}>← Retour</button>
                <button style={{ ...styles.payBtn, flex: 2 }} onClick={handlePay}>
                  💳 Payer {chosenPlan?.price.toLocaleString()} FCFA
                </button>
              </div>
            </div>
          )}

          {paymentStep === 'processing' && (
            <div style={styles.processingWrap}>
              <div style={styles.processingIcon}>⏳</div>
              <h3 style={styles.processingTitle}>En attente de confirmation...</h3>
              <p style={styles.processingText}>Notification envoyée au <strong>{phoneNumber}</strong>.<br />Confirmez sur votre téléphone.</p>
              <div style={styles.countdownCircle}>
                <span style={styles.countdownNum}>{countdown}</span>
                <span style={styles.countdownSec}>sec</span>
              </div>
              <div style={styles.processingSteps}>
                <p style={{ color: '#2d6a4f', fontWeight: '700', fontSize: '13px' }}>✅ Notification envoyée</p>
                <p style={{ color: '#f5b041', fontWeight: '700', fontSize: '13px' }}>⏳ Attente de confirmation</p>
                <p style={{ color: '#adb5bd', fontWeight: '700', fontSize: '13px' }}>○ Activation du compte</p>
              </div>
            </div>
          )}

          {paymentStep === 'success' && (
            <div style={styles.processingWrap}>
              <div style={styles.processingIcon}>✅</div>
              <h3 style={{ ...styles.processingTitle, color: '#2d6a4f' }}>Paiement confirmé !</h3>
              <p style={styles.processingText}>Création de votre compte en cours...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== ABONNEMENT =====
  if (step === 3) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.cardWide}>
          <div style={styles.header}>
            <div style={styles.logo}>🌾</div>
            <h1 style={styles.title}>Choisissez votre abonnement</h1>
            <p style={styles.subtitle}>Boostez la visibilité de vos produits</p>
          </div>
          <StepBar />
          <div style={styles.plansGrid}>
            {plans.map(plan => (
              <div key={plan.id} style={{
                ...styles.planCard,
                borderColor: selectedPlan === plan.id ? plan.color : '#e9ecef',
                borderWidth: selectedPlan === plan.id ? '2px' : '1px',
                backgroundColor: selectedPlan === plan.id ? plan.bgColor : '#ffffff',
                transform: selectedPlan === plan.id ? 'scale(1.03)' : 'scale(1)',
                boxShadow: selectedPlan === plan.id ? `0 12px 32px ${plan.color}33` : '0 4px 12px rgba(0,0,0,0.03)',
              }} onClick={() => setSelectedPlan(plan.id)}>
                {plan.badge && <div style={{ ...styles.planBadge, backgroundColor: plan.color }}>{plan.badge}</div>}
                <div style={styles.planIcon}>{plan.icon}</div>
                <h3 style={{ ...styles.planName, color: plan.color }}>{plan.name}</h3>
                <p style={styles.planPrice}>{plan.price === 0 ? <span style={{ color: '#2d6a4f', fontWeight: '800' }}>Gratuit</span> : <><strong>{plan.price.toLocaleString()}</strong> FCFA/mois</>}</p>
                <div style={styles.planFeatures}>
                  {plan.features.map((f, i) => <div key={i} style={styles.planFeatureItem}><span style={{ color: plan.color }}>✓</span> {f}</div>)}
                </div>
                {selectedPlan === plan.id && <div style={{ ...styles.selectedBadge, color: plan.color }}>✓ Sélectionné</div>}
              </div>
            ))}
          </div>
          <div style={styles.actionRow}>
            <button style={styles.backBtn} onClick={() => setStep(2)}>← Retour</button>
            <button style={{ ...styles.submitBtn, flex: 2, opacity: loading ? 0.7 : 1 }} onClick={handleStep3} disabled={loading}>
              {loading ? 'Création...' : chosenPlan?.price === 0 ? 'Continuer gratuitement →' : `Payer ${chosenPlan?.price.toLocaleString()} FCFA →`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== DOCUMENTS VENDEUR =====
  if (step === 2) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}>📄</div>
            <h1 style={styles.title}>Vérification d'identité</h1>
            <p style={styles.subtitle}>Documents obligatoires pour valider votre statut de producteur</p>
          </div>
          <StepBar />

          <div style={styles.form}>
            {/* Info importante */}
            <div style={styles.infoBox}>
              <p style={styles.infoTitle}>⚠️ Documents requis</p>
              <p style={styles.infoText}>Pour garantir la qualité et la sécurité de notre plateforme, tout vendeur doit prouver son statut de producteur avec des documents officiels.</p>
            </div>

            {/* CNI */}
            <div style={styles.docSection}>
              <div style={styles.docHeader}>
                <div style={styles.docIconWrap}>🪪</div>
                <div>
                  <h3 style={styles.docTitle}>Carte Nationale d'Identité (CNI) *</h3>
                  <p style={styles.docSubtitle}>Recto ou recto-verso — JPG, PNG, PDF</p>
                </div>
                {cniFile && <span style={styles.docDone}>✅ Ajouté</span>}
              </div>

              {!cniPreview ? (
                <div style={styles.uploadZone} onClick={() => cniRef.current.click()}>
                  <input ref={cniRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files[0], 'cni')} />
                  <Upload size={24} color="#2d6a4f" />
                  <span style={styles.uploadText}>Cliquez pour ajouter votre CNI</span>
                </div>
              ) : (
                <div style={styles.docPreview}>
                  <FileText size={20} color="#2d6a4f" />
                  <span style={styles.docFileName}>{cniFile?.name}</span>
                  <button style={styles.docRemove} onClick={() => { setCniFile(null); setCniPreview(null); }}><X size={14} /></button>
                </div>
              )}
            </div>

            {/* Diplôme */}
            <div style={styles.docSection}>
              <div style={styles.docHeader}>
                <div style={styles.docIconWrap}>🎓</div>
                <div>
                  <h3 style={styles.docTitle}>Diplôme agricole / Certificat de production *</h3>
                  <p style={styles.docSubtitle}>École de recherche en production animale ou végétale — JPG, PNG, PDF</p>
                </div>
                {diplomeFile && <span style={styles.docDone}>✅ Ajouté</span>}
              </div>

              {!diplomePreview ? (
                <div style={styles.uploadZone} onClick={() => diplomeRef.current.click()}>
                  <input ref={diplomeRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files[0], 'diplome')} />
                  <Upload size={24} color="#2d6a4f" />
                  <span style={styles.uploadText}>Cliquez pour ajouter votre diplôme</span>
                </div>
              ) : (
                <div style={styles.docPreview}>
                  <FileText size={20} color="#2d6a4f" />
                  <span style={styles.docFileName}>{diplomeFile?.name}</span>
                  <button style={styles.docRemove} onClick={() => { setDiplomeFile(null); setDiplomePreview(null); }}><X size={14} /></button>
                </div>
              )}
            </div>

            <div style={styles.legalNote}>
              🔒 Vos documents sont traités de manière confidentielle et ne seront utilisés qu'à des fins de vérification.
            </div>

            <div style={styles.actionRow}>
              <button style={styles.backBtn} onClick={() => setStep(1)}>← Retour</button>
              <button style={{ ...styles.submitBtn, flex: 2 }} onClick={handleStep2}>
                Continuer → Choisir abonnement
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== ETAPE 1 : INFOS =====
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>🌿</div>
          <h1 style={styles.title}>Créer un compte</h1>
          <p style={styles.subtitle}>Rejoignez AgroMarket</p>
        </div>
        <StepBar />

        <div style={styles.roleRow}>
          <button style={{ ...styles.roleBtn, ...(role === 'client' ? styles.roleBtnActive : {}) }} onClick={() => setRole('client')}>
            🛒 Je suis Client
          </button>
          <button style={{ ...styles.roleBtn, ...(role === 'vendeur' ? styles.roleBtnActive : {}) }} onClick={() => setRole('vendeur')}>
            🌾 Je suis Vendeur
          </button>
        </div>

        {role === 'vendeur' && (
          <div style={styles.vendeurInfo}>
            🌾 En tant que vendeur, vous devrez fournir vos documents officiels (CNI + Diplôme agricole) et choisir un abonnement.
          </div>
        )}

        <div style={styles.form}>
          <div style={styles.row2}>
            <div style={styles.field}>
              <label style={styles.label}>Prénom *</label>
              <div style={{ ...styles.inputWrap, borderColor: errors.prenom ? '#e07a5f' : '#dee2e6' }}>
                <User size={16} color="#6c757d" />
                <input name="prenom" type="text" placeholder="ex: Ravie" style={styles.input} value={form.prenom} onChange={handleChange} />
              </div>
              {errors.prenom && <span style={styles.error}>{errors.prenom}</span>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Nom *</label>
              <div style={{ ...styles.inputWrap, borderColor: errors.nom ? '#e07a5f' : '#dee2e6' }}>
                <User size={16} color="#6c757d" />
                <input name="nom" type="text" placeholder="ex: Dupont" style={styles.input} value={form.nom} onChange={handleChange} />
              </div>
              {errors.nom && <span style={styles.error}>{errors.nom}</span>}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email *</label>
            <div style={{ ...styles.inputWrap, borderColor: errors.email ? '#e07a5f' : '#dee2e6' }}>
              <Mail size={16} color="#6c757d" />
              <input name="email" type="email" placeholder="ex: ravie@email.com" style={styles.input} value={form.email} onChange={handleChange} />
            </div>
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Téléphone (MTN / Orange) *</label>
            <div style={{ ...styles.inputWrap, borderColor: errors.telephone ? '#e07a5f' : '#dee2e6' }}>
              <Phone size={16} color="#6c757d" />
              <input name="telephone" type="tel" placeholder="ex: 6XX XXX XXX" style={styles.input} value={form.telephone} onChange={handleChange} />
            </div>
            {errors.telephone && <span style={styles.error}>{errors.telephone}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mot de passe *</label>
            <div style={{ ...styles.inputWrap, borderColor: errors.password ? '#e07a5f' : '#dee2e6' }}>
              <Lock size={16} color="#6c757d" />
              <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Minimum 6 caractères" style={styles.input} value={form.password} onChange={handleChange} />
              <button style={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} color="#6c757d" /> : <Eye size={16} color="#6c757d" />}
              </button>
            </div>
            {errors.password && <span style={styles.error}>{errors.password}</span>}
            {form.password.length > 0 && (
              <div style={styles.strengthWrap}>
                <div style={styles.strengthBar}><div style={{ ...styles.strengthFill, width: strength.width, backgroundColor: strength.color }} /></div>
                <span style={{ ...styles.strengthLabel, color: strength.color }}>{strength.label}</span>
              </div>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirmer le mot de passe *</label>
            <div style={{ ...styles.inputWrap, borderColor: errors.confirm ? '#e07a5f' : '#dee2e6' }}>
              <Lock size={16} color="#6c757d" />
              <input name="confirm" type={showConfirm ? 'text' : 'password'} placeholder="Répétez le mot de passe" style={styles.input} value={form.confirm} onChange={handleChange} />
              <button style={styles.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={16} color="#6c757d" /> : <Eye size={16} color="#6c757d" />}
              </button>
            </div>
            {errors.confirm && <span style={styles.error}>{errors.confirm}</span>}
          </div>

          <button style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} onClick={handleStep1} disabled={loading}>
            {loading ? 'Création...' : role === 'vendeur' ? 'Suivant → Documents' : 'Créer mon compte Client'}
            {!loading && <ArrowRight size={18} />}
          </button>

          <p style={styles.loginText}>
            Déjà un compte ?{' '}
            <button style={styles.loginLink} onClick={onNavigateToLogin}>Se connecter</button>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '100vh', backgroundColor: '#f0f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  card: { backgroundColor: '#ffffff', borderRadius: '28px', padding: '40px', width: '100%', maxWidth: '560px', boxShadow: '0 24px 64px rgba(0,0,0,0.08)', border: '1px solid #e9ecef' },
  cardWide: { backgroundColor: '#ffffff', borderRadius: '28px', padding: '40px', width: '100%', maxWidth: '900px', boxShadow: '0 24px 64px rgba(0,0,0,0.08)', border: '1px solid #e9ecef' },
  header: { textAlign: 'center', marginBottom: '20px' },
  logo: { fontSize: '44px', marginBottom: '10px' },
  title: { fontSize: '24px', fontWeight: '900', color: '#1b4d3e', margin: '0 0 6px 0' },
  subtitle: { fontSize: '14px', color: '#6c757d', margin: 0 },
  stepBar: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' },
  stepItem: { fontSize: '11px', fontWeight: '800', padding: '5px 12px', borderRadius: '20px' },
  stepActive: { color: '#2d6a4f', backgroundColor: '#e9f5ee', border: '2px solid #2d6a4f' },
  stepDone: { color: '#ffffff', backgroundColor: '#2d6a4f' },
  stepPending: { color: '#adb5bd', backgroundColor: '#f8f9fa' },
  stepLine: { width: '20px', height: '2px', backgroundColor: '#dee2e6', flexShrink: 0 },
  roleRow: { display: 'flex', gap: '10px', marginBottom: '14px' },
  roleBtn: { flex: 1, padding: '12px', border: '2px solid #dee2e6', borderRadius: '14px', backgroundColor: '#f8f9fa', color: '#495057', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  roleBtnActive: { border: '2px solid #2d6a4f', backgroundColor: '#e9f5ee', color: '#1b4d3e' },
  vendeurInfo: { backgroundColor: '#e9f5ee', border: '1px solid #b7e4c7', borderRadius: '12px', padding: '10px 14px', fontSize: '12px', color: '#2d6a4f', fontWeight: '600', marginBottom: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#212529' },
  inputWrap: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', border: '1.5px solid #dee2e6', borderRadius: '12px', backgroundColor: '#f8f9fa' },
  input: { flex: 1, border: 'none', backgroundColor: 'transparent', fontSize: '14px', color: '#212529', outline: 'none', fontWeight: '500' },
  eyeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' },
  error: { fontSize: '11px', color: '#e07a5f', fontWeight: '600' },
  strengthWrap: { display: 'flex', alignItems: 'center', gap: '8px' },
  strengthBar: { flex: 1, height: '4px', backgroundColor: '#dee2e6', borderRadius: '4px', overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' },
  strengthLabel: { fontSize: '11px', fontWeight: '700', minWidth: '55px' },
  submitBtn: { padding: '14px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(45,106,79,0.3)' },
  backBtn: { flex: 1, padding: '12px', backgroundColor: '#f1f3f5', color: '#495057', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  actionRow: { display: 'flex', gap: '10px', alignItems: 'center' },
  loginText: { textAlign: 'center', fontSize: '13px', color: '#6c757d', margin: 0 },
  loginLink: { background: 'none', border: 'none', color: '#2d6a4f', fontWeight: '800', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' },

  // Documents
  infoBox: { backgroundColor: '#fff8e8', border: '1px solid #f5e4a0', borderRadius: '12px', padding: '14px' },
  infoTitle: { fontSize: '13px', fontWeight: '800', color: '#856404', margin: '0 0 4px 0' },
  infoText: { fontSize: '12px', color: '#856404', margin: 0, lineHeight: '1.5' },
  docSection: { border: '1px solid #e9ecef', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
  docHeader: { display: 'flex', alignItems: 'center', gap: '12px' },
  docIconWrap: { fontSize: '28px', flexShrink: 0 },
  docTitle: { fontSize: '14px', fontWeight: '800', color: '#212529', margin: 0 },
  docSubtitle: { fontSize: '12px', color: '#6c757d', margin: '2px 0 0 0' },
  docDone: { marginLeft: 'auto', fontSize: '12px', fontWeight: '700', color: '#2d6a4f', backgroundColor: '#e9f5ee', padding: '4px 10px', borderRadius: '20px', flexShrink: 0 },
  uploadZone: { border: '2px dashed #b7e4c7', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: '#f0f7f4' },
  uploadText: { fontSize: '13px', color: '#2d6a4f', fontWeight: '600' },
  docPreview: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#e9f5ee', borderRadius: '10px' },
  docFileName: { flex: 1, fontSize: '13px', color: '#212529', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  docRemove: { background: 'none', border: 'none', cursor: 'pointer', color: '#e07a5f', display: 'flex' },
  legalNote: { fontSize: '12px', color: '#6c757d', textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '10px' },

  // Plans
  plansGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' },
  planCard: { borderRadius: '18px', padding: '18px 14px', border: 'solid', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'all 0.2s ease' },
  planBadge: { position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap' },
  planIcon: { fontSize: '26px', textAlign: 'center' },
  planName: { fontSize: '16px', fontWeight: '900', margin: 0, textAlign: 'center' },
  planPrice: { fontSize: '12px', color: '#6c757d', fontWeight: '600', textAlign: 'center', margin: 0 },
  planFeatures: { display: 'flex', flexDirection: 'column', gap: '5px' },
  planFeatureItem: { fontSize: '11px', color: '#495057', fontWeight: '600' },
  selectedBadge: { fontSize: '11px', fontWeight: '800', textAlign: 'center' },

  // Paiement
  planSummary: { display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '14px', border: '2px solid' },
  planSummaryName: { fontSize: '16px', fontWeight: '800', margin: 0 },
  planSummaryPrice: { fontSize: '13px', color: '#6c757d', margin: '2px 0 0 0' },
  totalAmount: { fontSize: '20px', fontWeight: '900', margin: 0 },
  paymentMethods: { display: 'flex', flexDirection: 'column', gap: '10px' },
  paymentMethod: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: '1.5px solid', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' },
  pmLabel: { fontSize: '14px', fontWeight: '700', color: '#212529', margin: 0 },
  pmHint: { fontSize: '11px', color: '#6c757d', margin: '2px 0 0 0' },
  radioCircle: { width: '18px', height: '18px', borderRadius: '50%', border: '2px solid', marginLeft: 'auto', flexShrink: 0, transition: 'all 0.15s' },
  payHint: { fontSize: '12px', color: '#6c757d', margin: '4px 0 0 0', fontStyle: 'italic' },
  secureRow: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#e9f5ee', borderRadius: '10px' },
  secureText: { fontSize: '12px', color: '#2d6a4f', fontWeight: '600' },
  payBtn: { padding: '14px', backgroundColor: '#e07a5f', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '800', cursor: 'pointer' },
  processingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '24px 0', textAlign: 'center' },
  processingIcon: { fontSize: '52px' },
  processingTitle: { fontSize: '20px', fontWeight: '900', color: '#212529', margin: 0 },
  processingText: { fontSize: '14px', color: '#6c757d', lineHeight: '1.6', margin: 0 },
  countdownCircle: { width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#e9f5ee', border: '4px solid #2d6a4f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  countdownNum: { fontSize: '22px', fontWeight: '900', color: '#1b4d3e', lineHeight: 1 },
  countdownSec: { fontSize: '10px', color: '#2d6a4f', fontWeight: '700' },
  processingSteps: { display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '14px 20px' },

  // Succès
  successCard: { backgroundColor: '#ffffff', borderRadius: '28px', padding: '56px 40px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 64px rgba(0,0,0,0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' },
  successIcon: { width: '96px', height: '96px', backgroundColor: '#e9f5ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: '26px', fontWeight: '900', color: '#1b4d3e', margin: 0 },
  successText: { fontSize: '15px', color: '#495057', lineHeight: '1.6', margin: 0 },
  successInfo: { backgroundColor: '#e9f5ee', borderRadius: '12px', padding: '12px 20px', border: '1px solid #b7e4c7', width: '100%' },
  successInfoText: { fontSize: '13px', color: '#2d6a4f', fontWeight: '600', margin: 0 },
  successBtn: { padding: '14px 32px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(45,106,79,0.3)' },
};