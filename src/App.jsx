import React, { useState } from 'react';
import NavigationConsole from './components/NavigationConsole';
import AgroMarketHome from './components/AgroMarketHome';
import AddProduct from './components/AddProduct';
import AdminDashboard from './components/AdminDashboard';
import CheckoutWizard from './components/CheckoutWizard';
import EditProfile from './components/EditProfile';
import FAQPage from './components/FAQPage';
import LoginPage from './components/LoginPage';
import MessagePage from './components/messagepage';
import ModerationPanel from './components/ModerationPanel';
import MyProducts from './components/MyProducts';
import NotificationsCenter from './components/NotificationsCenter';
import OrderDetailAdmin from './components/OrderDetailAdmin';
import OrderManagement from './components/OrderManagement';
import OrderManagementAdmin from './components/OrderManagementAdmin';
import PasswordRecovery from './components/PasswordRecovery';
import ProductDetail from './components/ProductDetail';
import RegisterPage from './components/Registerpage';
import SalesHistory from './components/SalesHistory';
import SellerDashboard from './components/SellerDashboard';
import ShoppingCart from './components/ShoppingCart';
import StockAlerts from './components/StockAlerts';
import SubscriptionPlans from './components/SubscriptionPlans';
import UserProfile from './components/UserProfile';
import CertificationRequest from './components/CertificationRequest';
import SignalementModal from './components/SignalementModal';
import VendorVerificationAdmin from './components/VendorVerificationAdmin';
import ProducerProfile from './components/ProducerProfile';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // ===== UTILISATEUR CONNECTÉ =====
  const [currentUser, setCurrentUser] = useState(null);
  // currentUser = { role: 'client'|'vendeur', prenom, nom, email, plan, hasProducts }

  // ===== COMPTES INSCRITS (pour valider la connexion) =====
  const [registeredUsers, setRegisteredUsers] = useState([]);
  // [{ id, role, prenom, nom, email, telephone, password, plan, verificationStatus }]

  // ===== SIGNALEMENT =====
  const [showSignalement, setShowSignalement] = useState(false);
  const [signalementProduct, setSignalementProduct] = useState(null);

  // ===== CERTIFICATION =====
  const [certificationStatus, setCertificationStatus] = useState('none');

  // ===== ABONNEMENT =====
  const [activePlan, setActivePlan] = useState('gratuit');

  // ===== PRODUITS VENDEUR =====
  const [vendeurProducts, setVendeurProducts] = useState([]);

  // ===== VÉRIFICATION VENDEUR (identité + formation) =====
  const [vendorVerifications, setVendorVerifications] = useState([]);
  // [{ id, prenom, nom, email, telephone, idDocuments, trainingInstitution,
  //    trainingCertificate, attestationNumber, trainingYear, submittedAt, status }]

  // ===== AVIS SUR LES PRODUCTEURS (classe Avis du diagramme) =====
  const [avisList, setAvisList] = useState([]);
  // [{ id, id_client, id_producteur, clientNom, note, commentaire, date }]

  // ===== PANIER GLOBAL =====
  const [cartItems, setCartItems] = useState([]);

  // ===== GARDE D'AUTHENTIFICATION =====
  // D'après le diagramme de cas d'utilisation : le Visiteur ne peut que consulter les
  // produits et créer un compte. Toute autre interaction nécessite d'être connecté.
  const [authRedirectMessage, setAuthRedirectMessage] = useState('');
  const requireLogin = (action) => {
    if (currentUser) {
      action();
    } else {
      setAuthRedirectMessage('Connectez-vous ou créez un compte pour continuer.');
      setScreen('login-page');
    }
  };

  const addToCart = (product, quantity = 1) => {
    requireLogin(() => {
      setCartItems(prev => {
        const existing = prev.find(i => i.id === product.id);
        if (existing) {
          return prev.map(i => i.id === product.id
            ? { ...i, quantity: i.quantity + quantity, total: (i.quantity + quantity) * i.price }
            : i
          );
        }
        return [...prev, {
          id: product.id, name: product.name, farm: product.farm,
          price: product.price, image: product.image, quantity,
          total: product.price * quantity,
        }];
      });
      setScreen('cart');
    });
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));

  const openSignalement = (product) => {
    requireLogin(() => {
      setSignalementProduct(product);
      setShowSignalement(true);
    });
  };

  // ===== CONNEXION =====
  // Vérifie les identifiants par rapport aux comptes inscrits.
  // Retourne l'utilisateur trouvé, ou null si email/mot de passe/rôle incorrect.
  const validateLogin = (email, password, role) => {
    const found = registeredUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() &&
           u.password === password &&
           u.role === role
    );
    return found || null;
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setAuthRedirectMessage('');

    if (userData.role === 'vendeur') {
      if (vendeurProducts.length > 0) {
        setScreen('my-products'); // Vendeur avec produits → mes produits
      } else {
        setScreen('plans'); // Vendeur sans produits → abonnements
      }
    } else {
      setScreen('home'); // Client → accueil
    }
  };

  // ===== DÉCONNEXION =====
  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('home');
  };

  // ===== INSCRIPTION =====
  const handleRegisterSuccess = ({ role, plan, verificationStatus, verificationRequest, prenom, nom, email, telephone, password }) => {
    const newUser = {
      id: `user-${Date.now()}`,
      role, plan, verificationStatus,
      prenom, nom, email, telephone, password,
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setActivePlan(plan || 'gratuit');

    if (role === 'vendeur' && verificationRequest) {
      setVendorVerifications(prev => [
        ...prev,
        { id: `vv-${Date.now()}`, status: 'pending', ...verificationRequest },
      ]);
    }

    if (role === 'client') {
      setScreen('home'); // Client → accueil
    } else {
      setScreen('my-products'); // Vendeur → mes produits (vide, vérification en attente)
    }
  };

  // ===== APPROBATION / REJET VÉRIFICATION VENDEUR =====
  const handleApproveVerification = (id) => {
    setVendorVerifications(prev => prev.map(v => v.id === id ? { ...v, status: 'approved' } : v));
    setCurrentUser(prev => (prev?.role === 'vendeur' ? { ...prev, verificationStatus: 'approved' } : prev));
  };

  const handleRejectVerification = (id, reason) => {
    setVendorVerifications(prev => prev.map(v => v.id === id ? { ...v, status: 'rejected', rejectReason: reason } : v));
    setCurrentUser(prev => (prev?.role === 'vendeur' ? { ...prev, verificationStatus: 'rejected' } : prev));
  };

  // ===== GESTION DES UTILISATEURS (admin) =====
  const handleToggleUserBlocked = (userId) => {
    setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, blocked: !u.blocked } : u));
  };

  // ===== SIGNALEMENTS (produits ET utilisateurs) =====
  const [signalements, setSignalements] = useState([]);
  // [{ id, type: 'produit'|'utilisateur', cible, motif, auteur, date, status }]

  const handleSignalerProducteur = (producteur, motif) => {
    setSignalements(prev => [
      ...prev,
      {
        id: `sig-${Date.now()}`,
        type: 'utilisateur',
        cible: producteur.nom,
        motif,
        auteur: currentUser?.prenom || 'Client',
        date: new Date().toISOString(),
        status: 'pending',
      },
    ]);
  };

  // ===== AVIS PRODUCTEUR (publier / modifier / supprimer) =====
  const handleSubmitAvis = ({ id, note, commentaire }) => {
    if (id) {
      // modification d'un avis existant (1 avis max par client/producteur)
      setAvisList(prev => prev.map(a => a.id === id ? { ...a, note, commentaire, date: new Date().toISOString() } : a));
    } else {
      setAvisList(prev => [
        ...prev,
        {
          id: `avis-${Date.now()}`,
          id_client: currentUser?.id ?? currentUser?.email ?? 'client-anonyme',
          id_producteur: selectedVendor?.id,
          clientNom: currentUser?.prenom || 'Client',
          note,
          commentaire,
          date: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleDeleteAvis = (avisId) => {
    setAvisList(prev => prev.filter(a => a.id !== avisId));
  };

  const goToProducerProfile = (vendor) => { setSelectedVendor(vendor); setScreen('producer-profile'); };

  const [adminOrders, setAdminOrders] = useState([
    { id: '001', client: 'Client A', amount: 25000, status: 'En préparation', date: '15/05' },
    { id: '002', client: 'Client B', amount: 45500, status: 'En livraison', date: '13/05' },
    { id: '003', client: 'Client C', amount: 18500, status: 'En attente', date: '12/05' }
  ]);

  const goToProduct = (product) => { setSelectedProduct(product); setScreen('product-detail'); }; // consultation libre (Visiteur)
  const goToMessage = (vendor) => requireLogin(() => { setSelectedVendor(vendor); setScreen('message'); });
  const navigate = (s) => {
    // Écrans accessibles aux visiteurs non connectés (cf. diagramme de cas d'utilisation)
    const publicScreens = ['home', 'login-page', 'register', 'recovery', 'product-detail', 'faq', 'producer-profile'];
    if (!currentUser && !publicScreens.includes(s)) {
      requireLogin(() => setScreen(s));
      return;
    }
    setScreen(s);
  };

  const renderScreen = () => {
    switch (screen) {

      // ===== ACCUEIL =====
      case 'home':
        return (
          <AgroMarketHome
            onNavigateToProduct={goToProduct}
            onNavigateToLogin={() => navigate('login-page')}
            onNavigateToCart={() => navigate('cart')}
            onNavigateToOrders={() => navigate('orders')}
            onNavigateToRecovery={() => navigate('recovery')}
            onNavigateToCheckout={() => navigate('checkout-wizard')}
            onNavigateToRegister={() => navigate('register')}
            onNavigateToFAQ={() => navigate('faq')}
            onAddToCart={addToCart}
            cartCount={cartItems.length}
            activePlan={activePlan}
            onSignaler={openSignalement}
            currentUser={currentUser}
            onNavigateToProfile={() => navigate('user-profile')}
          />
        );

      // ===== AUTH =====
      case 'login-page':
        return (
          <LoginPage
            onLoginSuccess={(userData) => handleLoginSuccess(userData)}
            onValidateLogin={validateLogin}
            infoMessage={authRedirectMessage}
            onNavigateToRecovery={() => navigate('recovery')}
            onNavigateToRegister={() => navigate('register')}
          />
        );

      case 'register':
        return (
          <RegisterPage
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={() => navigate('login-page')}
          />
        );

      case 'recovery':
        return (
          <PasswordRecovery
            onBack={() => navigate('login-page')}
            onSuccess={() => navigate('login-page')}
          />
        );

      // ===== PRODUITS =====
      case 'product-detail':
        return (
          <ProductDetail
            product={selectedProduct}
            onBack={() => navigate('home')}
            onAddToCart={(qty) => addToCart(selectedProduct, qty)}
            onContactVendor={goToMessage}
            onSignaler={() => openSignalement(selectedProduct)}
            onNavigateToProducerProfile={goToProducerProfile}
          />
        );

      case 'add-product':
        return (
          <AddProduct
            onProductAdded={(newProd) => {
              setVendeurProducts(prev => [...prev, newProd]);
              alert(`Produit "${newProd.name}" publié avec succès !`);
              navigate('my-products');
            }}
            onCancel={() => navigate('my-products')}
          />
        );

      case 'my-products':
        return (
          <MyProducts
            onNavigateToAddProduct={() => navigate('add-product')}
            onEditProduct={() => navigate('add-product')}
            onBack={() => navigate('seller-dashboard')}
          />
        );

      // ===== PANIER & PAIEMENT =====
      case 'cart':
        return (
          <ShoppingCart
            cartItems={cartItems}
            onRemoveItem={removeFromCart}
            onCheckout={() => navigate('checkout-wizard')}
            onContinueShopping={() => navigate('home')}
          />
        );

      case 'checkout-wizard':
        return (
          <CheckoutWizard
            onCancel={() => navigate('cart')}
            onOrderSuccess={(newOrder) => {
              setAdminOrders(prev => [...prev, {
                id: newOrder.id, client: newOrder.client,
                amount: newOrder.amount, status: newOrder.status, date: newOrder.date
              }]);
              setCartItems([]);
              navigate('orders');
            }}
          />
        );

      // ===== COMMANDES =====
      case 'orders':
        return (
          <OrderManagement
            onBackHome={() => navigate('home')}
            onViewDetail={() => navigate('order-detail-admin')}
          />
        );

      // ===== MESSAGERIE =====
      case 'message':
        return (
          <MessagePage
            vendor={selectedVendor}
            onBack={() => navigate('product-detail')}
          />
        );

      // ===== PROFIL CLIENT =====
      case 'user-profile':
        return (
          <UserProfile
            onBack={() => navigate('home')}
            onEditProfile={() => navigate('edit-profile')}
            onNavigateToOrders={() => navigate('orders')}
            onNavigateToNotifications={() => navigate('notifications')}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        );

      case 'edit-profile':
        return <EditProfile onBack={() => navigate('user-profile')} onSave={() => navigate('user-profile')} />;

      case 'notifications':
        return <NotificationsCenter onBack={() => navigate('home')} />;

      case 'faq':
        return <FAQPage onBack={() => navigate('home')} />;

      // ===== DASHBOARD VENDEUR =====
      case 'seller-dashboard':
        return (
          <SellerDashboard
            onNavigate={navigate}
            onNavigateToMyProducts={() => navigate('my-products')}
            onNavigateToAddProduct={() => navigate('add-product')}
            onNavigateToSalesHistory={() => navigate('sales-history')}
            onNavigateToStockAlerts={() => navigate('stock-alerts')}
            onNavigateToSubscription={() => navigate('plans')}
            onNavigateToMessages={() => navigate('message')}
            onNavigateToCertification={() => navigate('certification')}
            certificationStatus={certificationStatus}
            activePlan={activePlan}
          />
        );

      case 'sales-history':
        return <SalesHistory onBack={() => navigate('seller-dashboard')} />;

      case 'stock-alerts':
        return <StockAlerts onBack={() => navigate('seller-dashboard')} />;

      // ===== ABONNEMENTS =====
      case 'plans':
        return (
          <SubscriptionPlans
            onBack={() => navigate('seller-dashboard')}
            currentPlan={activePlan}
            onSelectPlan={(plan) => {
              setActivePlan(plan.id);
              alert(`✅ Abonnement ${plan.name} activé !`);
              navigate('my-products');
            }}
          />
        );

      // ===== CERTIFICATION =====
      case 'certification':
        return (
          <CertificationRequest
            currentStatus={certificationStatus}
            onBack={() => navigate('seller-dashboard')}
            onSubmit={() => setCertificationStatus('pending')}
          />
        );

      // ===== DASHBOARD ADMIN =====
      case 'admin-dashboard':
        return (
          <AdminDashboard
            onNavigate={navigate}
            onNavigateToOrders={() => navigate('order-management-admin')}
            onNavigateToModeration={() => navigate('moderation-panel')}
            onNavigateToVendorVerification={() => navigate('vendor-verification')}
            pendingVerificationCount={vendorVerifications.filter(v => v.status === 'pending').length}
            onApproveCertification={() => setCertificationStatus('approved')}
            registeredUsers={registeredUsers}
            onToggleUserBlocked={handleToggleUserBlocked}
          />
        );

      case 'order-management-admin':
        return (
          <OrderManagementAdmin
            ordersData={adminOrders}
            onViewOrder={() => navigate('order-detail-admin')}
            onBack={() => navigate('admin-dashboard')}
          />
        );

      case 'order-detail-admin':
        return (
          <OrderDetailAdmin
            onBack={() => navigate('order-management-admin')}
            onMarkAsDeliveredState={(id, newStatus) => {
              setAdminOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
            }}
          />
        );

      case 'moderation-panel':
        return <ModerationPanel onBack={() => navigate('admin-dashboard')} />;

      case 'vendor-verification':
        return (
          <VendorVerificationAdmin
            pendingVerifications={vendorVerifications}
            onApprove={handleApproveVerification}
            onReject={handleRejectVerification}
            onBack={() => navigate('admin-dashboard')}
          />
        );

      case 'producer-profile':
        return (
          <ProducerProfile
            producteur={selectedVendor}
            avisList={avisList}
            currentUser={currentUser}
            onSubmitAvis={handleSubmitAvis}
            onDeleteAvis={handleDeleteAvis}
            onBack={() => navigate('product-detail')}
            onContactVendor={goToMessage}
            onNavigateToLogin={() => navigate('login-page')}
            onSignalerProducteur={(motif) => requireLogin(() => handleSignalerProducteur(selectedVendor, motif))}
          />
        );

      default:
        return (
          <AgroMarketHome
            onNavigateToProduct={goToProduct}
            onNavigateToLogin={() => navigate('login-page')}
            onNavigateToCart={() => navigate('cart')}
            onAddToCart={addToCart}
            cartCount={cartItems.length}
            activePlan={activePlan}
            onSignaler={openSignalement}
            currentUser={currentUser}
            onNavigateToProfile={() => navigate('user-profile')}
          />
        );
    }
  };

  return (
    <div style={styles.appWrapper}>
      <NavigationConsole
        currentScreen={screen}
        setScreen={setScreen}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <div style={styles.screenContainer}>{renderScreen()}</div>

      {/* MODAL SIGNALEMENT GLOBAL */}
      {showSignalement && (
        <SignalementModal
          product={signalementProduct}
          onClose={() => { setShowSignalement(false); setSignalementProduct(null); }}
        />
      )}
    </div>
  );
}

const styles = {
  appWrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#f8f9fa' },
  screenContainer: { flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%' }
};