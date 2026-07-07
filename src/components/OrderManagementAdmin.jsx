import React, { useState } from 'react';

export default function OrderManagementAdmin({ onViewOrder, ordersData }) {
  const [activeTab, setActiveTab] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Default fallback data matching the mockup
  const defaultOrders = [
    { id: '001', client: 'Client A', amount: 25000, status: 'Livrée', date: '15/05' },
    { id: '002', client: 'Client B', amount: 45500, status: 'En livraison', date: '13/05' },
    { id: '003', client: 'Client C', amount: 18500, status: 'En attente', date: '12/05' }
  ];

  const orders = ordersData || defaultOrders;

  const tabs = ['Toutes', 'En attente', 'Confirmées', 'En livraison', 'Livrées'];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Livrée':
        return { color: '#2d6a4f', backgroundColor: '#d8f3dc' };
      case 'En livraison':
        return { color: '#e07a5f', backgroundColor: '#fde8e3' };
      case 'En attente':
        return { color: '#dfa116', backgroundColor: '#fef5d1' };
      case 'Confirmées':
      case 'Confirmée':
        return { color: '#2b6cb0', backgroundColor: '#ebf8ff' };
      default:
        return { color: '#6c757d', backgroundColor: '#f1f3f5' };
    }
  };

  const getStatusLabel = (status) => {
    return status;
  };

  const filteredOrders = orders.filter(order => {
    // Tab Filter
    const matchesTab = activeTab === 'Toutes' || 
                       (activeTab === 'En attente' && order.status === 'En attente') ||
                       (activeTab === 'Confirmées' && (order.status === 'Confirmée' || order.status === 'Confirmées')) ||
                       (activeTab === 'En livraison' && order.status === 'En livraison') ||
                       (activeTab === 'Livrées' && order.status === 'Livrée');

    // Search Query Filter
    const matchesSearch = order.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          `#${order.id}`.includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  return (
    <div style={styles.container} className="fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleArea}>
          <h2 style={styles.title}>Gestion commandes</h2>
          <p style={styles.subtitle}>Supervisez et gérez les flux logistiques des commandes AgroMarket.</p>
        </div>
      </div>

      {/* Control Bar (Tabs + Search) */}
      <div style={styles.controlsBar}>
        {/* Status Tabs */}
        <div style={styles.tabsWrapper}>
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tabBtn,
                  ...(isActive ? styles.activeTabBtn : {})
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div style={styles.searchWrapper}>
          <svg style={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher client, N°..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={styles.clearSearchBtn}>×</button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableResponsive}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th style={styles.th}>Commande</th>
                <th style={styles.th}>Client</th>
                <th style={styles.th}>Montant</th>
                <th style={styles.th}>Statut</th>
                <th style={styles.th}>Date</th>
                <th style={styles.thAlignRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => {
                  const statusStyle = getStatusStyle(order.status);
                  return (
                    <tr key={order.id} style={{
                      ...styles.tableRow,
                      backgroundColor: idx % 2 === 1 ? '#f8f9fa' : '#ffffff'
                    }}>
                      <td style={styles.tdOrderCode}>#{order.id}</td>
                      <td style={styles.tdClient}>{order.client}</td>
                      <td style={styles.tdAmount}>
                        {order.amount.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          ...statusStyle
                        }}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td style={styles.tdDate}>{order.date}</td>
                      <td style={styles.tdActions}>
                        <button 
                          onClick={() => onViewOrder(order.id)} 
                          style={styles.actionBtn}
                          title="Consulter le détail de la commande"
                        >
                          Voir | Éditer
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={styles.noDataCell}>
                    <div style={styles.noDataContent}>
                      <span style={styles.noDataIcon}>📦</span>
                      <p style={styles.noDataText}>Aucune commande ne correspond à vos filtres.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer / Summary */}
        <div style={styles.tableFooter}>
          <span style={styles.footerInfo}>
            Affichage de <strong>{filteredOrders.length}</strong> commande(s) sur <strong>{orders.length}</strong> au total
          </span>
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
  header: {
    marginBottom: '28px',
    borderBottom: '1.5px solid #dee2e6',
    paddingBottom: '16px',
  },
  titleArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#212529',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '13.5px',
    color: '#6c757d',
  },
  // Controls bar
  controlsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  tabsWrapper: {
    display: 'flex',
    gap: '8px',
    backgroundColor: '#ffffff',
    padding: '5px',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    flexWrap: 'wrap',
  },
  tabBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#495057',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    ':hover': {
      backgroundColor: '#f1f3f5',
    }
  },
  activeTabBtn: {
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    boxShadow: '0 2px 6px rgba(27,77,62,0.15)',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    minWidth: '240px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1.5px solid #dee2e6',
    padding: '2px 12px',
    transition: 'all 0.2s ease',
    '@media (max-width: 576px)': {
      width: '100%',
    }
  },
  searchIcon: {
    color: '#adb5bd',
    marginRight: '8px',
  },
  searchInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    padding: '8px 0',
    fontSize: '13px',
    fontWeight: '500',
    color: '#212529',
  },
  clearSearchBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '16px',
    color: '#adb5bd',
    cursor: 'pointer',
    padding: '0 4px',
  },
  // Table Card
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
    overflow: 'hidden',
  },
  tableResponsive: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeadRow: {
    borderBottom: '1.5px solid #dee2e6',
    backgroundColor: '#f8f9fa',
  },
  th: {
    padding: '16px 20px',
    fontSize: '12px',
    fontWeight: '800',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  thAlignRight: {
    padding: '16px 20px',
    fontSize: '12px',
    fontWeight: '800',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textAlign: 'right',
  },
  tableRow: {
    borderBottom: '1px solid #e9ecef',
    transition: 'background-color 0.15s ease',
    ':hover': {
      backgroundColor: '#fdfdfd',
    }
  },
  td: {
    padding: '16px 20px',
    verticalAlign: 'middle',
  },
  tdOrderCode: {
    padding: '16px 20px',
    verticalAlign: 'middle',
    fontSize: '14px',
    fontWeight: '700',
    color: '#1b4d3e',
  },
  tdClient: {
    padding: '16px 20px',
    verticalAlign: 'middle',
    fontSize: '13.5px',
    fontWeight: '600',
    color: '#212529',
  },
  tdAmount: {
    padding: '16px 20px',
    verticalAlign: 'middle',
    fontSize: '14px',
    fontWeight: '800',
    color: '#e07a5f',
  },
  tdDate: {
    padding: '16px 20px',
    verticalAlign: 'middle',
    fontSize: '13px',
    fontWeight: '500',
    color: '#6c757d',
  },
  tdActions: {
    padding: '16px 20px',
    verticalAlign: 'middle',
    textAlign: 'right',
  },
  actionBtn: {
    color: '#1b4d3e',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    borderBottom: '1px solid transparent',
    padding: '2px 0',
    transition: 'all 0.2s',
    ':hover': {
      color: '#e07a5f',
    }
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.02em',
  },
  noDataCell: {
    padding: '40px 20px',
  },
  noDataContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  noDataIcon: {
    fontSize: '32px',
  },
  noDataText: {
    fontSize: '13.5px',
    color: '#6c757d',
    fontWeight: '500',
  },
  tableFooter: {
    padding: '16px 20px',
    borderTop: '1px solid #e9ecef',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerInfo: {
    fontSize: '12px',
    color: '#6c757d',
  }
};
