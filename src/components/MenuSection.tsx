import React, { useState, useMemo, useRef } from 'react';
import {
  Edit3,
  Plus,
  RotateCcw,
  Check,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Search,
  X,
  Utensils,
  Coffee,
  SlidersHorizontal,
} from 'lucide-react';
import {
  MENU_CATEGORIES,
  BEVERAGE_CATEGORIES,
  MenuCategory,
  MenuItem,
  CAFE_IMAGES,
} from '../data/cafeData';
import { SmartImage } from './SmartImage';

interface MenuSectionProps {
  items: MenuItem[];
  onUpdateItems: (items: MenuItem[]) => void;
  onResetItems: () => void;
  selectedItemIds: string[];
  onToggleSelectItem: (id: string) => void;
  onNavigateToContact: () => void;
}

const PHOTO_PRESETS = [
  { label: 'No Photograph', url: '' },
  { label: 'Espresso & Viennoiserie', url: CAFE_IMAGES.hero },
  { label: 'Artisanal Coffee Pour', url: CAFE_IMAGES.coffee },
  { label: 'Savoury Tartine & Plates', url: CAFE_IMAGES.savory },
  { label: 'Patisserie & Dessert', url: CAFE_IMAGES.dessert },
  { label: 'Café Table Atmosphere', url: CAFE_IMAGES.atmosphere },
];

/**
 * Standard Indian Vegetarian Symbol (Green square outline with centered green circle)
 */
const VegIndicator: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`inline-flex items-center justify-center w-4 h-4 rounded-[3px] border border-[#1E6F3D] bg-[#FAF7F2] shrink-0 ${className}`}
    title="Vegetarian"
    aria-label="Vegetarian item"
  >
    <span className="w-2 h-2 rounded-full bg-[#1E6F3D]" />
  </span>
);

export const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  onUpdateItems,
  onResetItems,
  selectedItemIds,
  onToggleSelectItem,
  onNavigateToContact,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | MenuCategory>(
    'All'
  );
  const [sectionGroup, setSectionGroup] = useState<'all' | 'food' | 'drinks'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showImages, setShowImages] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const menuTopRef = useRef<HTMLDivElement>(null);

  // Draft state for inline editing
  const [editDraft, setEditDraft] = useState<MenuItem | null>(null);

  // Draft state for adding a new item
  const [newItemDraft, setNewItemDraft] = useState<{
    name: string;
    description: string;
    priceInr: string;
    category: MenuCategory;
    subCategory: string;
    imageUrl: string;
    isVeg: boolean;
  }>({
    name: '',
    description: '',
    priceInr: '149',
    category: 'Soup & Salads',
    subCategory: '',
    imageUrl: '',
    isVeg: true,
  });

  // Categories filtered by Food vs Drinks group toggle
  const visibleCategories = useMemo(() => {
    if (sectionGroup === 'food') {
      return MENU_CATEGORIES.filter(
        (cat) => !BEVERAGE_CATEGORIES.includes(cat)
      );
    }
    if (sectionGroup === 'drinks') {
      return MENU_CATEGORIES.filter((cat) => BEVERAGE_CATEGORIES.includes(cat));
    }
    return MENU_CATEGORIES;
  }, [sectionGroup]);

  // Item counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of MENU_CATEGORIES) {
      counts[cat] = 0;
    }
    for (const item of items) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [items]);

  // Filtered items based on active category, food/drink group, and search query
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const inGroup = visibleCategories.includes(item.category);
      if (!inGroup) return false;

      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q)) ||
        String(item.priceInr).includes(q)
      );
    });
  }, [items, visibleCategories, activeCategory, searchQuery]);

  // Group filtered items by category in canonical MENU_CATEGORIES order
  const groupedFilteredItems = useMemo(() => {
    const groups: Array<{ category: MenuCategory; items: MenuItem[] }> = [];
    const targetCategories =
      activeCategory === 'All' ? visibleCategories : [activeCategory];

    for (const cat of targetCategories) {
      const catItems = filteredItems.filter((i) => i.category === cat);
      if (catItems.length > 0) {
        groups.push({ category: cat, items: catItems });
      }
    }
    return groups;
  }, [filteredItems, visibleCategories, activeCategory]);

  const handleSelectCategory = (cat: 'All' | MenuCategory) => {
    setActiveCategory(cat);
  };

  const startEditingItem = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditDraft({ ...item });
  };

  const saveEditedItem = () => {
    if (!editDraft || !editDraft.name.trim()) return;
    const updated = items.map((it) =>
      it.id === editDraft.id
        ? {
            ...editDraft,
            name: editDraft.name.trim(),
            description: editDraft.description.trim(),
            priceInr: Math.max(0, Number(editDraft.priceInr) || 0),
          }
        : it
    );
    onUpdateItems(updated);
    setEditingItemId(null);
    setEditDraft(null);
  };

  const handleDeleteItem = (id: string) => {
    onUpdateItems(items.filter((it) => it.id !== id));
    if (editingItemId === id) {
      setEditingItemId(null);
      setEditDraft(null);
    }
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemDraft.name.trim()) return;
    const created: MenuItem = {
      id: `custom-${Date.now()}`,
      name: newItemDraft.name.trim(),
      description:
        newItemDraft.description.trim() ||
        'Prepared fresh to order at Chéri Café.',
      priceInr: Math.max(0, Number(newItemDraft.priceInr) || 0),
      category: newItemDraft.category,
      subCategory: newItemDraft.subCategory.trim() || undefined,
      imageUrl: newItemDraft.imageUrl || undefined,
      isVeg: newItemDraft.isVeg,
    };
    onUpdateItems([created, ...items]);
    setNewItemDraft({
      name: '',
      description: '',
      priceInr: '149',
      category: activeCategory === 'All' ? 'Soup & Salads' : activeCategory,
      subCategory: '',
      imageUrl: '',
      isVeg: true,
    });
    setShowAddForm(false);
  };

  return (
    <section
      id="menu"
      ref={menuTopRef}
      className="py-20 sm:py-28 bg-[#FAF7F2] border-b border-[#E5DEC9]"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#6E2632] font-medium mb-3">
              <span>Chéri Cafe & Eatery</span>
              <span aria-hidden="true">·</span>
              <span>33 Categories · {items.length} Offerings</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5 text-[#1E6F3D]">
                <VegIndicator className="w-3.5 h-3.5" />
                <span>Pure Veg Menu</span>
              </span>
            </div>

            <h2 className="font-serif-display text-3xl sm:text-5xl text-[#231815] font-normal leading-[1.12] text-balance">
              Our Complete Menu.
            </h2>

            <p className="mt-3 text-[15px] sm:text-base text-[#5A463F] leading-relaxed">
              From signature espresso brews, cold coffees, and indulgent frappes
              to artisanal sandwiches, pasta, pizzas, sizzlers, and North Indian
              favourites.
            </p>
          </div>

          {/* Interactive Editor & Display Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowImages((prev) => !prev)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium rounded-lg border border-[#DED4C1] bg-[#F3EDE3] text-[#5A463F] hover:text-[#231815] hover:bg-[#EAE1D3] transition-colors whitespace-nowrap cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showImages ? 'Hide Photos' : 'Show Photos'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEditMode((prev) => !prev);
                setEditingItemId(null);
                setShowAddForm(false);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                isEditMode
                  ? 'bg-[#231815] text-[#FAF7F2] border-[#231815]'
                  : 'bg-[#F3EDE3] text-[#231815] border-[#DED4C1] hover:bg-[#EAE1D3]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>
                {isEditMode ? 'Done Editing Menu' : 'Edit Menu & Prices'}
              </span>
            </button>

            {isEditMode && (
              <>
                <button
                  type="button"
                  onClick={() => setShowAddForm((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-lg bg-[#6E2632] text-[#FAF7F2] hover:bg-[#561C26] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
                <button
                  type="button"
                  onClick={onResetItems}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-lg bg-[#FAF7F2] text-[#5A463F] border border-[#DED4C1] hover:text-[#231815] transition-colors whitespace-nowrap cursor-pointer"
                  title="Restore default online-listed menu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Menu</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Pricing Disclaimer & Selected Items Bar */}
        <div className="mb-8 px-4 py-3.5 rounded-xl bg-[#F3EDE3] border border-[#E2D8C5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-[#5A463F] leading-relaxed">
            <span className="font-semibold text-[#231815]">Menu Note:</span>{' '}
            Prices shown are online-listed prices in Indian Rupees (₹) and are
            not guaranteed dine-in prices.{' '}
            <span className="italic text-[#6E2632]">
              Prices may vary. Please confirm with the café.
            </span>
          </p>

          {selectedItemIds.length > 0 && (
            <button
              type="button"
              onClick={onNavigateToContact}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#6E2632] text-[#FAF7F2] rounded-lg hover:bg-[#561C26] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>
                Enquire About {selectedItemIds.length} Saved{' '}
                {selectedItemIds.length === 1 ? 'Item' : 'Items'}
              </span>
            </button>
          )}
        </div>

        {/* Add New Item Form (Visible in Edit Mode) */}
        {isEditMode && showAddForm && (
          <form
            onSubmit={handleAddNewItem}
            className="mb-10 p-6 rounded-2xl bg-[#F3EDE3] border-2 border-[#6E2632] space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E2D8C5] pb-3">
              <h3 className="font-serif-display text-2xl text-[#231815]">
                Add New Dish or Beverage
              </h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-[#6B564E] hover:text-[#231815] cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#231815] mb-1.5">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={newItemDraft.name}
                  onChange={(e) =>
                    setNewItemDraft({ ...newItemDraft, name: e.target.value })
                  }
                  placeholder="e.g. Hazelnut Cold Coffee"
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D8CBB5] rounded-lg text-[#231815] focus:outline-none focus:border-[#6E2632]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#231815] mb-1.5">
                  Category *
                </label>
                <select
                  value={newItemDraft.category}
                  onChange={(e) =>
                    setNewItemDraft({
                      ...newItemDraft,
                      category: e.target.value as MenuCategory,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D8CBB5] rounded-lg text-[#231815] focus:outline-none focus:border-[#6E2632]"
                >
                  {MENU_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#231815] mb-1.5">
                  Price in Indian Rupees (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newItemDraft.priceInr}
                  onChange={(e) =>
                    setNewItemDraft({
                      ...newItemDraft,
                      priceInr: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D8CBB5] rounded-lg text-[#231815] tabular-nums focus:outline-none focus:border-[#6E2632]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#231815] mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  value={newItemDraft.description}
                  onChange={(e) =>
                    setNewItemDraft({
                      ...newItemDraft,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe preparation or flavour profile..."
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D8CBB5] rounded-lg text-[#231815] focus:outline-none focus:border-[#6E2632]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#231815] mb-1.5">
                  Optional Food Photograph
                </label>
                <select
                  value={newItemDraft.imageUrl}
                  onChange={(e) =>
                    setNewItemDraft({
                      ...newItemDraft,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D8CBB5] rounded-lg text-[#231815] focus:outline-none focus:border-[#6E2632]"
                >
                  {PHOTO_PRESETS.map((preset) => (
                    <option key={preset.label} value={preset.url}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium bg-[#6E2632] text-[#FAF7F2] rounded-lg hover:bg-[#561C26] transition-colors cursor-pointer"
              >
                Save Menu Item
              </button>
            </div>
          </form>
        )}

        {/* Top Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#E5DEC9]">
          {/* High-Level Group Selector (All / Food / Coffee & Drinks) */}
          <div className="flex items-center gap-1.5 bg-[#F3EDE3] p-1 rounded-xl border border-[#E2D8C5] self-start">
            <button
              type="button"
              onClick={() => {
                setSectionGroup('all');
                setActiveCategory('All');
              }}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                sectionGroup === 'all'
                  ? 'bg-[#231815] text-[#FAF7F2] shadow-xs'
                  : 'text-[#5A463F] hover:text-[#231815]'
              }`}
            >
              All 33 Categories ({items.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setSectionGroup('food');
                setActiveCategory('All');
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                sectionGroup === 'food'
                  ? 'bg-[#231815] text-[#FAF7F2] shadow-xs'
                  : 'text-[#5A463F] hover:text-[#231815]'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Food & Kitchen (21)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSectionGroup('drinks');
                setActiveCategory('All');
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                sectionGroup === 'drinks'
                  ? 'bg-[#231815] text-[#FAF7F2] shadow-xs'
                  : 'text-[#5A463F] hover:text-[#231815]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Coffee, Frappes & Drinks (12)</span>
            </button>
          </div>

          {/* Search Bar Across All 180 Items */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#846F67] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 180 dishes, coffees, frappes..."
              aria-label="Search menu items"
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-[#F3EDE3] border border-[#DFD5C3] rounded-xl text-[#231815] placeholder:text-[#846F67] focus:outline-none focus:border-[#6E2632] focus:bg-[#FAF7F2] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#846F67] hover:text-[#231815] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* MOBILE Sticky Horizontally Scrollable Category Tabs */}
        <div className="lg:hidden sticky top-16 z-30 -mx-5 px-5 sm:-mx-8 sm:px-8 py-3 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DEC9] mb-6">
          <div
            role="tablist"
            aria-label="Mobile Menu Categories"
            className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'All'}
              onClick={() => handleSelectCategory('All')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === 'All'
                  ? 'bg-[#6E2632] text-[#FAF7F2]'
                  : 'bg-[#F3EDE3] text-[#5A463F] border border-[#E2D8C5]'
              }`}
            >
              All ({visibleCategories.reduce((acc, c) => acc + (categoryCounts[c] || 0), 0)})
            </button>

            {visibleCategories.map((cat) => {
              const isSelected = activeCategory === cat;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#6E2632] text-[#FAF7F2]'
                      : 'bg-[#F3EDE3] text-[#5A463F] border border-[#E2D8C5]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* DESKTOP Two-Zone Layout: Left Category Sidebar + Right 2-Column Menu Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Category Navigation Sidebar */}
          <aside
            aria-label="Menu Category Directory"
            className="hidden lg:block lg:col-span-3 sticky top-24 bg-[#F3EDE3] rounded-2xl border border-[#E2D8C5] p-4 max-h-[calc(100vh-120px)] overflow-y-auto"
          >
            <div className="px-2.5 pb-3 mb-2 border-b border-[#E2D8C5] flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#231815]">
                Categories
              </span>
              <span className="text-xs font-mono-tabular text-[#846F67]">
                {visibleCategories.length} sections
              </span>
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleSelectCategory('All')}
                className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  activeCategory === 'All'
                    ? 'bg-[#6E2632] text-[#FAF7F2]'
                    : 'text-[#5A463F] hover:bg-[#EAE1D3] hover:text-[#231815]'
                }`}
              >
                <span className="truncate">All Displayed Categories</span>
                <span
                  className={`font-mono-tabular text-[11px] ml-2 shrink-0 ${
                    activeCategory === 'All'
                      ? 'text-[#FAF7F2]/90'
                      : 'text-[#846F67]'
                  }`}
                >
                  {visibleCategories.reduce(
                    (acc, c) => acc + (categoryCounts[c] || 0),
                    0
                  )}
                </span>
              </button>

              {visibleCategories.map((cat, idx) => {
                const isSelected = activeCategory === cat;
                const count = categoryCounts[cat] || 0;
                const isFirstBeverage =
                  sectionGroup === 'all' && cat === 'Classics';

                return (
                  <React.Fragment key={cat}>
                    {isFirstBeverage && (
                      <div className="pt-3 pb-1.5 px-2.5 mt-2 border-t border-[#E2D8C5] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6E2632]">
                        Coffee, Frappes & Drinks
                      </div>
                    )}
                    {sectionGroup === 'all' && idx === 0 && (
                      <div className="pt-2 pb-1 px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6E2632]">
                        Kitchen & Savoury
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#6E2632] text-[#FAF7F2]'
                          : 'text-[#231815]/85 hover:bg-[#EAE1D3] hover:text-[#231815]'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      <span
                        className={`font-mono-tabular text-[11px] ml-2 shrink-0 ${
                          isSelected ? 'text-[#FAF7F2]/90' : 'text-[#846F67]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </aside>

          {/* Right Column: Menu Category Sections & 2-Column Menu Cards */}
          <div className="lg:col-span-9 space-y-12">
            {groupedFilteredItems.length === 0 ? (
              <div className="py-16 px-6 text-center bg-[#F3EDE3]/60 rounded-2xl border border-[#E5DEC9]">
                <p className="font-serif-display text-2xl text-[#231815] mb-2">
                  No matching dishes or drinks found.
                </p>
                <p className="text-sm text-[#6B564E] mb-5">
                  We could not find any items matching "{searchQuery}". Try
                  clearing your search or switching categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All');
                    setSectionGroup('all');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 text-xs font-medium bg-[#231815] text-[#FAF7F2] rounded-lg hover:bg-[#3A2924] transition-colors cursor-pointer"
                >
                  Reset Menu Filters
                </button>
              </div>
            ) : (
              groupedFilteredItems.map((group) => (
                <div key={group.category} className="space-y-5">
                  {/* Category Header */}
                  <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-[#DFD5C3]">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-serif-display text-2xl sm:text-3xl text-[#231815] font-medium">
                        {group.category}
                      </h3>
                      <span className="text-xs text-[#846F67] font-mono-tabular">
                        {group.items.length}{' '}
                        {group.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    {activeCategory !== 'All' && (
                      <button
                        type="button"
                        onClick={() => setActiveCategory('All')}
                        className="text-xs font-medium text-[#6E2632] hover:underline cursor-pointer whitespace-nowrap"
                      >
                        View All Categories
                      </button>
                    )}
                  </div>

                  {/* Two-Column Desktop / Single-Column Mobile Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {group.items.map((item) => {
                      const isEditingThis =
                        editingItemId === item.id && editDraft;
                      const isBookmarked = selectedItemIds.includes(item.id);

                      if (isEditingThis) {
                        return (
                          <div
                            key={item.id}
                            className="p-5 rounded-2xl bg-[#F3EDE3] border-2 border-[#6E2632] flex flex-col justify-between space-y-3.5"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#6E2632]">
                                  Editing Item
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="inline-flex items-center gap-1 text-xs text-[#9E2A2B] hover:underline cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>

                              <div>
                                <label className="block text-[11px] text-[#5A463F] mb-1">
                                  Item Name
                                </label>
                                <input
                                  type="text"
                                  value={editDraft.name}
                                  onChange={(e) =>
                                    setEditDraft({
                                      ...editDraft,
                                      name: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-1.5 text-sm bg-[#FAF7F2] border border-[#D8CBB5] rounded-lg text-[#231815]"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2.5">
                                <div>
                                  <label className="block text-[11px] text-[#5A463F] mb-1">
                                    Price (₹ INR)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={editDraft.priceInr}
                                    onChange={(e) =>
                                      setEditDraft({
                                        ...editDraft,
                                        priceInr: Number(e.target.value),
                                      })
                                    }
                                    className="w-full px-3 py-1.5 text-sm bg-[#FAF7F2] border border-[#D8CBB5] rounded-lg text-[#231815] tabular-nums"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] text-[#5A463F] mb-1">
                                    Category
                                  </label>
                                  <select
                                    value={editDraft.category}
                                    onChange={(e) =>
                                      setEditDraft({
                                        ...editDraft,
                                        category:
                                          e.target.value as MenuCategory,
                                      })
                                    }
                                    className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#D8CBB5] rounded-lg text-[#231815]"
                                  >
                                    {MENU_CATEGORIES.map((cat) => (
                                      <option key={cat} value={cat}>
                                        {cat}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] text-[#5A463F] mb-1">
                                  Description
                                </label>
                                <textarea
                                  rows={2}
                                  value={editDraft.description}
                                  onChange={(e) =>
                                    setEditDraft({
                                      ...editDraft,
                                      description: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#D8CBB5] rounded-lg text-[#231815]"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] text-[#5A463F] mb-1">
                                  Optional Photograph
                                </label>
                                <select
                                  value={editDraft.imageUrl || ''}
                                  onChange={(e) =>
                                    setEditDraft({
                                      ...editDraft,
                                      imageUrl: e.target.value || undefined,
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#D8CBB5] rounded-lg text-[#231815]"
                                >
                                  {PHOTO_PRESETS.map((preset) => (
                                    <option
                                      key={preset.label}
                                      value={preset.url}
                                    >
                                      {preset.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2D8C5]">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingItemId(null);
                                  setEditDraft(null);
                                }}
                                className="px-3 py-1.5 text-xs text-[#5A463F] hover:text-[#231815] cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={saveEditedItem}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-[#6E2632] text-[#FAF7F2] rounded-lg hover:bg-[#561C26] cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <article
                          key={item.id}
                          className="group bg-[#FAF7F2] rounded-2xl border border-[#E5DEC9] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4C7B1] hover:shadow-[0_8px_24px_rgba(35,24,21,0.05)]"
                        >
                          <div>
                            {/* Optional Food Photograph */}
                            {showImages && item.imageUrl && (
                              <div className="aspect-[16/10] w-full overflow-hidden bg-[#F3EDE3] border-b border-[#EFE8DC]">
                                <SmartImage
                                  src={item.imageUrl}
                                  alt={item.name}
                                  fallbackLabel={item.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                              </div>
                            )}

                            <div className="p-5">
                              {/* Top Metadata Line: Veg Indicator + Subcategory if present */}
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2 text-xs text-[#846F67]">
                                  {item.isVeg && <VegIndicator />}
                                  <span>
                                    {item.subCategory
                                      ? `${item.category} · ${item.subCategory}`
                                      : item.category}
                                  </span>
                                </div>

                                {isEditMode && (
                                  <button
                                    type="button"
                                    onClick={() => startEditingItem(item)}
                                    className="inline-flex items-center gap-1 text-xs font-medium text-[#6E2632] hover:underline cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                )}
                              </div>

                              {/* Item Name & Large Readable ₹ Price */}
                              <div className="flex items-baseline justify-between gap-4 mb-2">
                                <h4 className="font-serif-display text-xl sm:text-[22px] font-medium text-[#231815] leading-snug">
                                  {item.name}
                                </h4>
                                <span className="font-mono-tabular text-base sm:text-lg font-medium text-[#6E2632] whitespace-nowrap shrink-0">
                                  ₹{item.priceInr.toLocaleString('en-IN')}
                                </span>
                              </div>

                              {/* Short Editorial Description */}
                              <p className="text-xs sm:text-sm text-[#5A463F] leading-[1.6]">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Subtle Card Footer */}
                          <div className="px-5 py-2.5 bg-[#F3EDE3]/55 border-t border-[#EFE8DC] flex items-center justify-between gap-2">
                            <span className="text-[11px] text-[#846F67]">
                              Online-listed price · ₹{item.priceInr}
                            </span>

                            <button
                              type="button"
                              onClick={() => onToggleSelectItem(item.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                                isBookmarked
                                  ? 'bg-[#6E2632] text-[#FAF7F2]'
                                  : 'text-[#5A463F] hover:text-[#231815] hover:bg-[#EAE1D3]/70'
                              }`}
                            >
                              {isBookmarked ? (
                                <>
                                  <BookmarkCheck className="w-3.5 h-3.5" />
                                  <span>Saved</span>
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-3.5 h-3.5" />
                                  <span>Add to Note</span>
                                </>
                              )}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
