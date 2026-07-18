import React, { useState, useEffect } from 'react';
import { paiementApi } from '../services/api';

// order: objet déjà mappé par commandeMapping.mapCommandePourAffichage —
// { id, id_client, client, clientEmail, amount, status, date,
//   items: [{ produitId, nomProduit, quantity, prixUnitaire, subtotal }] }
// (voir App.jsx, écran 'order-detail-admin')

const METHODE_LABELS = { ORANGE_MONEY: 'Orange Money', MOBILE_MONEY: 'Mobile Money', CARTE: 'Carte bancaire' };
const STATUT_PAIEMENT_LABELS = {
  EN_ATTENTE: { label: 'En attente', color: '#f5b041', bg: '#fffbea' },
  REUSSI: { label: 'Réussi', color: '#2d6a4f', bg: '#e9f5ee' },
  ECHOUE: { label: 'Échoué', color: '#c0392b', bg: '#fdecea' },
  REMBOURSE: { label: 'Remboursé', color: '#6c757d', bg: '#f1f3f5' },
};

// Les 5 statuts "normaux" d'une commande, dans leur ordre naturel.
// 'Annulée' est un état terminal exceptionnel, traité à part (pas une
// étape de la progression normale).
const STEPS = ['En attente', 'Validée', 'En préparation', 'En livraison', 'Livrée'];

export default function OrderDetailAdmin({ order, onBack, onMarkAsDelivered, onContactClient }) {
  const [paiement, setPaiement] = useState(null);
  const [loadingPaiement, setLoadingPaiement] = useState(true);
  const [marking, setMarking] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (!order?.id) { setLoadingPaiement(false); return; }
    setLoadingPaiement(true);
    paiementApi.getPaiementsByCommande(order.id)
      .then((paiements) => {
        if (cancelled) return;
        // On garde le paiement le plus récent s'il y en a plusieurs
        // (ex : une tentative échouée suivie d'une réussie).
        const plusRecent = (paiements || []).slice().sort(
          (a, b) => new Date(b.datePaiement) - new Date(a.datePaiement)
        )[0];
        setPaiement(plusRecent || null);
      })
      .catch(() => { if (!cancelled) setPaiement(null); })
      .finally(() => { if (!cancelled) setLoadingPaiement(false); });
    return () => { cancelled = true; };
  }, [order?.id]);

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleMarkAsDelivered = async () => {
    if (!order || marking) return;
    setMarking(true);
    try {
      await onMarkAsDelivered(order.id);
      triggerNotification(`🎉 La commande #${order.id} a été marquée comme LIVRÉE avec succès !`);
    } finally {
      setMarking(false);
    }
  };

  const handleContactClient = () => {
    if (!order) return;
    onContactClient(order);
  };

  if (!order) {
    return (
      <div style={styles.container} className="fade-in">
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Commande introuvable. Elle a peut-être été retirée de la liste.</p>
          <button onClick={onBack} style={styles.backBtn}>← Retour aux commandes</button>
        </div>
      </div>
    );
  }

  const currentStepIdx = STEPS.indexOf(order.status);
  const estAnnulee = order.status === 'Annulée';
  const estLivree = order.status === 'Livrée';
  const paiementStyle = paiement ? (STATUT_PAIEMENT_LABELS[paiement.statut] || { label: paiement.statut, color: '#6c757d', bg: '#f1f3f5' }) : null;

  return (
    <div style={styles.container} className="fade-in">
      {/* Toast Notification */}
      {notification && (
        <div style={styles.toast} className="fade-in">
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Détail commande #{order.id}</h2>
        <button onClick={onBack} style={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Retour
        </button>
      </div>

      {/* Cancelled banner — état terminal exceptionnel, hors de la
          progression normale ci-dessous */}
      {estAnnulee && (
        <div style={styles.cancelledBanner}>❌ Cette commande a été annulée.</div>
      )}

      {/* Progress Timeline Tracker */}
      {!estAnnulee && (
        <div style={styles.trackerCard}>
          <span style={styles.statusLabel}>Statut actuel : <strong style={{ color: estLivree ? '#2d6a4f' : '#e07a5f' }}>{order.status}</strong></span>
          <div style={styles.timelineWrapper}>
            {STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isActive = idx === currentStepIdx;
              return (
                <React.Fragment key={step}>
                  {idx > 0 && (
                    <div style={{
                      ...styles.timelineLine,
                      backgroundColor: idx <= currentStepIdx ? '#2d6a4f' : '#dee2e6'
                    }} />
                  )}
                  <div style={styles.stepNodeContainer}>
                    <div style={{
                      ...styles.stepDot,
                      backgroundColor: isCompleted ? '#2d6a4f' : '#ffffff',
                      borderColor: isCompleted ? '#2d6a4f' : '#adb5bd',
                      boxShadow: isActive ? '0 0 0 4px rgba(45, 106, 79, 0.2)' : 'none'
                    }}>
                      {isCompleted ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span style={styles.stepNumber}>{idx + 1}</span>
                      )}
                    </div>
                    <span style={{
                      ...styles.stepLabelText,
                      fontWeight: isCompleted ? '700' : '500',
                      color: isCompleted ? '#212529' : '#6c757d'
                    }}>
                      {step}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid Layout (Left Content, Right Summary Card) */}
      <div style={styles.layoutGrid}>

        {/* Left Side: Order Information Card */}
        <div style={styles.leftCard}>
          {/* Section 1: Produits commandés */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🛒 Produits commandés</h3>
            {(order.items || []).map((item) => (
              <div key={item.produitId} style={styles.productRow}>
                <div style={styles.productAvatar}>🌾</div>
                <div style={styles.productInfo}>
                  <h4 style={styles.productName}>{item.nomProduit}</h4>
                  <p style={styles.productMeta}>{item.quantity} × {item.prixUnitaire.toLocaleString('fr-FR')} FCFA</p>
                </div>
                <div style={styles.productPrice}>{item.subtotal.toLocaleString('fr-FR')} FCFA</div>
              </div>
            ))}
          </div>

          <div style={styles.divider}></div>

          {/* Section 2: Informations client */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>👤 Informations client</h3>
            <div style={styles.clientDetail}>
              <p style={styles.detailName}>{order.client}</p>
              <p style={styles.detailContact}>{order.clientEmail || 'Email non renseigné'}</p>
              <p style={styles.detailHint}>L'adresse de livraison exacte se discute directement avec le client via la messagerie — elle peut différer de son adresse enregistrée.</p>
            </div>
          </div>

          <div style={styles.divider}></div>

          {/* Section 3: Paiement — données réelles depuis paiement-service */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💳 Paiement</h3>
            {loadingPaiement ? (
              <p style={styles.detailText}>Chargement...</p>
            ) : paiement ? (
              <div style={styles.paymentBadge}>
                <span style={styles.paymentMethod}>{METHODE_LABELS[paiement.methode] || paiement.methode}</span>
                <span style={{ ...styles.paymentStatus, color: paiementStyle.color, backgroundColor: paiementStyle.bg }}>
                  {paiementStyle.label}
                </span>
                <span style={styles.paymentAmount}>{paiement.montant.toLocaleString('fr-FR')} FCFA</span>
              </div>
            ) : (
              <p style={styles.detailText}>Aucun paiement enregistré pour cette commande.</p>
            )}
          </div>

          <div style={styles.divider}></div>

          {/* Section 4: Date commande */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📅 Date commande</h3>
            <p style={styles.detailText}>{order.date || 'Non renseignée'}</p>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            <button
              onClick={handleMarkAsDelivered}
              style={{
                ...styles.btnPrimary,
                ...((estLivree || estAnnulee || marking) ? styles.btnDisabled : {})
              }}
              disabled={estLivree || estAnnulee || marking}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {estLivree ? 'Livraison validée' : marking ? 'Mise à jour...' : 'Marquer livrée'}
            </button>

            <button onClick={handleContactClient} style={styles.btnSecondary}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Contacter client
            </button>
          </div>
        </div>

        {/* Right Side: Résumé Card */}
        <div style={styles.rightCard}>
          <h3 style={styles.summaryTitle}>Résumé</h3>

          <div style={{ ...styles.summaryRow, marginBottom: '24px' }}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>{order.amount.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>

      </div>
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
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    padding: '14px 20px',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    zIndex: 9999,
    fontSize: '13px',
    fontWeight: '700',
    animation: 'slideInRight 0.3s ease-out forwards',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#6c757d',
    fontWeight: '500',
  },
  cancelledBanner: {
    backgroundColor: '#fdecea',
    color: '#c0392b',
    fontWeight: '700',
    fontSize: '14px',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid #f5c6c0',
    marginBottom: '24px',
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
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#1b4d3e',
    fontSize: '13px',
    fontWeight: '700',
    border: '1.5px solid #dee2e6',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  // Tracker
  trackerCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    padding: '24px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
  },
  statusLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6c757d',
    display: 'block',
    marginBottom: '20px',
  },
  timelineWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    padding: '0 20px',
  },
  timelineLine: {
    flexGrow: 1,
    height: '4px',
    margin: '0 -15px',
    transform: 'translateY(-10px)',
    borderRadius: '2px',
    transition: 'background-color 0.4s ease',
  },
  stepNodeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    zIndex: 2,
    position: 'relative',
  },
  stepDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2.5px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  stepNumber: {
    fontSize: '12px',
    fontWeight: '800',
    color: '#adb5bd',
  },
  stepLabelText: {
    fontSize: '12px',
    textAlign: 'center',
    letterSpacing: '-0.01em',
  },
  // Layout Grid
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '30px',
    alignItems: 'start',
  },
  leftCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#1b4d3e',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  divider: {
    height: '1px',
    backgroundColor: '#f1f3f5',
    margin: '20px 0',
  },
  // Product Row
  productRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '8px',
  },
  productAvatar: {
    width: '44px',
    height: '44px',
    backgroundColor: '#fcf8f2',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    border: '1px solid #f8e5d0',
    flexShrink: 0,
  },
  productInfo: {
    flexGrow: 1,
  },
  productName: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#212529',
  },
  productMeta: {
    fontSize: '12px',
    color: '#6c757d',
  },
  productPrice: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#e07a5f',
  },
  // Client
  clientDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  detailName: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#212529',
  },
  detailContact: {
    fontSize: '13px',
    color: '#6c757d',
  },
  detailHint: {
    fontSize: '12px',
    color: '#adb5bd',
    fontStyle: 'italic',
    marginTop: '4px',
  },
  detailText: {
    fontSize: '14px',
    color: '#343a40',
    fontWeight: '500',
  },
  paymentBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  paymentMethod: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#2d6a4f',
    backgroundColor: '#d8f3dc',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  paymentStatus: {
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  paymentAmount: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#495057',
  },
  // Action Buttons
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    marginTop: '32px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    flex: 1.2,
    minWidth: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 20px',
    borderRadius: '10px',
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    fontSize: '13.5px',
    fontWeight: '700',
    boxShadow: '0 4px 10px rgba(27,77,62,0.15)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
  },
  btnDisabled: {
    backgroundColor: '#adb5bd',
    boxShadow: 'none',
    cursor: 'not-allowed',
  },
  btnSecondary: {
    flex: 1,
    minWidth: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 20px',
    borderRadius: '10px',
    backgroundColor: '#f8f9fa',
    color: '#343a40',
    fontSize: '13.5px',
    fontWeight: '700',
    border: '1.5px solid #dee2e6',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
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
    fontSize: '13.5px',
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
};
