import React from 'react';
import { Listing } from '../types/marketplace';
import { formatKina } from '../utils/marketplace';
import { MapPin, ShieldCheck, Heart, MessageCircle } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  isSaved: boolean;
  onToggleSave: (listingId: string, e: React.MouseEvent) => void;
  onQuickWhatsApp: (listing: Listing, e: React.MouseEvent) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSelect,
  isSaved,
  onToggleSave,
  onQuickWhatsApp,
}) => {
  return (
    <article
      onClick={() => onSelect(listing)}
      className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Product Image Slot with Fallback */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={listing.images[0] || '/src/assets/images/category_cars_vehicles_1794060138397.jpg'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // graceful fallback
            (e.target as HTMLImageElement).src =
              '/src/assets/images/hero_png_marketplace_1794060138177.jpg';
          }}
        />

        {/* Priority Featured Indicator - Clean, disciplined */}
        {listing.isFeatured && (
          <div className="absolute top-2.5 left-2.5 bg-amber-400 text-stone-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
            Featured
          </div>
        )}

        {/* Save button */}
        <button
          onClick={(e) => onToggleSave(listing.id, e)}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition-colors ${
            isSaved
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-stone-900/60 text-white hover:bg-stone-900/90'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
          title="Save listing"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Condition tag */}
        <div className="absolute bottom-2.5 left-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
          {listing.condition}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Dot Separator */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            <span className="flex items-center gap-1 font-medium text-stone-600 truncate max-w-[160px]">
              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
              {listing.district || listing.province}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{listing.province}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-stone-900 text-sm sm:text-base line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
            {listing.title}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="font-display font-bold text-lg text-stone-950 tabular-nums">
              {formatKina(listing.price)}
            </div>
            {listing.priceType === 'negotiable' && (
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Negotiable</span>
            )}
          </div>

          {/* Seller / Contact Action */}
          <div className="flex items-center gap-2">
            {listing.seller.isVerified && (
              <span
                title="Verified Seller by Phone/ID"
                className="flex items-center text-amber-700 text-xs font-medium"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
              </span>
            )}

            <button
              onClick={(e) => onQuickWhatsApp(listing, e)}
              className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors flex items-center gap-1"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
