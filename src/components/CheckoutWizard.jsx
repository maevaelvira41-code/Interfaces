import React, { useState } from 'react';

export default function CheckoutWizard({ onCancel, onOrderSuccess }) {
  const [step, setStep] = useState(1); // 1 to 4
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    zipCode: '',
    city: ''
  });
  const [errors, setErrors] = useState({});
  const [shippingMethod, setShippingMethod] = useState('express'); // 'standard' or 'express'
  const [paymentMethod, setPaymentMethod] = useState('momo'); // 'momo', 'om', 'card'
  const [notification, setNotification] = useState('');

  // Cart summary data
  const baseSubtotal = 92500;
  const promoDiscount = -10000;
  
  const getShippingCost = () => {
    return shippingMethod === 'express' ? 5000 : 2000;
  };

  const getShippingLabel = () => {
    return shippingMethod === 'express' ? 'Express (DHL)' : 'Standard (Point Relais)';
  };

  const getTotal = () => {
    return baseSubtotal + promoDiscount + getShippingCost();
  };

  const validateStep1 = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = 'Le nom complet est requis.';
    if (!formData.phone.trim()) tempErrors.phone = 'Le numéro de téléphone est requis.';
    if (!formData.address.trim()) tempErrors.address = 'L’adresse de livraison est requise.';
    if (!formData.city.trim()) tempErrors.city = 'La ville est requise.';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      } else {
        setNotification('⚠️ Veuillez remplir correctement tous les champs obligatoires.');
        setTimeout(() => setNotification(''), 3000);
      }
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Placing order simulation
      setStep(4);
      if (onOrderSuccess) {
        onOrderSuccess({
          id: '2026-004',
          client: formData.fullName,
          amount: getTotal(),
          status: 'En attente',
          date: 'Aujourd\'hui'
        });
      }
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 4) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div style={styles.container} className="fade-in">
      {/* Toast Notification */}
      {notification && (
        <div style={styles.toast} className="fade-in">
          <span>{notification}</span>
        </div>
      )}

      {/* Page Title */}
      {step < 4 && (
        <div style={styles.header}>
          <h2 style={styles.title}>Tunnel de Paiement</h2>
          <button onClick={onCancel} style={styles.cancelTopBtn}>
            Annuler l'achat
          </button>
        </div>
      )}

      {/* Progress Wizard Bar */}
      <div style={styles.wizardCard}>
        <div style={styles.wizardSteps}>
          {['Adresse', 'Livraison', 'Paiement', 'Confirmation'].map((name, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;
            return (
              <div key={name} style={styles.wizardStepContainer}>
                <div style={{
                  ...styles.wizardDot,
                  backgroundColor: isCompleted ? '#2d6a4f' : (isActive ? '#1b4d3e' : '#ffffff'),
                  borderColor: isCompleted || isActive ? '#1b4d3e' : '#adb5bd',
                }}>
                  {isCompleted ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span style={{
                      ...styles.wizardNumber,
                      color: isActive ? '#ffffff' : '#adb5bd'
                    }}>{stepNum}</span>
                  )}
                </div>
                <span style={{
                  ...styles.wizardLabel,
                  color: isActive || isCompleted ? '#212529' : '#868e96',
                  fontWeight: isActive || isCompleted ? '700' : '500'
                }}>{name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Checkout Area */}
      {step === 4 ? (
        /* Step 4: Order Confirmation Success Screen */
        <div style={styles.successCard} className="fade-in">
          <div style={styles.successIconWrapper}>
            <div style={styles.successIconPulse}></div>
            <div style={styles.successIcon}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <h3 style={styles.successTitle}>Commande validée !</h3>
          <p style={styles.successSubtitle}>
            Merci pour votre confiance. Votre commande a été enregistrée avec succès.
          </p>

          <div style={styles.orderSummaryBox}>
            <div style={styles.orderInfoLine}>
              <span style={styles.infoLabel}>Numéro de commande</span>
              <span style={styles.infoValue}>#2026-004</span>
            </div>
            <div style={styles.orderInfoLine}>
              <span style={styles.infoLabel}>Client</span>
              <span style={styles.infoValue}>{formData.fullName || 'Client AgroMarket'}</span>
            </div>
            <div style={styles.orderInfoLine}>
              <span style={styles.infoLabel}>Montant débité</span>
              <span style={{ ...styles.infoValue, color: '#e07a5f' }}>{getTotal().toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div style={styles.orderInfoLine}>
              <span style={styles.infoLabel}>Livraison prévue</span>
              <span style={styles.infoValue}>{getShippingLabel()} — 1 à 3 jours</span>
            </div>
          </div>

          <button onClick={onCancel} style={styles.successBtn}>
            Retourner au catalogue
          </button>
        </div>
      ) : (
        /* Steps 1, 2, 3 Grid Layout */
        <div style={styles.layoutGrid}>
          {/* Left panel: Form panels */}
          <div style={styles.leftCard}>
            
            {step === 1 && (
              /* Step 1: Adresse de livraison */
              <div className="fade-in">
                <h3 style={styles.sectionTitle}>Adresse de livraison</h3>
                <div style={styles.formGrid}>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Nom complet *</label>
                    <input
                      type="text"
                      placeholder="Ex: Flavier Dschang"
                      value={formData.fullName}
                      onChange={e => handleInputChange('fullName', e.target.value)}
                      className="custom-input"
                      style={errors.fullName ? styles.inputError : {}}
                    />
                    {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Numéro de téléphone *</label>
                    <input
                      type="text"
                      placeholder="Ex: +237 6XX XXX XXX"
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className="custom-input"
                      style={errors.phone ? styles.inputError : {}}
                    />
                    {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
                  </div>

                  <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                    <label style={styles.label}>Adresse *</label>
                    <input
                      type="text"
                      placeholder="Ex: 123 Rue de la Paix"
                      value={formData.address}
                      onChange={e => handleInputChange('address', e.target.value)}
                      className="custom-input"
                      style={errors.address ? styles.inputError : {}}
                    />
                    {errors.address && <span style={styles.errorText}>{errors.address}</span>}
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Ville *</label>
                    <input
                      type="text"
                      placeholder="Ex: Dschang"
                      value={formData.city}
                      onChange={e => handleInputChange('city', e.target.value)}
                      className="custom-input"
                      style={errors.city ? styles.inputError : {}}
                    />
                    {errors.city && <span style={styles.errorText}>{errors.city}</span>}
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Code postal</label>
                    <input
                      type="text"
                      placeholder="Ex: 00237"
                      value={formData.zipCode}
                      onChange={e => handleInputChange('zipCode', e.target.value)}
                      className="custom-input"
                    />
                  </div>

                </div>
              </div>
            )}

            {step === 2 && (
              /* Step 2: Mode de livraison */
              <div className="fade-in">
                <h3 style={styles.sectionTitle}>Mode de livraison</h3>
                <div style={styles.selectionGrid}>
                  
                  <div 
                    onClick={() => setShippingMethod('express')}
                    style={{
                      ...styles.selectionCard,
                      ...(shippingMethod === 'express' ? styles.selectionCardActive : {})
                    }}
                  >
                    <div style={styles.selectionRadioWrapper}>
                      <span style={{
                        ...styles.selectionRadio,
                        ...(shippingMethod === 'express' ? styles.selectionRadioActive : {})
                      }} />
                      <div style={styles.selectionInfo}>
                        <h4 style={styles.selectionTitleText}>Livraison Express (DHL)</h4>
                        <p style={styles.selectionDesc}>Livraison à domicile en 24h à 48h. Remise en main propre sécurisée.</p>
                      </div>
                    </div>
                    <span style={styles.selectionPrice}>5,000 FCFA</span>
                  </div>

                  <div 
                    onClick={() => setShippingMethod('standard')}
                    style={{
                      ...styles.selectionCard,
                      ...(shippingMethod === 'standard' ? styles.selectionCardActive : {})
                    }}
                  >
                    <div style={styles.selectionRadioWrapper}>
                      <span style={{
                        ...styles.selectionRadio,
                        ...(shippingMethod === 'standard' ? styles.selectionRadioActive : {})
                      }} />
                      <div style={styles.selectionInfo}>
                        <h4 style={styles.selectionTitleText}>Livraison Standard (Point Relais)</h4>
                        <p style={styles.selectionDesc}>Disponible sous 3 à 5 jours dans le point de retrait AgroMarket de votre ville.</p>
                      </div>
                    </div>
                    <span style={styles.selectionPrice}>2,000 FCFA</span>
                  </div>

                </div>
              </div>
            )}

            {step === 3 && (
              /* Step 3: Moyen de paiement */
              <div className="fade-in">
                <h3 style={styles.sectionTitle}>Moyen de paiement</h3>
                <div style={styles.selectionGrid}>
                  
                  <div 
                    onClick={() => setPaymentMethod('momo')}
                    style={{
                      ...styles.selectionCard,
                      ...(paymentMethod === 'momo' ? styles.selectionCardActive : {})
                    }}
                  >
                    <div style={styles.selectionRadioWrapper}>
                      <span style={{
                        ...styles.selectionRadio,
                        ...(paymentMethod === 'momo' ? styles.selectionRadioActive : {})
                      }} />
                      <div style={styles.selectionInfo}>
                        <h4 style={styles.selectionTitleText}>MTN Mobile Money</h4>
                        <p style={styles.selectionDesc}>Débiteur direct. Un message de validation USSD s'affichera sur votre téléphone.</p>
                      </div>
                    </div>
                    <span style={styles.paymentLogo}>🟡 mtn</span>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('om')}
                    style={{
                      ...styles.selectionCard,
                      ...(paymentMethod === 'om' ? styles.selectionCardActive : {})
                    }}
                  >
                    <div style={styles.selectionRadioWrapper}>
                      <span style={{
                        ...styles.selectionRadio,
                        ...(paymentMethod === 'om' ? styles.selectionRadioActive : {})
                      }} />
                      <div style={styles.selectionInfo}>
                        <h4 style={styles.selectionTitleText}>Orange Money</h4>
                        <p style={styles.selectionDesc}>Paiement instantané sécurisé par code d'autorisation Orange Money Cameroun.</p>
                      </div>
                    </div>
                    <span style={styles.paymentLogo}>🟠 om</span>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      ...styles.selectionCard,
                      ...(paymentMethod === 'card' ? styles.selectionCardActive : {})
                    }}
                  >
                    <div style={styles.selectionRadioWrapper}>
                      <span style={{
                        ...styles.selectionRadio,
                        ...(paymentMethod === 'card' ? styles.selectionRadioActive : {})
                      }} />
                      <div style={styles.selectionInfo}>
                        <h4 style={styles.selectionTitleText}>Carte Bancaire Visa / MasterCard</h4>
                        <p style={styles.selectionDesc}>Paiement international supporté avec authentification 3D Secure.</p>
                      </div>
                    </div>
                    <span style={styles.paymentLogo}>💳 carte</span>
                  </div>

                </div>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div style={styles.wizardActions}>
              {step > 1 ? (
                <button onClick={handleBack} style={styles.backBtn}>
                  Précédent
                </button>
              ) : (
                <button onClick={onCancel} style={styles.backLinkBtn}>
                  Retour
                </button>
              )}
              
              <button onClick={handleNext} style={styles.nextBtn}>
                {step === 3 ? 'Confirmer le paiement' : 'Suivant'}
              </button>
            </div>

          </div>

          {/* Right panel: Summary Card */}
          <div style={styles.rightCard}>
            <h3 style={styles.summaryTitle}>Résumé</h3>
            
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Articles (3)</span>
              <span style={styles.summaryValue}>{baseSubtotal.toLocaleString('fr-FR')} FCFA</span>
            </div>

            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Livraison</span>
              <span style={styles.summaryValue}>{getShippingCost().toLocaleString('fr-FR')} FCFA</span>
            </div>

            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Code Promo</span>
              <span style={styles.promoValue}>{promoDiscount.toLocaleString('fr-FR')} FCFA</span>
            </div>

            <div style={styles.summaryDivider}></div>

            <div style={{ ...styles.summaryRow, marginBottom: '20px' }}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalValue}>{getTotal().toLocaleString('fr-FR')} FCFA</span>
            </div>

            {/* Micro details block */}
            <div style={styles.logisticsBlock}>
              <div style={styles.logisticsLine}>
                <span>Livraison :</span>
                <strong>{getShippingLabel()}</strong>
              </div>
              <div style={styles.logisticsLine}>
                <span>Paiement sécurisé par cryptage SSL de bout en bout</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '30px 20px 60px 20px',
    width: '100%',
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#e07a5f',
    color: '#ffffff',
    padding: '12px 18px',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    zIndex: 9999,
    fontSize: '13px',
    fontWeight: '700',
    animation: 'slideInRight 0.3s ease-out forwards',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    borderBottom: '1.5px solid #dee2e6',
    paddingBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#212529',
    letterSpacing: '-0.02em',
  },
  cancelTopBtn: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#6c757d',
    borderBottom: '1px dashed #adb5bd',
    cursor: 'pointer',
    paddingBottom: '2px',
    ':hover': {
      color: '#e07a5f',
      borderBottomColor: '#e07a5f',
    }
  },
  // Wizard Card
  wizardCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    padding: '20px 24px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
  },
  wizardSteps: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  wizardStepContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  wizardDot: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.25s ease',
  },
  wizardNumber: {
    fontSize: '11px',
    fontWeight: '800',
  },
  wizardLabel: {
    fontSize: '13px',
    letterSpacing: '-0.01em',
  },
  // Layout Grid
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '30px',
    alignItems: 'start',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    }
  },
  leftCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#1b4d3e',
    marginBottom: '24px',
    borderBottom: '1px solid #f1f3f5',
    paddingBottom: '8px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    '@media (max-width: 576px)': {
      gridTemplateColumns: '1fr',
    }
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#495057',
  },
  inputError: {
    borderColor: '#dc3545',
    backgroundColor: '#fff8f8',
  },
  errorText: {
    fontSize: '11px',
    color: '#dc3545',
    fontWeight: '600',
    marginTop: '2px',
  },
  // Selection Cards (delivery, payments)
  selectionGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  selectionCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px',
    borderRadius: '12px',
    border: '2px solid #dee2e6',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: '#1b4d3e',
      backgroundColor: '#f8f9fa',
    }
  },
  selectionCardActive: {
    borderColor: '#1b4d3e',
    backgroundColor: 'rgba(27,77,62,0.02)',
    boxShadow: '0 4px 10px rgba(27,77,62,0.05)',
  },
  selectionRadioWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  selectionRadio: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid #adb5bd',
    display: 'inline-block',
    position: 'relative',
    transition: 'all 0.2s',
  },
  selectionRadioActive: {
    borderColor: '#1b4d3e',
    borderWidth: '5px',
    backgroundColor: '#ffffff',
  },
  selectionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  selectionTitleText: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#212529',
  },
  selectionDesc: {
    fontSize: '11.5px',
    color: '#6c757d',
    lineHeight: '1.4',
    maxWidth: '380px',
  },
  selectionPrice: {
    fontSize: '14.5px',
    fontWeight: '800',
    color: '#e07a5f',
  },
  paymentLogo: {
    fontSize: '12px',
    fontWeight: '800',
    textTransform: 'uppercase',
    padding: '3px 8px',
    borderRadius: '4px',
    backgroundColor: '#f1f3f5',
    color: '#495057',
  },
  // Wizard actions
  wizardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '32px',
    borderTop: '1px solid #f1f3f5',
    paddingTop: '20px',
  },
  backBtn: {
    padding: '12px 24px',
    borderRadius: '10px',
    backgroundColor: '#f1f3f5',
    color: '#495057',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  backLinkBtn: {
    padding: '12px 24px',
    color: '#6c757d',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    borderBottom: '1.5px solid transparent',
    ':hover': {
      color: '#1b4d3e',
      borderBottomColor: '#1b4d3e',
    }
  },
  nextBtn: {
    padding: '12px 28px',
    borderRadius: '10px',
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    boxShadow: '0 4px 10px rgba(27,77,62,0.15)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#2d6a4f',
    }
  },
  // Right card: Summary Card
  rightCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
  },
  summaryTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#212529',
    marginBottom: '20px',
    borderBottom: '1px solid #f1f3f5',
    paddingBottom: '10px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '14px',
    fontSize: '13.5px',
  },
  summaryLabel: {
    color: '#6c757d',
    fontWeight: '500',
  },
  summaryValue: {
    color: '#212529',
    fontWeight: '700',
  },
  promoValue: {
    color: '#2d6a4f',
    fontWeight: '700',
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: '#e9ecef',
    margin: '16px 0',
  },
  totalLabel: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#212529',
  },
  totalValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#e07a5f',
  },
  logisticsBlock: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px solid #e9ecef',
  },
  logisticsLine: {
    fontSize: '11px',
    color: '#868e96',
    fontWeight: '600',
    display: 'flex',
    justifyContent: 'space-between',
  },
  // Success Card step 4
  successCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1px solid #e9ecef',
    padding: '48px 30px',
    maxWidth: '540px',
    margin: '30px auto',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  successIconWrapper: {
    position: 'relative',
    marginBottom: '24px',
  },
  successIconPulse: {
    position: 'absolute',
    top: '-6px',
    left: '-6px',
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    animation: 'pulse 2s infinite',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#2d6a4f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 16px rgba(45, 106, 79, 0.25)',
    zIndex: 1,
    position: 'relative',
  },
  successTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#2d6a4f',
    marginBottom: '8px',
  },
  successSubtitle: {
    fontSize: '13.5px',
    color: '#6c757d',
    marginBottom: '28px',
    maxWidth: '380px',
  },
  orderSummaryBox: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '12px',
    padding: '20px',
    width: '100%',
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    textAlign: 'left',
  },
  orderInfoLine: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  infoLabel: {
    color: '#868e96',
    fontWeight: '600',
  },
  infoValue: {
    color: '#212529',
    fontWeight: '700',
  },
  successBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    fontSize: '13.5px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(27,77,62,0.2)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#2d6a4f',
    }
  }
};
