import React, { useState } from 'react';
import { Camera, Save, X, User, MapPin, Mail, Phone, BookOpen, ArrowLeft } from 'lucide-react';

export default function EditProfile({ onBack, onSave }) {
  const [formData, setFormData] = useState({
    nom: 'Dschang',
    prenom: 'Ravie',
    email: 'ravie@gmail.com',
    telephone: '+237 6XX XXX XXX',
    adresse: '123 Rue Test',
    ville: 'Dschang',
    codePostal: '',
    pays: 'Cameroun',
    biographie: ''
  });

  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    else alert('Profil mis à jour !');
  };

  return (
    <div style={styles.pageWrapper} className="fade-in">
      {/* Top Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.headerLeft}>
            <button style={styles.backBtn} onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={styles.pageTitle}>Modifier profil</h1>
          </div>
          <p style={styles.headerSubtitle}>Mettez à jour vos informations personnelles et vos coordonnées.</p>
        </div>
      </div>

      <div style={styles.container}>
        <form style={styles.formCard} onSubmit={handleSubmit}>
          
          <div style={styles.grid}>
            {/* Left Column - Photo Upload */}
            <div style={styles.photoColumn}>
              <div 
                style={{
                  ...styles.photoUploadArea,
                  borderColor: isHoveringPhoto ? '#2d6a4f' : '#ced4da',
                  backgroundColor: isHoveringPhoto ? '#f8fffb' : '#f8f9fa'
                }}
                onMouseEnter={() => setIsHoveringPhoto(true)}
                onMouseLeave={() => setIsHoveringPhoto(false)}
              >
                <div style={styles.photoIconWrap}>
                  <Camera size={32} color={isHoveringPhoto ? '#2d6a4f' : '#adb5bd'} />
                </div>
                <span style={{
                  ...styles.photoText,
                  color: isHoveringPhoto ? '#2d6a4f' : '#6c757d'
                }}>
                  Clic pour charger une photo
                </span>
                <span style={styles.photoSubText}>JPG, PNG max 5MB</span>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div style={styles.formColumn}>
              <h3 style={styles.sectionTitle}>
                <User size={18} />
                Informations personnelles
              </h3>
              
              <div style={styles.inputGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nom</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Prénom</label>
                  <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} style={styles.input} />
                </div>
              </div>

              <div style={styles.inputGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Mail size={14} /> Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Phone size={14} /> Téléphone
                  </label>
                  <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} style={styles.input} />
                </div>
              </div>

              <div style={styles.divider} />

              <h3 style={styles.sectionTitle}>
                <MapPin size={18} />
                Coordonnées de facturation
              </h3>

              <div style={styles.inputGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Adresse</label>
                  <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Ville</label>
                  <input type="text" name="ville" value={formData.ville} onChange={handleChange} style={styles.input} />
                </div>
              </div>

              <div style={styles.inputGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Code postal</label>
                  <input type="text" name="codePostal" value={formData.codePostal} onChange={handleChange} style={styles.input} placeholder="Ex: 00000" />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Pays</label>
                  <input type="text" name="pays" value={formData.pays} onChange={handleChange} style={styles.input} />
                </div>
              </div>

              <div style={styles.divider} />

              <h3 style={styles.sectionTitle}>
                <BookOpen size={18} />
                Biographie
              </h3>

              <div style={styles.inputGroup}>
                <textarea 
                  name="biographie" 
                  value={formData.biographie} 
                  onChange={handleChange} 
                  style={styles.textarea} 
                  placeholder="Parlez de vous, de vos préférences alimentaires..."
                />
              </div>

              {/* Action Buttons */}
              <div style={styles.actionRow}>
                <button type="button" style={styles.cancelBtn} onClick={onBack}>
                  <X size={18} />
                  Annuler
                </button>
                <button type="submit" style={styles.saveBtn}>
                  <Save size={18} />
                  Enregistrer
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    width: '100%',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e9ecef',
    padding: '32px 0',
  },
  headerInner: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 24px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '8px',
  },
  backBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: '#f1f3f5',
    color: '#212529',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#212529',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  headerSubtitle: {
    fontSize: '15px',
    color: '#6c757d',
    margin: '0 0 0 56px',
  },
  container: {
    maxWidth: '1000px',
    margin: '40px auto 60px',
    padding: '0 24px',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 12px 36px rgba(0,0,0,0.03)',
    border: '1px solid #e9ecef',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '48px',
    alignItems: 'start',
  },
  photoColumn: {
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: '40px',
  },
  photoUploadArea: {
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '24px',
    border: '2px dashed #ced4da',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  photoIconWrap: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
  },
  photoText: {
    fontSize: '14px',
    fontWeight: '700',
  },
  photoSubText: {
    fontSize: '12px',
    color: '#adb5bd',
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#212529',
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#495057',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #dee2e6',
    backgroundColor: '#f8f9fa',
    fontSize: '15px',
    color: '#212529',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e9ecef',
    margin: '16px 0',
  },
  textarea: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #dee2e6',
    backgroundColor: '#f8f9fa',
    fontSize: '15px',
    color: '#212529',
    minHeight: '120px',
    resize: 'vertical',
    transition: 'all 0.2s ease',
    outline: 'none',
    fontFamily: 'inherit',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '16px',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e9ecef',
  },
  cancelBtn: {
    padding: '14px 28px',
    backgroundColor: '#ffffff',
    color: '#495057',
    border: '1px solid #dee2e6',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  saveBtn: {
    padding: '14px 32px',
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 8px 24px rgba(27, 77, 62, 0.25)',
  }
};
