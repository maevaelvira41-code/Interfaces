import React, { useState } from 'react';

const REPORTS = [
  {
    id: 'RPT-001',
    type: 'Contenu',
    typeIcon: '📄',
    reporter: 'User_123',
    reporterAvatar: 'U1',
    subject: 'Produit frauduleux — Banane Premium falsifiée',
    detail: 'L\'utilisateur affirme que les photos du produit sont volées et que le vendeur n\'est pas réellement producteur de bananes. Prix anormalement bas (1 FCFA/kg).',
    priority: 'Haute',
    status: 'Nouveau',
    date: '22/06/2026',
    time: '09:14',
  },
  {
    id: 'RPT-002',
    type: 'Utilisateur',
    typeIcon: '👤',
    reporter: 'User_456',
    reporterAvatar: 'U4',
    subject: 'Vendeur malhonnête — Non-livraison répétée',
    detail: 'Ce vendeur a encaissé le paiement de 3 commandes sans jamais effectuer de livraison. Aucune réponse aux messages. 4 autres utilisateurs ont signalé le même problème.',
    priority: 'Moyenne',
    status: 'En cours',
    date: '21/06/2026',
    time: '16:45',
  },
  {
    id: 'RPT-003',
    type: 'Comportement',
    typeIcon: '🚨',
    reporter: 'User_789',
    reporterAvatar: 'U7',
    subject: 'Commentaire offensant et discriminatoire',
    detail: 'Un commentaire contient des propos discriminatoires à caractère ethnique dans la section d\'avis du produit "Maïs du Nord". Le commentaire est toujours visible.',
    priority: 'Basse',
    status: 'Résolu',
    date: '20/06/2026',
    time: '11:30',
  },
  {
    id: 'RPT-004',
    type: 'Contenu',
    typeIcon: '📄',
    reporter: 'User_321',
    reporterAvatar: 'U3',
    subject: 'Annonce de produit interdit — pesticides non homologués',
    detail: 'Le produit "Insecticide Maison" contient des substances interdites au Cameroun selon la réglementation phytosanitaire. Le vendeur ne mentionne aucune certification.',
    priority: 'Haute',
    status: 'Nouveau',
    date: '22/06/2026',
    time: '07:52',
  },
  {
    id: 'RPT-005',
    type: 'Utilisateur',
    typeIcon: '👤',
    reporter: 'User_654',
    reporterAvatar: 'U6',
    subject: 'Spam de messages — Harcèlement commercial',
    detail: 'Cet utilisateur envoie des dizaines de messages promotionnels non sollicités à d\'autres membres via la messagerie interne AgroMarket.',
    priority: 'Moyenne',
    status: 'En cours',
    date: '21/06/2026',
    time: '13:20',
  },
];

const STATUS_CONFIG = {
  'Nouveau': { color: '#dc3545', bg: '#fde8ea', dot: '#dc3545' },
  'En cours': { color: '#e07a5f', bg: '#fdf1ed', dot: '#e07a5f' },
  'Résolu': { color: '#2d6a4f', bg: '#d8f3dc', dot: '#2d6a4f' },
};

const PRIORITY_CONFIG = {
  'Haute': { color: '#dc3545', bg: '#fde8ea' },
  'Moyenne': { color: '#e07a5f', bg: '#fdf1ed' },
  'Basse': { color: '#40916c', bg: '#d8f3dc' },
};

const TYPE_CONFIG = {
  'Contenu': { color: '#0066cc', bg: '#e0f0ff' },
  'Utilisateur': { color: '#6f42c1', bg: '#f0e8ff' },
  'Comportement': { color: '#dc3545', bg: '#fde8ea' },
};

const FILTERS = ['Tous', 'Nouveau', 'En cours', 'Résolu'];

export default function ModerationPanel({ onBack }) {
  const [reports, setReports] = useState(REPORTS);
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const updateStatus = (id, newStatus) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    showToast(`✅ Signalement ${id} → statut mis à jour : ${newStatus}`);
  };

  const handleDelete = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
    showToast(`🗑️ Signalement ${id} supprimé.`);
  };

  const filtered = reports.filter(r => {
    const matchFilter = activeFilter === 'Tous' || r.status === activeFilter;
    const matchSearch = r.subject.toLowerCase().includes(searchQuery.toLowerCase())
      || r.reporter.toLowerCase().includes(searchQuery.toLowerCase())
      || r.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getCounts = (status) => reports.filter(r => status === 'Tous' ? true : r.status === status).length;

  return (
    <div style={styles.container} className="fade-in">
      {toast && <div style={styles.toast} className="fade-in">{toast}</div>}

      {/* ── Header ── */}
      <div style={styles.pageHeader}>
        <div>
          <div style={styles.titleRow}>
            <h2 style={styles.pageTitle}>Signalements & Modération</h2>
            {reports.filter(r => r.status === 'Nouveau').length > 0 && (
              <span style={styles.urgentPip}>
                {reports.filter(r => r.status === 'Nouveau').length} nouveau(x)
              </span>
            )}
          </div>
          <p style={styles.pageSubtitle}>
            Gérez les signalements des utilisateurs · Modération de contenu AgroMarket
          </p>
        </div>
        <div style={styles.headerActions}>
          <div style={styles.searchWrapper}>
            <svg style={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher un signalement..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button
            style={styles.exportBtn}
            onClick={() => showToast('📊 Export rapport de modération en cours...')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={styles.statsGrid}>
        {[
          { label: 'Total signalements', value: reports.length, icon: '📋', color: '#1b4d3e', bg: '#e9f5ee' },
          { label: 'Nouveaux', value: getCounts('Nouveau'), icon: '🔴', color: '#dc3545', bg: '#fde8ea' },
          { label: 'En cours', value: getCounts('En cours'), icon: '🟡', color: '#e07a5f', bg: '#fdf1ed' },
          { label: 'Résolus', value: getCounts('Résolu'), icon: '✅', color: '#2d6a4f', bg: '#d8f3dc' },
        ].map(stat => (
          <div key={stat.label} style={styles.statCard}>
            <div style={{ ...styles.statIconWrap, backgroundColor: stat.bg }}>
              <span style={styles.statIcon}>{stat.icon}</span>
            </div>
            <div>
              <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs ── */}
      <div style={styles.filterRow}>
        {FILTERS.map(f => (
          <button
            key={f}
            style={{
              ...styles.filterTab,
              ...(activeFilter === f ? styles.filterTabActive : {}),
            }}
            onClick={() => setActiveFilter(f)}
          >
            {f}
            <span style={{
              ...styles.filterBadge,
              backgroundColor: activeFilter === f ? '#1b4d3e' : '#e9ecef',
              color: activeFilter === f ? '#ffffff' : '#6c757d',
            }}>
              {getCounts(f)}
            </span>
          </button>
        ))}
      </div>

      {/* ── Reports List ── */}
      {filtered.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>🎉</span>
          <h4 style={styles.emptyTitle}>Aucun signalement dans cette catégorie</h4>
          <p style={styles.emptyDesc}>Tous les signalements ont été traités avec succès.</p>
        </div>
      ) : (
        <div style={styles.reportsList}>
          {filtered.map((report) => {
            const isExpanded = expandedId === report.id;
            const statusCfg = STATUS_CONFIG[report.status];
            const priorityCfg = PRIORITY_CONFIG[report.priority];
            const typeCfg = TYPE_CONFIG[report.type];

            return (
              <div key={report.id} style={{
                ...styles.reportCard,
                ...(isExpanded ? styles.reportCardExpanded : {}),
                borderLeftColor: statusCfg.color,
              }}>
                {/* ── Report Header Row ── */}
                <div style={styles.reportHeader}>
                  {/* Left: Reporter info */}
                  <div style={styles.reportLeft}>
                    <div style={styles.reporterAvatar}>
                      {report.reporterAvatar}
                    </div>
                    <div style={styles.reporterInfo}>
                      <div style={styles.reportTopRow}>
                        <span style={styles.reportId}>{report.id}</span>
                        <span style={{
                          ...styles.typeBadge,
                          color: typeCfg.color,
                          backgroundColor: typeCfg.bg,
                        }}>
                          {report.typeIcon} {report.type}
                        </span>
                        {report.priority === 'Haute' && (
                          <span style={styles.urgentTag}>🔴 URGENT</span>
                        )}
                      </div>
                      <h4 style={styles.reportSubject}>{report.subject}</h4>
                      <p style={styles.reportMeta}>
                        Signalé par <strong>{report.reporter}</strong> · {report.date} à {report.time}
                      </p>
                    </div>
                  </div>

                  {/* Right: Badges + Actions */}
                  <div style={styles.reportRight}>
                    <div style={styles.badgesRow}>
                      <span style={{
                        ...styles.statusBadge,
                        color: statusCfg.color,
                        backgroundColor: statusCfg.bg,
                      }}>
                        <span style={{ ...styles.statusDot, backgroundColor: statusCfg.dot }} />
                        {report.status}
                      </span>
                      <span style={{
                        ...styles.priorityBadge,
                        color: priorityCfg.color,
                        backgroundColor: priorityCfg.bg,
                      }}>
                        {report.priority}
                      </span>
                    </div>

                    <div style={styles.actionsRow}>
                      <button
                        style={styles.expandBtn}
                        onClick={() => setExpandedId(isExpanded ? null : report.id)}
                      >
                        {isExpanded ? 'Réduire ↑' : 'Voir détail →'}
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(report.id)}
                        title="Supprimer"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Expanded Detail Panel ── */}
                {isExpanded && (
                  <div style={styles.expandedPanel} className="fade-in">
                    <div style={styles.detailBlock}>
                      <h5 style={styles.detailTitle}>Description du signalement</h5>
                      <p style={styles.detailText}>{report.detail}</p>
                    </div>

                    <div style={styles.actionButtons}>
                      <div style={styles.statusActions}>
                        <span style={styles.statusActionsLabel}>Changer le statut :</span>
                        {['Nouveau', 'En cours', 'Résolu'].filter(s => s !== report.status).map(s => (
                          <button
                            key={s}
                            style={{
                              ...styles.statusChangeBtn,
                              borderColor: STATUS_CONFIG[s].color,
                              color: STATUS_CONFIG[s].color,
                            }}
                            onClick={() => updateStatus(report.id, s)}
                          >
                            → {s}
                          </button>
                        ))}
                      </div>
                      <div style={styles.moderationBtns}>
                        <button
                          style={styles.warnBtn}
                          onClick={() => showToast(`⚠️ Avertissement envoyé à ${report.reporter}`)}
                        >
                          ⚠️ Avertir l'utilisateur
                        </button>
                        <button
                          style={styles.suspendBtn}
                          onClick={() => showToast(`🚫 Compte ${report.reporter} suspendu temporairement.`)}
                        >
                          🚫 Suspendre le compte
                        </button>
                        <button
                          style={styles.resolveBtn}
                          onClick={() => updateStatus(report.id, 'Résolu')}
                        >
                          ✅ Marquer résolu
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Footer summary ── */}
      {filtered.length > 0 && (
        <div style={styles.footerSummary}>
          <span style={styles.footerText}>
            {filtered.length} signalement{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          </span>
          <span style={styles.footerHint}>
            Cliquer sur "Voir détail" pour accéder aux actions de modération
          </span>
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
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    padding: '14px 20px',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    zIndex: 9999,
    fontSize: '13px',
    fontWeight: '700',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    borderBottom: '1.5px solid #dee2e6',
    paddingBottom: '18px',
    flexWrap: 'wrap',
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
  },
  urgentPip: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#ffffff',
    backgroundColor: '#dc3545',
    padding: '3px 10px',
    borderRadius: '20px',
    animation: 'pulse 2s infinite',
  },
  pageSubtitle: {
    fontSize: '13px',
    color: '#6c757d',
    fontWeight: '500',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    pointerEvents: 'none',
  },
  searchInput: {
    padding: '10px 12px 10px 30px',
    borderRadius: '10px',
    border: '1.5px solid #dee2e6',
    fontSize: '13px',
    color: '#343a40',
    backgroundColor: '#f8f9fa',
    outline: 'none',
    width: '220px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1.5px solid #dee2e6',
    backgroundColor: '#ffffff',
    color: '#343a40',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px',
    marginBottom: '20px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e9ecef',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  statIconWrap: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },
  statIcon: {},
  statValue: {
    fontSize: '22px',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    marginBottom: '2px',
  },
  statLabel: {
    fontSize: '11px',
    color: '#868e96',
    fontWeight: '600',
  },
  // Filter tabs
  filterRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '20px',
    borderBottom: '1.5px solid #e9ecef',
    paddingBottom: '0',
    flexWrap: 'wrap',
  },
  filterTab: {
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
  filterTabActive: {
    color: '#1b4d3e',
    fontWeight: '800',
    borderBottomColor: '#1b4d3e',
  },
  filterBadge: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 7px',
    borderRadius: '20px',
    transition: 'all 0.2s',
  },
  // Reports list
  reportsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1.5px solid #e9ecef',
    borderLeft: '4px solid',
    padding: '20px 22px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    transition: 'all 0.2s',
  },
  reportCardExpanded: {
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    flexWrap: 'wrap',
  },
  reportLeft: {
    display: 'flex',
    gap: '14px',
    flex: 1,
    minWidth: 0,
  },
  reporterAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#f1f3f5',
    color: '#495057',
    fontSize: '12px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    border: '1.5px solid #e9ecef',
  },
  reporterInfo: {
    flex: 1,
    minWidth: 0,
  },
  reportTopRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
    flexWrap: 'wrap',
  },
  reportId: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#adb5bd',
    fontFamily: 'monospace',
  },
  typeBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 9px',
    borderRadius: '20px',
  },
  urgentTag: {
    fontSize: '10px',
    fontWeight: '800',
    color: '#dc3545',
    backgroundColor: '#fde8ea',
    padding: '3px 8px',
    borderRadius: '4px',
    letterSpacing: '0.03em',
  },
  reportSubject: {
    fontSize: '14.5px',
    fontWeight: '800',
    color: '#212529',
    marginBottom: '6px',
    lineHeight: '1.3',
  },
  reportMeta: {
    fontSize: '12px',
    color: '#868e96',
    fontWeight: '500',
  },
  reportRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
    flexShrink: 0,
  },
  badgesRow: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  priorityBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  actionsRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  expandBtn: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1b4d3e',
    backgroundColor: '#e9f5ee',
    border: 'none',
    padding: '7px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  deleteBtn: {
    width: '32px',
    height: '32px',
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
  // Expanded Panel
  expandedPanel: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1.5px solid #f1f3f5',
  },
  detailBlock: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '18px',
    border: '1px solid #e9ecef',
  },
  detailTitle: {
    fontSize: '12px',
    fontWeight: '800',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
  },
  detailText: {
    fontSize: '13.5px',
    color: '#343a40',
    lineHeight: '1.6',
    fontWeight: '400',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  statusActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  statusActionsLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#6c757d',
  },
  statusChangeBtn: {
    padding: '7px 14px',
    borderRadius: '8px',
    border: '1.5px solid',
    backgroundColor: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  moderationBtns: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  warnBtn: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#fff9e6',
    color: '#e07a5f',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  suspendBtn: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#fde8ea',
    color: '#dc3545',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  resolveBtn: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 10px rgba(27,77,62,0.15)',
  },
  // Empty State
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '16px',
    border: '1.5px dashed #dee2e6',
    gap: '12px',
  },
  emptyIcon: { fontSize: '40px', marginBottom: '8px' },
  emptyTitle: { fontSize: '16px', fontWeight: '800', color: '#343a40' },
  emptyDesc: { fontSize: '13px', color: '#6c757d', textAlign: 'center' },
  // Footer
  footerSummary: {
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
  footerText: { fontSize: '12px', fontWeight: '700', color: '#495057' },
  footerHint: { fontSize: '11px', color: '#adb5bd', fontWeight: '500' },
};
