import React, { useState } from 'react';
import { Listing, PriceAlert, SellerReview } from '../types/marketplace';
import {
  formatKina,
  calculateSellerTrustScore,
  calculatePriceAlertSavings,
  calculateSellerAverageRating,
  getRatingStarsBreakdown,
} from '../utils/marketplace';
import { PNG_PROVINCES } from '../data/mockData';
import {
  X,
  MapPin,
  ShieldCheck,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building,
  Flag,
  Bell,
  BellRing,
  TrendingDown,
  Trash2,
  Edit3,
  Star,
  MessageSquare,
  ThumbsUp,
  UserCheck,
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (listingId: string) => void;
  onReportListing: (listingId: string, reason: string) => void;
  activeAlert?: PriceAlert;
  onSavePriceAlert?: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>) => void;
  onRemovePriceAlert?: (alertId: string) => void;
  sellerReviews?: SellerReview[];
  onAddReview?: (review: Omit<SellerReview, 'id' | 'createdAt'>) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  isSaved,
  onToggleSave,
  onReportListing,
  activeAlert,
  onSavePriceAlert,
  onRemovePriceAlert,
  sellerReviews = [],
  onAddReview,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('Suspicious pricing or advance payment requested');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Price Alert local states
  const [showPriceAlertForm, setShowPriceAlertForm] = useState(false);
  const [targetPriceInput, setTargetPriceInput] = useState<string>('');
  const [notifyContactInput, setNotifyContactInput] = useState<string>('');
  const [alertError, setAlertError] = useState<string | null>(null);

  // Review & Star-Rating local states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerProvince, setReviewerProvince] = useState<string>(
    listing ? listing.province : 'National Capital District'
  );
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isVerifiedTrade, setIsVerifiedTrade] = useState<boolean>(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  if (!listing) return null;

  const trust = calculateSellerTrustScore(listing.seller);

  // Price Alert handlers
  const handleOpenAlertForm = () => {
    if (activeAlert) {
      setTargetPriceInput(activeAlert.targetPrice.toString());
      setNotifyContactInput(activeAlert.notifyContact);
    } else {
      const suggested = Math.max(1, Math.round(listing.price * 0.9));
      setTargetPriceInput(suggested.toString());
      setNotifyContactInput('+675 7');
    }
    setAlertError(null);
    setShowPriceAlertForm(true);
  };

  const handleApplyPreset = (percent: number) => {
    const calculated = Math.max(1, Math.round(listing.price * (1 - percent / 100)));
    setTargetPriceInput(calculated.toString());
    setAlertError(null);
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = Number(targetPriceInput);
    if (isNaN(targetNum) || targetNum <= 0) {
      setAlertError('Please enter a valid target price greater than K0.');
      return;
    }
    if (targetNum >= listing.price) {
      setAlertError(`Target price must be lower than the asking price (${formatKina(listing.price)}).`);
      return;
    }
    if (!notifyContactInput || notifyContactInput.trim().length < 5) {
      setAlertError('Please enter your contact details (WhatsApp/phone or email).');
      return;
    }

    onSavePriceAlert?.({
      listingId: listing.id,
      listingTitle: listing.title,
      currentPrice: listing.price,
      targetPrice: targetNum,
      notifyContact: notifyContactInput.trim(),
    });

    setShowPriceAlertForm(false);
    setAlertError(null);
  };

  const parsedTargetPrice = Number(targetPriceInput);
  const currentSavings = calculatePriceAlertSavings(listing.price, parsedTargetPrice);

  // Review Stats & Helpers
  const activeReviews = sellerReviews ?? [];
  const ratingStats = calculateSellerAverageRating(activeReviews, listing.seller.rating);
  const ratingBreakdown = getRatingStarsBreakdown(activeReviews);

  const ratingLabels: Record<number, string> = {
    1: '1 Star — Poor experience / Caution advised',
    2: '2 Stars — Below expectations / Communication issues',
    3: '3 Stars — Average / Satisfactory deal',
    4: '4 Stars — Very good & reliable seller',
    5: '5 Stars — Excellent! Highly recommended',
  };

  const handleOpenReviewForm = () => {
    setShowReviewForm(true);
    setReviewError(null);
    setReviewSuccess(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      setReviewError('Please enter your name.');
      return;
    }
    if (!reviewComment.trim() || reviewComment.trim().length < 8) {
      setReviewError('Please write a brief comment describing your transaction experience (at least 8 characters).');
      return;
    }

    onAddReview?.({
      sellerId: listing.seller.id,
      listingId: listing.id,
      authorName: reviewerName.trim(),
      province: reviewerProvince,
      rating: ratingScore,
      comment: reviewComment.trim(),
      isVerifiedBuyer: isVerifiedTrade,
    });

    setReviewSuccess(true);
    setReviewComment('');
    setReviewError(null);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSuccess(false);
    }, 2000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    onReportListing(listing.id, reportReason);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setShowReportDialog(false);
    }, 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${listing.seller.name}, I am interested in your listing '${listing.title}' on Pawa Market for ${formatKina(listing.price)}. Is this still available?`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-800 uppercase tracking-wide">
              {listing.category.replace('-', ' ')}
            </span>
            <span aria-hidden="true">·</span>
            <span>Ref #{listing.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(listing.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
              title={isSaved ? 'Saved to favourites' : 'Save to favourites'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-white text-stone-700 border border-stone-200 hover:bg-stone-100 transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors ml-1"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Gallery & Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Gallery Image */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={
                  listing.images[selectedImageIndex] ||
                  listing.images[0] ||
                  '/src/assets/images/category_cars_vehicles_1794060138397.jpg'
                }
                alt={listing.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {listing.isFeatured && (
                <div className="absolute top-3 left-3 bg-amber-400 text-stone-950 font-extrabold text-xs px-3 py-1 rounded shadow-sm uppercase tracking-wider">
                  Featured Priority Listing
                </div>
              )}
            </div>

            {/* Thumbnail Row if multiple images */}
            {listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-amber-500 ring-2 ring-amber-500/30'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-2">
                Description & Specifications
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50 p-4 rounded-xl border border-stone-100">
                {listing.description}
              </p>
            </div>

            {/* Key Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-stone-400 block font-medium">Condition</span>
                <span className="text-stone-900 font-bold mt-0.5 block">{listing.condition}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-stone-400 block font-medium">Province</span>
                <span className="text-stone-900 font-bold mt-0.5 block">{listing.province}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-stone-400 block font-medium">District / Area</span>
                <span className="text-stone-900 font-bold mt-0.5 block">{listing.district || 'Town'}</span>
              </div>
            </div>

            {/* Seller Reviews & Buyer Feedback Section */}
            <div id="seller-feedback-section" className="border border-stone-200 rounded-2xl bg-white p-5 shadow-xs space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      <span>Seller Trust & Buyer Ratings</span>
                    </h4>
                    {listing.seller.isVerified && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified Seller
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Ratings and feedback from buyers across Papua New Guinea who traded with {listing.seller.name}.
                  </p>
                </div>

                {!showReviewForm && (
                  <button
                    type="button"
                    onClick={handleOpenReviewForm}
                    className="self-start sm:self-auto px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 active:scale-[0.98]"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Rate Seller</span>
                  </button>
                )}
              </div>

              {/* Overall Rating Scorecard */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Score Number and Stars (5 cols) */}
                <div className="sm:col-span-5 flex items-center sm:flex-col sm:items-start gap-3 sm:gap-1.5 sm:border-r sm:border-stone-200 sm:pr-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-stone-950 tabular-nums">
                      {ratingStats.average.toFixed(1)}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">/ 5.0</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5" aria-label={`${ratingStats.average} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(ratingStats.average)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-stone-200 text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1">
                      {ratingStats.count === 0
                        ? 'New verified seller'
                        : `Based on ${ratingStats.count} ${
                            ratingStats.count === 1 ? 'buyer review' : 'buyer reviews'
                          }`}
                    </div>
                  </div>
                </div>

                {/* Rating Distribution Bars (7 cols) */}
                <div className="sm:col-span-7 space-y-1 text-[11px] text-stone-600">
                  {[5, 4, 3, 2, 1].map((starNum) => {
                    const count = ratingBreakdown[starNum as 1 | 2 | 3 | 4 | 5] || 0;
                    const percent =
                      ratingStats.count > 0 ? Math.round((count / ratingStats.count) * 100) : 0;
                    return (
                      <div key={starNum} className="flex items-center gap-2">
                        <span className="w-6 font-semibold tabular-nums text-stone-700 flex items-center gap-0.5">
                          <span>{starNum}</span>
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        </span>
                        <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-6 text-right tabular-nums text-stone-400 text-[10px]">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-amber-50/50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900">
                          Rate {listing.seller.name}
                        </h5>
                        <p className="text-[11px] text-stone-500">
                          Help protect PNG buyers by giving an honest transaction rating.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="text-stone-400 hover:text-stone-600 text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  {reviewSuccess ? (
                    <div className="py-6 text-center text-emerald-700 text-xs font-semibold flex flex-col items-center gap-2 bg-emerald-50 rounded-xl border border-emerald-200 p-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                      <span>Thank you! Your feedback for {listing.seller.name} has been recorded and published.</span>
                    </div>
                  ) : (
                    <>
                      {/* Interactive Star Rating Selector */}
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1.5">
                          Your Rating
                        </label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((starValue) => {
                            const isFilled =
                              (hoverRating !== null ? hoverRating : ratingScore) >= starValue;
                            return (
                              <button
                                key={starValue}
                                type="button"
                                onClick={() => setRatingScore(starValue)}
                                onMouseEnter={() => setHoverRating(starValue)}
                                onMouseLeave={() => setHoverRating(null)}
                                className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                aria-label={`${starValue} star`}
                              >
                                <Star
                                  className={`w-7 h-7 transition-colors ${
                                    isFilled
                                      ? 'fill-amber-400 text-amber-500'
                                      : 'fill-stone-100 text-stone-300'
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                        <div className="text-xs font-medium text-amber-800 mt-1">
                          {ratingLabels[hoverRating ?? ratingScore]}
                        </div>
                      </div>

                      {/* Reviewer Details Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-semibold text-stone-700 mb-1">
                            Your Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={reviewerName}
                            onChange={(e) => {
                              setReviewerName(e.target.value);
                              setReviewError(null);
                            }}
                            placeholder="e.g. Kila Nou or Buyer Mary"
                            className="w-full px-3 py-2 text-xs text-stone-900 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-stone-700 mb-1">
                            Province / Location
                          </label>
                          <select
                            value={reviewerProvince}
                            onChange={(e) => setReviewerProvince(e.target.value)}
                            className="w-full px-3 py-2 text-xs text-stone-900 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            {PNG_PROVINCES.map((prov) => (
                              <option key={prov} value={prov}>
                                {prov}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Comment Feedback */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Comment & Experience Details <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => {
                            setReviewComment(e.target.value);
                            setReviewError(null);
                          }}
                          placeholder="Describe your trade experience: Was the seller easy to reach on WhatsApp? Was the vehicle/item accurate to the photos? Did you meet in a safe public spot?"
                          className="w-full p-3 text-xs text-stone-900 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                          required
                        />
                      </div>

                      {/* Verified Buyer Checkbox */}
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-700 select-none">
                        <input
                          type="checkbox"
                          checked={isVerifiedTrade}
                          onChange={(e) => setIsVerifiedTrade(e.target.checked)}
                          className="mt-0.5 rounded border-stone-300 text-amber-500 focus:ring-amber-400"
                        />
                        <span>
                          <strong className="text-stone-900">Direct Contact or Transaction:</strong> I
                          contacted or met this seller in person (grants a Verified Buyer badge to this review).
                        </span>
                      </label>

                      {reviewError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
                          {reviewError}
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors"
                        >
                          Submit Feedback
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3 pt-1">
                {activeReviews.length === 0 ? (
                  <div className="text-center py-6 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-300 space-y-2">
                    <MessageSquare className="w-8 h-8 text-stone-300 mx-auto" />
                    <p className="text-xs font-semibold text-stone-800">
                      No feedback recorded yet for {listing.seller.name}
                    </p>
                    <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                      Have you spoken with or bought from this seller? Share your feedback to build platform trust across PNG.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenReviewForm}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors mt-2"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span>Write the First Review</span>
                    </button>
                  </div>
                ) : (
                  activeReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl border border-stone-200 bg-white space-y-2 hover:border-stone-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center border border-stone-200 shrink-0">
                            {rev.authorName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs text-stone-900">
                                {rev.authorName}
                              </span>
                              {rev.isVerifiedBuyer && (
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.2 rounded-full border border-emerald-200 inline-flex items-center gap-0.5">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Verified Trade</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-400">
                              {rev.province || 'PNG'} ·{' '}
                              {rev.createdAt
                                ? new Date(rev.createdAt).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : 'Recent'}
                            </div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-stone-150 text-stone-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed pl-10">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Report Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowReportDialog(true)}
                className="text-xs text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report suspicious listing or fraud attempt</span>
              </button>
            </div>
          </div>

          {/* Right Column: Pricing & Contact Action (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Price Box */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                Asking Price
              </div>
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-stone-950 mt-1 tabular-nums">
                {formatKina(listing.price)}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                {listing.priceType === 'negotiable'
                  ? 'Price is negotiable with seller'
                  : 'Fixed price (Cash on collection / Direct transfer)'}
              </div>

              {/* Direct Actions */}
              <div className="mt-5 space-y-2.5">
                {/* WhatsApp Primary Button */}
                <a
                  href={`https://wa.me/${listing.seller.whatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-sm active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat on WhatsApp</span>
                </a>

                {/* Direct Phone Call Button */}
                <a
                  href={`tel:${listing.seller.phone}`}
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-sm active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call {listing.seller.phone}</span>
                </a>
              </div>

              {/* Price Alert Action & Form */}
              <div className="mt-4 pt-4 border-t border-stone-200">
                {activeAlert && !showPriceAlertForm ? (
                  <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <BellRing className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                            <span>Price Alert Active</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                              Active
                            </span>
                          </div>
                          <div className="text-xs text-amber-900 font-extrabold font-display">
                            Target: {formatKina(activeAlert.targetPrice)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleOpenAlertForm}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-amber-100 rounded-lg transition-colors"
                          title="Edit target price"
                          aria-label="Edit price alert"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {onRemovePriceAlert && (
                          <button
                            type="button"
                            onClick={() => onRemovePriceAlert(activeAlert.id)}
                            className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove price alert"
                            aria-label="Remove price alert"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-600 bg-white/80 p-2.5 rounded-lg border border-amber-200/80 leading-relaxed">
                      Triggers when price drops by{' '}
                      <span className="font-bold text-stone-900">
                        {formatKina(listing.price - activeAlert.targetPrice)}
                      </span>{' '}
                      ({Math.round(((listing.price - activeAlert.targetPrice) / listing.price) * 100)}% off). Notifying:{' '}
                      <span className="font-semibold text-stone-900">{activeAlert.notifyContact}</span>
                    </div>
                  </div>
                ) : showPriceAlertForm ? (
                  <form onSubmit={handleSaveAlert} className="bg-white rounded-xl p-3.5 border border-amber-300 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                        <Bell className="w-3.5 h-3.5 text-amber-600" />
                        <span>{activeAlert ? 'Update Price Alert' : 'Create Price Alert'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPriceAlertForm(false);
                          setAlertError(null);
                        }}
                        className="text-stone-400 hover:text-stone-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-500 leading-tight">
                      Set your target budget. We will trigger an immediate alert as soon as this item's price is reduced.
                    </p>

                    {/* Target Price input */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Target Price (PNG Kina)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs font-bold text-stone-400 select-none">
                          K
                        </span>
                        <input
                          type="number"
                          min="1"
                          max={listing.price - 1}
                          step="1"
                          value={targetPriceInput}
                          onChange={(e) => {
                            setTargetPriceInput(e.target.value);
                            setAlertError(null);
                          }}
                          placeholder="e.g. 15000"
                          className="w-full pl-8 pr-3 py-1.5 text-xs font-bold text-stone-900 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-stone-50"
                          autoFocus
                          required
                        />
                      </div>
                    </div>

                    {/* Quick percentage discount presets */}
                    <div>
                      <span className="block text-[10px] font-medium text-stone-400 mb-1">
                        Quick Discount Presets:
                      </span>
                      <div className="grid grid-cols-4 gap-1 text-[11px]">
                        {[5, 10, 15, 20].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => handleApplyPreset(pct)}
                            className="py-1 px-1 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 font-semibold rounded text-center transition-colors text-[11px]"
                          >
                            -{pct}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live savings preview */}
                    {parsedTargetPrice > 0 && parsedTargetPrice < listing.price && (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-1.5">
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          Target drop:{' '}
                          <span className="font-bold">{formatKina(currentSavings.savingsAmount)}</span> (
                          {currentSavings.savingsPercent}% savings)
                        </span>
                      </div>
                    )}

                    {/* Notification contact */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Contact Phone / WhatsApp / Email
                      </label>
                      <input
                        type="text"
                        value={notifyContactInput}
                        onChange={(e) => setNotifyContactInput(e.target.value)}
                        placeholder="+675 7... or email"
                        className="w-full px-2.5 py-1.5 text-xs text-stone-900 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50"
                        required
                      />
                    </div>

                    {alertError && (
                      <div className="text-[11px] text-rose-600 font-medium bg-rose-50 p-2 rounded-lg border border-rose-200">
                        {alertError}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPriceAlertForm(false);
                          setAlertError(null);
                        }}
                        className="w-1/3 py-2 px-3 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors text-center"
                      >
                        {activeAlert ? 'Update Alert' : 'Set Price Alert'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenAlertForm}
                    className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300/80 font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-xs active:scale-[0.98]"
                  >
                    <BellRing className="w-3.5 h-3.5 text-amber-600" />
                    <span>Create Price Alert</span>
                  </button>
                )}
              </div>
            </div>

            {/* Seller Information Card */}
            <div className="p-5 rounded-2xl border border-stone-200 bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Seller Information
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {trust.badgeLevel}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 font-display font-bold text-xl flex items-center justify-center shrink-0">
                  {listing.seller.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                    {listing.seller.name}
                    {listing.seller.isVerified && (
                      <span title="Verified Seller">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </span>
                    )}
                  </div>
                  {listing.seller.businessName && (
                    <div className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-stone-400" />
                      {listing.seller.businessName}
                    </div>
                  )}
                  <div className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    {listing.seller.location}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs text-stone-600">
                <div>
                  <span className="text-stone-400 block">Member since</span>
                  <span className="font-semibold text-stone-800">{listing.seller.joinedDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Active listings</span>
                  <span className="font-semibold text-stone-800">{listing.seller.activeAdsCount} ads</span>
                </div>
              </div>

              {/* Seller Rating & Feedback Quick Summary */}
              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
                  <span className="font-extrabold text-stone-900 font-display text-sm">
                    {ratingStats.average.toFixed(1)}
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    ({ratingStats.count} {ratingStats.count === 1 ? 'buyer review' : 'buyer reviews'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(true);
                    document.getElementById('seller-feedback-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-amber-800 hover:text-amber-950 font-bold text-[11px] underline cursor-pointer"
                >
                  Rate Seller
                </button>
              </div>
            </div>

            {/* PNG Buyer Safety Notice Box */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>PNG Safe Trading Checklist</span>
              </div>
              <ul className="space-y-1 text-stone-700 pl-5 list-disc text-[12px] leading-relaxed">
                <li>Meet the seller in a busy, public daylight area (e.g. shopping mall or bank).</li>
                <li>Inspect and verify the item completely before handing over cash or transferring funds.</li>
                <li>Never send money via mobile wallet or advance bank deposit to an unknown seller.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Report Dialog Overlay */}
        {showReportDialog && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Report Listing #{listing.id}
                </h4>
                <button
                  onClick={() => setShowReportDialog(false)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {reportSubmitted ? (
                <div className="py-6 text-center text-emerald-600 text-sm font-semibold flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8" />
                  <span>Report submitted to Pawa Market moderators. Thank you for protecting the community!</span>
                </div>
              ) : (
                <form onSubmit={handleReport} className="space-y-3">
                  <p className="text-xs text-stone-600">
                    Help us keep PNG Marketplace trustworthy. Why are you reporting this ad?
                  </p>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white"
                  >
                    <option>Suspicious pricing or advance payment requested</option>
                    <option>Stolen goods or counterfeit item</option>
                    <option>Prohibited goods policy violation</option>
                    <option>Seller unreachable or incorrect phone number</option>
                    <option>Misleading photograph or description</option>
                  </select>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReportDialog(false)}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
