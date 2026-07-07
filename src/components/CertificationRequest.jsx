import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, FileText, CheckCircle, X, Shield, Clock, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function CertificationRequest({ onBack, currentStatus = 'none' }) {
  // currentStatus: 'none' | 'pending' | 'approved' | 'rejected'
  const [status, setStatus] = useState(currentStatus);

  const [form, setForm] = useState({
    farmName: '',
    location: '',
    yearsActive: '',
    description: '',
  });

  const [documents, setDocuments] = useState([]);
  const [photos, setPhotos] = useState([]);
  const docInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDocUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(0) + ' KB' }));
    setDocuments(prev => [...prev, ...newDocs]);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeDoc = (idx) => setDocuments(prev => prev.filter((_, i) => i !== idx));
  const removePhoto = (idx) => setPhotos(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!form.farmName || !form.location || documents.length === 0) {
      alert('Veuillez remplir les champs obligatoires et ajouter au moins un document.');
      return;
    }
    setStatus('pending');
  };

  // ===== STATUT : EN ATTENTE =====
  if (status === 'pending') {
    return (
      <div style={styles.wrapper}>
        <div style={styles.statusCard}>
          <div style={styles.statusIconWrap}>
            <Clock size={48} color="#f5b041" />
          </div>
          <h2 style={styles.statusTitle}>Demande en cours d'examen ⏳</h2>
          <p style={styles.statusText}>
            Votre demande de certification a été envoyée avec succès.<br />
            Notre équipe l'examine et vous recevrez une réponse sous <strong>2 à 5 jours ouvrés</strong>.
          </p>
          <div style={styles.statusDetails}>
            <div style={styles.statusRow}>
              <span style={styles.statusLabel}>Ferme</span>
              <span style={styles.statusValue}>{form.farmName}</span>
            </div>
            <div style={styles.statusRow}>
              <span style={styles.statusLabel}>Localisation</span>
              <span style={styles.statusValue}>{form.location}</span>
            </div>
            <div style={styles.statusRow}>
              <span style={styles.statusLabel}>Documents soumis</span>
              <span style={styles.statusValue}>{documents.length} fichier(s)</span>
            </div>
          </div>
          <button style={styles.backToStatusBtn} onClick={onBack}>Retour au tableau de bord</button>
        </div>
      </div>
    );
  }

  // ===== STATUT : APPROUVÉ =====
  if (status === 'approved') {
    return (
      <div style={styles.wrapper}>
        <div style={styles.statusCard}>
          <div style={{ ...styles.statusIconWrap, backgroundColor: '#e9f5ee' }}>
            <Shield size={48} color="#2d6a4f" />
          </div>
          <h2 style={styles.statusTitle}>Vous êtes certifié ! ✅</h2>
          <p style={styles.statusText}>
            Félicitations ! Votre exploitation <strong>{form.farmName || 'votre ferme'}</strong> est maintenant certifiée.<br />
            Le badge <strong>✅ Certifié</strong> apparaît désormais sur tous vos produits.
          </p>
          <button style={styles.backToStatusBtn} onClick={onBack}>Retour au tableau de bord</button>
        </div>
      </div>
    );
  }

  // ===== FORMULAIRE =====
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={onBack}>
            <ArrowLeft size={18} /> Retour
          </button>
          <div style={styles.headerBadge}>
            <Shield size={28} color="#ffffff" />
          </div>
          <h1 style={styles.title}>Demande de certification</h1>
          <p style={styles.subtitle}>
            Obtenez le badge <strong>✅ Certifié</strong> pour renforcer la confiance de vos clients
          </p>
        </div>

        <div style={styles.grid}>

          {/* Colonne gauche - Formulaire */}
          <div style={styles.formCard}>

            <h3 style={styles.sectionTitle}>Informations sur l'exploitation</h3>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Nom de la ferme / exploitation *</label>
              <input
                name="farmName"
                type="text"
                placeholder="Ex: Ferme Dschang Bio"
                style={styles.input}
                value={form.farmName}
                onChange={handleChange}
              />
            </div>

            <div style={styles.row2}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Localisation *</label>
                <input
                  name="location"
                  type="text"
                  placeholder="Ex: Dschang, Ouest"
                  style={styles.input}
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Années d'activité</label>
                <input
                  name="yearsActive"
                  type="number"
                  placeholder="Ex: 5"
                  style={styles.input}
                  value={form.yearsActive}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Description de l'exploitation</label>
              <textarea
                name="description"
                placeholder="Décrivez vos pratiques agricoles, certifications existantes, méthodes de culture..."
                style={styles.textarea}
                rows="4"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Documents justificatifs */}
            <h3 style={styles.sectionTitle}>Documents justificatifs *</h3>
            <p style={styles.hint}>Pièce d'identité, titre foncier, certificat agricole, registre de commerce...</p>

            <div style={styles.uploadZone} onClick={() => docInputRef.current.click()}>
              <input
                ref={docInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={handleDocUpload}
              />
              <FileText size={28} color="#2d6a4f" />
              <span style={styles.uploadText}>Cliquez pour ajouter des documents (PDF, JPG, PNG)</span>
            </div>

            {documents.length > 0 && (
              <div style={styles.docList}>
                {documents.map((doc, i) => (
                  <div key={i} style={styles.docItem}>
                    <FileText size={16} color="#2d6a4f" />
                    <span style={styles.docName}>{doc.name}</span>
                    <span style={styles.docSize}>{doc.size}</span>
                    <button style={styles.docRemove} onClick={() => removeDoc(i)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Photos de l'exploitation */}
            <h3 style={styles.sectionTitle}>Photos de l'exploitation (optionnel)</h3>

            <div style={styles.uploadZone} onClick={() => photoInputRef.current.click()}>
              <input
                ref={photoInputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
              <ImageIcon size={28} color="#2d6a4f" />
              <span style={styles.uploadText}>Ajoutez des photos de votre ferme</span>
            </div>

            {photos.length > 0 && (
              <div style={styles.photoGrid}>
                {photos.map((photo, i) => (
                  <div key={i} style={styles.photoItem}>
                    <img src={photo} alt="" style={styles.photoImg} />
                    <button style={styles.photoRemove} onClick={() => removePhoto(i)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button style={styles.submitBtn} onClick={handleSubmit}>
              <Shield size={18} /> Envoyer la demande de certification
            </button>
          </div>

          {/* Colonne droite - Info */}
          <div style={styles.sideCard}>
            <h3 style={styles.sideTitle}>Pourquoi se certifier ?</h3>
            <div style={styles.benefitList}>
              <div style={styles.benefitItem}>
                <CheckCircle size={18} color="#2d6a4f" />
                <span>Badge <strong>✅ Certifié</strong> visible sur tous vos produits</span>
              </div>
              <div style={styles.benefitItem}>
                <CheckCircle size={18} color="#2d6a4f" />
                <span>Confiance accrue des acheteurs</span>
              </div>
              <div style={styles.benefitItem}>
                <CheckCircle size={18} color="#2d6a4f" />
                <span>Meilleur classement dans les résultats</span>
              </div>
              <div style={styles.benefitItem}>
                <CheckCircle size={18} color="#2d6a4f" />
                <span>Accès à des fonctionnalités premium</span>
              </div>
            </div>

            <div style={styles.infoBox}>
              <AlertCircle size={16} color="#e07a5f" />
              <span style={styles.infoText}>
                Le traitement de votre demande prend généralement entre <strong>2 et 5 jours ouvrés</strong>.
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' },

  header: { textAlign: 'center', padding: '40px 0', position: 'relative' },
  backBtn: { position: 'absolute', left: 0, top: '40px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#212529', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  headerBadge: { width: '64px', height: '64px', backgroundColor: '#2d6a4f', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  title: { fontSize: '28px', fontWeight: '900', color: '#1b4d3e', margin: '0 0 8px 0' },
  subtitle: { fontSize: '15px', color: '#6c757d', margin: 0, fontWeight: '500' },

  grid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', alignItems: 'start' },

  formCard: { backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e9ecef', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' },
  sectionTitle: { fontSize: '16px', fontWeight: '800', color: '#212529', margin: '24px 0 16px 0' },
  hint: { fontSize: '13px', color: '#6c757d', margin: '0 0 12px 0' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#343a40' },
  input: { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #dee2e6', fontSize: '14px', backgroundColor: '#f8f9fa', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #dee2e6', fontSize: '14px', backgroundColor: '#f8f9fa', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },

  uploadZone: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '32px', border: '2px dashed #b7e4c7', borderRadius: '16px', backgroundColor: '#f0f7f4', cursor: 'pointer', marginBottom: '12px' },
  uploadText: { fontSize: '13px', color: '#2d6a4f', fontWeight: '600', textAlign: 'center' },

  docList: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' },
  docItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #e9ecef' },
  docName: { flex: 1, fontSize: '13px', fontWeight: '600', color: '#212529', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  docSize: { fontSize: '12px', color: '#adb5bd' },
  docRemove: { background: 'none', border: 'none', cursor: 'pointer', color: '#e07a5f', display: 'flex' },

  photoGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' },
  photoItem: { position: 'relative', aspectRatio: '1/1', borderRadius: '10px', overflow: 'hidden' },
  photoImg: { width: '100%', height: '100%', objectFit: 'cover' },
  photoRemove: { position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },

  submitBtn: { width: '100%', padding: '16px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '24px', boxShadow: '0 8px 24px rgba(45,106,79,0.3)' },

  sideCard: { backgroundColor: '#e9f5ee', borderRadius: '24px', padding: '28px', border: '1px solid #b7e4c7' },
  sideTitle: { fontSize: '16px', fontWeight: '800', color: '#1b4d3e', margin: '0 0 20px 0' },
  benefitList: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' },
  benefitItem: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#212529', lineHeight: '1.5' },
  infoBox: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f5d4c8' },
  infoText: { fontSize: '12px', color: '#495057', lineHeight: '1.5' },

  // Statuts
  statusCard: { maxWidth: '500px', margin: '80px auto', backgroundColor: '#ffffff', borderRadius: '28px', padding: '48px', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.08)' },
  statusIconWrap: { width: '96px', height: '96px', backgroundColor: '#fff8e8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' },
  statusTitle: { fontSize: '24px', fontWeight: '900', color: '#212529', margin: '0 0 16px 0' },
  statusText: { fontSize: '15px', color: '#6c757d', lineHeight: '1.6', margin: '0 0 24px 0' },
  statusDetails: { backgroundColor: '#f8f9fa', borderRadius: '16px', padding: '16px', marginBottom: '24px', textAlign: 'left' },
  statusRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0' },
  statusLabel: { fontSize: '13px', color: '#6c757d', fontWeight: '600' },
  statusValue: { fontSize: '13px', color: '#212529', fontWeight: '700' },
  backToStatusBtn: { padding: '14px 32px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
};