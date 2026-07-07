import React, { useState } from 'react';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, Tag } from 'lucide-react';

export default function ShoppingCart({ onCheckout, onContinueShopping, cartItems = [], onRemoveItem }) {

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Si des articles sont passés depuis App.jsx on les utilise, sinon liste vide
  const [items, setItems] = useState(
    cartItems.length > 0 ? cartItems : []
  );

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const shipping = items.length > 0 ? 5000 : 0;
  const total = subtotal + shipping - discount;

  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id));
    if (onRemoveItem) onRemoveItem(id);
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'AGRO2026') {
      setDiscount(5000);
      alert('Code promo appliqué ! -5000 FCFA 🎉');
    } else {
      alert('Code promo invalide. Essayez AGRO2026');
    }
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.iconWrap}>
            <ShoppingBag size={28} color="#fff" />
          </div>
          <h1 style={styles.title}>Mon Panier</h1>
          <span style={styles.badge}>{items.length} articles</span>
        </div>
        <p style={styles.subtitle}>Finalisez vos achats en toute sécurité avec nos producteurs partenaires.</p>
      </div>

      <div style={styles.grid}>
        {/* Colonne gauche */}
        <div style={styles.leftCol}>
          <div style={styles.listHeader}>
            <span style={styles.headerTitle}>Produits</span>
          </div>

          <div style={styles.itemsList}>
            {items.length > 0 ? items.map((item) => (
              <div key={item.id} style={styles.itemCard}>
                <div style={styles.itemLeft}>
                  {/* Image réelle ou emoji fallback */}
                  <div style={styles.itemImageWrapper}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={styles.itemImg} />
                    ) : (
                      <span style={styles.itemEmoji}>{item.img || '🛒'}</span>
                    )}
                  </div>
                  <div style={styles.itemInfo}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemFarm}>{item.farm}</p>
                  </div>
                </div>

                <div style={styles.itemMiddle}>
                  <span style={styles.itemWeight}>{item.quantity || 1} kg</span>
                  <span style={styles.itemUnitPrice}>{item.price.toLocaleString('fr-FR')} FCFA / kg</span>
                </div>

                <div style={styles.itemRight}>
                  <span style={styles.itemTotalPrice}>{item.total.toLocaleString('fr-FR')} FCFA</span>
                  <button style={styles.removeBtn} onClick={() => handleRemove(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )) : (
              <div style={styles.emptyState}>
                <ShoppingBag size={48} color="#adb5bd" style={{ marginBottom: '16px' }} />
                <h3 style={styles.emptyTitle}>Votre panier est vide</h3>
                <p style={styles.emptyText}>Découvrez nos produits frais et ajoutez-les à votre panier.</p>
                <button style={styles.continueBtn} onClick={onContinueShopping}>
                  <ArrowLeft size={18} /> Découvrir les produits
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite - Résumé */}
        <div style={styles.rightCol}>
          <div style={styles.summaryCard}>
            <h2 style={styles.summaryTitle}>Résumé de la commande</h2>
            <div style={styles.summaryBody}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Sous-total</span>
                <span style={styles.summaryValue}>{subtotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Frais de livraison</span>
                <span style={styles.summaryValue}>{shipping.toLocaleString('fr-FR')} FCFA</span>
              </div>
              {discount > 0 && (
                <div style={{...styles.summaryRow, color: '#2d6a4f'}}>
                  <span style={styles.summaryLabel}>Réduction (Promo)</span>
                  <span style={styles.summaryValue}>-{discount.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}
              <div style={styles.divider} />
              <div style={styles.promoSection}>
                <label style={styles.promoLabel}>Code promo</label>
                <div style={styles.promoInputGroup}>
                  <div style={styles.promoIcon}><Tag size={16} color="#6c757d" /></div>
                  <input
                    type="text"
                    placeholder="Entrer le code (ex: AGRO2026)"
                    style={styles.promoInput}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button style={styles.promoBtn} onClick={applyPromo}>Appliquer</button>
                </div>
              </div>
              <div style={styles.divider} />
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total à payer</span>
                <span style={styles.totalValue}>{total.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <button
                style={{...styles.checkoutBtn, opacity: items.length === 0 ? 0.5 : 1}}
                onClick={onCheckout}
                disabled={items.length === 0}
              >
                Procéder au paiement <ArrowRight size={18} />
              </button>
              <button style={styles.continueShoppingBtn} onClick={onContinueShopping}>
                <ArrowLeft size={16} /> Continuer vos achats
              </button>
            </div>
          </div>
          <div style={styles.secureCard}>
            <div style={styles.secureItem}><span>🔒</span> Paiement 100% sécurisé</div>
            <div style={styles.secureItem}><span>🚚</span> Livraison suivie garantie</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', maxWidth: '1400px', margin: '0 auto', width: '100%', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  header: { marginBottom: '40px', background: 'linear-gradient(135deg, #1b4d3e 0%, #2d6a4f 100%)', borderRadius: '24px', padding: '32px 40px', color: 'white', boxShadow: '0 20px 40px rgba(27,77,62,0.15)' },
  headerContent: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' },
  iconWrap: { width: '56px', height: '56px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)' },
  title: { fontSize: '32px', fontWeight: '800', margin: 0 },
  badge: { backgroundColor: '#e07a5f', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '700' },
  subtitle: { fontSize: '16px', color: 'rgba(255,255,255,0.8)', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
  listHeader: { display: 'flex', alignItems: 'center', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' },
  headerTitle: { fontSize: '18px', fontWeight: '700', color: '#212529' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  itemCard: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', borderRadius: '20px', padding: '20px 24px', border: '1px solid #e9ecef', boxShadow: '0 8px 24px rgba(0,0,0,0.02)' },
  itemLeft: { display: 'flex', alignItems: 'center', gap: '20px', flex: 1 },
  itemImageWrapper: { width: '70px', height: '70px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f3f5', flexShrink: 0 },
  itemImg: { width: '100%', height: '100%', objectFit: 'cover' },
  itemEmoji: { fontSize: '32px' },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  itemName: { fontSize: '18px', fontWeight: '700', color: '#212529', margin: 0 },
  itemFarm: { fontSize: '13px', color: '#6c757d', fontWeight: '500', margin: 0 },
  itemMiddle: { display: 'flex', alignItems: 'center', gap: '40px', flex: 1, justifyContent: 'center' },
  itemWeight: { fontSize: '15px', fontWeight: '600', color: '#495057', backgroundColor: '#f1f3f5', padding: '6px 12px', borderRadius: '12px' },
  itemUnitPrice: { fontSize: '14px', color: '#868e96', fontWeight: '500' },
  itemRight: { display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'flex-end', flex: 1 },
  itemTotalPrice: { fontSize: '18px', fontWeight: '800', color: '#e07a5f' },
  removeBtn: { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fff5f5', color: '#fa5252', border: '1px solid #ffe3e3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '24px' },
  summaryCard: { backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e9ecef', boxShadow: '0 12px 36px rgba(0,0,0,0.04)' },
  summaryTitle: { fontSize: '20px', fontWeight: '800', color: '#212529', marginBottom: '24px', textAlign: 'center' },
  summaryBody: { display: 'flex', flexDirection: 'column', gap: '16px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: '15px', color: '#6c757d', fontWeight: '500' },
  summaryValue: { fontSize: '16px', fontWeight: '700', color: '#212529' },
  divider: { height: '1px', backgroundColor: '#e9ecef', margin: '8px 0' },
  promoSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  promoLabel: { fontSize: '13px', fontWeight: '700', color: '#495057' },
  promoInputGroup: { position: 'relative', display: 'flex', gap: '8px' },
  promoIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex' },
  promoInput: { flex: 1, padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1.5px solid #dee2e6', backgroundColor: '#f8f9fa', fontSize: '14px', outline: 'none', fontWeight: '500' },
  promoBtn: { padding: '0 20px', backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', marginBottom: '24px' },
  totalLabel: { fontSize: '18px', fontWeight: '800', color: '#212529' },
  totalValue: { fontSize: '28px', fontWeight: '900', color: '#e07a5f' },
  checkoutBtn: { width: '100%', padding: '18px', backgroundColor: '#e07a5f', color: 'white', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 8px 24px rgba(224,122,95,0.25)' },
  continueShoppingBtn: { width: '100%', padding: '16px', backgroundColor: 'transparent', color: '#1b4d3e', border: '1.5px solid #1b4d3e', borderRadius: '16px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  secureCard: { backgroundColor: '#e9f5ee', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid #b7e4c7' },
  secureItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', color: '#1b4d3e' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px dashed #ced4da' },
  emptyTitle: { fontSize: '20px', fontWeight: '800', color: '#212529', marginBottom: '8px' },
  emptyText: { fontSize: '15px', color: '#6c757d', marginBottom: '24px', textAlign: 'center' },
  continueBtn: { padding: '14px 28px', backgroundColor: '#1b4d3e', color: 'white', borderRadius: '12px', fontSize: '15px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
};
