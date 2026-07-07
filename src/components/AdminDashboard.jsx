import React, { useState } from 'react';
import { Shield, ShieldCheck, CheckCircle, XCircle, Clock, Eye, FileText } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Accueil', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { id: 'products', label: 'Produits', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  )},
  { id: 'orders', label: 'Commandes', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  )},
  { id: 'certifications', label: 'Certifications', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )},
  { id: 'signalements', label: 'Signalements', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  )},
  { id: 'users', label: 'Utilisateurs', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )},
  { id: 'vendor-verification', label: 'Vérif. Vendeurs', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M9 12l2 2 4-4"/>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )},
  { id: 'sales', label: 'Ventes', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  )},
  { id: 'subscription', label: 'Abonnement', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )},
  { id: 'settings', label: 'Paramètres', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )},
];

const kpis = [
  { id: 'orders', label: 'Total commandes', value: '24', unit: '', change: '+12%', up: true, icon: '📦', color: '#1b4d3e', bg: '#e9f5ee' },
  { id: 'revenue', label: 'Revenus du mois', value: '1.24M', unit: 'FCFA', change: '+8%', up: true, icon: '💰', color: '#2d6a4f', bg: '#d8f3dc' },
  { id: 'products', label: 'Produits actifs', value: '12', unit: '', change: '✓ OK', up: true, icon: '🌿', color: '#40916c', bg: '#f0faf3' },
  { id: 'stock', label: 'Stock critique', value: '3', unit: 'alertes', change: '↑ Urgent', up: false, icon: '⚠️', color: '#dc3545', bg: '#fde8ea' },
];

const recentSales = [
  { date: '15/05', product: 'Banane fraîche', qty: '10 kg', amount: 25000, client: 'Bakari Sow', status: 'Livrée' },
  { date: '14/05', product: 'Tomate fraîche', qty: '5 kg', amount: 7500, client: 'Aminata Fall', status: 'Livrée' },
  { date: '13/05', product: 'Maïs grain', qty: '20 kg', amount: 60000, client: 'Kofi Mensah', status: 'En livraison' },
  { date: '12/05', product: 'Lait frais', qty: '25 L', amount: 30000, client: 'Fatou Diallo', status: 'Livrée' },
];

const recentOrders = [
  { id: '#087', client: 'Bakari Sow', amount: 45000, status: 'Livrée', statusColor: '#2d6a4f', statusBg: '#d8f3dc' },
  { id: '#086', client: 'Aminata Fall', amount: 12500, status: 'En livraison', statusColor: '#0066cc', statusBg: '#e0f0ff' },
  { id: '#085', client: 'Kofi Mensah', amount: 28000, status: 'En préparation', statusColor: '#e07a5f', statusBg: '#fdf1ed' },
];

const chartPoints = [30, 52, 40, 70, 55, 88, 72, 95, 80, 110, 96, 124];
const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

// Données initiales des certifications
const initialCertifications = [
  { id: 1, farm: 'Ferme Bio Dschang', vendeur: 'Jean Tchinda', email: 'jean@farm.cm', location: 'Dschang, Ouest', years: 5, date: '01/07/2026', docs: 3, photos: 2, status: 'pending' },
  { id: 2, farm: 'Élevage Premium Bafoussam', vendeur: 'Marie Kamga', email: 'marie@elev.cm', location: 'Bafoussam, Ouest', years: 8, date: '30/06/2026', docs: 4, photos: 5, status: 'pending' },
  { id: 3, farm: 'Plantation Soleil', vendeur: 'Paul Nkomo', email: 'paul@plant.cm', location: 'Yaoundé, Centre', years: 3, date: '29/06/2026', docs: 2, photos: 1, status: 'approved' },
  { id: 4, farm: 'Ferme Verte', vendeur: 'Aïcha Moussa', email: 'aicha@farm.cm', location: 'Garoua, Nord', years: 6, date: '28/06/2026', docs: 3, photos: 3, status: 'rejected' },
];

export default function AdminDashboard({
  onNavigate,
  onApproveCertification,
  onNavigateToVendorVerification,
  onNavigateToModeration,
  pendingVerificationCount = 0,
  registeredUsers = [],
  onToggleUserBlocked,
}) {
  const [activeNav, setActiveNav] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifCount, setNotifCount] = useState(3);
  const [toast, setToast] = useState('');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [certifications, setCertifications] = useState(initialCertifications);
  const [selectedCert, setSelectedCert] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [certToReject, setCertToReject] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApprove = (id) => {
    setCertifications(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    setSelectedCert(null);
    setNotifCount(n => Math.max(0, n - 1));
    showToast('✅ Certification approuvée avec succès !');
    if (onApproveCertification) onApproveCertification();
  };

  const handleReject = (id) => {
    if (!rejectReason.trim()) { alert('Veuillez indiquer une raison de rejet'); return; }
    setCertifications(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected', rejectReason } : c));
    setShowRejectModal(false);
    setSelectedCert(null);
    setRejectReason('');
    setCertToReject(null);
    showToast('❌ Certification rejetée.');
  };

  const openRejectModal = (cert) => {
    setCertToReject(cert);
    setShowRejectModal(true);
  };

  const pendingCount = certifications.filter(c => c.status === 'pending').length;
  const approvedCount = certifications.filter(c => c.status === 'approved').length;
  const rejectedCount = certifications.filter(c => c.status === 'rejected').length;

  const filteredCerts = certifications.filter(c =>
    filterStatus === 'all' ? true : c.status === filterStatus
  );

  const maxVal = Math.max(...chartPoints);

  const getStatusStyle = (status) => {
    if (status === 'approved') return { color: '#2d6a4f', bg: '#e9f5ee', label: '✅ Approuvée' };
    if (status === 'rejected') return { color: '#e07a5f', bg: '#fdf1ed', label: '❌ Rejetée' };
    return { color: '#f5b041', bg: '#fffbea', label: '⏳ En attente' };
  };

  const handleNavClick = (item) => {
    setActiveNav(item.id);
    if (item.id === 'orders') {
      onNavigate && onNavigate('order-management-admin');
    } else if (item.id === 'vendor-verification') {
      onNavigateToVendorVerification && onNavigateToVendorVerification();
    } else if (item.id === 'signalements') {
      onNavigateToModeration && onNavigateToModeration();
    } else if (item.id === 'users') {
      // reste sur le dashboard : affiche l'onglet Utilisateurs ci-dessous
    } else if (item.id !== 'home' && item.id !== 'certifications') {
      showToast(`Navigation → ${item.label}`);
    }
  };

  return (
    <div style={styles.wrapper}>
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* Modal rejet */}
      {showRejectModal && certToReject && (
        <div style={styles.overlay}>
          <div style={styles.rejectModal}>
            <h3 style={styles.rejectTitle}>❌ Rejeter la certification</h3>
            <p style={styles.rejectSubtitle}>Ferme : <strong>{certToReject.farm}</strong></p>
            <div style={styles.field}>
              <label style={styles.label}>Raison du rejet *</label>
              <textarea
                style={styles.textarea}
                rows="4"
                placeholder="Ex: Documents insuffisants, informations incorrectes..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div style={styles.rejectActions}>
              <button style={styles.cancelBtn} onClick={() => { setShowRejectModal(false); setRejectReason(''); }}>Annuler</button>
              <button style={styles.rejectBtn} onClick={() => handleReject(certToReject.id)}>Confirmer le rejet</button>
            </div>
          </div>
        </div>
      )}

      {/* Détail certification */}
      {selectedCert && (
        <div style={styles.overlay} onClick={() => setSelectedCert(null)}>
          <div style={styles.detailModal} onClick={e => e.stopPropagation()}>
            <div style={styles.detailHeader}>
              <div style={styles.detailHeaderLeft}>
                <div style={styles.detailAvatar}>{selectedCert.farm[0]}</div>
                <div>
                  <h3 style={styles.detailTitle}>{selectedCert.farm}</h3>
                  <p style={styles.detailSub}>{selectedCert.vendeur} · {selectedCert.email}</p>
                </div>
              </div>
              <button style={styles.closeBtn} onClick={() => setSelectedCert(null)}>✕</button>
            </div>

            <div style={styles.detailGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Localisation</span>
                <span style={styles.detailValue}>📍 {selectedCert.location}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Années d'activité</span>
                <span style={styles.detailValue}>🗓 {selectedCert.years} ans</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Date de demande</span>
                <span style={styles.detailValue}>📅 {selectedCert.date}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Documents soumis</span>
                <span style={styles.detailValue}>📄 {selectedCert.docs} fichier(s)</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Photos de ferme</span>
                <span style={styles.detailValue}>📸 {selectedCert.photos} photo(s)</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Statut actuel</span>
                <span style={{
                  ...styles.statusBadge,
                  color: getStatusStyle(selectedCert.status).color,
                  backgroundColor: getStatusStyle(selectedCert.status).bg,
                }}>
                  {getStatusStyle(selectedCert.status).label}
                </span>
              </div>
            </div>

            {selectedCert.rejectReason && (
              <div style={styles.rejectReasonBox}>
                <p style={styles.rejectReasonLabel}>Raison du rejet :</p>
                <p style={styles.rejectReasonText}>{selectedCert.rejectReason}</p>
              </div>
            )}

            {selectedCert.status === 'pending' && (
              <div style={styles.detailActions}>
                <button style={styles.rejectBtnOutline} onClick={() => { setSelectedCert(null); openRejectModal(selectedCert); }}>
                  ❌ Rejeter
                </button>
                <button style={styles.approveBtn} onClick={() => handleApprove(selectedCert.id)}>
                  ✅ Approuver la certification
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside style={{ ...styles.sidebar, width: sidebarCollapsed ? '72px' : '220px' }}>
        <div style={styles.sidebarBrand}>
          <div style={styles.sidebarLogo}><span style={styles.sidebarLogoText}>AM</span></div>
          {!sidebarCollapsed && <span style={styles.sidebarBrandName}>AgroMarket</span>}
        </div>
        <nav style={styles.nav}>
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                }}
              >
                <span style={{ ...styles.navIcon, color: isActive ? '#ffffff' : '#a3c2b8' }}>{item.icon}</span>
                {!sidebarCollapsed && (
                  <span style={{ ...styles.navLabel, color: isActive ? '#ffffff' : '#a3c2b8' }}>{item.label}</span>
                )}
                {!sidebarCollapsed && item.id === 'certifications' && pendingCount > 0 && (
                  <span style={styles.navBadge}>{pendingCount}</span>
                )}
                {!sidebarCollapsed && item.id === 'vendor-verification' && pendingVerificationCount > 0 && (
                  <span style={styles.navBadge}>{pendingVerificationCount}</span>
                )}
                {!sidebarCollapsed && item.id === 'orders' && (
                  <span style={styles.navBadge}>3</span>
                )}
              </button>
            );
          })}
        </nav>
        <button style={styles.collapseBtn} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a3c2b8" strokeWidth="2.5">
            {sidebarCollapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
          </svg>
          {!sidebarCollapsed && <span style={styles.collapseBtnText}>Réduire</span>}
        </button>
      </aside>

      {/* MAIN */}
      <div style={styles.main}>
        <header style={styles.topbar}>
          <div>
            <p style={styles.greetingText}>Bonjour, Admin 👋</p>
            <p style={styles.dateText}>Tableau de bord — AgroMarket</p>
          </div>
          <div style={styles.topbarRight}>
            <button style={styles.topbarIconBtn} onClick={() => onNavigate && onNavigate('notifications')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {notifCount > 0 && <span style={styles.notifPip}>{notifCount}</span>}
            </button>
            <div style={styles.avatarSmall}>AD</div>
          </div>
        </header>

        <div style={styles.content}>

          {/* ===== VUE ACCUEIL ===== */}
          {activeNav === 'home' && (
            <>
              <div style={styles.pageTitle}>
                <h2 style={styles.pageTitleText}>Tableau de bord</h2>
                <p style={styles.pageTitleSub}>Vue d'ensemble de votre activité</p>
              </div>

              {/* Alerte certifications qualité en attente */}
              {pendingCount > 0 && (
                <div style={styles.certAlert} onClick={() => setActiveNav('certifications')}>
                  <Shield size={20} color="#f5b041" />
                  <span style={styles.certAlertText}>
                    <strong>{pendingCount} demande(s) de certification</strong> en attente de votre validation
                  </span>
                  <span style={styles.certAlertBtn}>Voir →</span>
                </div>
              )}

              {/* Alerte vérifications d'identité vendeur en attente */}
              {pendingVerificationCount > 0 && (
                <div
                  style={{ ...styles.certAlert, backgroundColor: '#e9f5ee', borderColor: '#b7e4c7' }}
                  onClick={() => onNavigateToVendorVerification && onNavigateToVendorVerification()}
                >
                  <ShieldCheck size={20} color="#2d6a4f" />
                  <span style={{ ...styles.certAlertText, color: '#1b4d3e' }}>
                    <strong>{pendingVerificationCount} nouveau(x) vendeur(s)</strong> en attente de vérification d'identité
                  </span>
                  <span style={{ ...styles.certAlertBtn, color: '#2d6a4f' }}>Voir →</span>
                </div>
              )}

              <div style={styles.kpiGrid}>
                {kpis.map((kpi) => (
                  <div key={kpi.id} style={styles.kpiCard}>
                    <div style={styles.kpiTop}>
                      <div style={{ ...styles.kpiIcon, backgroundColor: kpi.bg }}><span>{kpi.icon}</span></div>
                      <span style={{ ...styles.kpiChange, color: kpi.up ? '#2d6a4f' : '#dc3545', backgroundColor: kpi.up ? '#d8f3dc' : '#fde8ea' }}>{kpi.change}</span>
                    </div>
                    <p style={styles.kpiLabel}>{kpi.label}</p>
                    <p style={styles.kpiValue}>{kpi.value}{kpi.unit && <span style={styles.kpiUnit}> {kpi.unit}</span>}</p>
                    <div style={{ ...styles.kpiBar, backgroundColor: kpi.bg }}>
                      <div style={{ ...styles.kpiBarFill, width: kpi.id === 'stock' ? '25%' : kpi.id === 'revenue' ? '85%' : kpi.id === 'orders' ? '62%' : '45%', backgroundColor: kpi.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.midGrid}>
                <div style={styles.chartCard}>
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.cardTitle}>Ventes récentes</h3>
                      <p style={styles.cardSub}>Évolution mensuelle 2026</p>
                    </div>
                  </div>
                  <div style={styles.chartArea}>
                    {chartPoints.map((val, i) => {
                      const h = (val / maxVal) * 100;
                      const isHov = hoveredBar === i;
                      return (
                        <div key={i} style={styles.barGroup} onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                          {isHov && <div style={styles.tooltip}>{(val * 8500).toLocaleString('fr-FR')} F</div>}
                          <div style={{ ...styles.bar, height: `${h}%`, background: isHov ? 'linear-gradient(180deg, #1b4d3e 0%, #2d6a4f 100%)' : 'linear-gradient(180deg, #40916c 0%, #2d6a4f 100%)', opacity: isHov ? 1 : 0.75 }} />
                          <span style={styles.barLabel}>{months[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={styles.ordersCard}>
                  <div style={styles.cardHeader}>
                    <div><h3 style={styles.cardTitle}>Commandes récentes</h3><p style={styles.cardSub}>3 dernières</p></div>
                    <button style={styles.viewAllBtn} onClick={() => onNavigate && onNavigate('order-management-admin')}>Tout voir →</button>
                  </div>
                  <div style={styles.ordersList}>
                    {recentOrders.map((o) => (
                      <div key={o.id} style={styles.orderItem}>
                        <div style={styles.orderLeft}>
                          <div style={styles.orderAvatar}>{o.client.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                          <div><p style={styles.orderClient}>{o.client}</p><p style={styles.orderId}>{o.id}</p></div>
                        </div>
                        <div style={styles.orderRight}>
                          <p style={styles.orderAmount}>{o.amount.toLocaleString('fr-FR')} FCFA</p>
                          <span style={{ ...styles.orderStatus, color: o.statusColor, backgroundColor: o.statusBg }}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.salesTableCard}>
                <div style={styles.cardHeader}>
                  <div><h3 style={styles.cardTitle}>Historique des ventes</h3><p style={styles.cardSub}>4 ventes récentes</p></div>
                  <button style={styles.viewAllBtn} onClick={() => onNavigate && onNavigate('sales-history')}>Tout voir →</button>
                </div>
                <table style={styles.table}>
                  <thead>
                    <tr>{['Date', 'Produit', 'Quantité', 'Montant', 'Client', 'Statut'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {recentSales.map((row, i) => (
                      <tr key={i} style={styles.tr}>
                        <td style={styles.td}>{row.date}</td>
                        <td style={styles.td}><strong style={{ color: '#212529' }}>{row.product}</strong></td>
                        <td style={styles.td}>{row.qty}</td>
                        <td style={styles.td}><strong style={{ color: '#e07a5f' }}>{row.amount.toLocaleString('fr-FR')} FCFA</strong></td>
                        <td style={styles.td}>{row.client}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.statusBadge, color: row.status === 'Livrée' ? '#2d6a4f' : '#0066cc', backgroundColor: row.status === 'Livrée' ? '#d8f3dc' : '#e0f0ff' }}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ===== VUE CERTIFICATIONS ===== */}
          {activeNav === 'certifications' && (
            <>
              <div style={styles.pageTitle}>
                <h2 style={styles.pageTitleText}>Gestion des certifications</h2>
                <p style={styles.pageTitleSub}>Examinez et validez les demandes des producteurs</p>
              </div>

              {/* Stats certifications */}
              <div style={styles.certStatsRow}>
                <div style={styles.certStat}>
                  <Clock size={20} color="#f5b041" />
                  <div>
                    <p style={styles.certStatNum}>{pendingCount}</p>
                    <p style={styles.certStatLabel}>En attente</p>
                  </div>
                </div>
                <div style={styles.certStat}>
                  <CheckCircle size={20} color="#2d6a4f" />
                  <div>
                    <p style={styles.certStatNum}>{approvedCount}</p>
                    <p style={styles.certStatLabel}>Approuvées</p>
                  </div>
                </div>
                <div style={styles.certStat}>
                  <XCircle size={20} color="#e07a5f" />
                  <div>
                    <p style={styles.certStatNum}>{rejectedCount}</p>
                    <p style={styles.certStatLabel}>Rejetées</p>
                  </div>
                </div>
                <div style={styles.certStat}>
                  <Shield size={20} color="#1b4d3e" />
                  <div>
                    <p style={styles.certStatNum}>{certifications.length}</p>
                    <p style={styles.certStatLabel}>Total</p>
                  </div>
                </div>
              </div>

              {/* Filtres */}
              <div style={styles.filterRow}>
                {['all', 'pending', 'approved', 'rejected'].map(f => (
                  <button
                    key={f}
                    style={{ ...styles.filterBtn, ...(filterStatus === f ? styles.filterBtnActive : {}) }}
                    onClick={() => setFilterStatus(f)}
                  >
                    {f === 'all' ? 'Toutes' : f === 'pending' ? '⏳ En attente' : f === 'approved' ? '✅ Approuvées' : '❌ Rejetées'}
                    {f === 'pending' && pendingCount > 0 && <span style={styles.filterBadge}>{pendingCount}</span>}
                  </button>
                ))}
              </div>

              {/* Liste certifications */}
              <div style={styles.certList}>
                {filteredCerts.length === 0 && (
                  <div style={styles.emptyState}>
                    <Shield size={40} color="#adb5bd" />
                    <p>Aucune demande dans cette catégorie</p>
                  </div>
                )}
                {filteredCerts.map(cert => {
                  const st = getStatusStyle(cert.status);
                  return (
                    <div key={cert.id} style={styles.certCard}>
                      <div style={styles.certLeft}>
                        <div style={styles.certAvatar}>{cert.farm[0]}</div>
                        <div style={styles.certInfo}>
                          <h4 style={styles.certFarm}>{cert.farm}</h4>
                          <p style={styles.certVendeur}>👤 {cert.vendeur} · {cert.email}</p>
                          <p style={styles.certMeta}>📍 {cert.location} · 🗓 {cert.years} ans · 📅 {cert.date}</p>
                          <div style={styles.certDocs}>
                            <span style={styles.certDocBadge}>📄 {cert.docs} documents</span>
                            <span style={styles.certDocBadge}>📸 {cert.photos} photos</span>
                          </div>
                        </div>
                      </div>
                      <div style={styles.certRight}>
                        <span style={{ ...styles.certStatus, color: st.color, backgroundColor: st.bg }}>{st.label}</span>
                        <div style={styles.certActions}>
                          <button style={styles.certViewBtn} onClick={() => setSelectedCert(cert)}>
                            <Eye size={14} /> Voir détails
                          </button>
                          {cert.status === 'pending' && (
                            <>
                              <button style={styles.certRejectBtn} onClick={() => openRejectModal(cert)}>
                                <XCircle size={14} /> Rejeter
                              </button>
                              <button style={styles.certApproveBtn} onClick={() => handleApprove(cert.id)}>
                                <CheckCircle size={14} /> Approuver
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ===== VUE UTILISATEURS (Gérer utilisateur) ===== */}
          {activeNav === 'users' && (
            <>
              <div style={styles.pageTitle}>
                <h2 style={styles.pageTitleText}>Gestion des utilisateurs</h2>
                <p style={styles.pageTitleSub}>Comptes clients et vendeurs inscrits sur la plateforme</p>
              </div>

              {registeredUsers.length === 0 ? (
                <div style={styles.emptyState}>
                  <ShieldCheck size={40} color="#adb5bd" />
                  <p>Aucun utilisateur inscrit pour le moment</p>
                </div>
              ) : (
                <div style={styles.certList}>
                  {registeredUsers.map((u) => (
                    <div key={u.id} style={styles.certCard}>
                      <div style={styles.certLeft}>
                        <div style={styles.certAvatar}>{u.prenom?.[0]?.toUpperCase()}{u.nom?.[0]?.toUpperCase()}</div>
                        <div style={styles.certInfo}>
                          <h4 style={styles.certFarm}>{u.prenom} {u.nom}</h4>
                          <p style={styles.certVendeur}>✉️ {u.email} · 📞 {u.telephone}</p>
                          <p style={styles.certMeta}>
                            {u.role === 'vendeur' ? '🌾 Vendeur' : '🛒 Client'}
                            {u.role === 'vendeur' && u.verificationStatus && (
                              <> · Vérification : {u.verificationStatus === 'approved' ? '✅ approuvée' : u.verificationStatus === 'rejected' ? '❌ rejetée' : '⏳ en attente'}</>
                            )}
                          </p>
                        </div>
                      </div>
                      <div style={styles.certRight}>
                        <span style={{
                          ...styles.certStatus,
                          color: u.blocked ? '#c0392b' : '#2d6a4f',
                          backgroundColor: u.blocked ? '#fdecea' : '#e9f5ee',
                        }}>
                          {u.blocked ? '🚫 Bloqué' : '✅ Actif'}
                        </span>
                        <div style={styles.certActions}>
                          <button
                            style={u.blocked ? styles.certApproveBtn : styles.certRejectBtn}
                            onClick={() => onToggleUserBlocked && onToggleUserBlocked(u.id)}
                          >
                            {u.blocked ? 'Débloquer' : 'Bloquer'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f4f6f8', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
  toast: { position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#1b4d3e', color: '#ffffff', padding: '13px 18px', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 9999, fontSize: '13px', fontWeight: '700' },

  // Sidebar
  sidebar: { backgroundColor: '#1b4d3e', display: 'flex', flexDirection: 'column', padding: '20px 0', transition: 'width 0.25s ease', flexShrink: 0, overflow: 'hidden', boxShadow: '4px 0 20px rgba(0,0,0,0.1)', zIndex: 100 },
  sidebarBrand: { display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' },
  sidebarLogo: { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sidebarLogoText: { fontSize: '13px', fontWeight: '800', color: '#ffffff' },
  sidebarBrandName: { fontSize: '16px', fontWeight: '800', color: '#ffffff', whiteSpace: 'nowrap' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 10px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: 'transparent', width: '100%' },
  navItemActive: { backgroundColor: 'rgba(255,255,255,0.15)' },
  navIcon: { flexShrink: 0 },
  navLabel: { fontSize: '13.5px', fontWeight: '600', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' },
  navBadge: { fontSize: '10px', fontWeight: '800', color: '#ffffff', backgroundColor: '#e07a5f', padding: '2px 6px', borderRadius: '10px' },
  collapseBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' },
  collapseBtnText: { fontSize: '12px', fontWeight: '600', color: '#a3c2b8', whiteSpace: 'nowrap' },

  // Main
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 },
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', backgroundColor: '#ffffff', borderBottom: '1px solid #e9ecef', flexShrink: 0 },
  greetingText: { fontSize: '14px', fontWeight: '700', color: '#212529', marginBottom: '2px' },
  dateText: { fontSize: '12px', color: '#adb5bd', fontWeight: '500' },
  topbarRight: { display: 'flex', alignItems: 'center', gap: '8px' },
  topbarIconBtn: { position: 'relative', width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#495057' },
  notifPip: { position: 'absolute', top: '5px', right: '5px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#e07a5f', fontSize: '9px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatarSmall: { width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#1b4d3e', color: '#ffffff', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  content: { flex: 1, overflow: 'auto', padding: '24px 28px' },
  pageTitle: { marginBottom: '20px' },
  pageTitleText: { fontSize: '22px', fontWeight: '800', color: '#212529', letterSpacing: '-0.02em', marginBottom: '2px' },
  pageTitleSub: { fontSize: '12px', color: '#adb5bd', fontWeight: '500' },

  // Alerte certifications
  certAlert: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', backgroundColor: '#fffbea', border: '1px solid #f5e4a0', borderRadius: '14px', marginBottom: '12px', cursor: 'pointer' },
  certAlertText: { flex: 1, fontSize: '14px', color: '#856404' },
  certAlertBtn: { fontSize: '13px', fontWeight: '800', color: '#f5b041' },

  // KPI
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px', marginTop: '8px' },
  kpiCard: { backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e9ecef', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  kpiTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  kpiIcon: { width: '36px', height: '36px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
  kpiChange: { fontSize: '10px', fontWeight: '700', padding: '3px 7px', borderRadius: '20px' },
  kpiLabel: { fontSize: '11px', color: '#868e96', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' },
  kpiValue: { fontSize: '20px', fontWeight: '800', color: '#212529', marginBottom: '12px' },
  kpiUnit: { fontSize: '11px', fontWeight: '600', color: '#adb5bd' },
  kpiBar: { height: '4px', borderRadius: '4px', overflow: 'hidden' },
  kpiBarFill: { height: '100%', borderRadius: '4px' },

  // Charts
  midGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '16px' },
  chartCard: { backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e9ecef', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  cardTitle: { fontSize: '14px', fontWeight: '800', color: '#212529', marginBottom: '2px' },
  cardSub: { fontSize: '11px', color: '#adb5bd', fontWeight: '500' },
  chartArea: { display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px', borderBottom: '2px solid #f1f3f5' },
  barGroup: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '5px', position: 'relative', cursor: 'pointer' },
  tooltip: { position: 'absolute', top: '-32px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#212529', color: '#fff', fontSize: '9px', fontWeight: '700', padding: '3px 7px', borderRadius: '5px', whiteSpace: 'nowrap', zIndex: 10 },
  bar: { width: '100%', borderRadius: '5px 5px 0 0', transition: 'all 0.2s' },
  barLabel: { fontSize: '8px', color: '#adb5bd', fontWeight: '600' },
  ordersCard: { backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e9ecef', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  viewAllBtn: { fontSize: '12px', fontWeight: '700', color: '#1b4d3e', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 },
  ordersList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  orderItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f8f9fa' },
  orderLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  orderAvatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e9f5ee', color: '#1b4d3e', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  orderClient: { fontSize: '13px', fontWeight: '700', color: '#212529', marginBottom: '1px' },
  orderId: { fontSize: '11px', color: '#adb5bd', fontFamily: 'monospace' },
  orderRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' },
  orderAmount: { fontSize: '13px', fontWeight: '800', color: '#e07a5f' },
  orderStatus: { fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' },
  salesTableCard: { backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e9ecef', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { textAlign: 'left', padding: '8px 12px', fontSize: '10px', fontWeight: '700', color: '#868e96', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1.5px solid #f1f3f5', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f8f9fa' },
  td: { padding: '12px 12px', color: '#495057', fontWeight: '500', verticalAlign: 'middle', whiteSpace: 'nowrap' },
  statusBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },

  // Certifications
  certStatsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' },
  certStat: { backgroundColor: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e9ecef', display: 'flex', alignItems: 'center', gap: '14px' },
  certStatNum: { fontSize: '24px', fontWeight: '900', color: '#212529', margin: 0 },
  certStatLabel: { fontSize: '12px', color: '#6c757d', fontWeight: '600', margin: 0 },
  filterRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
  filterBtn: { padding: '8px 16px', borderRadius: '20px', border: '1.5px solid #dee2e6', backgroundColor: '#ffffff', color: '#6c757d', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  filterBtnActive: { backgroundColor: '#1b4d3e', borderColor: '#1b4d3e', color: '#ffffff' },
  filterBadge: { backgroundColor: '#e07a5f', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '1px 6px', borderRadius: '10px' },
  certList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  certCard: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  certLeft: { display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 },
  certAvatar: { width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#e9f5ee', color: '#1b4d3e', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  certInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  certFarm: { fontSize: '15px', fontWeight: '800', color: '#212529', margin: 0 },
  certVendeur: { fontSize: '13px', color: '#6c757d', margin: 0 },
  certMeta: { fontSize: '12px', color: '#adb5bd', margin: 0 },
  certDocs: { display: 'flex', gap: '8px', marginTop: '4px' },
  certDocBadge: { fontSize: '11px', fontWeight: '700', color: '#2d6a4f', backgroundColor: '#e9f5ee', padding: '2px 10px', borderRadius: '20px' },
  certRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 },
  certStatus: { fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' },
  certActions: { display: 'flex', gap: '8px' },
  certViewBtn: { display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 14px', backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  certRejectBtn: { display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 14px', backgroundColor: '#fff5f2', color: '#e07a5f', border: '1px solid #f5d4c8', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  certApproveBtn: { display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 14px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#adb5bd', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', fontSize: '14px' },

  // Modal détail
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: '24px' },
  detailModal: { backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '560px', boxShadow: '0 32px 64px rgba(0,0,0,0.15)' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  detailHeaderLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  detailAvatar: { width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#e9f5ee', color: '#1b4d3e', fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  detailTitle: { fontSize: '18px', fontWeight: '800', color: '#212529', margin: 0 },
  detailSub: { fontSize: '13px', color: '#6c757d', margin: '4px 0 0 0' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6c757d', padding: '4px' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '10px' },
  detailLabel: { fontSize: '11px', color: '#adb5bd', fontWeight: '700', textTransform: 'uppercase' },
  detailValue: { fontSize: '13px', color: '#212529', fontWeight: '700' },
  detailActions: { display: 'flex', gap: '12px' },
  approveBtn: { flex: 2, padding: '12px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '800', cursor: 'pointer' },
  rejectBtnOutline: { flex: 1, padding: '12px', backgroundColor: '#fff5f2', color: '#e07a5f', border: '1px solid #f5d4c8', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  rejectReasonBox: { backgroundColor: '#fff5f2', borderRadius: '12px', padding: '14px', marginBottom: '20px', border: '1px solid #f5d4c8' },
  rejectReasonLabel: { fontSize: '12px', fontWeight: '700', color: '#e07a5f', margin: '0 0 4px 0' },
  rejectReasonText: { fontSize: '13px', color: '#495057', margin: 0 },

  // Modal rejet
  rejectModal: { backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '440px' },
  rejectTitle: { fontSize: '18px', fontWeight: '800', color: '#212529', margin: '0 0 8px 0' },
  rejectSubtitle: { fontSize: '14px', color: '#6c757d', margin: '0 0 20px 0' },
  field: { marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#343a40', display: 'block', marginBottom: '6px' },
  textarea: { width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #dee2e6', fontSize: '14px', backgroundColor: '#f8f9fa', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
  rejectActions: { display: 'flex', gap: '10px' },
  cancelBtn: { flex: 1, padding: '12px', backgroundColor: '#f1f3f5', color: '#495057', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  rejectBtn: { flex: 1, padding: '12px', backgroundColor: '#e07a5f', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
};