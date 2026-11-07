import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { CategoryId } from '../types/marketplace';
import { Car, Home, Smartphone, Wheat, ShoppingBag, Armchair, Wrench, Briefcase } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Car':
      return <Car className="w-5 h-5" />;
    case 'Home':
      return <Home className="w-5 h-5" />;
    case 'Smartphone':
      return <Smartphone className="w-5 h-5" />;
    case 'Wheat':
      return <Wheat className="w-5 h-5" />;
    case 'ShoppingBag':
      return <ShoppingBag className="w-5 h-5" />;
    case 'Armchair':
      return <Armchair className="w-5 h-5" />;
    case 'Wrench':
      return <Wrench className="w-5 h-5" />;
    case 'Briefcase':
      return <Briefcase className="w-5 h-5" />;
    default:
      return <ShoppingBag className="w-5 h-5" />;
  }
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories-section" className="py-8 bg-stone-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900 tracking-tight">
              Explore Categories
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Browse cars, real estate, electronics, fresh food, bilums, and trades
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
            }`}
          >
            View All Categories
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-150 text-center group border text-left ${
                  isSelected
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-100 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-800'
                  }`}
                >
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[11px] text-stone-400 mt-0.5 tabular-nums">
                  {cat.count} listings
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
