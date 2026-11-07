import React from 'react';
import { Listing } from '../types/marketplace';
import { formatKina } from '../utils/marketplace';
import { X, Trash2, ExternalLink, Bookmark } from 'lucide-react';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedListings: Listing[];
  onSelectListing: (listing: Listing) => void;
  onRemoveSaved: (listingId: string) => void;
  onClearAll: () => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedListings,
  onSelectListing,
  onRemoveSaved,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-bold text-base text-stone-900">
              Saved Listings ({savedListings.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedListings.length === 0 ? (
            <div className="py-16 text-center text-stone-400 space-y-2">
              <Bookmark className="w-12 h-12 stroke-[1.2] mx-auto text-stone-300" />
              <p className="text-sm font-medium text-stone-600">No saved items yet</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Click the heart icon on any vehicle, property, or gadget to save it here for later.
              </p>
            </div>
          ) : (
            savedListings.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-colors"
              >
                <img
                  src={item.images[0] || '/src/assets/images/category_cars_vehicles_1794060138397.jpg'}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 cursor-pointer"
                  onClick={() => {
                    onSelectListing(item);
                    onClose();
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => {
                      onSelectListing(item);
                      onClose();
                    }}
                    className="text-xs font-bold text-stone-900 truncate hover:text-amber-600 cursor-pointer"
                  >
                    {item.title}
                  </h4>
                  <div className="text-xs font-display font-bold text-stone-950 mt-0.5 tabular-nums">
                    {formatKina(item.price)}
                  </div>
                  <div className="text-[11px] text-stone-400 truncate mt-0.5">
                    {item.district || item.province}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onRemoveSaved(item.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedListings.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-between items-center">
            <button
              onClick={onClearAll}
              className="text-xs text-stone-500 hover:text-rose-600 underline font-medium"
            >
              Clear All Saved
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
