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

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // ===== UTILISATEUR CONNECTÉ =====
  // null = non connecté
  // { role, prenom, nom, email, plan, hasProducts }
  const [currentUser, setCurrentUser] = useState(null);

  // ===== SIGNALEMENT =====
  const [showSignalement, setShowSignalement] = useState(false);
  const [signalementProduct, setSignalementProduct] = useState(null);

  // ===== CERTIFICATION =====
  const [certificationStatus, setCertificationStatus] = useState('none');

  // ===== ABONNEMENT =====
  const [activePlan, setActivePlan] = useState('gratuit');

  // ===== PRODUITS VENDEUR =====
  const [vendeurProducts, setVendeurProducts] = useState([]);

  // ===== PANIER =====
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    // Si non connecté → rediriger vers connexion
    if (!currentUser) {
      alert('⚠️ Vous devez être connecté pour ajouter des produits au panier.');
      setScreen('login-page');
      return;
    }
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
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));

  const openSignalement = (product) => {
    if (!currentUser) {
      alert('⚠️ Vous devez être connecté pour signaler un produit.');
      setScreen('login-page');
      return;
    }
    setSignalementProduct(product);
    setShowSignalement(true);
  };

  // ===== CONNEXION =====
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.plan) setActivePlan(user.plan);

    switch (user.role) {
      case 'client':
        setScreen('home'); // Client → accueil
        break;
      case 'vendeur':
        if (user.hasProducts || vendeurProducts.length > 0) {
          setScreen('my-products'); // Vendeur avec produits
        } else {
          setScreen('plans'); // Vendeur sans produits → abonnements
        }
        break;
      case 'admin':
        setScreen('admin-dashboard'); // Admin → dashboard admin
        break;
      default:
        setScreen('home');
    }
  };

  // ===== INSCRIPTION =====
  const handleRegisterSuccess = ({ role, plan }) => {
    // Après inscription → toujours vers connexion
    setScreen('login-page');
  };

  // ===== DÉCONNEXION =====
  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]);
    setScreen('home');
  };

  const [adminOrders, setAdminOrders] = useState([
    { id: '001', client: 'Client A', amount: 25000, status: 'En préparation', date: '15/05' },
    { id: '002', client: 'Client B', amount: 45500, status: 'En livraison', date: '13/05' },
    { id: '003', client: 'Client C', amount: 18500, status: 'En attente', date: '12/05' }
  ]);

  const goToProduct = (product) => { setSelectedProduct(product); setScreen('product-detail'); };
  const goToMessage = (vendor) => {
    if (!currentUser) {
      alert('⚠️ Vous devez être connecté pour contacter un vendeur.');
      setScreen('login-page');
      return;
    }
    setSelectedVendor(vendor);
    setScreen('message');
  };
  const navigate = (s) => setScreen(s);

  const renderScreen = () => {
    switch (screen) {

      // ===== ACCUEIL =====
      case 'home':
        return (
          <AgroMarketHome
            onNavigateToProduct={goToProduct}
            onNavigateToLogin={() => navigate('login-page')}
            onNavigateToRegister={() => navigate('register')}
            onNavigateToCart={() => {
              if (!currentUser) { alert('⚠️ Connectez-vous pour voir votre panier.'); navigate('login-page'); return; }
              navigate('cart');
            }}
            onNavigateToOrders={() => navigate('orders')}
            onNavigateToFAQ={() => navigate('faq')}
            onAddToCart={addToCart}
            cartCount={cartItems.length}
            activePlan={activePlan}
            onSignaler={openSignalement}
            currentUser={currentUser}
            onNavigateToProfile={() => navigate('user-profile')}
            onLogout={handleLogout}
          />
        );

      // ===== AUTH =====
      case 'login-page':
        return (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
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
          />
        );

      case 'add-product':
        return (
          <AddProduct
            onProductAdded={(newProd) => {
              setVendeurProducts(prev => [...prev, newProd]);
              alert(`Produit "${newProd.name}" publié !`);
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
            currentUser={currentUser}
            onBack={() => navigate('home')}
            onEditProfile={() => navigate('edit-profile')}
            onNavigateToOrders={() => navigate('orders')}
            onNavigateToNotifications={() => navigate('notifications')}
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
            currentUser={currentUser}
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
            onBack={() => navigate(currentUser?.role === 'vendeur' ? 'seller-dashboard' : 'home')}
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
            onApproveCertification={() => setCertificationStatus('approved')}
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

      default:
        return (
          <AgroMarketHome
            onNavigateToProduct={goToProduct}
            onNavigateToLogin={() => navigate('login-page')}
            onNavigateToRegister={() => navigate('register')}
            onNavigateToCart={() => { if (!currentUser) { navigate('login-page'); return; } navigate('cart'); }}
            onAddToCart={addToCart}
            cartCount={cartItems.length}
            activePlan={activePlan}
            onSignaler={openSignalement}
            currentUser={currentUser}
            onNavigateToProfile={() => navigate('user-profile')}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <div style={styles.appWrapper}>
      <NavigationConsole currentScreen={screen} setScreen={setScreen} />
      <div style={styles.screenContainer}>{renderScreen()}</div>

      {/* MODAL SIGNALEMENT */}
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