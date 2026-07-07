import React, { useState } from 'react';
import { X, Flag, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SignalementModal({ product, onClose }) {
  const [step, setStep] = useState(1); // 1: formulaire, 2: succès
  const [raison, setRaison] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const raisons = [
    { value: 'fausse_description', label: '📝 Fausse description', desc: 'Les informations du produit ne correspondent pas à la réalité' },
    { value: 'prix_abusif', label: '💰 Prix abusif', desc: 'Le prix est excessivement élevé ou trompeur' },
    { value: 'produit_dangereux', label: '⚠️ Produit dangereux', desc: 'Le produit présente un danger pour la santé' },
    { value: 'arnaque', label: '🚨 Arnaque / Fraude', desc: 'Tentative d\'escroquerie ou de fraude' },
    { value: 'contenu_inapproprie', label: '🚫 Contenu inapproprié', desc: 'Photos ou textes inappropriés' },
    { value: 'autre', label: '❓ Autre raison', desc: 'Autre problème non listé ci-dessus' },
  ];

  const handleSubmit = () => {
    if (!raison) { alert('Veuillez choisir une raison'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1500);
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>

        {/* Header */}
        <div style={styles.modalHeader}>
          <div style={styles.headerLeft}>
            <div style={styles.flagIcon}><Flag size={20} color="#e07a5f" /></div>
            <div>
              <h3 style={styles.modalTitle}>Signaler un problème</h3>
              {product && <p style={styles.modalSubtitle}>Produit : <strong>{product.name}</strong></p>}
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        {/* Étape 1 : Formulaire */}
        {step === 1 && (
          <div style={styles.modalBody}>
            <p style={styles.intro}>
              Aidez-nous à maintenir la qualité de la plateforme en signalant les contenus problématiques.
            </p>

            <div style={styles.raisonList}>
              {raisons.map((r) => (
                <div
                  key={r.value}
                  style={{
                    ...styles.raisonItem,
                    borderColor: raison === r.value ? '#e07a5f' : '#e9ecef',
                    backgroundColor: raison === r.value ? '#fff5f2' : '#ffffff',
                  }}
                  onClick={() => setRaison(r.value)}
                >
                  <div style={styles.raisonLeft}>
                    <div style={{
                      ...styles.radioCircle,
                      borderColor: raison === r.value ? '#e07a5f' : '#dee2e6',
                      backgroundColor: raison === r.value ? '#e07a5f' : 'transparent',
                    }} />
                    <div>
                      <p style={styles.raisonLabel}>{r.label}</p>
                      <p style={styles.raisonDesc}>{r.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Détails supplémentaires (optionnel)</label>
              <textarea
                placeholder="Décrivez le problème en détail..."
                style={styles.textarea}
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={styles.warningBox}>
              <AlertTriangle size={14} color="#f5b041" />
              <span style={styles.warningText}>Les faux signalements peuvent entraîner une suspension de votre compte.</span>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={onClose}>Annuler</button>
              <button
                style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                <Flag size={16} />
                {loading ? 'Envoi...' : 'Envoyer le signalement'}
              </button>
            </div>
          </div>
        )}

        {/* Étape 2 : Succès */}
        {step === 2 && (
          <div style={styles.successBody}>
            <div style={styles.successIcon}>
              <CheckCircle size={48} color="#2d6a4f" />
            </div>
            <h3 style={styles.successTitle}>Signalement envoyé !</h3>
            <p style={styles.successText}>
              Merci pour votre contribution. Notre équipe va examiner ce signalement et prendre les mesures nécessaires sous <strong>48 heures</strong>.
            </p>
            <div style={styles.successRef}>
              Référence : <strong>SIG-{Date.now().toString().slice(-6)}</strong>
            </div>
            <button style={styles.successBtn} onClick={onClose}>Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px', backdropFilter: 'blur(4px)' },
  modal: { backgroundColor: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '520px', boxShadow: '0 32px 64px rgba(0,0,0,0.15)', overflow: 'hidden' },

  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid #e9ecef' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  flagIcon: { width: '40px', height: '40px', backgroundColor: '#fff5f2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: '18px', fontWeight: '800', color: '#212529', margin: 0 },
  modalSubtitle: { fontSize: '13px', color: '#6c757d', margin: '2px 0 0 0' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d', padding: '4px', display: 'flex', borderRadius: '8px' },

  modalBody: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  intro: { fontSize: '14px', color: '#6c757d', margin: 0, lineHeight: '1.5' },

  raisonList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  raisonItem: { border: '1.5px solid', borderRadius: '12px', padding: '12px 16px', cursor: 'pointer', transition: 'all 0.15s ease' },
  raisonLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  radioCircle: { width: '16px', height: '16px', borderRadius: '50%', border: '2px solid', flexShrink: 0, transition: 'all 0.15s ease' },
  raisonLabel: { fontSize: '14px', fontWeight: '700', color: '#212529', margin: 0 },
  raisonDesc: { fontSize: '12px', color: '#6c757d', margin: '2px 0 0 0' },

  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#343a40' },
  textarea: { width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #dee2e6', fontSize: '14px', backgroundColor: '#f8f9fa', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },

  warningBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#fffbea', borderRadius: '10px', border: '1px solid #f5e4a0' },
  warningText: { fontSize: '12px', color: '#856404', fontWeight: '600' },

  modalFooter: { display: 'flex', gap: '12px' },
  cancelBtn: { flex: 1, padding: '12px', backgroundColor: '#f1f3f5', color: '#495057', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  submitBtn: { flex: 2, padding: '12px', backgroundColor: '#e07a5f', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },

  // Succès
  successBody: { padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' },
  successIcon: { width: '80px', height: '80px', backgroundColor: '#e9f5ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: '22px', fontWeight: '900', color: '#212529', margin: 0 },
  successText: { fontSize: '14px', color: '#6c757d', lineHeight: '1.6', margin: 0 },
  successRef: { fontSize: '13px', color: '#2d6a4f', backgroundColor: '#e9f5ee', padding: '8px 16px', borderRadius: '20px', fontWeight: '600' },
  successBtn: { padding: '12px 32px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },
};