import React, { useState } from 'react';
import { Search, ShoppingBag, Leaf, ShieldCheck, Truck, Star, ArrowRight, UserPlus, PackageSearch, Menu, X, Globe } from 'lucide-react';

const translations = {
  fr: {
    navHome: 'Accueil', navCatalogue: 'Catalogue', navCategories: 'Catégories', navHow: 'Comment ça marche',
    navCart: 'Panier', navLogin: 'Connexion',
    heroTitle: 'AgroMarket', heroSubtitle: 'Connectez-vous directement aux producteurs locaux',
    pill1: 'Produits frais', pill2: 'Prix justes', pill3: 'Livraison rapide',
    heroCta: 'Commencer à acheter',
    searchPlaceholder: 'Cherchez un produit... (Banane, Tomate, Maïs...)',
    filterBtn: 'Filtrer',
    catTitle: 'Catégories populaires',
    trendTitle: 'Produits disponible',
    searchResults: 'Résultats de recherche',
    noResult: 'Aucun produit trouvé pour',
    resultCount: 'produit(s) pour',
    reset: '✕ Réinitialiser', showAll: '✕ Tout afficher',
    inStock: 'En stock', lowStock: 'Stock faible',
    addCart: 'Ajouter au panier',
    howTitle: 'Comment ça marche ?',
    step1: 'Créer un compte', step1d: '5 minutes',
    step2: 'Parcourir les produits', step2d: 'Frais & bio',
    step3: 'Commander', step3d: 'Paiement sécurisé',
    step4: 'Livraison rapide', step4d: '2-3 jours max',
    statsTitle: 'Rejoignez des milliers de clients heureux',
    stat1: 'Utilisateurs actifs', stat2: 'Producteurs vérifiés', stat3: 'Produits disponibles', stat4: 'Commandes livrées',
    testiTitle: 'Ce que disent nos clients',
    prefooterTitle: 'Prêt à commencer ? Inscrivez-vous gratuitement ou connectez-vous',
    prefooterBtn: 'Se connecter',
    footerTagline: 'La plateforme de marché agricole local',
    footerFollow: 'Nous suivre :',
    catSelected: '✓ Sélectionné',
    catLegumes: 'Légumes', catFruits: 'Fruits', catViande: 'Viande & Volaille', catLait: 'Produits Laitiers', catPoisson: 'Poisson & Fruits de Mer',
    emptyMsg: 'Aucun produit dans cette catégorie.',
    seeAll: 'Voir tous les produits',
    monEspace: 'Mon espace',
    deconnexion: 'Déconnexion',
  },
  en: {
    navHome: 'Home', navCatalogue: 'Catalogue', navCategories: 'Categories', navHow: 'How it works',
    navCart: 'Cart', navLogin: 'Login',
    heroTitle: 'AgroMarket', heroSubtitle: 'Connect directly with local producers',
    pill1: 'Fresh products', pill2: 'Fair prices', pill3: 'Fast delivery',
    heroCta: 'Start shopping',
    searchPlaceholder: 'Search a product... (Banana, Tomato, Corn...)',
    filterBtn: 'Filter',
    catTitle: 'Popular categories',
    trendTitle: 'Trending now',
    searchResults: 'Search results',
    noResult: 'No product found for',
    resultCount: 'product(s) for',
    reset: '✕ Reset', showAll: '✕ Show all',
    inStock: 'In stock', lowStock: 'Low stock',
    addCart: 'Add to cart',
    howTitle: 'How it works?',
    step1: 'Create an account', step1d: '5 minutes',
    step2: 'Browse products', step2d: 'Fresh & organic',
    step3: 'Order', step3d: 'Secure payment',
    step4: 'Fast delivery', step4d: '2-3 days max',
    statsTitle: 'Join thousands of happy customers',
    stat1: 'Active users', stat2: 'Verified producers', stat3: 'Available products', stat4: 'Delivered orders',
    testiTitle: 'What our clients say',
    prefooterTitle: 'Ready to start? Sign up for free or log in',
    prefooterBtn: 'Login',
    footerTagline: 'The local agricultural marketplace platform',
    footerFollow: 'Follow us:',
    catSelected: '✓ Selected',
    catLegumes: 'Vegetables', catFruits: 'Fruits', catViande: 'Meat & Poultry', catLait: 'Dairy Products', catPoisson: 'Fish & Seafood',
    emptyMsg: 'No products in this category.',
    seeAll: 'See all products',
    monEspace: 'My space',
    deconnexion: 'Logout',
  }
};

export default function AgroMarketHome({
  onNavigateToProduct,
  onNavigateToLogin,
  onNavigateToCart,
  onNavigateToOrders,
  onNavigateToRecovery,
  onNavigateToCheckout,
  onNavigateToRegister,
  onNavigateToFAQ,
  onAddToCart,
  onSignaler,
  onNavigateToProfile,
  onLogout,
  cartCount = 0,
  activePlan,
  currentUser,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('fr');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const t = translations[lang];

  const categories = [
    { id: 1, name: t.catLegumes, count: '250+ produits', image: '/image/carotte.jpg', color: '#e9f5ee', keywords: ['légume', 'tomate', 'maïs', 'vegetable', 'tomato', 'corn'] },
    { id: 2, name: t.catFruits, count: '180+ produits', image: '/image/ananas.jpg', color: '#fff3e0', keywords: ['fruit', 'banane', 'banana', 'ananas'] },
    { id: 3, name: t.catViande, count: '120+ produits', image: '/image/viande.jpg', color: '#fbe9e7', keywords: ['viande', 'volaille', 'poulet', 'meat', 'chicken'] },
    { id: 4, name: t.catLait, count: '85+ produits', image: '/image/lait_de_vache.jpg', color: '#e3f2fd', keywords: ['lait', 'miel', 'milk', 'honey'] },
    { id: 5, name: t.catPoisson, count: '60+ produits', image: '/image/poisson_frais.jpg', color: '#e8f4fd', keywords: ['poisson', 'crabe', 'fish', 'seafood'] },
  ];

  const trendingProducts = [
    { id: 1,  name: 'Ail Frais',       farm: 'Ferme Dschang',     price: 500,  image: '/image/ails.jpg',            stock: true,  category: 1, cat: t.catLegumes },
    { id: 2,  name: 'Ananas Frais',    farm: 'Plantation Ouest',  price: 2000, image: '/image/ananas.jpg',          stock: true,  category: 2, cat: t.catFruits },
    { id: 3,  name: 'Banane Fraîche',  farm: 'Ferme Premium',     price: 2500, image: '/image/banane.jpg',          stock: true,  category: 2, cat: t.catFruits },
    { id: 4,  name: 'Carotte Bio',     farm: 'Organic Farm',      price: 800,  image: '/image/carotte.jpg',         stock: true,  category: 1, cat: t.catLegumes },
    { id: 5,  name: 'Choux Frais',     farm: 'Ferme Soleil',      price: 600,  image: '/image/choux.jpg',           stock: true,  category: 1, cat: t.catLegumes },
    { id: 6,  name: 'Concombre',       farm: 'Ferme Verte',       price: 500,  image: '/image/comcombre.jpg',       stock: true,  category: 1, cat: t.catLegumes },
    { id: 7,  name: 'Crabe Frais',     farm: 'Pêcherie Locale',   price: 3500, image: '/image/crabe_frais.jpg',     stock: true,  category: 5, cat: t.catPoisson },
    { id: 8,  name: 'Gingembre',       farm: 'Ferme Bio',         price: 1000, image: '/image/djindjinbres.jpg',    stock: true,  category: 1, cat: t.catLegumes },
    { id: 9,  name: 'Fraise',          farm: 'Ferme Premium',     price: 3000, image: '/image/fraise.jpg',          stock: false, category: 2, cat: t.catFruits },
    { id: 10, name: 'Gombo Frais',     farm: 'Ferme Dschang',     price: 1200, image: '/image/gombos.jpg',          stock: true,  category: 1, cat: t.catLegumes },
    { id: 11, name: 'Lait de Vache',   farm: 'Élevage Local',     price: 800,  image: '/image/lait_de_vache.jpg',   stock: true,  category: 4, cat: t.catLait },
    { id: 12, name: 'Maïs Premium',    farm: 'Ferme Soleil',      price: 3000, image: '/image/mais.jpg',            stock: true,  category: 1, cat: t.catLegumes },
    { id: 13, name: 'Manioc Frais',    farm: 'Plantation Ouest',  price: 1500, image: '/image/manoic.jpg',          stock: true,  category: 1, cat: t.catLegumes },
    { id: 14, name: 'Miel Pur',        farm: 'Apiculteur Local',  price: 5000, image: '/image/miel.jpg',            stock: true,  category: 4, cat: t.catLait },
    { id: 15, name: 'Aubergine',       farm: 'Ferme Bio',         price: 700,  image: '/image/obergine.jpg',        stock: true,  category: 1, cat: t.catLegumes },
    { id: 16, name: 'Oignons Frais',   farm: 'Ferme Dschang',     price: 600,  image: '/image/oignons.jpg',         stock: true,  category: 1, cat: t.catLegumes },
    { id: 17, name: 'Piment Rouge',    farm: 'Ferme Moussa',      price: 800,  image: '/image/piment.jpg',          stock: true,  category: 1, cat: t.catLegumes },
    { id: 18, name: 'Poireau',         farm: 'Ferme Verte',       price: 900,  image: '/image/poiro (2).jpg',       stock: false, category: 1, cat: t.catLegumes },
    { id: 19, name: 'Poisson Frais',   farm: 'Pêcherie Locale',   price: 4000, image: '/image/poisson_frais.jpg',   stock: true,  category: 5, cat: t.catPoisson },
    { id: 20, name: 'Poivron',         farm: 'Organic Farm',      price: 1000, image: '/image/poivron.jpg',         stock: true,  category: 1, cat: t.catLegumes },
    { id: 21, name: 'Pomme France',    farm: 'Import Premium',    price: 2500, image: '/image/pomme_de_france.jpg', stock: true,  category: 2, cat: t.catFruits },
    { id: 22, name: 'Pomme de Terre',  farm: 'Ferme Soleil',      price: 1200, image: '/image/pomme_de_terre.jpg',  stock: true,  category: 1, cat: t.catLegumes },
    { id: 23, name: 'Poulet Fermier',  farm: 'Élevage Bio',       price: 4500, image: '/image/poulet.jpg',          stock: true,  category: 3, cat: t.catViande },
    { id: 24, name: 'Prune',           farm: 'Ferme Premium',     price: 1500, image: '/image/prune.jpg',           stock: true,  category: 2, cat: t.catFruits },
    { id: 25, name: 'Tomate Bio',      farm: 'Organic Farm',      price: 1500, image: '/image/tomate.jpg',          stock: true,  category: 1, cat: t.catLegumes },
    { id: 26, name: 'Tournesol',       farm: 'Ferme Soleil',      price: 2000, image: '/image/tourne_sol.jpg',      stock: false, category: 2, cat: t.catFruits },
    { id: 27, name: 'Viande Fraîche',  farm: 'Boucherie Locale',  price: 6000, image: '/image/viande.jpg',          stock: true,  category: 3, cat: t.catViande },
  ];

  const handleFilter = () => {
    setActiveCategory(null);
    if (!searchQuery.trim()) { setFilteredProducts(null); return; }
    const query = searchQuery.toLowerCase();
    setFilteredProducts(trendingProducts.filter(p =>
      p.name.toLowerCase().includes(query) || p.farm.toLowerCase().includes(query)
    ));
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleFilter(); };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') setFilteredProducts(null);
  };

  const handleCategoryClick = (cat) => {
    if (activeCategory === cat.id) {
      setActiveCategory(null);
      setFilteredProducts(null);
    } else {
      setActiveCategory(cat.id);
      setFilteredProducts(trendingProducts.filter(p => p.category === cat.id));
      setSearchQuery('');
      setTimeout(() => document.getElementById('produits')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleReset = () => { setFilteredProducts(null); setSearchQuery(''); setActiveCategory(null); };

  const displayedProducts = filteredProducts !== null ? filteredProducts : trendingProducts;
  const activeCatName = categories.find(c => c.id === activeCategory)?.name;

  // Initiale de l'utilisateur connecté
  const userInitiale = currentUser?.prenom?.charAt(0).toUpperCase() || '?';

  return (
    <div style={styles.pageWrapper}>

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navInner}>
          <h2 style={styles.navLogo}>🌿 AgroMarket</h2>
          <div style={styles.navLinks}>
            <a href="#" style={styles.navLink}>{t.navHome}</a>
            <a href="#produits" style={styles.navLink}>{t.navCatalogue}</a>
            <a href="#categories" style={styles.navLink}>{t.navCategories}</a>
            <a href="#comment" style={styles.navLink}>{t.navHow}</a>
          </div>

          <div style={styles.navActions}>
            {/* Bouton langue */}
            <button style={styles.langBtn} onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
              <Globe size={14} />
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* Panier */}
            <button style={styles.navCartBtn} onClick={onNavigateToCart}>
              <ShoppingBag size={16} />
              {t.navCart}
              {cartCount > 0 && (
                <span style={styles.cartBadge}>{cartCount}</span>
              )}
            </button>

            {/* ===== AFFICHAGE SELON CONNEXION ===== */}
            {currentUser ? (
              // ✅ UTILISATEUR CONNECTÉ — affiche avatar + menu
              <div style={styles.userMenuWrapper}>
                <button
                  style={styles.userBtn}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span style={styles.userAvatar}>{userInitiale}</span>
                  <span style={styles.userName}>{currentUser.prenom}</span>
                  <span style={styles.userChevron}>{userMenuOpen ? '▲' : '▼'}</span>
                </button>

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div style={styles.userDropdown}>
                    <div style={styles.userDropdownHeader}>
                      <strong>{currentUser.prenom} {currentUser.nom}</strong>
                      <span style={styles.userRoleBadge}>
                        {currentUser.role === 'client' ? '🛒 Client' : '🌾 Vendeur'}
                      </span>
                    </div>
                    <div style={styles.userDropdownDivider} />
                    <button
                      style={styles.userDropdownItem}
                      onClick={() => { setUserMenuOpen(false); onNavigateToProfile && onNavigateToProfile(); }}
                    >
                      👤 {t.monEspace}
                    </button>
                    {currentUser.role === 'vendeur' && (
                      <button
                        style={styles.userDropdownItem}
                        onClick={() => { setUserMenuOpen(false); }}
                      >
                        🌾 Mes produits
                      </button>
                    )}
                    <div style={styles.userDropdownDivider} />
                    <button
                      style={{ ...styles.userDropdownItem, color: '#e07a5f' }}
                      onClick={() => { setUserMenuOpen(false); onLogout && onLogout(); }}
                    >
                      🚪 {t.deconnexion}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // ❌ NON CONNECTÉ — affiche bouton Connexion
              <button style={styles.navLoginBtn} onClick={onNavigateToLogin}>
                {t.navLogin}
              </button>
            )}
          </div>

          <button style={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div style={styles.mobileMenu}>
            <a href="#" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.navHome}</a>
            <a href="#produits" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.navCatalogue}</a>
            <a href="#categories" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.navCategories}</a>
            <a href="#comment" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.navHow}</a>
            <button style={styles.langBtnMobile} onClick={() => { setLang(lang === 'fr' ? 'en' : 'fr'); setMenuOpen(false); }}>
              🌐 {lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
            </button>
            <button style={styles.mobileBtn} onClick={() => { setMenuOpen(false); onNavigateToCart && onNavigateToCart(); }}>
              🛒 {t.navCart} {cartCount > 0 && `(${cartCount})`}
            </button>
            {currentUser ? (
              <>
                <button style={styles.mobileBtnGreen} onClick={() => { setMenuOpen(false); onNavigateToProfile && onNavigateToProfile(); }}>
                  👤 {currentUser.prenom} — {t.monEspace}
                </button>
                <button style={{ ...styles.mobileBtn, color: '#e07a5f' }} onClick={() => { setMenuOpen(false); onLogout && onLogout(); }}>
                  🚪 {t.deconnexion}
                </button>
              </>
            ) : (
              <button style={styles.mobileBtnGreen} onClick={() => { setMenuOpen(false); onNavigateToLogin(); }}>
                {t.navLogin}
              </button>
            )}
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>{t.heroTitle}</h1>
          <p style={styles.heroSubtitle}>{t.heroSubtitle}</p>
          <div style={styles.heroPills}>
            <span style={styles.heroPill}><Leaf size={14} /> {t.pill1}</span>
            <span style={styles.heroPill}><ShieldCheck size={14} /> {t.pill2}</span>
            <span style={styles.heroPill}><Truck size={14} /> {t.pill3}</span>
          </div>
          <button style={styles.heroCta} onClick={() => document.getElementById('produits')?.scrollIntoView({ behavior: 'smooth' })}>
            {t.heroCta} <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* BARRE DE RECHERCHE */}
      <div style={styles.searchContainer}>
        <div style={styles.searchWrap}>
          <Search size={22} color="#6c757d" style={styles.searchIcon} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            style={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <button style={styles.searchBtn} onClick={handleFilter}>{t.filterBtn}</button>
        </div>
        {filteredProducts !== null && filteredProducts.length === 0 && (
          <div style={styles.noResult}>{t.noResult} "<strong>{searchQuery}</strong>"</div>
        )}
        {filteredProducts !== null && filteredProducts.length > 0 && !activeCategory && (
          <div style={styles.resultInfo}>
            {filteredProducts.length} {t.resultCount} "<strong>{searchQuery}</strong>"
            <button style={styles.resetBtn} onClick={handleReset}>{t.reset}</button>
          </div>
        )}
      </div>

      <div style={styles.container}>

        {/* CATEGORIES */}
        <div style={styles.section} id="categories">
          <h2 style={styles.sectionTitle}>{t.catTitle}</h2>
          <div style={styles.categoryGrid}>
            {categories.map(cat => (
              <div
                key={cat.id}
                style={{
                  ...styles.categoryCard,
                  backgroundColor: cat.color,
                  border: activeCategory === cat.id ? '2px solid #2d6a4f' : '2px solid transparent',
                  transform: activeCategory === cat.id ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: activeCategory === cat.id ? '0 8px 24px rgba(45,106,79,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => handleCategoryClick(cat)}
              >
                <div style={styles.catImgWrap}>
                  <img src={cat.image} alt={cat.name} style={styles.catImg} />
                </div>
                <h3 style={styles.catName}>{cat.name}</h3>
                <span style={styles.catCount}>{cat.count}</span>
                {activeCategory === cat.id && (
                  <span style={styles.catActive}>{t.catSelected}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PRODUITS */}
        <div style={styles.section} id="produits">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              {activeCategory ? activeCatName : filteredProducts !== null ? t.searchResults : t.trendTitle}
            </h2>
            {(activeCategory || filteredProducts !== null) && (
              <button style={styles.resetBtn} onClick={handleReset}>{t.showAll}</button>
            )}
          </div>

          {displayedProducts.length > 0 ? (
            <div style={styles.productGrid}>
              {displayedProducts.map(prod => (
                <div key={prod.id} style={styles.productCard} onClick={() => onNavigateToProduct(prod)}>
                  <div style={styles.productImageWrap}>
                    <img src={prod.image} alt={prod.name} style={styles.productImg} />
                    <span style={styles.catBadge}>{prod.cat}</span>
                    {!prod.stock && <span style={styles.lowStockBadge}>{t.lowStock}</span>}
                  </div>
                  <div style={styles.productInfo}>
                    <div style={styles.prodHeaderRow}>
                      <h3 style={styles.prodName}>{prod.name}</h3>
                      <span style={styles.prodPrice}>{prod.price.toLocaleString()} FCFA</span>
                    </div>
                    <p style={styles.prodFarm}>{prod.farm}</p>
                    <div style={styles.prodFooter}>
                      <div style={styles.stars}>
                        {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#f5b041" color="#f5b041" />)}
                      </div>
                      <span style={{
                        ...styles.stockBadge,
                        color: prod.stock ? '#2d6a4f' : '#e07a5f',
                        backgroundColor: prod.stock ? '#e9f5ee' : '#fdf1ed'
                      }}>
                        {prod.stock ? t.inStock : t.lowStock}
                      </span>
                    </div>
                    <button
                      style={styles.addToCartBtn}
                      onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(prod); }}
                    >
                      <ShoppingBag size={14} /> {t.addCart}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <span style={{fontSize: '48px'}}>🔍</span>
              <p>{t.emptyMsg}</p>
              <button style={styles.resetBtn} onClick={handleReset}>{t.seeAll}</button>
            </div>
          )}
        </div>

        {/* COMMENT CA MARCHE */}
        <div style={styles.section} id="comment">
          <h2 style={styles.sectionTitle}>{t.howTitle}</h2>
          <div style={styles.stepsGrid}>
            {[
              { icon: <UserPlus size={28} />, title: t.step1, desc: t.step1d },
              { icon: <PackageSearch size={28} />, title: t.step2, desc: t.step2d },
              { icon: <ShoppingBag size={28} />, title: t.step3, desc: t.step3d },
              { icon: <Truck size={28} />, title: t.step4, desc: t.step4d }
            ].map((step, i) => (
              <div key={i} style={styles.stepCard}>
                <div style={styles.stepNumber}>{i + 1}</div>
                <div style={styles.stepIconWrap}>{step.icon}</div>
                <h4 style={styles.stepTitle}>{step.title}</h4>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{t.statsTitle}</h2>
          <div style={styles.statsGrid}>
            {[
              { num: '5,000+', label: t.stat1 },
              { num: '500+', label: t.stat2 },
              { num: '10,000+', label: t.stat3 },
              { num: '50,000+', label: t.stat4 }
            ].map((stat, i) => (
              <div key={i} style={styles.statCard}>
                <h3 style={styles.statNum}>{stat.num}</h3>
                <p style={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TEMOIGNAGES */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{t.testiTitle}</h2>
          <div style={styles.testimonialGrid}>
            {[
              { name: 'Ravie D.', text: '"Produits très frais et livraison ultra-rapide ! Je recommande à 100%."' },
              { name: 'Farmer X', text: '"Plateforme fiable qui me permet de vendre à des prix équitables sans intermédiaire."' },
              { name: 'Client Y', text: '"Le meilleur rapport qualité/prix par rapport au marché local."' }
            ].map((testi, i) => (
              <div key={i} style={styles.testimonialCard}>
                <div style={{display:'flex', gap:'2px', marginBottom:'12px'}}>
                  {[1,2,3,4,5].map(j => <Star key={j} size={14} fill="#f5b041" color="#f5b041" />)}
                </div>
                <p style={styles.testiText}>{testi.text}</p>
                <h4 style={styles.testiName}>{testi.name}</h4>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PRE-FOOTER — masqué si connecté */}
      {!currentUser && (
        <div style={styles.preFooter}>
          <h2 style={styles.preFooterTitle}>{t.prefooterTitle}</h2>
          <button style={styles.preFooterBtn} onClick={onNavigateToLogin}>{t.prefooterBtn}</button>
        </div>
      )}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <h2 style={styles.footerBrand}>🌿 AgroMarket</h2>
          <p style={styles.footerTagline}>{t.footerTagline}</p>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>{t.navHome}</a>
            <a href="#produits" style={styles.footerLink}>{t.navCatalogue}</a>
            <a href="#categories" style={styles.footerLink}>{t.navCategories}</a>
            <a href="#comment" style={styles.footerLink}>{t.navHow}</a>
            {!currentUser && (
              <a href="#" style={styles.footerLink} onClick={onNavigateToLogin}>{t.navLogin}</a>
            )}
          </div>
          <div style={styles.footerSocials}>
            <span style={styles.socialText}>{t.footerFollow}</span>
            <div style={styles.socialIcons}>
              <a href="#" style={styles.socialLink}>Facebook</a>
              <a href="#" style={styles.socialLink}>Twitter</a>
              <a href="#" style={styles.socialLink}>Instagram</a>
              <a href="#" style={styles.socialLink}>WhatsApp</a>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p>© 2026 AgroMarket. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  pageWrapper: { backgroundColor: '#f8f9fa', minHeight: '100vh', width: '100%', fontFamily: "'Plus Jakarta Sans', sans-serif" },

  // NAVBAR
  navbar: { backgroundColor: '#ffffff', borderBottom: '1px solid #e9ecef', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  navInner: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLogo: { fontSize: '22px', fontWeight: '900', color: '#1b4d3e', margin: 0 },
  navLinks: { display: 'flex', gap: '32px' },
  navLink: { color: '#495057', textDecoration: 'none', fontSize: '15px', fontWeight: '600' },
  navActions: { display: 'flex', gap: '10px', alignItems: 'center' },
  langBtn: { display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 14px', backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  navCartBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#e9f5ee', color: '#2d6a4f', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', position: 'relative' },
  cartBadge: { backgroundColor: '#e07a5f', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navLoginBtn: { padding: '8px 18px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },

  // USER MENU (connecté)
  userMenuWrapper: { position: 'relative' },
  userBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', backgroundColor: '#e9f5ee', color: '#1b4d3e', border: '1.5px solid #b7e4c7', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  userAvatar: { width: '28px', height: '28px', backgroundColor: '#2d6a4f', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800' },
  userName: { maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userChevron: { fontSize: '10px', color: '#2d6a4f' },
  userDropdown: { position: 'absolute', top: 'calc(100% + 10px)', right: 0, backgroundColor: '#ffffff', border: '1px solid #e9ecef', borderRadius: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', minWidth: '220px', zIndex: 200, overflow: 'hidden' },
  userDropdownHeader: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#f8f9fa' },
  userRoleBadge: { fontSize: '12px', fontWeight: '700', color: '#2d6a4f', backgroundColor: '#e9f5ee', padding: '3px 10px', borderRadius: '20px', alignSelf: 'flex-start' },
  userDropdownDivider: { height: '1px', backgroundColor: '#e9ecef' },
  userDropdownItem: { width: '100%', padding: '12px 16px', backgroundColor: 'transparent', border: 'none', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#212529', cursor: 'pointer' },

  burger: { display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#212529' },
  mobileMenu: { display: 'flex', flexDirection: 'column', padding: '16px 24px', gap: '12px', borderTop: '1px solid #e9ecef', backgroundColor: '#ffffff' },
  mobileLink: { color: '#495057', textDecoration: 'none', fontSize: '16px', fontWeight: '600', padding: '8px 0' },
  langBtnMobile: { padding: '12px', backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  mobileBtn: { padding: '12px', backgroundColor: '#e9f5ee', color: '#2d6a4f', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  mobileBtnGreen: { padding: '12px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },

  // HERO
  heroSection: { position: 'relative', minHeight: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: "url('/image/marche.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' },
  heroOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(27, 77, 62, 0.72)', zIndex: 1 },
  heroContent: { position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto', padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  heroTitle: { fontSize: '56px', fontWeight: '900', color: '#ffffff', margin: '0 0 16px 0', letterSpacing: '-0.03em' },
  heroSubtitle: { fontSize: '20px', color: 'rgba(255,255,255,0.92)', margin: '0 0 32px 0', fontWeight: '500' },
  heroPills: { display: 'flex', gap: '16px', marginBottom: '48px', flexWrap: 'wrap', justifyContent: 'center' },
  heroPill: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: '20px', color: 'white', fontSize: '14px', fontWeight: '600' },
  heroCta: { padding: '16px 36px', backgroundColor: '#e07a5f', color: 'white', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 12px 32px rgba(224,122,95,0.4)' },

  // SEARCH
  searchContainer: { maxWidth: '1000px', margin: '-40px auto 0', padding: '0 24px', position: 'relative', zIndex: 20 },
  searchWrap: { display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', padding: '12px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #e9ecef' },
  searchIcon: { margin: '0 16px' },
  searchInput: { flex: 1, border: 'none', fontSize: '16px', padding: '12px 0', outline: 'none', color: '#212529', fontWeight: '500' },
  searchBtn: { padding: '14px 28px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  noResult: { marginTop: '12px', padding: '12px 20px', backgroundColor: '#fdf1ed', color: '#e07a5f', borderRadius: '12px', fontSize: '14px', fontWeight: '600' },
  resultInfo: { marginTop: '12px', padding: '12px 20px', backgroundColor: '#e9f5ee', color: '#2d6a4f', borderRadius: '12px', fontSize: '14px', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  resetBtn: { background: 'none', border: '1px solid #2d6a4f', color: '#2d6a4f', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },

  container: { maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', display: 'flex', flexDirection: 'column', gap: '80px' },
  section: {},
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  sectionTitle: { fontSize: '28px', fontWeight: '800', color: '#212529', margin: '0', letterSpacing: '-0.02em' },

  // CATEGORIES
  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' },
  categoryCard: { padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer' },
  catImgWrap: { width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
  catImg: { width: '100%', height: '100%', objectFit: 'cover' },
  catName: { fontSize: '18px', fontWeight: '800', color: '#212529', margin: '0 0 6px 0' },
  catCount: { fontSize: '14px', color: '#6c757d', fontWeight: '600' },
  catActive: { marginTop: '10px', fontSize: '12px', fontWeight: '700', color: '#2d6a4f', backgroundColor: '#ffffff', padding: '4px 12px', borderRadius: '20px' },

  // PRODUITS
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' },
  productCard: { backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e9ecef', boxShadow: '0 12px 36px rgba(0,0,0,0.04)', cursor: 'pointer' },
  productImageWrap: { height: '200px', overflow: 'hidden', position: 'relative', borderBottom: '1px solid #e9ecef' },
  productImg: { width: '100%', height: '100%', objectFit: 'cover' },
  catBadge: { position: 'absolute', top: '12px', left: '12px', backgroundColor: '#2d6a4f', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' },
  lowStockBadge: { position: 'absolute', top: '12px', right: '12px', backgroundColor: '#e07a5f', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' },
  productInfo: { padding: '20px' },
  prodHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  prodName: { fontSize: '17px', fontWeight: '800', color: '#212529', margin: 0 },
  prodPrice: { fontSize: '15px', fontWeight: '800', color: '#e07a5f' },
  prodFarm: { fontSize: '13px', color: '#6c757d', margin: '0 0 12px 0', fontWeight: '500' },
  prodFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px dashed #dee2e6', marginBottom: '14px' },
  stars: { display: 'flex', gap: '2px' },
  stockBadge: { fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px' },
  addToCartBtn: { width: '100%', padding: '10px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  emptyState: { textAlign: 'center', padding: '60px 24px', color: '#6c757d', fontSize: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },

  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' },
  stepCard: { backgroundColor: '#ffffff', padding: '32px 24px', borderRadius: '24px', border: '1px solid #e9ecef', textAlign: 'center', position: 'relative', boxShadow: '0 8px 24px rgba(0,0,0,0.02)' },
  stepNumber: { position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', width: '32px', height: '32px', backgroundColor: '#2d6a4f', color: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800' },
  stepIconWrap: { width: '64px', height: '64px', backgroundColor: '#e9f5ee', color: '#1b4d3e', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '16px auto 20px' },
  stepTitle: { fontSize: '17px', fontWeight: '800', color: '#212529', margin: '0 0 8px 0' },
  stepDesc: { fontSize: '14px', color: '#6c757d', margin: 0 },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' },
  statCard: { backgroundColor: '#e9f5ee', padding: '32px 24px', borderRadius: '24px', textAlign: 'center', border: '1px solid #b7e4c7' },
  statNum: { fontSize: '32px', fontWeight: '900', color: '#1b4d3e', margin: '0 0 8px 0' },
  statLabel: { fontSize: '15px', fontWeight: '600', color: '#2d6a4f', margin: 0 },

  testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' },
  testimonialCard: { backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px', border: '1px solid #e9ecef', boxShadow: '0 12px 36px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  testiText: { fontSize: '15px', color: '#495057', lineHeight: '1.6', fontStyle: 'italic', margin: '0 0 20px 0' },
  testiName: { fontSize: '15px', fontWeight: '800', color: '#212529', margin: 0 },

  preFooter: { backgroundColor: '#e07a5f', padding: '60px 24px', textAlign: 'center', color: '#ffffff' },
  preFooterTitle: { fontSize: '24px', fontWeight: '800', margin: '0 0 32px 0' },
  preFooterBtn: { padding: '16px 40px', backgroundColor: '#ffffff', color: '#e07a5f', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '800', cursor: 'pointer' },

  footer: { backgroundColor: '#1b4d3e', padding: '80px 24px 40px', color: 'rgba(255,255,255,0.8)' },
  footerInner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '40px' },
  footerBrand: { fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 },
  footerTagline: { fontSize: '16px', margin: 0 },
  footerLinks: { display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' },
  footerLink: { color: '#ffffff', textDecoration: 'none', fontSize: '15px', fontWeight: '600' },
  footerSocials: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  socialText: { fontSize: '14px', fontWeight: '600' },
  socialIcons: { display: 'flex', gap: '20px' },
  socialLink: { color: '#b7e4c7', textDecoration: 'none', fontSize: '14px' },
  footerBottom: { paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%', fontSize: '13px' },
};