import React, { useState } from 'react';

const kpis = [
  {
    id: 'revenue',
    label: 'Revenus du mois',
    value: '1 248 500',
    unit: 'FCFA',
    change: '+18.4%',
    up: true,
    icon: '💰',
    color: '#2d6a4f',
    bg: '#d8f3dc',
  },
  {
    id: 'orders',
    label: 'Commandes reçues',
    value: '87',
    unit: 'commandes',
    change: '+12.1%',
    up: true,
    icon: '📦',
    color: '#1b4d3e',
    bg: '#e9f5ee',
  },
  {
    id: 'products',
    label: 'Produits actifs',
    value: '34',
    unit: 'articles',
    change: '+3',
    up: true,
    icon: '🌿',
    color: '#40916c',
    bg: '#f0faf3',
  },
  {
    id: 'rating',
    label: 'Note moyenne',
    value: '4.8',
    unit: '/ 5',
    change: '▲ 0.2',
    up: true,
    icon: '⭐',
    color: '#e07a5f',
    bg: '#fdf1ed',
  },
];

const chartData = [42, 68, 55, 80, 72, 95, 88, 110, 102, 130, 118, 145];
const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const recentOrders = [
  { id: '#2026-087', client: 'Bakari Sow', product: 'Mangue Premium', amount: '45,000 FCFA', status: 'Livrée', statusColor: '#2d6a4f', statusBg: '#d8f3dc' },
  { id: '#2026-086', client: 'Aminata Fall', product: 'Tomate fraîche', amount: '12,500 FCFA', status: 'En livraison', statusColor: '#0066cc', statusBg: '#e0f0ff' },
  { id: '#2026-085', client: 'Kofi Mensah', product: 'Ananas Bio', amount: '28,000 FCFA', status: 'En préparation', statusColor: '#e07a5f', statusBg: '#fdf1ed' },
  { id: '#2026-084', client: 'Fatou Diallo', product: 'Gombo séché', amount: '8,500 FCFA', status: 'En attente', statusColor: '#6c757d', statusBg: '#f1f3f5' },
];

const topProducts = [
  { name: 'Mangue Premium', sold: 234, revenue: '351,000', emoji: '🥭', pct: 84 },
  { name: 'Ananas Bio', sold: 178, revenue: '267,000', emoji: '🍍', pct: 64 },
  { name: 'Banane Fraîche', sold: 145, revenue: '217,500', emoji: '🍌', pct: 52 },
  { name: 'Tomate fraîche', sold: 89, revenue: '111,250', emoji: '🍅', pct: 32 },
];

const quickActions = [
  { label: 'Ajouter un produit', icon: '➕', action: 'add-product', color: '#1b4d3e' },
  { label: 'Voir les commandes', icon: '📋', action: 'order-management-admin', color: '#2d6a4f' },
  { label: 'Mes produits', icon: '🌿', action: 'my-products', color: '#40916c' },
  { label: 'Mon abonnement', icon: '💎', action: 'plans', color: '#e07a5f' },
];

export default function SellerDashboard({ onNavigate }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tooltip, setTooltip] = useState('');

  const maxVal = Math.max(...chartData);

  const showToast = (msg) => {
    setTooltip(msg);
    setTimeout(() => setTooltip(''), 3000);
  };

  return (
    <div style={styles.container} className="fade-in">

      {/* Toast */}
      {tooltip && (
        <div style={styles.toast} className="fade-in">
          {tooltip}
        </div>
      )}

      {/* ─── Page Header ─── */}
      <div style={styles.pageHeader}>
        <div>
          <p style={styles.greeting}>Bonjour, Jean-Pierre 👋</p>
          <h2 style={styles.pageTitle}>Tableau de bord Vendeur</h2>
          <p style={styles.pageSubtitle}>Juin 2026 · AgroMarket Pro</p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.exportBtn}
            onClick={() => showToast('📊 Export du rapport mensuel en cours...')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter rapport
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div style={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <div key={kpi.id} style={styles.kpiCard}>
            <div style={styles.kpiTop}>
              <div style={{ ...styles.kpiIconWrap, backgroundColor: kpi.bg }}>
                <span style={styles.kpiIcon}>{kpi.icon}</span>
              </div>
              <span style={{
                ...styles.kpiChange,
                color: kpi.up ? '#2d6a4f' : '#dc3545',
                backgroundColor: kpi.up ? '#d8f3dc' : '#fde8ea',
              }}>
                {kpi.up ? '▲' : '▼'} {kpi.change}
              </span>
            </div>
            <p style={styles.kpiLabel}>{kpi.label}</p>
            <p style={styles.kpiValue}>
              {kpi.value}
              <span style={styles.kpiUnit}> {kpi.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* ─── Main Grid ─── */}
      <div style={styles.mainGrid}>

        {/* ─── Revenue Chart ─── */}
        <div style={styles.chartCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Évolution des revenus</h3>
              <p style={styles.cardSubtitle}>Ventes mensuelles en FCFA (2026)</p>
            </div>
            <div style={styles.chartLegend}>
              <span style={styles.legendDot}></span>
              <span style={styles.legendText}>Revenus</span>
            </div>
          </div>

          <div style={styles.chartArea}>
            {chartData.map((val, i) => {
              const barHeight = (val / maxVal) * 120;
              const isHovered = hoveredBar === i;
              return (
                <div key={i} style={styles.barGroup}
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {isHovered && (
                    <div style={styles.barTooltip}>
                      {(val * 10000).toLocaleString('fr-FR')} FCFA
                    </div>
                  )}
                  <div
                    style={{
                      ...styles.bar,
                      height: `${barHeight}px`,
                      backgroundColor: isHovered ? '#1b4d3e' : '#2d6a4f',
                      opacity: isHovered ? 1 : 0.8,
                      transform: isHovered ? 'scaleY(1.04)' : 'scaleY(1)',
                    }}
                  />
                  <span style={styles.barLabel}>{months[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Top Products ─── */}
        <div style={styles.topProductsCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Top produits</h3>
              <p style={styles.cardSubtitle}>Classement par ventes</p>
            </div>
          </div>
          <div style={styles.productsList}>
            {topProducts.map((p, i) => (
              <div key={p.name} style={styles.productItem}>
                <div style={styles.productLeft}>
                  <span style={styles.productRank}>#{i + 1}</span>
                  <span style={styles.productEmoji}>{p.emoji}</span>
                  <div>
                    <p style={styles.productName}>{p.name}</p>
                    <p style={styles.productSold}>{p.sold} ventes</p>
                  </div>
                </div>
                <div style={styles.productRight}>
                  <p style={styles.productRevenue}>{p.revenue} FCFA</p>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${p.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bottom Grid ─── */}
      <div style={styles.bottomGrid}>

        {/* ─── Recent Orders ─── */}
        <div style={styles.recentOrdersCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Commandes récentes</h3>
              <p style={styles.cardSubtitle}>4 dernières commandes</p>
            </div>
            {onNavigate && (
              <button
                style={styles.viewAllBtn}
                onClick={() => onNavigate('order-management-admin')}
              >
                Tout voir →
              </button>
            )}
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>N° Commande</th>
                <th style={styles.th}>Client</th>
                <th style={styles.th}>Produit</th>
                <th style={styles.th}>Montant</th>
                <th style={styles.th}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} style={styles.tr}>
                  <td style={styles.td}>
                    <span style={styles.orderId}>{order.id}</span>
                  </td>
                  <td style={styles.td}>{order.client}</td>
                  <td style={styles.td}>{order.product}</td>
                  <td style={styles.td}>
                    <strong style={{ color: '#e07a5f' }}>{order.amount}</strong>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      color: order.statusColor,
                      backgroundColor: order.statusBg,
                    }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Quick Actions ─── */}
        <div style={styles.quickActionsCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Actions rapides</h3>
              <p style={styles.cardSubtitle}>Raccourcis vendeur</p>
            </div>
          </div>
          <div style={styles.actionsGrid}>
            {quickActions.map((qa) => (
              <button
                key={qa.action}
                style={{ ...styles.actionBtn, borderColor: qa.color + '30' }}
                onClick={() => onNavigate ? onNavigate(qa.action) : showToast(`Navigation vers ${qa.label}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = qa.color;
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = qa.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#212529';
                  e.currentTarget.style.borderColor = qa.color + '30';
                }}
              >
                <span style={styles.actionIcon}>{qa.icon}</span>
                <span style={styles.actionLabel}>{qa.label}</span>
              </button>
            ))}
          </div>

          {/* Summary strip */}
          <div style={styles.summaryStrip}>
            <div style={styles.stripItem}>
              <span style={styles.stripLabel}>Taux conversion</span>
              <span style={styles.stripValue}>72.4%</span>
            </div>
            <div style={styles.stripDivider} />
            <div style={styles.stripItem}>
              <span style={styles.stripLabel}>Panier moyen</span>
              <span style={styles.stripValue}>14,350 FCFA</span>
            </div>
            <div style={styles.stripDivider} />
            <div style={styles.stripItem}>
              <span style={styles.stripLabel}>Retours</span>
              <span style={{ ...styles.stripValue, color: '#e07a5f' }}>2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
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
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '28px',
    borderBottom: '1.5px solid #dee2e6',
    paddingBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  greeting: {
    fontSize: '13px',
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: '4px',
  },
  pageTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#212529',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  pageSubtitle: {
    fontSize: '12px',
    color: '#adb5bd',
    fontWeight: '600',
    marginTop: '4px',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    border: '1.5px solid #dee2e6',
    color: '#343a40',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  // KPI Grid
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '28px',
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    padding: '22px 20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  kpiTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  kpiIconWrap: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiIcon: {
    fontSize: '18px',
  },
  kpiChange: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '20px',
  },
  kpiLabel: {
    fontSize: '12px',
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: '4px',
  },
  kpiValue: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#212529',
    letterSpacing: '-0.02em',
  },
  kpiUnit: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#adb5bd',
  },
  // Main Grid
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1.6fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#212529',
    marginBottom: '2px',
  },
  cardSubtitle: {
    fontSize: '12px',
    color: '#adb5bd',
    fontWeight: '500',
  },
  chartLegend: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#2d6a4f',
    display: 'inline-block',
  },
  legendText: {
    fontSize: '11px',
    color: '#6c757d',
    fontWeight: '600',
  },
  chartArea: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    height: '150px',
    borderBottom: '2px solid #f1f3f5',
    paddingBottom: '6px',
  },
  barGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '6px',
    cursor: 'pointer',
    position: 'relative',
  },
  barTooltip: {
    position: 'absolute',
    top: '-36px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#212529',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
    zIndex: 10,
  },
  bar: {
    width: '100%',
    borderRadius: '6px 6px 0 0',
    transition: 'all 0.2s ease',
    transformOrigin: 'bottom',
  },
  barLabel: {
    fontSize: '9px',
    color: '#adb5bd',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Top Products
  topProductsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
  },
  productsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  productItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  productLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    minWidth: 0,
  },
  productRank: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#adb5bd',
    width: '20px',
    flexShrink: 0,
  },
  productEmoji: {
    fontSize: '20px',
  },
  productName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#212529',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  productSold: {
    fontSize: '11px',
    color: '#adb5bd',
    fontWeight: '500',
  },
  productRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
    flexShrink: 0,
  },
  productRevenue: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#2d6a4f',
    whiteSpace: 'nowrap',
  },
  progressBar: {
    width: '80px',
    height: '5px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2d6a4f',
    borderRadius: '4px',
    transition: 'width 0.4s ease',
  },
  // Bottom Grid
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1.6fr 1fr',
    gap: '24px',
  },
  recentOrdersCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
    overflowX: 'auto',
  },
  viewAllBtn: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1b4d3e',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '4px 0',
    textDecoration: 'underline',
    textDecorationColor: 'transparent',
    transition: 'all 0.2s',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#868e96',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: '1.5px solid #f1f3f5',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid #f8f9fa',
  },
  td: {
    padding: '12px 12px',
    verticalAlign: 'middle',
    color: '#343a40',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  orderId: {
    fontWeight: '700',
    color: '#1b4d3e',
    fontFamily: 'monospace',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
  },
  // Quick Actions
  quickActionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  actionBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px 10px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    border: '1.5px solid',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#212529',
    fontSize: '12px',
    fontWeight: '600',
  },
  actionIcon: {
    fontSize: '22px',
  },
  actionLabel: {
    textAlign: 'center',
    lineHeight: '1.2',
    fontSize: '12px',
  },
  summaryStrip: {
    display: 'flex',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '12px 16px',
    border: '1px solid #e9ecef',
  },
  stripItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  stripLabel: {
    fontSize: '10px',
    color: '#868e96',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  stripValue: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#212529',
  },
  stripDivider: {
    width: '1px',
    backgroundColor: '#dee2e6',
    alignSelf: 'stretch',
    margin: '0 10px',
  },
};
