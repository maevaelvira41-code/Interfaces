import React, { useState } from 'react';
import { ArrowLeft, Edit2, Shield, Mail, Phone, MapPin, Calendar, Check, Star, Settings, Bell, MessageSquare, Globe, Moon } from 'lucide-react';

export default function UserProfile({ onBack, onNavigateToOrders, onNavigateToEditProfile }) {
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const recentOrders = [
    { id: '#001', amount: '25,000 FCFA', status: 'Livrée', date: '2026-05-20', statusColor: '#2d6a4f', statusBg: '#d8f3dc' },
    { id: '#002', amount: '12,500 FCFA', status: 'En cours', date: '2026-05-22', statusColor: '#0066cc', statusBg: '#e0f0ff' },
    { id: '#003', amount: '30,000 FCFA', status: 'En attente', date: '2026-05-25', statusColor: '#e07a5f', statusBg: '#fdf1ed' }
  ];

  return (
    <div style={styles.pageWrapper} className="fade-in">
      {toast && <div style={styles.toast} className="fade-in">{toast}</div>}

      {/* Hero Header */}
      <div style={styles.heroHeader}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 style={styles.pageTitle}>Mon Profil</h1>
        <div style={{ width: '80px' }}></div> {/* Spacer for centering */}
      </div>

      <div style={styles.container}>
        <div style={styles.grid}>
          
          {/* Left Column */}
          <div style={styles.leftCol}>
            
            {/* Profile Identity Card */}
            <div style={styles.profileCard}>
              <div style={styles.avatarWrap}>
                <div style={styles.avatar}>R</div>
                <div style={styles.verifiedBadge}>
                  <Check size={12} strokeWidth={4} />
                </div>
              </div>
              <div style={styles.profileInfo}>
                <h2 style={styles.userName}>Ravie Dschang</h2>
                <div style={styles.userStatus}>Client Vérifié</div>
                <div style={styles.userRating}>
                  <div style={styles.stars}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i === 5 ? "none" : "#f5b041"} color="#f5b041" />)}
                  </div>
                  <span style={styles.reviewCount}>(12 avis)</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={styles.statsRow}>
              <div style={styles.statBox}>
                <span style={styles.statValue}>24</span>
                <span style={styles.statLabel}>Commandes</span>
              </div>
              <div style={styles.dividerVertical} />
              <div style={styles.statBox}>
                <span style={{...styles.statValue, color: '#e07a5f'}}>450K</span>
                <span style={styles.statLabel}>Dépenses FCFA</span>
              </div>
              <div style={styles.dividerVertical} />
              <div style={styles.statBox}>
                <span style={{...styles.statValue, color: '#f5b041'}}>4.8/5</span>
                <span style={styles.statLabel}>Évaluation</span>
              </div>
            </div>

            <div style={styles.infoGrid}>
              {/* Personal Info */}
              <div style={styles.infoCard}>
                <h3 style={styles.cardTitle}>Informations personnelles</h3>
                <div style={styles.infoList}>
                  <div style={styles.infoRow}>
                    <Mail size={16} color="#6c757d" />
                    <span style={styles.infoLabel}>Email</span>
                    <span style={styles.infoValue}>ravie@gmail.com</span>
                  </div>
                  <div style={styles.infoRow}>
                    <Phone size={16} color="#6c757d" />
                    <span style={styles.infoLabel}>Téléphone</span>
                    <span style={styles.infoValue}>+237 6XX XXX XXX</span>
                  </div>
                  <div style={styles.infoRow}>
                    <MapPin size={16} color="#6c757d" />
                    <span style={styles.infoLabel}>Adresse</span>
                    <span style={styles.infoValue}>123 Rue Test, Dschang</span>
                  </div>
                  <div style={styles.infoRow}>
                    <Calendar size={16} color="#6c757d" />
                    <span style={styles.infoLabel}>Inscription</span>
                    <span style={styles.infoValue}>15 Mars 2026</span>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div style={styles.infoCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{...styles.cardTitle, margin: 0}}>Préférences</h3>
                  <button style={styles.editIconBtn} onClick={() => showToast('Édition des préférences...')}>
                    <Settings size={16} />
                  </button>
                </div>
                <div style={styles.infoList}>
                  <div style={styles.prefRow}>
                    <div style={styles.prefLeft}>
                      <Bell size={16} color="#2d6a4f" />
                      <span style={styles.prefLabel}>Notifications email</span>
                    </div>
                    <div style={styles.toggleActive}><div style={styles.toggleKnobActive} /></div>
                  </div>
                  <div style={styles.prefRow}>
                    <div style={styles.prefLeft}>
                      <MessageSquare size={16} color="#2d6a4f" />
                      <span style={styles.prefLabel}>SMS alerts</span>
                    </div>
                    <div style={styles.toggleActive}><div style={styles.toggleKnobActive} /></div>
                  </div>
                  <div style={styles.prefRow}>
                    <div style={styles.prefLeft}>
                      <Globe size={16} color="#2d6a4f" />
                      <span style={styles.prefLabel}>Langue</span>
                    </div>
                    <span style={styles.prefValue}>Français</span>
                  </div>
                  <div style={styles.prefRow}>
                    <div style={styles.prefLeft}>
                      <Moon size={16} color="#2d6a4f" />
                      <span style={styles.prefLabel}>Thème</span>
                    </div>
                    <span style={styles.prefValue}>Clair</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div style={styles.ordersCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{...styles.cardTitle, margin: 0}}>Commandes récentes</h3>
                {onNavigateToOrders && (
                  <button style={styles.linkBtn} onClick={onNavigateToOrders}>Tout voir</button>
                )}
              </div>
              
              <div style={styles.ordersList}>
                {recentOrders.map((order, i) => (
                  <React.Fragment key={order.id}>
                    <div style={styles.orderRow}>
                      <span style={styles.orderId}>{order.id}</span>
                      <span style={styles.orderAmount}>{order.amount}</span>
                      <span style={{...styles.statusBadge, color: order.statusColor, backgroundColor: order.statusBg}}>
                        {order.status}
                      </span>
                      <span style={styles.orderDate}>{order.date}</span>
                      <button style={styles.viewBtn} onClick={() => showToast(`Ouverture détails commande ${order.id}`)}>Voir</button>
                    </div>
                    {i < recentOrders.length - 1 && <div style={styles.dividerHorizontal} />}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Actions */}
          <div style={styles.rightCol}>
            <div style={styles.actionCard}>
              <div style={styles.actionIconWrap}>
                <Shield size={32} color="#1b4d3e" />
              </div>
              <h3 style={styles.actionTitle}>Gestion du compte</h3>
              <p style={styles.actionDesc}>Mettez à jour vos informations personnelles et gérez la sécurité de votre compte.</p>
              
              <button style={styles.primaryBtn} onClick={() => {
                if (onNavigateToEditProfile) {
                  onNavigateToEditProfile();
                } else {
                  showToast('Ouverture du formulaire de modification...');
                }
              }}>
                <Edit2 size={18} />
                Modifier profil
              </button>
              
              <button style={styles.secondaryBtn} onClick={() => showToast('Envoi du lien de réinitialisation...')}>
                Changer mot de passe
              </button>
            </div>
            
            {/* Premium Support Ad */}
            <div style={styles.supportCard}>
              <h4 style={styles.supportTitle}>Besoin d'aide ?</h4>
              <p style={styles.supportText}>Notre équipe support client est disponible 24/7 pour vous assister.</p>
              <button style={styles.supportBtn}>Contacter le support</button>
            </div>
          </div>

        </div>
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
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    padding: '14px 24px',
    borderRadius: '12px',
    boxShadow: '0 12px 24px rgba(27,77,62,0.2)',
    zIndex: 9999,
    fontSize: '14px',
    fontWeight: '700',
  },
  heroHeader: {
    background: 'linear-gradient(135deg, #1b4d3e 0%, #2d6a4f 100%)',
    padding: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
    height: '180px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '10px 20px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(4px)',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  container: {
    maxWidth: '1200px',
    margin: '-60px auto 40px',
    padding: '0 24px',
    position: 'relative',
    zIndex: 10,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '32px',
    alignItems: 'start',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
    border: '1px solid #e9ecef',
  },
  avatarWrap: {
    position: 'relative',
    width: '100px',
    height: '100px',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#e9f5ee',
    color: '#1b4d3e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: '800',
    border: '4px solid #ffffff',
    boxShadow: '0 8px 16px rgba(27,77,62,0.1)',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    width: '28px',
    height: '28px',
    backgroundColor: '#2d6a4f',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    border: '3px solid #ffffff',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  userName: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#212529',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  userStatus: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#2d6a4f',
  },
  userRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  reviewCount: {
    fontSize: '13px',
    color: '#6c757d',
    fontWeight: '500',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
    border: '1px solid #e9ecef',
  },
  statBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#212529',
  },
  statLabel: {
    fontSize: '13px',
    color: '#6c757d',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  dividerVertical: {
    width: '1px',
    height: '40px',
    backgroundColor: '#e9ecef',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
    border: '1px solid #e9ecef',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#212529',
    marginBottom: '20px',
    margin: 0,
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#6c757d',
    fontWeight: '500',
    width: '80px',
  },
  infoValue: {
    fontSize: '14px',
    color: '#212529',
    fontWeight: '700',
    flex: 1,
  },
  editIconBtn: {
    background: 'none',
    border: 'none',
    color: '#adb5bd',
    cursor: 'pointer',
    padding: '4px',
    transition: 'color 0.2s ease',
  },
  prefRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prefLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  prefLabel: {
    fontSize: '14px',
    color: '#495057',
    fontWeight: '600',
  },
  prefValue: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#212529',
    backgroundColor: '#f1f3f5',
    padding: '4px 12px',
    borderRadius: '8px',
  },
  toggleActive: {
    width: '36px',
    height: '20px',
    backgroundColor: '#2d6a4f',
    borderRadius: '10px',
    position: 'relative',
    cursor: 'pointer',
  },
  toggleKnobActive: {
    width: '16px',
    height: '16px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    right: '2px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  ordersCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
    border: '1px solid #e9ecef',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#1b4d3e',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
  },
  orderRow: {
    display: 'grid',
    gridTemplateColumns: '80px 120px 100px 1fr 60px',
    alignItems: 'center',
    padding: '16px 0',
  },
  orderId: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#212529',
  },
  orderAmount: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#e07a5f',
  },
  statusBadge: {
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '20px',
    textAlign: 'center',
  },
  orderDate: {
    fontSize: '13px',
    color: '#6c757d',
    fontWeight: '500',
  },
  viewBtn: {
    background: 'none',
    border: 'none',
    color: '#0066cc',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  dividerHorizontal: {
    height: '1px',
    backgroundColor: '#f1f3f5',
    width: '100%',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
    border: '1px solid #e9ecef',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  actionIconWrap: {
    width: '64px',
    height: '64px',
    backgroundColor: '#e9f5ee',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  actionTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#212529',
    margin: '0 0 12px 0',
  },
  actionDesc: {
    fontSize: '14px',
    color: '#6c757d',
    lineHeight: '1.6',
    margin: '0 0 32px 0',
  },
  primaryBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#1b4d3e',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '16px',
    boxShadow: '0 8px 24px rgba(27, 77, 62, 0.2)',
    transition: 'transform 0.2s ease',
  },
  secondaryBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#e07a5f',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(224, 122, 95, 0.2)',
    transition: 'transform 0.2s ease',
  },
  supportCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '20px',
    padding: '24px',
    border: '1px dashed #ced4da',
    textAlign: 'center',
  },
  supportTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  supportText: {
    fontSize: '13px',
    color: '#6c757d',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
  },
  supportBtn: {
    padding: '10px 20px',
    backgroundColor: '#ffffff',
    color: '#212529',
    border: '1px solid #dee2e6',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
  }
};
