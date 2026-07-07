import React, { useState } from 'react';

export default function NavigationConsole({ currentScreen, setScreen }) {
  const [isOpen, setIsOpen] = useState(true);

  const clientScreens = [
    { id: 'recovery', name: '1. Récupération Mot de passe', desc: 'Split-screen épuré, messages de validation et écran de succès' },
    { id: 'home', name: '2. Page d’accueil AgroMarket', desc: 'Catalogue de vente, recherche dynamique, filtres de catégories et panier réactif' },
    { id: 'orders', name: '3. Commandes (Client)', desc: 'Historique des commandes client, badges d’état, suivi timeline et export CSV' },
    { id: 'checkout-wizard', name: '9. Tunnel de Paiement Wizard', desc: 'Étape par étape : adresse, livraison, paiement interactif, validation et résumé dynamique' },
    { id: 'login-page', name: '13. Page de Connexion', desc: 'Split-screen premium, validation, affichage mot de passe, se souvenir de moi et réseaux sociaux' },
    { id: 'cart', name: '18. Mon Panier', desc: 'Gestion des articles du panier, résumé, code promo et checkout (Design ultra-moderne)' },
    { id: 'faq', name: '19. FAQ & Support', desc: 'Foire aux questions avec accordéon, filtrage par catégories et barre de recherche' },
    { id: 'product-detail', name: '20. Détail Produit (Banane)', desc: 'Page produit premium avec galerie, ferme, actions d\'achat et logistique' },
    { id: 'edit-profile', name: '21. Éditer Profil', desc: 'Formulaire moderne avec upload de photo et informations personnelles' }
  ];

  const sellerScreens = [
    { id: 'my-products', name: '4. Mes Produits (Vendeur)', desc: 'Tableau de bord de gestion avec actions (Dupliquer / Supprimer) et filtres' },
    { id: 'plans', name: '5. Plans d’abonnement', desc: 'Tarification à 3 plans avec sélection interactive (Basic / Pro / Premium)' },
    { id: 'add-product', name: '6. Ajouter un produit', desc: 'Formulaire multi-onglets avec prévisualisation en direct (Live Preview)' },
    { id: 'order-detail-admin', name: '7. Détail Commande (Admin)', desc: 'Supervision de commande, suivi logistique 4 étapes, validation interactive' },
    { id: 'order-management-admin', name: '8. Gestion Commandes (Admin)', desc: 'Tableau de bord logistique, filtrage par onglet d\'état, recherche et actions de suivi' },
    { id: 'seller-dashboard', name: '10. Tableau de bord Vendeur', desc: 'KPIs, graphique de revenus interactif, top produits, commandes récentes et actions rapides' },
    { id: 'user-profile', name: '11. Profil & Paramètres', desc: 'Edition profil, sécurité (2FA), préférences de notification, boutique et coordonnées bancaires' },
    { id: 'notifications', name: '12. Centre de Notifications', desc: 'Alertes temps réel, filtres par catégorie, marquage lu/non-lu, badges urgents et actions' },
    { id: 'admin-dashboard', name: '14. Tableau de bord Admin', desc: 'Sidebar repliable, KPIs avec barres de progression, graphe interactif et listes récentes' },
    { id: 'sales-history', name: '15. Historique des Ventes', desc: 'Graphe double barres (ventes/commandes), donut SVG par catégorie et tableau filtrable avec totaux' },
    { id: 'stock-alerts', name: '16. Alertes de Stocks', desc: 'Bannière d\'alerte rouge, barres de progression de remplissage, priorités et commandes d\'urgence' },
    { id: 'moderation-panel', name: '17. Modération & Signalements', desc: 'Stats bar, onglets de filtrage par état, cartes de signalement extensibles et actions de modération' }
  ];

  return (
    <div style={styles.container}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={styles.toggleBtn}
        title={isOpen ? "Masquer la console" : "Afficher la console de navigation"}
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>
        ) : (
          <div style={styles.pulseContainer}>
            <span style={styles.pulseDot}></span>
            <span style={styles.toggleText}>Console Jury : Cliquer pour basculer d'écran (21 interfaces disponibles)</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        )}
      </button>

      {/* Expanded Console */}
      {isOpen && (
        <div style={styles.consoleBody} className="fade-in">
          <div style={styles.header}>
            <div style={styles.headerTitle}>
              <span style={styles.badge}>CONSOLE DÉMO JURY</span>
              <h4 style={styles.title}>Visualisation des 21 Interfaces AgroMarket</h4>
            </div>
            <p style={styles.subtitle}>
              Conçues par un ingénieur d'interface senior. Utilisez les sections ci-dessous pour tester l'ensemble du prototype client et vendeur.
            </p>
          </div>

          <div style={styles.sectionsContainer}>
            {/* Client Section */}
            <div style={styles.sectionCol}>
              <h5 style={styles.sectionTitle}>🛒 Espace Client</h5>
              <div style={styles.btnGrid}>
                {clientScreens.map((screen) => {
                  const isActive = currentScreen === screen.id;
                  return (
                    <button
                      key={screen.id}
                      onClick={() => setScreen(screen.id)}
                      style={{
                        ...styles.screenBtn,
                        ...(isActive ? styles.activeScreenBtn : {})
                      }}
                    >
                      <span style={{
                        ...styles.btnText,
                        ...(isActive ? styles.activeBtnText : {})
                      }}>
                        {screen.name}
                      </span>
                      <span style={{
                        ...styles.btnDesc,
                        ...(isActive ? styles.activeBtnDesc : {})
                      }}>
                        {screen.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seller Section */}
            <div style={styles.sectionCol}>
              <h5 style={styles.sectionTitle}>👨‍🌾 Espace Vendeur / Producteur</h5>
              <div style={styles.btnGrid}>
                {sellerScreens.map((screen) => {
                  const isActive = currentScreen === screen.id;
                  return (
                    <button
                      key={screen.id}
                      onClick={() => setScreen(screen.id)}
                      style={{
                        ...styles.screenBtn,
                        ...(isActive ? styles.activeScreenBtn : {})
                      }}
                    >
                      <span style={{
                        ...styles.btnText,
                        ...(isActive ? styles.activeBtnText : {})
                      }}>
                        {screen.name}
                      </span>
                      <span style={{
                        ...styles.btnDesc,
                        ...(isActive ? styles.activeBtnDesc : {})
                      }}>
                        {screen.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'sticky',
    top: 0,
    zIndex: 9999,
    width: '100%',
    backgroundColor: '#1b4d3e',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '8px 24px',
    backgroundColor: '#133c30',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
  },
  pulseContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#e07a5f',
    borderRadius: '50%',
    animation: 'pulse 1.5s infinite',
  },
  toggleText: {
    color: '#f4f1de',
  },
  consoleBody: {
    padding: '16px 24px 20px 24px',
    backgroundColor: '#1b4d3e',
  },
  header: {
    marginBottom: '16px',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px',
  },
  badge: {
    backgroundColor: '#e07a5f',
    color: '#ffffff',
    fontSize: '9px',
    fontWeight: '800',
    padding: '3px 8px',
    borderRadius: '4px',
    letterSpacing: '0.05em',
  },
  title: {
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '700',
    margin: 0,
  },
  subtitle: {
    color: '#a3c2b8',
    fontSize: '12px',
    margin: 0,
  },
  sectionsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '16px',
    }
  },
  sectionCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: '800',
    color: '#f4f1de',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: '4px',
  },
  btnGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  screenBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    width: '100%',
  },
  activeScreenBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #ffffff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  btnText: {
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '2px',
  },
  activeBtnText: {
    color: '#1b4d3e',
  },
  btnDesc: {
    color: '#a3c2b8',
    fontSize: '10px',
    lineHeight: '1.2',
  },
  activeBtnDesc: {
    color: '#6c757d',
  }
};
