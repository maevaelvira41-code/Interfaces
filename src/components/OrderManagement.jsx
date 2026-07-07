import React, { useState, useMemo } from 'react';

// Sample detailed order data
const INITIAL_ORDERS = [
  {
    id: '#2026-001',
    date: '15/05/2026',
    amount: 25000,
    itemCount: 3,
    status: 'Livrée',
    items: [
      { name: 'Banane Régime', quantity: 2, price: 5000 },
      { name: 'Tomate Panier', quantity: 3, price: 4500 },
      { name: 'Lait Bouteille', quantity: 5, price: 1100 }
    ],
    address: '128 Rue des Maraîchers, Dakar',
    paymentMethod: 'Orange Money',
    shippingMethod: 'Express (Moto)',
    timeline: [
      { status: 'Commande reçue', date: '15/05/2026 09:12', done: true },
      { status: 'Préparation en cours', date: '15/05/2026 10:30', done: true },
      { status: 'En cours de livraison', date: '15/05/2026 11:15', done: true },
      { status: 'Livrée', date: '15/05/2026 12:00', done: true }
    ]
  },
  {
    id: '#2026-002',
    date: '12/05/2026',
    amount: 45000,
    itemCount: 5,
    status: 'En cours',
    items: [
      { name: 'Viande de Bœuf (kg)', quantity: 4, price: 3200 },
      { name: 'Miel Pur Pot', quantity: 2, price: 9000 },
      { name: 'Sac de Maïs 5kg', quantity: 4, price: 12000 },
      { name: 'Plateau d\'Oeufs', quantity: 1, price: 1800 },
      { name: 'Tomate Panier', quantity: 2, price: 4000 }
    ],
    address: 'Villa 45, Cité Keur Gorgui, Dakar',
    paymentMethod: 'Wave',
    shippingMethod: 'Standard (Camionette)',
    timeline: [
      { status: 'Commande reçue', date: '12/05/2026 14:02', done: true },
      { status: 'Préparation en cours', date: '12/05/2026 16:30', done: true },
      { status: 'En cours de livraison', date: '13/05/2026 08:00', done: true },
      { status: 'Livrée', date: '--', done: false }
    ]
  },
  {
    id: '#2026-003',
    date: '10/05/2026',
    amount: 18500,
    itemCount: 2,
    status: 'En attente',
    items: [
      { name: 'Plateau d\'Oeufs', quantity: 5, price: 9000 },
      { name: 'Banane Régime', quantity: 3, price: 9500 }
    ],
    address: 'Point E, Dakar',
    paymentMethod: 'Paiement à la livraison',
    shippingMethod: 'Express (Moto)',
    timeline: [
      { status: 'Commande reçue', date: '10/05/2026 11:22', done: true },
      { status: 'Validation du paiement', date: '--', done: false },
      { status: 'En cours de livraison', date: '--', done: false },
      { status: 'Livrée', date: '--', done: false }
    ]
  },
  {
    id: '#2026-004',
    date: '08/05/2026',
    amount: 62000,
    itemCount: 7,
    status: 'Livrée',
    items: [
      { name: 'Miel Pur Pot', quantity: 5, price: 22500 },
      { name: 'Viande de Bœuf (kg)', quantity: 6, price: 19200 },
      { name: 'Sac de Maïs 5kg', quantity: 3, price: 9000 },
      { name: 'Lait Bouteille', quantity: 8, price: 9600 },
      { name: 'Plateau d\'Oeufs', quantity: 1, price: 1700 }
    ],
    address: 'Sicap Liberté 4, Dakar',
    paymentMethod: 'Wave',
    shippingMethod: 'Standard (Camionette)',
    timeline: [
      { status: 'Commande reçue', date: '08/05/2026 08:30', done: true },
      { status: 'Préparation en cours', date: '08/05/2026 09:15', done: true },
      { status: 'En cours de livraison', date: '08/05/2026 10:45', done: true },
      { status: 'Livrée', date: '08/05/2026 12:15', done: true }
    ]
  },
  {
    id: '#2026-005',
    date: '05/05/2026',
    amount: 9500,
    itemCount: 1,
    status: 'Annulée',
    items: [
      { name: 'Tomate Panier', quantity: 3, price: 9500 }
    ],
    address: 'Parcelles Assainies, Dakar',
    paymentMethod: 'Paiement à la livraison',
    shippingMethod: 'Express (Moto)',
    timeline: [
      { status: 'Commande reçue', date: '05/05/2026 17:10', done: true },
      { status: 'Annulée par l\'acheteur', date: '05/05/2026 17:35', done: true }
    ]
  }
];

const TABS = [
  { id: 'Toutes', name: 'Toutes' },
  { id: 'En attente', name: 'En attente' },
  { id: 'En cours', name: 'En cours' },
  { id: 'Livrées', name: 'Livrées' },
  { id: 'Annulées', name: 'Annulées' }
];

export default function OrderManagement({ onBackHome }) {
  const [activeTab, setActiveTab] = useState('Toutes');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  // Filter orders based on active tab status
  const filteredOrders = useMemo(() => {
    if (activeTab === 'Toutes') return INITIAL_ORDERS;
    if (activeTab === 'Livrées') return INITIAL_ORDERS.filter(o => o.status === 'Livrée');
    return INITIAL_ORDERS.filter(o => o.status === activeTab);
  }, [activeTab]);

  // Export CSV Handler
  const handleExportCSV = () => {
    setExporting(true);
    
    // Create CSV content
    const headers = 'Commande #,Date,Montant (FCFA),Articles,Statut,Adresse de Livraison,Moyen de Paiement\n';
    const rows = filteredOrders.map(order => 
      `"${order.id}","${order.date}","${order.amount}","${order.itemCount}","${order.status}","${order.address}","${order.paymentMethod}"`
    ).join('\n');
    
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(headers + rows);
    
    // Create hidden link and download
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `agromarket_commandes_${activeTab.toLowerCase()}.csv`);
    document.body.appendChild(link);
    
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      setExporting(false);
    }, 800);
  };

  // Helper for status badge styles
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Livrée':
        return { color: '#2d6a4f', backgroundColor: '#d8f3dc', border: '1px solid #b7e4c7' };
      case 'En cours':
        return { color: '#e07a5f', backgroundColor: '#fde8e3', border: '1px solid #f8c8bc' };
      case 'En attente':
        return { color: '#b27a00', backgroundColor: '#fff3cd', border: '1px solid #ffeeba' };
      case 'Annulée':
        return { color: '#dc3545', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb' };
      default:
        return {};
    }
  };

  return (
    <div style={styles.container} className="fade-in">
      {/* Title Header */}
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <button onClick={onBackHome} style={styles.backBtn} title="Retour à l'accueil">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <h2 style={styles.title}>Mes Commandes</h2>
        </div>
        <p style={styles.subtitle}>Consultez l'état et l'historique de vos commandes AgroMarket.</p>
      </div>

      {/* Tabs Filter Bar */}
      <div style={styles.toolbar}>
        <div style={styles.tabsContainer}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                style={{
                  ...styles.tabBtn,
                  ...(isActive ? styles.tabBtnActive : {})
                }}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        <button 
          onClick={handleExportCSV} 
          style={styles.exportBtn}
          disabled={exporting || filteredOrders.length === 0}
        >
          {exporting ? (
            <span>Génération...</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Export CSV</span>
            </>
          )}
        </button>
      </div>

      {/* Orders Table Container */}
      <div style={styles.tableCard}>
        {filteredOrders.length > 0 ? (
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Commande #</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Montant</th>
                  <th style={styles.th}>Articles</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th} aria-label="Action"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} style={styles.tr}>
                    <td style={styles.tdId}>{order.id}</td>
                    <td style={styles.td}>{order.date}</td>
                    <td style={styles.tdAmount}>
                      {order.amount.toLocaleString('fr-FR')} <span style={styles.currency}>FCFA</span>
                    </td>
                    <td style={styles.td}>{order.itemCount} article{order.itemCount > 1 ? 's' : ''}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        ...getStatusStyle(order.status)
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={styles.tdAction}>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        style={styles.viewLink}
                      >
                        Voir <span style={styles.arrow}>»</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty Table State */
          <div style={styles.emptyTable} className="fade-in">
            <span style={styles.emptyIcon}>📦</span>
            <h4>Aucune commande trouvée</h4>
            <p style={styles.emptyText}>
              Vous n'avez pas de commande avec le statut "{activeTab}" pour le moment.
            </p>
            <button onClick={onBackHome} style={styles.backToShopBtn}>
              Faire mes achats
            </button>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {filteredOrders.length > 0 && (
        <div style={styles.paginationContainer}>
          <button 
            style={styles.pageArrow} 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          <button 
            style={{...styles.pageBtn, ...styles.pageBtnActive}} 
            onClick={() => setCurrentPage(1)}
          >
            1
          </button>
          <button 
            style={styles.pageBtn} 
            onClick={() => setCurrentPage(2)}
          >
            2
          </button>
          <button 
            style={styles.pageBtn} 
            onClick={() => setCurrentPage(3)}
          >
            3
          </button>
          <button 
            style={styles.pageArrow} 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, 3))}
            disabled={currentPage === 3}
          >
            ›
          </button>
        </div>
      )}

      {/* Interactive Details Modal */}
      {selectedOrder && (
        <div style={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()} className="fade-in">
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div>
                <span style={{
                  ...styles.statusBadge,
                  ...getStatusStyle(selectedOrder.status),
                  marginBottom: '8px',
                  display: 'inline-block'
                }}>
                  {selectedOrder.status}
                </span>
                <h3 style={styles.modalTitle}>Commande {selectedOrder.id}</h3>
                <p style={styles.modalSubtitle}>Date d'achat : {selectedOrder.date}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={styles.closeBtn} aria-label="Fermer le modal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div style={styles.modalBody}>
              {/* Product list */}
              <div style={styles.modalSection}>
                <h4 style={styles.modalSectionTitle}>Détails des articles</h4>
                <div style={styles.itemList}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={styles.itemRow}>
                      <div style={styles.itemNameWrapper}>
                        <div style={styles.itemBullet}>🌱</div>
                        <div>
                          <p style={styles.itemName}>{item.name}</p>
                          <p style={styles.itemQty}>Qté: {item.quantity}</p>
                        </div>
                      </div>
                      <p style={styles.itemTotalPrice}>{(item.quantity * item.price).toLocaleString('fr-FR')} FCFA</p>
                    </div>
                  ))}
                </div>
                <div style={styles.totalRow}>
                  <span>Total payé</span>
                  <span style={styles.totalAmount}>{selectedOrder.amount.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div style={styles.modalSection}>
                <h4 style={styles.modalSectionTitle}>Informations de livraison</h4>
                <div style={styles.infoGrid}>
                  <div style={styles.infoCol}>
                    <span style={styles.infoLabel}>Adresse :</span>
                    <span style={styles.infoVal}>{selectedOrder.address}</span>
                  </div>
                  <div style={styles.infoCol}>
                    <span style={styles.infoLabel}>Paiement :</span>
                    <span style={styles.infoVal}>{selectedOrder.paymentMethod}</span>
                  </div>
                  <div style={styles.infoCol}>
                    <span style={styles.infoLabel}>Livraison :</span>
                    <span style={styles.infoVal}>{selectedOrder.shippingMethod}</span>
                  </div>
                </div>
              </div>

              {/* Order Tracking Timeline */}
              <div style={styles.modalSection}>
                <h4 style={styles.modalSectionTitle}>Suivi de la commande</h4>
                <div style={styles.timeline}>
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} style={styles.timelineStep}>
                      <div style={styles.timelineIconWrapper}>
                        <div style={{
                          ...styles.timelineDot,
                          ...(step.done ? styles.timelineDotDone : {})
                        }}>
                          {step.done && <span style={styles.timelineCheck}>✓</span>}
                        </div>
                        {idx < selectedOrder.timeline.length - 1 && (
                          <div style={{
                            ...styles.timelineLine,
                            ...(step.done && selectedOrder.timeline[idx+1].done ? styles.timelineLineDone : {})
                          }}></div>
                        )}
                      </div>
                      <div style={styles.timelineContent}>
                        <p style={{
                          ...styles.timelineStatus,
                          ...(step.done ? styles.timelineStatusDone : {})
                        }}>
                          {step.status}
                        </p>
                        <p style={styles.timelineDate}>{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={styles.modalFooter}>
              <button onClick={() => setSelectedOrder(null)} style={styles.modalCloseBtn}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px 80px 24px',
    width: '100%',
  },
  header: {
    marginBottom: '32px',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '8px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    border: '1.5px solid #dee2e6',
    color: '#495057',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#f1f3f5',
      borderColor: '#1b4d3e',
      color: '#1b4d3e',
    }
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#212529',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6c757d',
    lineHeight: '1.5',
    marginLeft: '58px', // Align with title
  },
  // Toolbar (Tabs + Export)
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  tabsContainer: {
    display: 'flex',
    backgroundColor: '#ffffff',
    padding: '6px',
    borderRadius: '12px',
    border: '1px solid #e9ecef',
    gap: '4px',
    overflowX: 'auto',
    maxWidth: '100%',
  },
  tabBtn: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#6c757d',
    padding: '10px 18px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    ':hover': {
      color: '#1b4d3e',
      backgroundColor: '#f8f9fa',
    }
  },
  tabBtnActive: {
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    boxShadow: '0 4px 10px rgba(27, 77, 62, 0.15)',
    ':hover': {
      backgroundColor: '#1b4d3e',
      color: '#ffffff',
    }
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    border: '1.5px solid #1b4d3e',
    color: '#1b4d3e',
    fontSize: '13px',
    fontWeight: '700',
    transition: 'all 0.2s',
    ':hover:not(:disabled)': {
      backgroundColor: '#1b4d3e',
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(27, 77, 62, 0.1)',
    },
    ':disabled': {
      borderColor: '#dee2e6',
      color: '#adb5bd',
      cursor: 'not-allowed',
    }
  },
  // Table Card styles
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e9ecef',
    boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
    overflow: 'hidden',
    marginBottom: '24px',
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
  th: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#495057',
    padding: '18px 24px',
    borderBottom: '2px solid #e9ecef',
    backgroundColor: '#f8f9fa',
  },
  tr: {
    borderBottom: '1px solid #e9ecef',
    transition: 'background 0.2s',
    ':hover': {
      backgroundColor: '#fdfdfb',
    }
  },
  td: {
    fontSize: '14px',
    color: '#495057',
    padding: '18px 24px',
    fontWeight: '500',
  },
  tdId: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1b4d3e',
    fontFamily: 'monospace',
    padding: '18px 24px',
  },
  tdAmount: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#e07a5f',
    padding: '18px 24px',
  },
  currency: {
    fontSize: '10px',
    fontWeight: '700',
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '800',
    padding: '4px 10px',
    borderRadius: '6px',
    display: 'inline-block',
    letterSpacing: '0.02em',
  },
  tdAction: {
    padding: '18px 24px',
    textAlign: 'right',
  },
  viewLink: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1b4d3e',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'color 0.2s',
    ':hover': {
      color: '#e07a5f',
    }
  },
  arrow: {
    fontSize: '14px',
  },
  // Empty State styles
  emptyTable: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '80px 24px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '13px',
    color: '#6c757d',
    marginTop: '6px',
    marginBottom: '24px',
    maxWidth: '380px',
    lineHeight: '1.5',
  },
  backToShopBtn: {
    padding: '12px 24px',
    borderRadius: '10px',
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#2d6a4f',
    }
  },
  // Pagination styles
  paginationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '32px',
  },
  pageBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: '#495057',
    border: '1px solid #dee2e6',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: '#1b4d3e',
      color: '#1b4d3e',
    }
  },
  pageBtnActive: {
    backgroundColor: '#1b4d3e',
    color: '#ffffff',
    borderColor: '#1b4d3e',
  },
  pageArrow: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    color: '#495057',
    border: '1px solid #dee2e6',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s',
    cursor: 'pointer',
    ':hover:not(:disabled)': {
      borderColor: '#1b4d3e',
      color: '#1b4d3e',
    },
    ':disabled': {
      color: '#adb5bd',
      borderColor: '#e9ecef',
      cursor: 'not-allowed',
    }
  },
  // Modal Overlay & Content
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '24px 24px 18px 24px',
    borderBottom: '1px solid #e9ecef',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#212529',
  },
  modalSubtitle: {
    fontSize: '12px',
    color: '#868e96',
    marginTop: '2px',
    fontWeight: '500',
  },
  closeBtn: {
    color: '#adb5bd',
    transition: 'color 0.2s',
    ':hover': {
      color: '#dc3545',
    }
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  modalSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  modalSectionTitle: {
    fontSize: '13px',
    fontWeight: '800',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: '1px solid #f1f3f5',
    paddingBottom: '6px',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
  },
  itemNameWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  itemBullet: {
    fontSize: '16px',
  },
  itemName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#212529',
  },
  itemQty: {
    fontSize: '11px',
    color: '#868e96',
    fontWeight: '500',
  },
  itemTotalPrice: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#495057',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 12px 0 12px',
    fontSize: '14px',
    fontWeight: '800',
    color: '#212529',
    borderTop: '2.5px double #e9ecef',
    marginTop: '6px',
  },
  totalAmount: {
    fontSize: '18px',
    color: '#e07a5f',
  },
  // Info Grid
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px',
    backgroundColor: '#fdfdfd',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #f1f3f5',
  },
  infoCol: {
    display: 'flex',
    gap: '6px',
    fontSize: '13px',
    lineHeight: '1.4',
  },
  infoLabel: {
    fontWeight: '700',
    color: '#6c757d',
    width: '80px',
    flexShrink: 0,
  },
  infoVal: {
    color: '#212529',
    fontWeight: '500',
  },
  // Timeline Track styles
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingLeft: '6px',
  },
  timelineStep: {
    display: 'flex',
    gap: '16px',
  },
  timelineIconWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  timelineDot: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#e9ecef',
    border: '2px solid #dee2e6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineDotDone: {
    backgroundColor: '#2d6a4f',
    borderColor: '#2d6a4f',
  },
  timelineCheck: {
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '800',
  },
  timelineLine: {
    width: '2px',
    height: '40px',
    backgroundColor: '#e9ecef',
    position: 'absolute',
    top: '20px',
    zIndex: 1,
  },
  timelineLineDone: {
    backgroundColor: '#2d6a4f',
  },
  timelineContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  timelineStatus: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#868e96',
  },
  timelineStatusDone: {
    color: '#212529',
    fontWeight: '700',
  },
  timelineDate: {
    fontSize: '11px',
    color: '#adb5bd',
    marginTop: '1px',
  },
  // Modal footer
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#f8f9fa',
  },
  modalCloseBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#6c757d',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    transition: 'background 0.2s',
    ':hover': {
      backgroundColor: '#5a6268',
    }
  }
};
