import React, { useState, useRef } from 'react';
import {
  User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle, ArrowRight,
  ShieldCheck, FileText, GraduationCap, X, AlertCircle, Clock,
} from 'lucide-react';

const plans = [
  {
    id: 'gratuit',
    name: 'Gratuit',
    price: 0,
    color: '#6c757d',
    bgColor: '#f8f9fa',
    borderColor: '#dee2e6',
    icon: '🆓',
    features: ['5 produits max', 'Position normale', 'Messagerie client'],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 2000,
    color: '#2d6a4f',
    bgColor: '#e9f5ee',
    borderColor: '#b7e4c7',
    icon: '⭐',
    badge: 'Populaire',
    features: ['20 produits', '2 produits sponsorisés', 'Badge ⭐'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 5000,
    color: '#e07a5f',
    bgColor: '#fff5f2',
    borderColor: '#f5d4c8',
    icon: '🔥',
    badge: 'Recommandé',
    features: ['Produits illimités', '5 produits sponsorisés', 'Support prioritaire'],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 10000,
    color: '#f5b041',
    bgColor: '#fffbea',
    borderColor: '#f5e4a0',
    icon: '👑',
    features: ['Produits illimités', 'Tous sponsorisés', 'Page personnalisée'],
  },
];

// Institutions / programmes de formation agropastorale reconnus (Cameroun)
const trainingInstitutions = [
  "FASA - Faculté d'Agronomie et des Sciences Agricoles (Université de Dschang)",
  'ESA - École Supérieure d\'Agriculture',
  'IRAD - Institut de Recherche Agricole pour le Développement',
  'MINADER - Programme PAJER-U',
  'MINADER - Programme PEA-Jeunes',
  'ENSAI - École Nationale Supérieure des Sciences Agro-Industrielles',
  'Centre de formation agropastorale (CFA) local',
  'Autre établissement reconnu',
];

export default function RegisterPage({ onRegisterSuccess, onNavigateToLogin }) {
  const [step, setStep] = useState(1);
  // step 1: infos personnelles (client + vendeur)
  // step 2: vérification producteur - identité + formation (vendeur seulement)
  // step 3: choix abonnement (vendeur seulement)
  // step 4: succès

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState('client');
  const [selectedPlan, setSelectedPlan] = useState('gratuit');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', password: '', confirm: '',
  });

  // ===== VÉRIFICATION PRODUCTEUR =====
  const [idDocuments, setIdDocuments] = useState([]); // pièce d'identité (recto/verso)
  const [trainingCertificate, setTrainingCertificate] = useState([]); // attestation de formation
  const [trainingInstitution, setTrainingInstitution] = useState('');
  const [trainingInstitutionOther, setTrainingInstitutionOther] = useState('');
  const [attestationNumber, setAttestationNumber] = useState('');
  const [trainingYear, setTrainingYear] = useState('');

  const idInputRef = useRef(null);
  const certInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!form.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!form.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email invalide';
    if (!form.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    if (!form.password) newErrors.password = 'Le mot de passe est requis';
    else if (form.password.length < 6) newErrors.password = 'Minimum 6 caractères';
    if (form.confirm !== form.password) newErrors.confirm = 'Les mots de passe ne correspondent pas';
    return newErrors;
  };

  const validateVerification = () => {
    const newErrors = {};
    if (idDocuments.length === 0) newErrors.idDocuments = "La pièce d'identité est requise";
    if (!trainingInstitution) newErrors.trainingInstitution = 'Sélectionnez votre établissement de formation';
    if (trainingInstitution === 'Autre établissement reconnu' && !trainingInstitutionOther.trim()) {
      newErrors.trainingInstitutionOther = "Précisez le nom de l'établissement";
    }
    if (trainingCertificate.length === 0) newErrors.trainingCertificate = "L'attestation de formation est requise";
    if (!attestationNumber.trim()) newErrors.attestationNumber = "Le numéro d'attestation est requis";
    return newErrors;
  };

  const handleSubmitStep1 = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    if (role === 'vendeur') {
      setStep(2); // → vérification producteur
    } else {
      // Client → créer compte directement
      setLoading(true);
      setTimeout(() => { setLoading(false); setStep(4); }, 1500);
    }
  };

  const handleSubmitVerification = () => {
    const newErrors = validateVerification();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    setStep(3); // → choix abonnement
  };

  const handleSubmitPlan = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(4); }, 1500);
  };

  const handleIdUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(0) + ' KB' }));
    setIdDocuments(prev => [...prev, ...newDocs]);
    setErrors(prev => ({ ...prev, idDocuments: '' }));
  };

  const handleCertUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(0) + ' KB' }));
    setTrainingCertificate(prev => [...prev, ...newDocs]);
    setErrors(prev => ({ ...prev, trainingCertificate: '' }));
  };

  const removeIdDoc = (idx) => setIdDocuments(prev => prev.filter((_, i) => i !== idx));
  const removeCert = (idx) => setTrainingCertificate(prev => prev.filter((_, i) => i !== idx));

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

  const finalizeRegistration = () => {
    onRegisterSuccess({
      role,
      plan: selectedPlan,
      verificationStatus: role === 'vendeur' ? 'pending' : undefined,
      verificationRequest: role === 'vendeur' ? {
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        telephone: form.telephone,
        idDocuments,
        trainingInstitution: trainingInstitution === 'Autre établissement reconnu'
          ? trainingInstitutionOther
          : trainingInstitution,
        trainingCertificate,
        attestationNumber,
        trainingYear,
        submittedAt: new Date().toISOString(),
      } : undefined,
    });
  };

  // ===== ETAPE 4 : SUCCES =====
  if (step === 4) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>
            {role === 'vendeur'
              ? <Clock size={64} color="#f5b041" />
              : <CheckCircle size={64} color="#2d6a4f" />}
          </div>
          <h2 style={styles.successTitle}>
            {role === 'vendeur' ? 'Compte créé — Vérification en cours ⏳' : 'Compte créé avec succès ! 🎉'}
          </h2>
          <p style={styles.successText}>
            Bienvenue sur AgroMarket, <strong>{form.prenom}</strong> !<br />
            {role === 'client' ? (
              <>Votre compte <strong>Client</strong> a été créé.</>
            ) : (
              <>
                Votre compte <strong>Vendeur/Producteur</strong> a été créé.<br />
                Plan souscrit : <strong>{chosenPlan?.icon} {chosenPlan?.name}</strong><br /><br />
                Notre équipe va vérifier votre pièce d'identité et votre attestation de formation
                sous <strong>24 à 48h</strong> avant d'activer la publication de vos produits.
                Ceci nous permet de garantir des producteurs authentiques et de réduire les arnaques
                sur la plateforme.
              </>
            )}
          </p>
          <button style={styles.successBtn} onClick={finalizeRegistration}>
            {role === 'client' ? 'Découvrir les produits' : 'Accéder à mon espace vendeur'} <ArrowRight size={18} />
          </button>
          <button style={styles.loginLinkBtn} onClick={onNavigateToLogin}>
            Se connecter à la place
          </button>
        </div>
      </div>
    );
  }

  // ===== ETAPE 3 : CHOIX ABONNEMENT (Vendeur) =====
  if (step === 3) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.cardWide}>
          <div style={styles.header}>
            <div style={styles.logo}>🌾</div>
            <h1 style={styles.title}>Choisissez votre abonnement</h1>
            <p style={styles.subtitle}>Boostez la visibilité de vos produits dès le départ</p>
          </div>

          <div style={styles.stepIndicator}>
            <div style={styles.stepDone}>✓ Infos</div>
            <div style={styles.stepLine} />
            <div style={styles.stepDone}>✓ Vérification</div>
            <div style={styles.stepLine} />
            <div style={styles.stepActive}>Abonnement</div>
            <div style={styles.stepLine} />
            <div style={styles.stepPending}>Terminé</div>
          </div>

          <div style={styles.plansGrid}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  ...styles.planCard,
                  borderColor: selectedPlan === plan.id ? plan.color : '#e9ecef',
                  borderWidth: selectedPlan === plan.id ? '2px' : '1px',
                  backgroundColor: selectedPlan === plan.id ? plan.bgColor : '#ffffff',
                  transform: selectedPlan === plan.id ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: selectedPlan === plan.id ? `0 12px 32px ${plan.color}33` : '0 4px 12px rgba(0,0,0,0.03)',
                }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.badge && (
                  <div style={{ ...styles.planBadge, backgroundColor: plan.color }}>{plan.badge}</div>
                )}
                <div style={styles.planIcon}>{plan.icon}</div>
                <h3 style={{ ...styles.planName, color: plan.color }}>{plan.name}</h3>
                <p style={styles.planPrice}>
                  {plan.price === 0 ? 'Gratuit' : `${plan.price.toLocaleString()} FCFA/mois`}
                </p>
                <div style={styles.planFeatures}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={styles.planFeatureItem}>
                      <span style={{ color: plan.color }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                {selectedPlan === plan.id && (
                  <div style={{ ...styles.selectedBadge, color: plan.color }}>✓ Sélectionné</div>
                )}
              </div>
            ))}
          </div>

          <div style={styles.planActions}>
            <button style={styles.backBtn} onClick={() => setStep(2)}>← Retour</button>
            <button
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1, flex: 2 }}
              onClick={handleSubmitPlan}
              disabled={loading}
            >
              {loading ? 'Création...' : `Continuer avec ${chosenPlan?.name}`} {!loading && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== ETAPE 2 : VÉRIFICATION PRODUCTEUR (Vendeur) =====
  if (step === 2) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.cardWide}>
          <div style={styles.header}>
            <div style={{ ...styles.logo, }}>
              <ShieldCheck size={40} color="#2d6a4f" />
            </div>
            <h1 style={styles.title}>Vérification du producteur</h1>
            <p style={styles.subtitle}>
              Pour protéger les acheteurs contre les arnaques, nous vérifions l'identité
              et la formation de chaque vendeur
            </p>
          </div>

          <div style={styles.stepIndicator}>
            <div style={styles.stepDone}>✓ Infos</div>
            <div style={styles.stepLine} />
            <div style={styles.stepActive}>Vérification</div>
            <div style={styles.stepLine} />
            <div style={styles.stepPending}>Abonnement</div>
            <div style={styles.stepLine} />
            <div style={styles.stepPending}>Terminé</div>
          </div>

          <div style={styles.verifGrid}>
            {/* Colonne gauche : formulaire */}
            <div>
              {/* Pièce d'identité */}
              <h3 style={styles.sectionTitle}>Pièce d'identité *</h3>
              <p style={styles.hint}>CNI, passeport ou carte de séjour (recto-verso, PDF ou image)</p>

              <div
                style={{ ...styles.uploadZone, borderColor: errors.idDocuments ? '#e07a5f' : '#b7e4c7' }}
                onClick={() => idInputRef.current.click()}
              >
                <input
                  ref={idInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  onChange={handleIdUpload}
                />
                <FileText size={26} color="#2d6a4f" />
                <span style={styles.uploadText}>Cliquez pour ajouter votre pièce d'identité</span>
              </div>
              {errors.idDocuments && <span style={styles.error}>{errors.idDocuments}</span>}

              {idDocuments.length > 0 && (
                <div style={styles.docList}>
                  {idDocuments.map((doc, i) => (
                    <div key={i} style={styles.docItem}>
                      <FileText size={16} color="#2d6a4f" />
                      <span style={styles.docName}>{doc.name}</span>
                      <span style={styles.docSize}>{doc.size}</span>
                      <button style={styles.docRemove} onClick={() => removeIdDoc(i)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formation agricole */}
              <h3 style={styles.sectionTitle}>Formation agropastorale suivie *</h3>
              <p style={styles.hint}>
                Sélectionnez l'établissement ou le programme officiel dans lequel vous avez été formé
              </p>

              <div style={styles.inputGroup}>
                <select
                  style={{
                    ...styles.input,
                    borderColor: errors.trainingInstitution ? '#e07a5f' : '#dee2e6',
                  }}
                  value={trainingInstitution}
                  onChange={(e) => {
                    setTrainingInstitution(e.target.value);
                    setErrors(prev => ({ ...prev, trainingInstitution: '' }));
                  }}
                >
                  <option value="">-- Sélectionnez un établissement --</option>
                  {trainingInstitutions.map((inst) => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
                {errors.trainingInstitution && <span style={styles.error}>{errors.trainingInstitution}</span>}
              </div>

              {trainingInstitution === 'Autre établissement reconnu' && (
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Nom exact de l'établissement"
                    style={{
                      ...styles.input,
                      borderColor: errors.trainingInstitutionOther ? '#e07a5f' : '#dee2e6',
                    }}
                    value={trainingInstitutionOther}
                    onChange={(e) => {
                      setTrainingInstitutionOther(e.target.value);
                      setErrors(prev => ({ ...prev, trainingInstitutionOther: '' }));
                    }}
                  />
                  {errors.trainingInstitutionOther && <span style={styles.error}>{errors.trainingInstitutionOther}</span>}
                </div>
              )}

              <div style={styles.row2}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Numéro d'attestation *</label>
                  <input
                    type="text"
                    placeholder="Ex: ATT-2024-00123"
                    style={{
                      ...styles.input,
                      borderColor: errors.attestationNumber ? '#e07a5f' : '#dee2e6',
                    }}
                    value={attestationNumber}
                    onChange={(e) => {
                      setAttestationNumber(e.target.value);
                      setErrors(prev => ({ ...prev, attestationNumber: '' }));
                    }}
                  />
                  {errors.attestationNumber && <span style={styles.error}>{errors.attestationNumber}</span>}
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Année d'obtention</label>
                  <input
                    type="number"
                    placeholder="Ex: 2023"
                    style={styles.input}
                    value={trainingYear}
                    onChange={(e) => setTrainingYear(e.target.value)}
                  />
                </div>
              </div>

              <p style={styles.hint} style={{ marginTop: '4px' }}>
                Scan ou photo lisible de l'attestation/certificat de formation (PDF ou image)
              </p>

              <div
                style={{ ...styles.uploadZone, borderColor: errors.trainingCertificate ? '#e07a5f' : '#b7e4c7' }}
                onClick={() => certInputRef.current.click()}
              >
                <input
                  ref={certInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  onChange={handleCertUpload}
                />
                <GraduationCap size={26} color="#2d6a4f" />
                <span style={styles.uploadText}>Cliquez pour ajouter votre attestation de formation</span>
              </div>
              {errors.trainingCertificate && <span style={styles.error}>{errors.trainingCertificate}</span>}

              {trainingCertificate.length > 0 && (
                <div style={styles.docList}>
                  {trainingCertificate.map((doc, i) => (
                    <div key={i} style={styles.docItem}>
                      <GraduationCap size={16} color="#2d6a4f" />
                      <span style={styles.docName}>{doc.name}</span>
                      <span style={styles.docSize}>{doc.size}</span>
                      <button style={styles.docRemove} onClick={() => removeCert(i)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Colonne droite : pourquoi */}
            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>Pourquoi cette vérification ?</h3>
              <div style={styles.benefitList}>
                <div style={styles.benefitItem}>
                  <CheckCircle size={18} color="#2d6a4f" />
                  <span>Réduit les faux producteurs et les arnaques envers les acheteurs</span>
                </div>
                <div style={styles.benefitItem}>
                  <CheckCircle size={18} color="#2d6a4f" />
                  <span>Renforce la confiance des clients envers vos produits</span>
                </div>
                <div style={styles.benefitItem}>
                  <CheckCircle size={18} color="#2d6a4f" />
                  <span>Vos documents restent confidentiels, réservés à l'équipe de modération</span>
                </div>
              </div>
              <div style={styles.infoBox}>
                <AlertCircle size={16} color="#e07a5f" />
                <span style={styles.infoText}>
                  Votre compte sera activé après validation manuelle sous <strong>24 à 48h</strong>.
                  Vous pourrez vous connecter dès maintenant mais la publication de produits
                  restera bloquée jusqu'à approbation.
                </span>
              </div>
            </div>
          </div>

          <div style={styles.planActions}>
            <button style={styles.backBtn} onClick={() => setStep(1)}>← Retour</button>
            <button
              style={{ ...styles.submitBtn, flex: 2 }}
              onClick={handleSubmitVerification}
            >
              Continuer → Choisir un abonnement <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== ETAPE 1 : FORMULAIRE =====
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>🌿</div>
          <h1 style={styles.title}>Créer un compte</h1>
          <p style={styles.subtitle}>Rejoignez des milliers d'agriculteurs et clients</p>
        </div>

        <div style={styles.stepIndicator}>
          <div style={styles.stepActive}>Informations</div>
          <div style={styles.stepLine} />
          <div style={{ ...styles.stepPending, opacity: role === 'vendeur' ? 1 : 0.3 }}>
            {role === 'vendeur' ? 'Vérification' : 'Accueil'}
          </div>
          {role === 'vendeur' && (
            <>
              <div style={styles.stepLine} />
              <div style={styles.stepPending}>Abonnement</div>
            </>
          )}
          <div style={styles.stepLine} />
          <div style={styles.stepPending}>Terminé</div>
        </div>

        <div style={styles.roleRow}>
          <button
            style={{ ...styles.roleBtn, ...(role === 'client' ? styles.roleBtnActive : {}) }}
            onClick={() => setRole('client')}
          >
            🛒 Je suis Client
          </button>
          <button
            style={{ ...styles.roleBtn, ...(role === 'vendeur' ? styles.roleBtnActiveGreen : {}) }}
            onClick={() => setRole('vendeur')}
          >
            🌾 Je suis Vendeur
          </button>
        </div>

        {role === 'vendeur' && (
          <div style={styles.vendeurInfo}>
            🌾 En tant que vendeur, vous devrez fournir une pièce d'identité et une attestation
            de formation agricole à l'étape suivante, avant de choisir votre abonnement.
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
            <label style={styles.label}>Adresse email *</label>
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
                <div style={styles.strengthBar}>
                  <div style={{ ...styles.strengthFill, width: strength.width, backgroundColor: strength.color }} />
                </div>
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

          <button
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmitStep1}
            disabled={loading}
          >
            {loading ? 'Création en cours...' : role === 'vendeur' ? 'Suivant → Vérification producteur' : 'Créer mon compte Client'}
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
  card: { backgroundColor: '#ffffff', borderRadius: '28px', padding: '48px 40px', width: '100%', maxWidth: '560px', boxShadow: '0 24px 64px rgba(0,0,0,0.08)', border: '1px solid #e9ecef' },
  cardWide: { backgroundColor: '#ffffff', borderRadius: '28px', padding: '40px', width: '100%', maxWidth: '1000px', boxShadow: '0 24px 64px rgba(0,0,0,0.08)', border: '1px solid #e9ecef' },
  header: { textAlign: 'center', marginBottom: '24px' },
  logo: { fontSize: '48px', marginBottom: '16px', display: 'flex', justifyContent: 'center' },
  title: { fontSize: '28px', fontWeight: '900', color: '#1b4d3e', margin: '0 0 8px 0', letterSpacing: '-0.02em' },
  subtitle: { fontSize: '15px', color: '#6c757d', margin: '0 auto', fontWeight: '500', maxWidth: '520px' },

  stepIndicator: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  stepActive: { fontSize: '13px', fontWeight: '800', color: '#2d6a4f', backgroundColor: '#e9f5ee', padding: '6px 14px', borderRadius: '20px' },
  stepDone: { fontSize: '13px', fontWeight: '800', color: '#ffffff', backgroundColor: '#2d6a4f', padding: '6px 14px', borderRadius: '20px' },
  stepPending: { fontSize: '13px', fontWeight: '700', color: '#adb5bd', padding: '6px 14px' },
  stepLine: { width: '24px', height: '2px', backgroundColor: '#dee2e6' },

  roleRow: { display: 'flex', gap: '12px', marginBottom: '16px' },
  roleBtn: { flex: 1, padding: '14px', border: '2px solid #dee2e6', borderRadius: '16px', backgroundColor: '#f8f9fa', color: '#495057', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  roleBtnActive: { border: '2px solid #2d6a4f', backgroundColor: '#e9f5ee', color: '#1b4d3e' },
  roleBtnActiveGreen: { border: '2px solid #2d6a4f', backgroundColor: '#e9f5ee', color: '#1b4d3e' },

  vendeurInfo: { backgroundColor: '#e9f5ee', border: '1px solid #b7e4c7', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', color: '#2d6a4f', fontWeight: '600', marginBottom: '16px' },

  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' },
  label: { fontSize: '14px', fontWeight: '700', color: '#212529' },
  inputWrap: { display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', border: '1.5px solid #dee2e6', borderRadius: '14px', backgroundColor: '#f8f9fa' },
  input: { flex: 1, width: '100%', border: '1.5px solid #dee2e6', backgroundColor: '#f8f9fa', fontSize: '14px', color: '#212529', outline: 'none', fontWeight: '500', padding: '12px 16px', borderRadius: '12px', boxSizing: 'border-box' },
  eyeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' },
  error: { fontSize: '12px', color: '#e07a5f', fontWeight: '600' },
  strengthWrap: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' },
  strengthBar: { flex: 1, height: '4px', backgroundColor: '#dee2e6', borderRadius: '4px', overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' },
  strengthLabel: { fontSize: '12px', fontWeight: '700', minWidth: '60px' },
  submitBtn: { padding: '16px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '8px', boxShadow: '0 8px 24px rgba(45,106,79,0.3)' },
  backBtn: { flex: 1, padding: '14px', backgroundColor: '#f1f3f5', color: '#495057', border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  loginText: { textAlign: 'center', fontSize: '14px', color: '#6c757d', margin: 0 },
  loginLink: { background: 'none', border: 'none', color: '#2d6a4f', fontWeight: '800', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' },

  // Vérification producteur
  verifGrid: { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px', alignItems: 'start', marginBottom: '24px' },
  sectionTitle: { fontSize: '15px', fontWeight: '800', color: '#212529', margin: '20px 0 8px 0' },
  hint: { fontSize: '12.5px', color: '#6c757d', margin: '0 0 10px 0' },
  uploadZone: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', border: '2px dashed #b7e4c7', borderRadius: '16px', backgroundColor: '#f0f7f4', cursor: 'pointer', marginBottom: '8px' },
  uploadText: { fontSize: '12.5px', color: '#2d6a4f', fontWeight: '600', textAlign: 'center' },
  docList: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' },
  docItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #e9ecef' },
  docName: { flex: 1, fontSize: '13px', fontWeight: '600', color: '#212529', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  docSize: { fontSize: '12px', color: '#adb5bd' },
  docRemove: { background: 'none', border: 'none', cursor: 'pointer', color: '#e07a5f', display: 'flex' },
  sideCard: { backgroundColor: '#e9f5ee', borderRadius: '20px', padding: '24px', border: '1px solid #b7e4c7' },
  sideTitle: { fontSize: '15px', fontWeight: '800', color: '#1b4d3e', margin: '0 0 16px 0' },
  benefitList: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' },
  benefitItem: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#212529', lineHeight: '1.5' },
  infoBox: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f5d4c8' },
  infoText: { fontSize: '12px', color: '#495057', lineHeight: '1.5' },

  // Plans
  plansGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  planCard: { borderRadius: '20px', padding: '20px 16px', border: 'solid', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'all 0.2s ease' },
  planBadge: { position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap' },
  planIcon: { fontSize: '28px', textAlign: 'center' },
  planName: { fontSize: '18px', fontWeight: '900', margin: 0, textAlign: 'center' },
  planPrice: { fontSize: '13px', color: '#6c757d', fontWeight: '700', textAlign: 'center', margin: 0 },
  planFeatures: { display: 'flex', flexDirection: 'column', gap: '6px' },
  planFeatureItem: { fontSize: '12px', color: '#495057', fontWeight: '600' },
  selectedBadge: { fontSize: '12px', fontWeight: '800', textAlign: 'center', marginTop: '4px' },
  planActions: { display: 'flex', gap: '12px', alignItems: 'center' },

  // Succès
  successCard: { backgroundColor: '#ffffff', borderRadius: '28px', padding: '64px 40px', width: '100%', maxWidth: '540px', boxShadow: '0 24px 64px rgba(0,0,0,0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  successIcon: { width: '100px', height: '100px', backgroundColor: '#e9f5ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: '24px', fontWeight: '900', color: '#1b4d3e', margin: 0 },
  successText: { fontSize: '15px', color: '#495057', lineHeight: '1.7', margin: 0 },
  successBtn: { padding: '16px 36px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 24px rgba(45,106,79,0.3)' },
  loginLinkBtn: { background: 'none', border: 'none', color: '#2d6a4f', fontWeight: '700', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' },
};