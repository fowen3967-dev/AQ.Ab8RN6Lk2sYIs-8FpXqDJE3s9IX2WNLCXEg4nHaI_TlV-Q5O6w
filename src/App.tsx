import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryBar } from './components/CategoryBar';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { PostAdModal } from './components/PostAdModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { FounderSetupModal } from './components/FounderSetupModal';
import { SellerRegisterModal } from './components/SellerRegisterModal';
import { SavedDrawer } from './components/SavedDrawer';
import { PricingSection } from './components/PricingSection';
import { TrustSafetySection } from './components/TrustSafetySection';
import { Footer } from './components/Footer';
import { DownloadAppModal } from './components/DownloadAppModal';

import { INITIAL_LISTINGS, PNG_PROVINCES, CATEGORIES, INITIAL_SELLER_REVIEWS } from './data/mockData';
import { Listing, FounderSettings, PriceAlert, SellerReview } from './types/marketplace';
import { filterListings, formatKina } from './utils/marketplace';
import { SlidersHorizontal, ArrowUpDown, Sparkles, AlertCircle, CheckCircle, Plus } from 'lucide-react';

export default function App() {
  // Marketplace Listings State
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [savedIds, setSavedIds] = useState<string[]>(['pawa-101', 'pawa-103']);
  // Temporary Price Alerts state
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  // Seller Reviews & Ratings state
  const [sellerReviews, setSellerReviews] = useState<SellerReview[]>(INITIAL_SELLER_REVIEWS);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');

  // Navigation tab / view
  const [activeTab, setActiveTab] = useState<'browse' | 'pricing' | 'safety'>('browse');

  // Modals
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isPostAdOpen, setIsPostAdOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFounderOpen, setIsFounderOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerInitialPackage, setRegisterInitialPackage] = useState('free');
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Founder Settings (answers the 3 founder decisions requested in prompt)
  const [founderSettings, setFounderSettings] = useState<FounderSettings>({
    appName: 'Pawa Market',
    tagline: 'Buy. Sell. Connect. Your marketplace, everywhere in PNG.',
    launchCity: 'Port Moresby first',
    budgetTier: 'K3,000–K10,000',
    showWeeklyResearch: false,
  });

  // Filtered Listings
  const filteredListings = useMemo(() => {
    return filterListings(listings, {
      query: searchQuery,
      category: selectedCategory,
      province: selectedProvince,
      condition: selectedCondition,
      featuredOnly,
      sortBy,
    });
  }, [listings, searchQuery, selectedCategory, selectedProvince, selectedCondition, featuredOnly, sortBy]);

  // Saved Listings objects
  const savedListings = useMemo(() => {
    return listings.filter((item) => savedIds.includes(item.id));
  }, [listings, savedIds]);

  // Handlers
  const handleToggleSave = (listingId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds((prev) => {
      const exists = prev.includes(listingId);
      if (exists) {
        showToast('Removed from saved items');
        return prev.filter((id) => id !== listingId);
      } else {
        showToast('Added to saved favourites');
        return [...prev, listingId];
      }
    });
  };

  const handleQuickWhatsApp = (item: Listing, e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Hello ${item.seller.name}, I am contacting you from ${founderSettings.appName} about your listing '${item.title}' for ${formatKina(item.price)}. Is it still available?`
    );
    window.open(`https://wa.me/${item.seller.whatsapp}?text=${msg}`, '_blank');
  };

  const handleAddListing = (newListing: Listing) => {
    setListings((prev) => [newListing, ...prev]);
    showToast(`Ad "${newListing.title}" posted successfully!`);
  };

  const handleToggleApproval = (id: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isApproved: !item.isApproved } : item))
    );
    showToast('Listing approval status toggled');
  };

  const handleToggleFeatured = (id: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFeatured: !item.isFeatured } : item))
    );
    showToast('Featured priority status updated (K10 boost)');
  };

  const handleDeleteListing = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    showToast('Listing removed');
  };

  const handleToggleVerifySeller = (sellerId: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.seller.id === sellerId) {
          return {
            ...item,
            seller: {
              ...item.seller,
              isVerified: !item.seller.isVerified,
            },
          };
        }
        return item;
      })
    );
    showToast('Seller verification updated');
  };

  const handleReportListing = (listingId: string, reason: string) => {
    showToast(`Report received for listing #${listingId}. Flagged for admin review.`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProvince('all');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setFeaturedOnly(false);
  };

  const handleSelectPackageFromPricing = (pkgId: string) => {
    setRegisterInitialPackage(pkgId);
    setIsRegisterOpen(true);
  };

  const handleSavePriceAlert = (alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>) => {
    const existingIndex = priceAlerts.findIndex((a) => a.listingId === alertData.listingId);
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (existingIndex >= 0) {
      setPriceAlerts((prev) =>
        prev.map((a, idx) =>
          idx === existingIndex
            ? {
                ...a,
                ...alertData,
                createdAt: dateStr,
                isActive: true,
              }
            : a
        )
      );
      showToast(`Price alert updated to ${formatKina(alertData.targetPrice)} for ${alertData.listingTitle}`);
    } else {
      const newAlert: PriceAlert = {
        id: `alert-${Date.now()}`,
        ...alertData,
        createdAt: dateStr,
        isActive: true,
      };
      setPriceAlerts((prev) => [newAlert, ...prev]);
      showToast(`Price alert set at ${formatKina(alertData.targetPrice)}! You will be notified on price drop.`);
    }
  };

  const handleRemovePriceAlert = (alertId: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== alertId));
    showToast('Price alert removed');
  };

  const handleAddSellerReview = (newReviewData: Omit<SellerReview, 'id' | 'createdAt'>) => {
    const newRev: SellerReview = {
      id: `rev-${Date.now()}`,
      ...newReviewData,
      createdAt: new Date().toISOString(),
    };
    setSellerReviews((prev) => [newRev, ...prev]);

    // Update seller rating across listings in state
    setListings((prev) =>
      prev.map((item) => {
        if (item.seller.id === newReviewData.sellerId) {
          const sellerMatchingRevs = [newRev, ...sellerReviews.filter((r) => r.sellerId === newReviewData.sellerId)];
          const newAvg =
            Math.round(
              (sellerMatchingRevs.reduce((acc, r) => acc + r.rating, 0) / sellerMatchingRevs.length) * 10
            ) / 10;
          return {
            ...item,
            seller: {
              ...item.seller,
              rating: newAvg,
              reviewCount: sellerMatchingRevs.length,
            },
          };
        }
        return item;
      })
    );

    showToast(`Thank you ${newReviewData.authorName}! Your feedback has been published.`);
  };

  const activeAlertForSelected = selectedListing
    ? priceAlerts.find((a) => a.listingId === selectedListing.id && a.isActive)
    : undefined;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900 selection:bg-amber-300 selection:text-stone-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-stone-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar with 3-Zone Contract */}
      <Navbar
        founderSettings={founderSettings}
        onOpenFounderModal={() => setIsFounderOpen(true)}
        onOpenPostAd={() => setIsPostAdOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPricing={() => {
          setActiveTab('browse');
          setTimeout(() => {
            document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenSafety={() => {
          setActiveTab('browse');
          setTimeout(() => {
            document.getElementById('safety-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('browse');
        }}
        savedCount={savedIds.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as 'browse' | 'pricing' | 'safety')}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        founderSettings={founderSettings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        onSearchSubmit={(e) => {
          e.preventDefault();
          const target = document.getElementById('browse-results-section');
          target?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectQuickTag={(tag) => {
          if (PNG_PROVINCES.includes(tag)) {
            setSelectedProvince(tag);
          } else {
            setSearchQuery(tag);
          }
          const target = document.getElementById('browse-results-section');
          target?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Category Explorer Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          const target = document.getElementById('browse-results-section');
          target?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main id="browse-results-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Marketplace Filter Bar & Controls */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Active Filter Description */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-stone-900 font-display">
              {filteredListings.length} {filteredListings.length === 1 ? 'Advertisement' : 'Advertisements'}
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-xs text-stone-500">
              {selectedProvince === 'all' ? 'All PNG' : selectedProvince}
              {selectedCategory !== 'all' && ` · ${CATEGORIES.find((c) => c.id === selectedCategory)?.name}`}
              {searchQuery && ` · "${searchQuery}"`}
            </span>

            {(selectedCategory !== 'all' || selectedProvince !== 'all' || searchQuery || featuredOnly || selectedCondition !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-amber-600 hover:text-amber-800 ml-2 underline"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Interactive Filters & Sort Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Featured Only Toggle Button */}
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                featuredOnly
                  ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Featured Only</span>
            </button>

            {/* Condition selector */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-700 outline-none cursor-pointer"
              aria-label="Filter by condition"
            >
              <option value="all">Any Condition</option>
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Used - Good">Used - Good</option>
              <option value="For Rent">For Rent</option>
              <option value="Service">Services</option>
            </select>

            {/* Sort order selector */}
            <div className="flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-700 outline-none cursor-pointer"
                aria-label="Sort listings"
              >
                <option value="newest">Featured & Newest</option>
                <option value="popular">Most Inquired</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-stone-900">
              No matching listings found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn't find items matching your current filters. Try searching for a different keyword or province.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setIsPostAdOpen(true)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Post This Item First</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={(item) => setSelectedListing(item)}
                isSaved={savedIds.includes(listing.id)}
                onToggleSave={handleToggleSave}
                onQuickWhatsApp={handleQuickWhatsApp}
              />
            ))}
          </div>
        )}
      </main>

      {/* Pricing Packages Section (K0 / K10 / K50 / K100) */}
      <PricingSection onSelectPackage={handleSelectPackageFromPricing} />

      {/* Trust & Safety Section (5 PNG Safe Trading Rules) */}
      <TrustSafetySection />

      {/* Footer */}
      <Footer
        founderSettings={founderSettings}
        onSelectProvince={(prov) => {
          setSelectedProvince(prov);
          document.getElementById('browse-results-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          document.getElementById('browse-results-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenPricing={() => {
          document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSafety={() => {
          document.getElementById('safety-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenFounderModal={() => setIsFounderOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      {/* Listing Detail Modal */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        isSaved={selectedListing ? savedIds.includes(selectedListing.id) : false}
        onToggleSave={(id) => handleToggleSave(id)}
        onReportListing={handleReportListing}
        activeAlert={activeAlertForSelected}
        onSavePriceAlert={handleSavePriceAlert}
        onRemovePriceAlert={handleRemovePriceAlert}
        sellerReviews={selectedListing ? sellerReviews.filter((r) => r.sellerId === selectedListing.seller.id) : []}
        onAddReview={handleAddSellerReview}
      />

      {/* Post an Ad Modal */}
      <PostAdModal
        isOpen={isPostAdOpen}
        onClose={() => setIsPostAdOpen(false)}
        onAddListing={handleAddListing}
      />

      {/* Administrator Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        listings={listings}
        onToggleApproval={handleToggleApproval}
        onToggleFeatured={handleToggleFeatured}
        onDeleteListing={handleDeleteListing}
        onToggleVerifySeller={handleToggleVerifySeller}
      />

      {/* Founder Decisions Modal */}
      <FounderSetupModal
        isOpen={isFounderOpen}
        onClose={() => setIsFounderOpen(false)}
        settings={founderSettings}
        onSaveSettings={(newSettings) => {
          setFounderSettings(newSettings);
          // if launch city is port moresby or madang, set default province
          if (newSettings.launchCity.includes('Port Moresby')) {
            setSelectedProvince('National Capital District');
          } else if (newSettings.launchCity.includes('Madang')) {
            setSelectedProvince('Madang');
          } else {
            setSelectedProvince('all');
          }
          showToast(`Marketplace updated to ${newSettings.appName}!`);
        }}
      />

      {/* Seller Register Modal */}
      <SellerRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        initialPackage={registerInitialPackage}
        onRegistered={(sellerData) => {
          showToast(`Welcome ${sellerData.name}! Verified badge granted.`);
        }}
      />

      {/* Saved Listings Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedListings={savedListings}
        onSelectListing={(item) => setSelectedListing(item)}
        onRemoveSaved={(id) => handleToggleSave(id)}
        onClearAll={() => {
          setSavedIds([]);
          showToast('Saved list cleared');
        }}
      />

      {/* Download & Install App Modal */}
      <DownloadAppModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        appName={founderSettings.appName}
      />
    </div>
  );
}
