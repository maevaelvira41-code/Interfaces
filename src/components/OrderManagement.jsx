// src/components/OrderManagement.jsx
import React from 'react';
import { ArrowLeft, Package, CheckCircle, Clock, Truck } from 'lucide-react';

export default function OrderManagement({ orders, onBackHome }) {
  const getStatusIcon = (status) => {
    if (status === 'Livrée') return <CheckCircle size={16} color="#2d6a4f" />;
    if (status === 'En livraison') return <Truck size={16} color="#f5b041" />;
    return <Clock size={16} color="#adb5bd" />;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBackHome}>
          <ArrowLeft size={20} /> Retour
        </button>
        <h1 style={styles.title}>Mes achats</h1>
        <p style={styles.subtitle}>Suivez l'état de vos commandes</p>
      </div>

      {orders.length === 0 ? (
        <div style={styles.emptyState}>
          <Package size={48} color="#adb5bd" />
          <p style={styles.emptyText}>Vous n'avez pas encore passé de commande.</p>
          <button style={styles.emptyBtn} onClick={onBackHome}>Commencer vos achats</button>
        </div>
      ) : (
        <div style={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div style={styles.orderId}>Commande #{order.id}</div>
                <div style={styles.orderDate}>{order.date}</div>
              </div>
              <div style={styles.orderDetails}>
                <div style={styles.orderClient}>{order.client}</div>
                <div style={styles.orderAmount}>{order.amount.toLocaleString()} FCFA</div>
                <div style={styles.orderStatus}>
                  {getStatusIcon(order.status)} {order.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  header: {
    marginBottom: '32px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#f1f3f5',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '900',
    color: '#212529',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#6c757d',
    margin: '4px 0 0 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6c757d',
  },
  emptyText: {
    fontSize: '16px',
    margin: '16px 0',
  },
  emptyBtn: {
    padding: '12px 24px',
    backgroundColor: '#2d6a4f',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #e9ecef',
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f1f3f5',
  },
  orderId: {
    fontWeight: '700',
    color: '#212529',
  },
  orderDate: {
    color: '#6c757d',
    fontSize: '13px',
  },
  orderDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gap: '16px',
    alignItems: 'center',
  },
  orderClient: {
    fontWeight: '600',
    color: '#495057',
  },
  orderAmount: {
    fontWeight: '800',
    color: '#e07a5f',
  },
  orderStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#495057',
  },
};