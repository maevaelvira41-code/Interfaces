import React, { useState } from 'react';

const ALL_NOTIFS = [
  {
    id: 1,
    type: 'commande',
    icon: '📦',
    title: 'Nouvelle commande reçue',
    message: 'Bakari Sow a passé une commande de 45,000 FCFA pour Mangue Premium.',
    time: 'Il y a 3 min',
    read: false,
    urgent: true,
  },
  {
    id: 2,
    type: 'commande',
    icon: '🚚',
    title: 'Commande #2026-086 expédiée',
    message: 'La commande d\'Aminata Fall est en cours de livraison par DHL. Numéro de suivi : AGM-86-Z.',
    time: 'Il y a 18 min',
    read: false,
    urgent: false,
  },
  {
    id: 3,
    type: 'promo',
    icon: '🎁',
    title: 'Offre spéciale — Juillet 2026',
    message: 'Boostez vos ventes : obtenez 50% de réduction sur votre abonnement Pro pendant 3 mois. Offre limitée !',
    time: 'Il y a 2 h',
    read: false,
    urgent: false,
  },
  {
    id: 4,
    type: 'commande',
    icon: '✅',
    title: 'Commande #2026-084 livrée',
    message: 'Fatou Diallo a confirmé la réception de sa commande. Note : 5/5 ⭐',
    time: 'Il y a 4 h',
    read: true,
    urgent: false,
  },
  {
    id: 5,
    type: 'systeme',
    icon: '🔐',
    title: 'Connexion depuis un nouvel appareil',
    message: 'Une connexion a été détectée depuis un iPhone 15 Pro à Douala. Si ce n\'est pas vous, sécurisez immédiatement votre compte.',
    time: 'Il y a 6 h',
    read: true,
    urgent: true,
  },
  {
    id: 6,
    type: 'promo',
    icon: '💡',
    title: 'Conseil du marché',
    message: 'La demande en tomates fraîches a augmenté de 32% cette semaine dans votre région. Pensez à réapprovisionner votre stock !',
    time: 'Hier 14:30',
    read: true,
    urgent: false,
  },
  {
    id: 7,
    type: 'systeme',
    icon: '⚙️',
    title: 'Mise à jour système',
    message: 'AgroMarket v3.2.0 est disponible. Nouvelles fonctionnalités : export CSV avancé, filtres pro, et tableau de bord analytique.',
    time: 'Hier 08:00',
    read: true,
    urgent: false,
  },
  {
    id: 8,
    type: 'commande',
    icon: '⏳',
    title: 'Commande en attente depuis 24h',
    message: 'La commande #2026-083 de Kofi Mensah est toujours en attente de validation de votre part.',
    time: 'Il y a 2 j',
    read: true,
    urgent: true,
  },
];

const TABS = ['Toutes', 'Commandes', 'Promotions', 'Système'];

const typeMap = {
  'Toutes': null,
  'Commandes': 'commande',
  'Promotions': 'promo',
  'Système': 'systeme',
};

const typeColor = {
  commande: { bg: '#e0f0ff', color: '#0066cc' },
  promo: { bg: '#fff3e0', color: '#e07a5f' },
  systeme: { bg: '#f1f3f5', color: '#6c757d' },
};

export default function NotificationsCenter({ onBack }) {
  const [activeTab, setActiveTab] = useState('Toutes');
  const [notifications, setNotifications] = useState(ALL_NOTIFS);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n =>
    typeMap[activeTab] === null || n.type === typeMap[activeTab]
  );

  const handleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('🗑️ Notification supprimée.');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('✅ Toutes les notifications ont été marquées comme lues.');
  };

  const handleClearAll = () => {
    const toKeep = notifications.filter(n => n.read);
    setNotifications(toKeep);
    showToast(`🗑️ ${notifications.filter(n => !n.read).length} notifications supprimées.`);
  };

  return (
    <div style={styles.container} className="fade-in">

      {/* Toast */}
      {toast && (
        <div style={styles.toast} className="fade-in">
          {toast}
        </div>
      )}

      {/* ─── Header ─── */}
      <div style={styles.pageHeader}>
        <div style={styles.headerLeft}>
          <div>
            <div style={styles.titleRow}>
              <h2 style={styles.pageTitle}>Centre de notifications</h2>
              {unreadCount > 0 && (
                <span style={styles.unreadBadge}>{unreadCount} non lues</span>
              )}
            </div>
            <p style={styles.pageSubtitle}>
              Restez informé de toute l'activité de votre boutique AgroMarket
            </p>
          </div>
        </div>
        <div style={styles.headerActions}>
          {unreadCount > 0 && (
            <button style={styles.markAllBtn} onClick={handleMarkAllRead}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Tout marquer lu
            </button>
          )}
          <button style={styles.clearBtn} onClick={handleClearAll}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Supprimer les lues
          </button>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div style={styles.tabsRow}>
        {TABS.map((tab) => {
          const count = notifications.filter(n =>
            typeMap[tab] === null ? true : n.type === typeMap[tab]
          ).length;
          const unread = notifications.filter(n =>
            !n.read && (typeMap[tab] === null ? true : n.type === typeMap[tab])
          ).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.activeTab : {}),
              }}
            >
              {tab}
              <span style={{
                ...styles.tabCount,
                ...(activeTab === tab ? styles.activeTabCount : {}),
                ...(unread > 0 && activeTab !== tab ? styles.tabUnread : {}),
              }}>
                {unread > 0 ? unread : count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Notifications List ─── */}
      {filtered.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>🔔</span>
          <h4 style={styles.emptyTitle}>Aucune notification</h4>
          <p style={styles.emptyDesc}>Vous êtes à jour sur toutes vos notifications dans cette catégorie.</p>
        </div>
      ) : (
        <div style={styles.notifList}>
          {filtered.map((notif) => (
            <div
              key={notif.id}
              style={{
                ...styles.notifCard,
                ...(notif.read ? styles.notifCardRead : styles.notifCardUnread),
                ...(notif.urgent && !notif.read ? styles.notifCardUrgent : {}),
              }}
              onClick={() => handleRead(notif.id)}
            >
              {/* Left: Icon */}
              <div style={{
                ...styles.iconWrap,
                backgroundColor: typeColor[notif.type].bg,
              }}>
                <span style={styles.notifIcon}>{notif.icon}</span>
              </div>

              {/* Middle: Content */}
              <div style={styles.notifContent}>
                <div style={styles.notifTop}>
                  <div style={styles.notifTitleRow}>
                    <h4 style={{
                      ...styles.notifTitle,
                      color: notif.read ? '#6c757d' : '#212529',
                    }}>
                      {notif.title}
                    </h4>
                    {notif.urgent && !notif.read && (
                      <span style={styles.urgentBadge}>URGENT</span>
                    )}
                    {!notif.read && (
                      <span style={styles.unreadDot} />
                    )}
                  </div>
                  <p style={{
                    ...styles.notifMessage,
                    color: notif.read ? '#adb5bd' : '#495057',
                  }}>
                    {notif.message}
                  </p>
                </div>
                <div style={styles.notifFooter}>
                  <div style={styles.metaTags}>
                    <span style={{
                      ...styles.typeTag,
                      color: typeColor[notif.type].color,
                      backgroundColor: typeColor[notif.type].bg,
                    }}>
                      {notif.type === 'commande' ? 'Commande' : notif.type === 'promo' ? 'Promotion' : 'Système'}
                    </span>
                    <span style={styles.timeTag}>{notif.time}</span>
                  </div>
                  <div style={styles.notifActions}>
                    {!notif.read && (
                      <button
                        style={styles.readBtn}
                        onClick={(e) => { e.stopPropagation(); handleRead(notif.id); }}
                      >
                        Marquer lu
                      </button>
                    )}
                    <button
                      style={styles.deleteBtn}
                      onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Footer summary ─── */}
      {filtered.length > 0 && (
        <div style={styles.summaryFooter}>
          <span style={styles.summaryText}>
            {filtered.length} notification{filtered.length > 1 ? 's' : ''} · {filtered.filter(n => !n.read).length} non lue{filtered.filter(n => !n.read).length > 1 ? 's' : ''}
          </span>
          <span style={styles.summaryHint}>Cliquer sur une notification pour la marquer comme lue</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
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
  // Header
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    borderBottom: '1.5px solid #dee2e6',
    paddingBottom: '18px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px',
  },
  pageTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#212529',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  unreadBadge: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#ffffff',
    backgroundColor: '#e07a5f',
    padding: '3px 10px',
    borderRadius: '20px',
  },
  pageSubtitle: {
    fontSize: '13px',
    color: '#6c757d',
    fontWeight: '500',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    flexShrink: 0,
  },
  markAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '10px',
    backgroundColor: '#1b4d3e',
    border: 'none',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    border: '1.5px solid #dee2e6',
    color: '#6c757d',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  // Tabs
  tabsRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    borderBottom: '1.5px solid #e9ecef',
    paddingBottom: '0',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: 'none',
    borderBottom: '2px solid transparent',
    backgroundColor: 'transparent',
    color: '#6c757d',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '-1px',
  },
  activeTab: {
    color: '#1b4d3e',
    fontWeight: '800',
    borderBottomColor: '#1b4d3e',
  },
  tabCount: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 7px',
    borderRadius: '20px',
    backgroundColor: '#f1f3f5',
    color: '#6c757d',
  },
  activeTabCount: {
    backgroundColor: '#e9f5ee',
    color: '#1b4d3e',
  },
  tabUnread: {
    backgroundColor: '#fdf1ed',
    color: '#e07a5f',
  },
  // Notifications list
  notifList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  notifCard: {
    display: 'flex',
    gap: '16px',
    padding: '18px 20px',
    borderRadius: '14px',
    border: '1.5px solid',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  notifCardUnread: {
    backgroundColor: '#ffffff',
    borderColor: '#e9ecef',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  },
  notifCardRead: {
    backgroundColor: '#f8f9fa',
    borderColor: '#f1f3f5',
    opacity: 0.85,
  },
  notifCardUrgent: {
    borderColor: '#fcd0d4',
    backgroundColor: '#fff9f9',
    boxShadow: '0 4px 16px rgba(224,60,60,0.06)',
  },
  iconWrap: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  notifIcon: {
    fontSize: '20px',
  },
  notifContent: {
    flex: 1,
    minWidth: 0,
  },
  notifTop: {
    marginBottom: '10px',
  },
  notifTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px',
    flexWrap: 'wrap',
  },
  notifTitle: {
    fontSize: '14px',
    fontWeight: '800',
    letterSpacing: '-0.01em',
    lineHeight: '1.3',
  },
  urgentBadge: {
    fontSize: '9px',
    fontWeight: '800',
    color: '#ffffff',
    backgroundColor: '#dc3545',
    padding: '2px 7px',
    borderRadius: '4px',
    letterSpacing: '0.05em',
    flexShrink: 0,
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#2d6a4f',
    flexShrink: 0,
    animation: 'pulse 2s infinite',
  },
  notifMessage: {
    fontSize: '13px',
    lineHeight: '1.5',
    fontWeight: '500',
  },
  notifFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  metaTags: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  typeTag: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '3px 9px',
    borderRadius: '20px',
    textTransform: 'capitalize',
  },
  timeTag: {
    fontSize: '11px',
    color: '#adb5bd',
    fontWeight: '600',
  },
  notifActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  readBtn: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#1b4d3e',
    backgroundColor: '#e9f5ee',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  deleteBtn: {
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    backgroundColor: '#fff5f5',
    border: '1px solid #fcd0d4',
    color: '#dc3545',
    cursor: 'pointer',
    transition: 'all 0.15s',
    flexShrink: 0,
  },
  // Empty state
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '16px',
    border: '1.5px dashed #dee2e6',
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '8px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#343a40',
  },
  emptyDesc: {
    fontSize: '13px',
    color: '#6c757d',
    textAlign: 'center',
    maxWidth: '320px',
    lineHeight: '1.5',
  },
  // Summary Footer
  summaryFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    padding: '12px 16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    flexWrap: 'wrap',
    gap: '8px',
  },
  summaryText: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#495057',
  },
  summaryHint: {
    fontSize: '11px',
    color: '#adb5bd',
    fontWeight: '500',
  },
};
