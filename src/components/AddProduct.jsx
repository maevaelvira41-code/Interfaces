import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, Image, FileText, Search, Info } from 'lucide-react';

export default function AddProduct({ onProductAdded, onCancel }) {
  const [activeTab, setActiveTab] = useState('Informations');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Légumes');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  // Image upload
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Gestion upload image
  const handleImageChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image (JPG, PNG, WEBP)');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => handleImageChange(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageChange(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const removeImage = () => { setImageFile(null); setImagePreview(null); };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!name || !price || !quantity) {
      alert('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }
    if (!imagePreview) {
      alert('Veuillez ajouter une image pour votre produit');
      setActiveTab('Images');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newProduct = {
        id: Date.now(),
        name,
        category,
        stock: parseFloat(quantity) || 0,
        price: parseFloat(price) || 0,
        status: 'Actif',
        image: imagePreview,
        description,
      };
      if (onProductAdded) onProductAdded(newProduct);
    }, 1200);
  };

  const handleSaveDraft = () => {
    setNotification('Brouillon enregistré avec succès !');
    setTimeout(() => setNotification(''), 2500);
  };

  const tabs = ['Informations', 'Images', 'Détails', 'SEO'];

  return (
    <div style={styles.container}>

      {/* Toast */}
      {notification && (
        <div style={styles.toast}>💾 {notification}</div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <button onClick={onCancel} style={styles.backBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h2 style={styles.title}>Ajouter un produit</h2>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tabBtn,
              ...(activeTab === tab ? styles.tabBtnActive : {})
            }}
          >
            {tab === 'Images' && imagePreview && <span style={styles.tabDot}>✓ </span>}
            {tab}
          </button>
        ))}
      </div>

      <div style={styles.layoutGrid}>

        {/* Colonne gauche - Formulaire */}
        <div style={styles.formCard}>

          {/* ===== ONGLET INFORMATIONS ===== */}
          {activeTab === 'Informations' && (
            <>
              <h3 style={styles.cardTitle}>Informations basiques</h3>
              <div style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nom du produit *</label>
                  <input
                    type="text"
                    placeholder="Ex: Banane Douce de Dschang"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Catégorie *</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
                    <option>Légumes</option>
                    <option>Fruits</option>
                    <option>Viande & Volaille</option>
                    <option>Produits Laitiers</option>
                    <option>Poisson & Fruits de Mer</option>
                    <option>Céréales</option>
                    <option>Épices</option>
                    <option>Miel</option>
                  </select>
                </div>

                <div style={styles.row2}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Quantité disponible *</label>
                    <input
                      type="number"
                      placeholder="Ex: 50"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      style={styles.input}
                      min="0"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Prix (FCFA) *</label>
                    <input
                      type="number"
                      placeholder="Ex: 1500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={styles.input}
                      min="0"
                    />
                  </div>
                </div>

                <div style={styles.actionsRow}>
                  <button type="button" onClick={handleSaveDraft} style={styles.draftBtn}>Brouillon</button>
                  <button type="button" onClick={() => setActiveTab('Images')} style={styles.nextBtn}>
                    Suivant → Images
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ===== ONGLET IMAGES ===== */}
          {activeTab === 'Images' && (
            <>
              <h3 style={styles.cardTitle}>Photo du produit</h3>
              <div style={styles.form}>

                {/* Zone drag & drop */}
                {!imagePreview ? (
                  <div
                    style={{
                      ...styles.dropZone,
                      borderColor: isDragging ? '#2d6a4f' : '#dee2e6',
                      backgroundColor: isDragging ? '#e9f5ee' : '#f8f9fa',
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileInput}
                    />
                    <Upload size={48} color="#2d6a4f" style={{ marginBottom: '16px' }} />
                    <h4 style={styles.dropTitle}>Cliquez ou glissez votre image ici</h4>
                    <p style={styles.dropSubtitle}>JPG, PNG, WEBP — Max 5 MB</p>
                    <button
                      type="button"
                      style={styles.uploadBtn}
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
                    >
                      <Image size={16} /> Choisir une image
                    </button>
                  </div>
                ) : (
                  <div style={styles.imagePreviewWrap}>
                    <img src={imagePreview} alt="Aperçu" style={styles.uploadedImg} />
                    <div style={styles.imageOverlay}>
                      <button style={styles.removeImgBtn} onClick={removeImage}>
                        <X size={16} /> Supprimer
                      </button>
                      <button style={styles.changeImgBtn} onClick={() => fileInputRef.current.click()}>
                        <Upload size={16} /> Changer
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileInput}
                      />
                    </div>
                    <div style={styles.imageSuccess}>
                      <CheckCircle size={16} color="#2d6a4f" />
                      <span>Image ajoutée : {imageFile?.name}</span>
                    </div>
                  </div>
                )}

                <div style={styles.actionsRow}>
                  <button type="button" onClick={() => setActiveTab('Informations')} style={styles.draftBtn}>← Retour</button>
                  <button type="button" onClick={() => setActiveTab('Détails')} style={styles.nextBtn}>
                    Suivant → Détails
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ===== ONGLET DETAILS ===== */}
          {activeTab === 'Détails' && (
            <>
              <h3 style={styles.cardTitle}>Description du produit</h3>
              <div style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    placeholder="Décrivez votre produit : origine, qualité, mode de culture..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.textarea}
                    rows="6"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Unité de vente</label>
                  <select style={styles.select}>
                    <option>kg</option>
                    <option>litre</option>
                    <option>plateau</option>
                    <option>pièce</option>
                    <option>sac</option>
                  </select>
                </div>

                <div style={styles.actionsRow}>
                  <button type="button" onClick={() => setActiveTab('Images')} style={styles.draftBtn}>← Retour</button>
                  <button type="button" onClick={() => setActiveTab('SEO')} style={styles.nextBtn}>
                    Suivant → SEO
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ===== ONGLET SEO ===== */}
          {activeTab === 'SEO' && (
            <>
              <h3 style={styles.cardTitle}>Référencement (SEO)</h3>
              <div style={styles.form}>
                <div style={styles.seoInfo}>
                  <Info size={16} color="#2d6a4f" />
                  <span>Ces informations aident les acheteurs à trouver votre produit plus facilement.</span>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Mots-clés</label>
                  <input
                    type="text"
                    placeholder="Ex: banane, fruit, bio, Dschang"
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Ville / Localisation</label>
                  <input
                    type="text"
                    placeholder="Ex: Dschang, Bafoussam"
                    style={styles.input}
                  />
                </div>

                <div style={styles.actionsRow}>
                  <button type="button" onClick={handleSaveDraft} style={styles.draftBtn}>Brouillon</button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    style={{ ...styles.publishBtn, opacity: isSubmitting ? 0.7 : 1 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '⏳ Publication...' : '🚀 Publier le produit'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Colonne droite - Aperçu */}
        <div style={styles.previewCard}>
          <h3 style={styles.cardTitle}>Aperçu en direct</h3>
          <div style={styles.previewContainer}>
            <div style={styles.productMockup}>
              <span style={styles.mockupTag}>{category}</span>
              <div style={styles.mockupImageContainer}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Aperçu" style={styles.mockupImage} />
                ) : (
                  <div style={styles.mockupPlaceholder}>
                    <Image size={40} color="#adb5bd" />
                    <span style={styles.mockupPlaceholderText}>Ajoutez une image</span>
                  </div>
                )}
              </div>
              <div style={styles.mockupInfo}>
                <h4 style={styles.mockupName}>{name || 'Nom du produit'}</h4>
                <p style={{ ...styles.mockupPrice, color: price ? '#e07a5f' : '#adb5bd' }}>
                  {price ? Number(price).toLocaleString('fr-FR') : '0'} FCFA
                </p>
                <p style={styles.mockupCategory}>{category}</p>
                <div style={styles.stockStatus}>
                  <span style={{ ...styles.statusDot, backgroundColor: quantity > 0 ? '#2d6a4f' : '#adb5bd' }} />
                  <span style={{ ...styles.statusText, color: quantity > 0 ? '#2d6a4f' : '#adb5bd' }}>
                    {quantity > 0 ? `${quantity} kg en stock` : 'Stock non défini'}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div style={styles.checklist}>
              <p style={styles.checklistTitle}>Checklist avant publication :</p>
              {[
                { label: 'Nom du produit', done: !!name },
                { label: 'Prix défini', done: !!price },
                { label: 'Quantité définie', done: !!quantity },
                { label: 'Image ajoutée', done: !!imagePreview },
                { label: 'Description rédigée', done: !!description },
              ].map((item, i) => (
                <div key={i} style={styles.checkItem}>
                  <span style={{ color: item.done ? '#2d6a4f' : '#adb5bd', fontWeight: '700' }}>
                    {item.done ? '✓' : '○'}
                  </span>
                  <span style={{ ...styles.checkLabel, color: item.done ? '#212529' : '#adb5bd' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  toast: { position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#1b4d3e', color: '#ffffff', padding: '14px 20px', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 999, fontSize: '13px', fontWeight: '700' },
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
  backBtn: { width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1.5px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  title: { fontSize: '24px', fontWeight: '800', color: '#212529', margin: 0 },
  tabsContainer: { display: 'flex', gap: '4px', borderBottom: '2px solid #e9ecef', marginBottom: '32px' },
  tabBtn: { fontSize: '14px', fontWeight: '700', color: '#6c757d', padding: '12px 20px', border: 'none', borderBottom: '3px solid transparent', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s' },
  tabBtnActive: { color: '#1b4d3e', borderBottomColor: '#1b4d3e' },
  tabDot: { color: '#2d6a4f' },
  layoutGrid: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' },
  formCard: { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e9ecef', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' },
  previewCard: { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e9ecef', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' },
  cardTitle: { fontSize: '16px', fontWeight: '800', color: '#212529', borderBottom: '1px solid #f1f3f5', paddingBottom: '12px', marginBottom: '24px', marginTop: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#343a40' },
  input: { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #dee2e6', fontSize: '14px', fontWeight: '500', backgroundColor: '#f8f9fa', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #dee2e6', fontSize: '14px', fontWeight: '500', backgroundColor: '#f8f9fa', outline: 'none', cursor: 'pointer' },
  textarea: { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #dee2e6', fontSize: '14px', fontWeight: '500', backgroundColor: '#f8f9fa', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
  actionsRow: { display: 'flex', gap: '12px', marginTop: '8px' },
  draftBtn: { flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: '#f1f3f5', color: '#495057', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer' },
  nextBtn: { flex: 2, padding: '12px', borderRadius: '10px', backgroundColor: '#2d6a4f', color: '#ffffff', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer' },
  publishBtn: { flex: 2, padding: '12px', borderRadius: '10px', backgroundColor: '#e07a5f', color: '#ffffff', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer' },

  // Upload
  dropZone: { border: '2px dashed', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  dropTitle: { fontSize: '16px', fontWeight: '800', color: '#212529', margin: '0 0 8px 0' },
  dropSubtitle: { fontSize: '13px', color: '#6c757d', margin: '0 0 20px 0' },
  uploadBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  imagePreviewWrap: { display: 'flex', flexDirection: 'column', gap: '12px' },
  uploadedImg: { width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e9ecef' },
  imageOverlay: { display: 'flex', gap: '10px' },
  removeImgBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#fff5f5', color: '#fa5252', border: '1px solid #ffe3e3', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  changeImgBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#e9f5ee', color: '#2d6a4f', border: '1px solid #b7e4c7', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  imageSuccess: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#2d6a4f', fontWeight: '600' },

  // SEO
  seoInfo: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#e9f5ee', borderRadius: '10px', fontSize: '13px', color: '#2d6a4f', fontWeight: '600' },

  // Preview
  previewContainer: { display: 'flex', flexDirection: 'column', gap: '24px' },
  productMockup: { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e9ecef', padding: '16px', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  mockupTag: { position: 'absolute', top: '24px', left: '24px', backgroundColor: 'rgba(27,77,62,0.85)', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '6px', zIndex: 2 },
  mockupImageContainer: { width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f1f3f5', marginBottom: '16px' },
  mockupImage: { width: '100%', height: '100%', objectFit: 'cover' },
  mockupPlaceholder: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  mockupPlaceholderText: { fontSize: '12px', color: '#adb5bd', fontWeight: '600' },
  mockupInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  mockupName: { fontSize: '16px', fontWeight: '800', color: '#212529', margin: '0 0 4px 0' },
  mockupPrice: { fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0' },
  mockupCategory: { fontSize: '12px', color: '#868e96', fontWeight: '500', margin: '0 0 8px 0' },
  stockStatus: { display: 'flex', alignItems: 'center', gap: '6px' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%' },
  statusText: { fontSize: '11px', fontWeight: '700' },

  // Checklist
  checklist: { backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '16px', border: '1px solid #e9ecef' },
  checklistTitle: { fontSize: '13px', fontWeight: '800', color: '#212529', margin: '0 0 12px 0' },
  checkItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' },
  checkLabel: { fontSize: '13px', fontWeight: '600' },
};