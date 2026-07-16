// src/App.jsx
import React, { useState, useEffect } from 'react';
import NavigationConsole from './components/NavigationConsole';
import AgroMarketHome from './components/AgriconnectHome';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import VendeurOrders from './components/VendeurOrders';
import ClientOrders from './components/ClientOrders';
import ClientPurchases from './components/ClientPurchases';
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
import ProductCatalog from './components/ProductCatalog';
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
import ChangePassword from './components/ChangePassword';
import { authApi, utilisateurApi, getSession } from './services/api';
import { ROLE_FRONTEND_TO_BACKEND, joinNomComplet, mapProfileToFrontendUser } from './services/userMapping';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // ===== LANGUE =====
  const [lang, setLang] = useState('fr');
  const toggleLang = () => setLang(prev => (prev === 'fr' ? 'en' : 'fr'));

  // ===== UTILISATEUR CONNECTÉ =====
  const [currentUser, setCurrentUser] = useState(null);

  // ===== COMPTES INSCRITS =====
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // ===== NOTIFICATIONS =====
  const [notifications, setNotifications] = useState([]);
  const addNotification = (userId, type, message, lien = null) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      utilisateurId: userId,
      type: type,
      message,
      lien,
      lu: false,
      dateCreation: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // ===== COMPTE ADMIN =====
  // NOTE : il n'y a plus de compte admin codé en dur ici. La connexion admin
  // passe désormais par le vrai backend (auth-service). Un compte avec le
  // rôle ADMIN doit exister dans la base de utilisateur-service (créé via
  // POST /api/utilisateurs/admin/creer par un autre admin, ou directement
  // en base pour le tout premier compte).

  // ===== AUTRES ÉTATS =====
  const [showSignalement, setShowSignalement] = useState(false);
  const [signalementProduct, setSignalementProduct] = useState(null);
  const [certificationStatus, setCertificationStatus] = useState('none');
  const [activePlan, setActivePlan] = useState('gratuit');
  const [vendeurProducts, setVendeurProducts] = useState([]);
  const [vendorVerifications, setVendorVerifications] = useState([]);
  const [avisList, setAvisList] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [authRedirectMessage, setAuthRedirectMessage] = useState('');
  const [signalements, setSignalements] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isClientMode, setIsClientMode] = useState(false);

  // ===== CHARGEMENT DEPUIS localStorage =====
  useEffect(() => {
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) { try { setRegisteredUsers(JSON.parse(savedUsers)); } catch {} }
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) { try { setCartItems(JSON.parse(savedCart)); } catch {} }
    const savedProducts = localStorage.getItem('vendeurProducts');
    if (savedProducts) { try { setVendeurProducts(JSON.parse(savedProducts)); } catch {} }
    const savedVerifications = localStorage.getItem('vendorVerifications');
    if (savedVerifications) { try { setVendorVerifications(JSON.parse(savedVerifications)); } catch {} }
    const savedAvis = localStorage.getItem('avisList');
    if (savedAvis) { try { setAvisList(JSON.parse(savedAvis)); } catch {} }
    const savedSignalements = localStorage.getItem('signalements');
    if (savedSignalements) { try { setSignalements(JSON.parse(savedSignalements)); } catch {} }
    const savedOrders = localStorage.getItem('adminOrders');
    if (savedOrders) { try { setAdminOrders(JSON.parse(savedOrders)); } catch {} }
    const savedNotifs = localStorage.getItem('notifications');
    if (savedNotifs) { try { setNotifications(JSON.parse(savedNotifs)); } catch {} }
    const savedPlan = localStorage.getItem('activePlan');
    if (savedPlan) { setActivePlan(savedPlan); }
    const savedClientMode = localStorage.getItem('isClientMode');
    if (savedClientMode) { setIsClientMode(JSON.parse(savedClientMode)); }

    // Restaurer la session utilisateur à partir du token JWT stocké,
    // en revérifiant le profil auprès du backend (utilisateur-service)
    // plutôt que de faire confiance à une copie locale potentiellement
    // périmée.
    const session = getSession();
    if (session) {
      utilisateurApi
        .getUtilisateurById(session.uid)
        .then((profile) => {
          setCurrentUser(mapProfileToFrontendUser(profile, session.roles));
        })
        .catch(() => {
          // Token invalide/expiré ou utilisateur supprimé : on nettoie la session.
          authApi.logout();
        });
    }
  }, []);

  // ===== SAUVEGARDE =====
  useEffect(() => { localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { localStorage.setItem('cartItems', JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem('vendeurProducts', JSON.stringify(vendeurProducts)); }, [vendeurProducts]);
  useEffect(() => { localStorage.setItem('vendorVerifications', JSON.stringify(vendorVerifications)); }, [vendorVerifications]);
  useEffect(() => { localStorage.setItem('avisList', JSON.stringify(avisList)); }, [avisList]);
  useEffect(() => { localStorage.setItem('signalements', JSON.stringify(signalements)); }, [signalements]);
  useEffect(() => { localStorage.setItem('adminOrders', JSON.stringify(adminOrders)); }, [adminOrders]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('activePlan', activePlan); }, [activePlan]);
  useEffect(() => { localStorage.setItem('isClientMode', JSON.stringify(isClientMode)); }, [isClientMode]);

  // ===== INITIALISER activePlan =====
  useEffect(() => {
    if (currentUser?.role === 'vendeur') {
      setActivePlan(currentUser.plan || 'gratuit');
    }
  }, [currentUser]);

  // ===== GARDE AUTH =====
  const requireLogin = (action) => {
    if (currentUser) action();
    else {
      setAuthRedirectMessage('Connectez-vous ou créez un compte pour continuer.');
      setScreen('login-page');
    }
  };

  // ===== ACTIONS =====
  const addToCart = (product, quantity = 1) => {
    requireLogin(() => {
      if (currentUser.role !== 'client' && !isClientMode) {
        alert('Seuls les clients peuvent ajouter des produits au panier.');
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
          id: product.id,
          name: product.name,
          farm: product.farm || 'Producteur local',
          price: product.price,
          image: product.image,
          quantity,
          total: product.price * quantity,
        }];
      });
      setScreen('cart');
    });
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));

  const updateCartItemQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity, total: item.price * newQuantity } : item
      )
    );
  };

  const openSignalement = (product) => {
    requireLogin(() => {
      setSignalementProduct(product);
      setShowSignalement(true);
    });
  };

  // ===== GESTION DES ABONNEMENTS =====
  const handleSelectPlan = (plan) => {
    if (!currentUser || currentUser.role !== 'vendeur') {
      alert('Seuls les vendeurs peuvent souscrire à un abonnement.');
      return;
    }
    if (plan.price > 0) {
      if (!window.confirm(`Passer à l'abonnement ${plan.name} (${plan.price.toLocaleString()} FCFA/mois) ?`)) {
        return;
      }
    }
    const updatedUser = { ...currentUser, plan: plan.id };
    setCurrentUser(updatedUser);
    setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setActivePlan(plan.id);
    addNotification(1, 'info', `${currentUser.prenom} ${currentUser.nom} a changé pour le plan ${plan.name}`, '/admin/dashboard');
    addNotification(currentUser.id, 'success', `Votre abonnement ${plan.name} est désormais actif !`, '/seller-dashboard');
    alert(`✅ Abonnement ${plan.name} activé avec succès !`);
    navigate('seller-dashboard');
  };

  // ===== CONNEXION =====
  // Appelle le vrai backend (auth-service + utilisateur-service).
  // Retourne l'utilisateur (au format frontend) en cas de succès,
  // ou lève une erreur avec un message lisible en cas d'échec.
  const validateLogin = async (email, password, uiRole) => {
    const authResponse = await authApi.login(email, password);
    const expectedBackendRole = ROLE_FRONTEND_TO_BACKEND[uiRole];

    if (!authResponse.roles?.includes(expectedBackendRole)) {
      authApi.logout();
      throw new Error(`Aucun compte ${uiRole} trouvé avec ces identifiants.`);
    }

    const profile = await utilisateurApi.getUtilisateurById(authResponse.uid);
    return mapProfileToFrontendUser(profile, authResponse.roles);
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setAuthRedirectMessage('');
    if (userData.role === 'vendeur') {
      setActivePlan(userData.plan || 'gratuit');
    }
    addNotification(1, 'info', `${userData.prenom} ${userData.nom} (${userData.role}) s'est connecté`, null);
    addNotification(userData.id, 'success', `Bienvenue ${userData.prenom} ! Vous êtes connecté.`, '/profil');

    setIsClientMode(false);

    if (userData.role === 'admin') setScreen('admin-dashboard');
    else if (userData.role === 'vendeur') {
      setScreen('seller-dashboard');
    } else setScreen('home');
  };

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    setIsClientMode(false);
    setScreen('home');
  };

  // ===== MODE CLIENT =====
  const toggleClientMode = () => {
    setIsClientMode(prev => {
      const newMode = !prev;
      if (newMode) {
        setScreen('home');
      } else {
        setScreen('seller-dashboard');
      }
      return newMode;
    });
  };

  // ===== INSCRIPTION =====
  // Crée le compte auprès de utilisateur-service, puis connecte
  // automatiquement l'utilisateur (auth-service) pour récupérer un token.
  const handleRegisterSuccess = async ({ role, prenom, nom, email, telephone, password, photo }) => {
    await utilisateurApi.createUtilisateur({
      nom: joinNomComplet(prenom, nom),
      email,
      motDePasse: password,
      telephone,
      photo: photo || null,
      role: ROLE_FRONTEND_TO_BACKEND[role],
    });

    const newUser = await validateLogin(email, password, role);

    addNotification(1, 'info', `Nouvel utilisateur inscrit : ${prenom} ${nom} (${role})`, '/admin/dashboard');
    addNotification(newUser.id, 'success', `Bienvenue ${prenom} ! Votre compte a été créé.`, '/profil');

    setActivePlan(newUser.plan);
    setCurrentUser(newUser);
    if (role === 'vendeur') {
      setScreen('seller-dashboard');
    } else {
      setScreen('home');
    }
  };

  // ===== GESTION DES PRODUITS =====
  const handleAddProduct = (newProduct) => {
    setVendeurProducts(prev => [...prev, newProduct]);
    navigate('my-products');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    navigate('edit-product');
  };

  const handleUpdateProduct = (updatedProduct) => {
    setVendeurProducts(prev =>
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    setEditingProduct(null);
    navigate('my-products');
  };

  const handleDeleteProduct = (id) => {
    setVendeurProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleDuplicateProduct = (product) => {
    setVendeurProducts(prev => [
      ...prev,
      { ...product, id: Date.now(), name: `${product.name} (Copie)`, sales: 0 },
    ]);
  };

  // ===== APPROBATION / REJET =====
  const handleApproveVerification = (id) => {};
  const handleRejectVerification = (id) => {};
  const handleToggleUserBlocked = (userId) => {
    setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, blocked: !u.blocked } : u));
  };

  const handleSignalerProducteur = (producteur, motif) => {
    setSignalements(prev => [
      ...prev,
      { id: `sig-${Date.now()}`, type: 'utilisateur', cible: producteur.nom, motif, auteur: currentUser?.prenom || 'Client', date: new Date().toISOString(), status: 'pending' },
    ]);
    addNotification(1, 'error', `Signalement de ${producteur.nom} par ${currentUser?.prenom || 'un client'}`, '/admin/moderation-panel');
  };

  const handleSubmitAvis = ({ id, note, commentaire }) => {
    if (id) {
      setAvisList(prev => prev.map(a => a.id === id ? { ...a, note, commentaire, date: new Date().toISOString() } : a));
    } else {
      setAvisList(prev => [
        ...prev,
        { id: `avis-${Date.now()}`, id_client: currentUser?.id ?? currentUser?.email ?? 'client-anonyme', id_producteur: selectedVendor?.id, clientNom: currentUser?.prenom || 'Client', note, commentaire, date: new Date().toISOString() },
      ]);
    }
  };

  const handleDeleteAvis = (avisId) => setAvisList(prev => prev.filter(a => a.id !== avisId));

  // ===== NAVIGATION =====
  const goToProduct = (product) => { setSelectedProduct(product); setScreen('product-detail'); };
  const goToMessage = (vendor) => requireLogin(() => { setSelectedVendor(vendor); setScreen('message'); });
  const goToProducerProfile = (vendor) => { setSelectedVendor(vendor); setScreen('producer-profile'); };

  const clientOnlyScreens = ['cart', 'checkout-wizard', 'orders', 'purchases'];
  const vendeurOnlyScreens = ['add-product', 'edit-product', 'my-products', 'seller-dashboard', 'sales-history', 'stock-alerts', 'plans', 'certification', 'vendeur-orders'];
  const adminOnlyScreens = ['admin-dashboard', 'order-management-admin', 'order-detail-admin', 'moderation-panel', 'vendor-verification'];

  const navigate = (s) => {
    const publicScreens = ['home', 'login-page', 'register', 'recovery', 'product-detail', 'faq', 'producer-profile', 'catalogue'];
    if (!currentUser && !publicScreens.includes(s)) {
      requireLogin(() => setScreen(s));
      return;
    }
    if (currentUser) {
      if (isClientMode) {
        if (vendeurOnlyScreens.includes(s) || adminOnlyScreens.includes(s)) {
          alert('Vous êtes en mode client, cette section est réservée aux vendeurs.');
          return;
        }
      } else {
        if (clientOnlyScreens.includes(s) && currentUser.role !== 'client') {
          alert("Cette section est réservée aux clients.");
          setScreen(currentUser.role === 'admin' ? 'admin-dashboard' : 'my-products');
          return;
        }
        if (vendeurOnlyScreens.includes(s) && currentUser.role !== 'vendeur') {
          alert('Cette section est réservée aux vendeurs.');
          setScreen(currentUser.role === 'admin' ? 'admin-dashboard' : 'home');
          return;
        }
        if (adminOnlyScreens.includes(s) && currentUser.role !== 'admin') {
          alert("Cette section est réservée à l'administrateur.");
          setScreen(currentUser.role === 'vendeur' ? 'my-products' : 'home');
          return;
        }
      }
    }
    setScreen(s);
  };

  // ===== RENDU =====
  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <AgroMarketHome
          onNavigateToProduct={goToProduct}
          onNavigateToLogin={() => navigate('login-page')}
          onNavigateToCatalogue={() => navigate('catalogue')}
          onAddToCart={addToCart}
          currentUser={currentUser}
          lang={lang}
        />;
      case 'catalogue':
        return <ProductCatalog
          onBack={() => navigate('home')}
          onNavigateToProduct={goToProduct}
          onAddToCart={addToCart}
        />;
      case 'login-page':
        return <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onValidateLogin={validateLogin}
          infoMessage={authRedirectMessage}
          onNavigateToRecovery={() => navigate('recovery')}
          onNavigateToRegister={() => navigate('register')}
        />;
      case 'register':
        return <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => navigate('login-page')}
        />;
      case 'recovery':
        return <PasswordRecovery
          onBack={() => navigate('login-page')}
          onSuccess={() => navigate('login-page')}
          registeredUsers={registeredUsers}
          updateUserPassword={(email, newPassword) => {
            const userIndex = registeredUsers.findIndex(
              u => u.email.toLowerCase() === email.toLowerCase()
            );
            if (userIndex !== -1) {
              const updatedUsers = [...registeredUsers];
              updatedUsers[userIndex] = {
                ...updatedUsers[userIndex],
                password: newPassword,
              };
              setRegisteredUsers(updatedUsers);
              if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
                setCurrentUser({ ...currentUser, password: newPassword });
              }
              return true;
            }
            return false;
          }}
        />;
      case 'product-detail':
        return <ProductDetail
          product={selectedProduct}
          onBack={() => navigate('home')}
          onAddToCart={(qty) => addToCart(selectedProduct, qty)}
          onContactVendor={goToMessage}
          onSignaler={() => openSignalement(selectedProduct)}
          onNavigateToProducerProfile={goToProducerProfile}
        />;
      case 'add-product':
        return <AddProduct
          onProductAdded={handleAddProduct}
          onCancel={() => navigate('my-products')}
        />;
      case 'edit-product':
        return <EditProduct
          product={editingProduct}
          onSave={handleUpdateProduct}
          onCancel={() => {
            setEditingProduct(null);
            navigate('my-products');
          }}
        />;
      case 'my-products':
        return <MyProducts
          products={vendeurProducts}
          onNavigateToAddProduct={() => navigate('add-product')}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onDuplicateProduct={handleDuplicateProduct}
          onBack={() => navigate('seller-dashboard')}
        />;
      case 'cart':
        return <ShoppingCart
          cartItems={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateCartItemQuantity}
          onCheckout={() => {
            const newOrder = {
              id: `CMD-${Date.now()}`,
              client: currentUser?.prenom + ' ' + currentUser?.nom || 'Client',
              amount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
              status: 'En attente',
              date: new Date().toLocaleDateString('fr-FR'),
              items: cartItems.map(item => ({
                nomProduit: item.name,
                quantity: item.quantity,
                prixUnitaire: item.price,
                subtotal: item.price * item.quantity,
              })),
            };
            setAdminOrders(prev => [...prev, newOrder]);
            addNotification(1, 'info', `Nouvelle commande #${newOrder.id} de ${newOrder.client}`, '/admin/order-management-admin');
            addNotification(currentUser.id, 'success', `Commande #${newOrder.id} confirmée !`, '/orders');
            setCartItems([]);
            navigate('orders');
          }}
          onContinueShopping={() => navigate('home')}
        />;
      case 'checkout-wizard':
        return <ShoppingCart
          cartItems={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateCartItemQuantity}
          onCheckout={() => {
            const newOrder = {
              id: `CMD-${Date.now()}`,
              client: currentUser?.prenom + ' ' + currentUser?.nom || 'Client',
              amount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
              status: 'En attente',
              date: new Date().toLocaleDateString('fr-FR'),
              items: cartItems.map(item => ({
                nomProduit: item.name,
                quantity: item.quantity,
                prixUnitaire: item.price,
                subtotal: item.price * item.quantity,
              })),
            };
            setAdminOrders(prev => [...prev, newOrder]);
            addNotification(1, 'info', `Nouvelle commande #${newOrder.id} de ${newOrder.client}`, '/admin/order-management-admin');
            addNotification(currentUser.id, 'success', `Commande #${newOrder.id} confirmée !`, '/orders');
            setCartItems([]);
            navigate('orders');
          }}
          onContinueShopping={() => navigate('home')}
        />;
      case 'orders':
        return <ClientOrders
          orders={adminOrders.filter(o => o.id_client === currentUser?.id)}
          onBackHome={() => navigate('home')}
        />;
      case 'purchases':
        return <ClientPurchases
          orders={adminOrders.filter(o => o.id_client === currentUser?.id)}
          onBackHome={() => navigate('home')}
        />;
      case 'message':
        return <MessagePage vendor={selectedVendor} onBack={() => navigate('product-detail')} />;
      case 'user-profile':
        return <UserProfile
          currentUser={currentUser}
          onEditProfile={() => navigate('edit-profile')}
          onChangePassword={() => navigate('change-password')}
          onBack={() => navigate('home')}
        />;
      case 'edit-profile':
        return <EditProfile
          currentUser={currentUser}
          onBack={() => navigate('user-profile')}
          onSave={(updatedData) => {
            const updatedUser = { ...currentUser, ...updatedData };
            setCurrentUser(updatedUser);
            setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
            navigate('user-profile');
          }}
        />;
      case 'change-password':
        return <ChangePassword
          currentUser={currentUser}
          onBack={() => navigate('user-profile')}
          onSave={(newPassword) => {
            const updatedUser = { ...currentUser, password: newPassword };
            setCurrentUser(updatedUser);
            setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
            addNotification(currentUser.id, 'info', 'Votre mot de passe a été modifié avec succès.', null);
          }}
        />;
      case 'notifications':
        return <NotificationsCenter
          onBack={() => navigate('home')}
          currentUser={currentUser}
          notifications={notifications}
          onMarkAsRead={(id) => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
          }}
          onMarkAllAsRead={() => {
            setNotifications(prev => prev.map(n => (n.utilisateurId === currentUser.id || n.utilisateurId === 1) ? { ...n, lu: true } : n));
          }}
          onDelete={(id) => {
            setNotifications(prev => prev.filter(n => n.id !== id));
          }}
          onNavigateToLink={(lien) => {
            if (lien) {
              if (lien.startsWith('/')) {
                const target = lien.replace('/', '');
                if (target === 'profil') navigate('user-profile');
                else if (target === 'orders') navigate('orders');
                else if (target === 'purchases') navigate('purchases');
                else if (target === 'seller-dashboard') navigate('seller-dashboard');
                else if (target === 'admin/dashboard') navigate('admin-dashboard');
                else if (target === 'admin/order-management-admin') navigate('order-management-admin');
                else if (target === 'admin/moderation-panel') navigate('moderation-panel');
                else if (target === 'admin/vendor-verification') navigate('vendor-verification');
                else navigate('home');
              } else {
                alert(`Redirection vers : ${lien}`);
              }
            }
          }}
        />;
      case 'faq':
        return <FAQPage onBack={() => navigate('home')} />;
      case 'seller-dashboard':
        return <SellerDashboard
          onNavigate={navigate}
          onLogout={handleLogout}
          currentUser={currentUser}
          vendeurProducts={vendeurProducts}
          adminOrders={adminOrders}
          activePlan={activePlan}
          onSelectPlan={(plan) => {
            const updatedUser = { ...currentUser, plan: plan.id };
            setCurrentUser(updatedUser);
            setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
            setActivePlan(plan.id);
            addNotification(1, 'info', `${currentUser.prenom} ${currentUser.nom} a changé pour le plan ${plan.name}`, '/admin/dashboard');
            addNotification(currentUser.id, 'success', `Votre abonnement ${plan.name} est désormais actif !`, '/seller-dashboard');
            alert(`✅ Abonnement ${plan.name} activé avec succès !`);
          }}
          onUpdateOrderStatus={(orderId, newStatus) => {
            setAdminOrders(prev =>
              prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
            );
            addNotification(1, 'info', `Statut de la commande #${orderId} mis à jour : ${newStatus}`, '/admin/order-management-admin');
          }}
        />;
      case 'sales-history':
        return <SalesHistory onBack={() => navigate('seller-dashboard')} />;
      case 'stock-alerts':
        return <StockAlerts onBack={() => navigate('seller-dashboard')} />;
      case 'plans':
        return <SubscriptionPlans
          onBack={() => navigate('seller-dashboard')}
          currentPlan={activePlan}
          onSelectPlan={handleSelectPlan}
        />;
      case 'certification':
        return <CertificationRequest
          currentStatus={certificationStatus}
          onBack={() => navigate('seller-dashboard')}
          onSubmit={() => setCertificationStatus('pending')}
        />;
      case 'admin-dashboard':
        return <AdminDashboard
          registeredUsers={registeredUsers}
          adminOrders={adminOrders}
          vendorVerifications={vendorVerifications}
          signalements={signalements}
          vendeurProducts={vendeurProducts}
          currentUser={currentUser}
          onNavigate={navigate}
          onLogout={handleLogout}
        />;
      case 'order-management-admin':
        return <OrderManagementAdmin
          ordersData={adminOrders}
          onViewOrder={() => navigate('order-detail-admin')}
          onBack={() => navigate('admin-dashboard')}
        />;
      case 'order-detail-admin':
        return <OrderDetailAdmin
          onBack={() => navigate('order-management-admin')}
          onMarkAsDeliveredState={(id, newStatus) => {
            setAdminOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
          }}
        />;
      case 'moderation-panel':
        return <ModerationPanel
          signalements={signalements}
          onResolve={(id) => {
            setSignalements(prev => prev.map(s => s.id === id ? { ...s, status: 'résolu' } : s));
            addNotification(1, 'info', `Signalement résolu`, '/admin/moderation-panel');
          }}
          onReject={(id) => {
            setSignalements(prev => prev.map(s => s.id === id ? { ...s, status: 'rejeté' } : s));
            addNotification(1, 'info', `Signalement rejeté`, '/admin/moderation-panel');
          }}
          onBack={() => navigate('admin-dashboard')}
        />;
      case 'vendor-verification':
        return <VendorVerificationAdmin
          pendingVerifications={vendorVerifications}
          onApprove={handleApproveVerification}
          onReject={handleRejectVerification}
          onBack={() => navigate('admin-dashboard')}
        />;
      case 'producer-profile':
        return <ProducerProfile
          producteur={selectedVendor}
          avisList={avisList}
          currentUser={currentUser}
          onSubmitAvis={handleSubmitAvis}
          onDeleteAvis={handleDeleteAvis}
          onBack={() => navigate('product-detail')}
          onContactVendor={goToMessage}
          onNavigateToLogin={() => navigate('login-page')}
          onSignalerProducteur={(motif) => requireLogin(() => handleSignalerProducteur(selectedVendor, motif))}
        />;
      case 'vendeur-orders':
        return <VendeurOrders
          orders={adminOrders}
          vendeurProducts={vendeurProducts}
          onUpdateOrderStatus={(orderId, newStatus) => {
            setAdminOrders(prev =>
              prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
            );
            addNotification(1, 'info', `Statut de la commande #${orderId} mis à jour : ${newStatus}`, '/admin/order-management-admin');
          }}
        />;
      default:
        return <AgroMarketHome
          onNavigateToProduct={goToProduct}
          onNavigateToLogin={() => navigate('login-page')}
          onNavigateToCart={() => navigate('cart')}
          onAddToCart={addToCart}
          cartCount={cartItems.length}
          activePlan={activePlan}
          onSignaler={openSignalement}
          currentUser={currentUser}
          onNavigateToProfile={() => navigate('user-profile')}
        />;
    }
  };

  return (
    <div style={styles.appWrapper}>
      <NavigationConsole
        currentScreen={screen}
        onNavigate={navigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        cartCount={cartItems.length}
        lang={lang}
        onToggleLang={toggleLang}
        notifications={notifications}
        isClientMode={isClientMode}
        onToggleClientMode={toggleClientMode}
      />
      <div style={styles.screenContainer}>{renderScreen()}</div>
      {showSignalement && (
        <SignalementModal
          product={signalementProduct}
          onClose={() => { setShowSignalement(false); setSignalementProduct(null); }}
          onSubmit={(data) => {
            const newSig = {
              id: `sig-${Date.now()}`,
              ...data,
              auteur: currentUser?.prenom || 'Client',
              date: new Date().toISOString(),
              status: 'pending',
            };
            setSignalements(prev => [...prev, newSig]);
            addNotification(1, 'error', `Nouveau signalement de ${newSig.cible} par ${newSig.auteur}`, '/admin/moderation-panel');
          }}
        />
      )}
    </div>
  );
}

const styles = {
  appWrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#f8f9fa',
  },
  screenContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
};