import React, { useState } from 'react';
import { Menu, Dish, ScreenId, AIDescriptionVariant } from '../../types';
import { Badge, DietaryBadge } from '../common/Badge';
import { menuService } from '../../services/mockMenuService';
import {
  Sparkles,
  Check,
  Edit3,
  RotateCw,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  BookOpen,
  Info,
} from 'lucide-react';

interface AIDescriptionsScreenProps {
  menu: Menu;
  onUpdateDish: (updatedDish: Dish) => void;
  onNavigate: (screen: ScreenId) => void;
  initialSelectedDishId?: string;
}

export const AIDescriptionsScreen: React.FC<AIDescriptionsScreenProps> = ({
  menu,
  onUpdateDish,
  onNavigate,
  initialSelectedDishId,
}) => {
  const [selectedDishId, setSelectedDishId] = useState<string>(
    initialSelectedDishId || menu.dishes[0]?.id || ''
  );
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [regeneratingVariant, setRegeneratingVariant] = useState<string | null>(null);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const selectedDish = menu.dishes.find((d) => d.id === selectedDishId) || menu.dishes[0];

  if (!selectedDish) return null;

  const handleSelectVariant = async (variantType: 'concise' | 'storytelling' | 'ingredient-focused') => {
    try {
      const updated = await menuService.applyDescriptionVariant(selectedDish.id, variantType);
      onUpdateDish(updated);
      setAppliedNotification(`Applied "${variantType}" description to ${selectedDish.name}`);
      setTimeout(() => setAppliedNotification(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEdit = (variantType: string, text: string) => {
    setEditingVariant(variantType);
    setEditText(text);
  };

  const handleSaveEdit = (variantType: 'concise' | 'storytelling' | 'ingredient-focused') => {
    const updated = { ...selectedDish };
    if (variantType === 'concise') {
      updated.descriptions.concise.description = editText;
      updated.descriptions.concise.wordCount = editText.trim().split(/\s+/).length;
    } else if (variantType === 'storytelling') {
      updated.descriptions.storytelling.description = editText;
      updated.descriptions.storytelling.wordCount = editText.trim().split(/\s+/).length;
    } else if (variantType === 'ingredient-focused') {
      updated.descriptions.ingredientFocused.description = editText;
      updated.descriptions.ingredientFocused.wordCount = editText.trim().split(/\s+/).length;
    }

    if (updated.selectedDescriptionType === variantType) {
      updated.optimizedDescription = editText;
    }

    onUpdateDish(updated);
    menuService.updateDish(updated);
    setEditingVariant(null);
  };

  const handleRegenerate = async (variantType: 'concise' | 'storytelling' | 'ingredient-focused') => {
    setRegeneratingVariant(variantType);
    try {
      const newText = await menuService.regenerateDescription(selectedDish.id, variantType);
      const updated = { ...selectedDish };
      if (variantType === 'concise') {
        updated.descriptions.concise.description = newText;
        updated.descriptions.concise.wordCount = newText.trim().split(/\s+/).length;
      } else if (variantType === 'storytelling') {
        updated.descriptions.storytelling.description = newText;
        updated.descriptions.storytelling.wordCount = newText.trim().split(/\s+/).length;
      } else if (variantType === 'ingredient-focused') {
        updated.descriptions.ingredientFocused.description = newText;
        updated.descriptions.ingredientFocused.wordCount = newText.trim().split(/\s+/).length;
      }

      if (updated.selectedDescriptionType === variantType) {
        updated.optimizedDescription = newText;
      }

      onUpdateDish(updated);
      menuService.updateDish(updated);
    } finally {
      setRegeneratingVariant(null);
    }
  };

  const variantsList: {
    type: 'concise' | 'storytelling' | 'ingredient-focused';
    variant: AIDescriptionVariant;
    archetype: string;
  }[] = [
    {
      type: 'concise',
      variant: selectedDish.descriptions.concise,
      archetype: 'Fast-casual reading, high-tempo scanning, punchy sensory hooks',
    },
    {
      type: 'storytelling',
      variant: selectedDish.descriptions.storytelling,
      archetype: 'Fine-dining emotional narrative, heritage origin, craft immersion',
    },
    {
      type: 'ingredient-focused',
      variant: selectedDish.descriptions.ingredientFocused,
      archetype: 'D.O.P. provenance, artisanal purveyors, culinary technique',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8A7862] font-semibold">
                Stage 03 • Sensory Copy Engineering
              </span>
              <span className="w-1 h-1 rounded-full bg-[#B0A795]" />
              <span className="text-xs text-[#736E64]">
                3 Tone Profiles per Item
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1E1F22] font-bold tracking-tight">
              AI Description Writer
            </h1>
            <p className="text-sm text-[#615B50] mt-1 max-w-2xl">
              Transform flat ingredient lists into appetizing copy that increases perceived culinary value.
              Select a tone profile for each dish or customize inline.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('pricing')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1F2023] hover:bg-[#35363B] rounded transition-colors shadow-xs"
            >
              <span>Next: Pricing Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {appliedNotification && (
          <div className="mt-4 p-2.5 bg-[#EBF3ED] border border-[#CDE3D3] rounded text-xs text-[#205A37] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {appliedNotification}
            </span>
            <span className="text-[11px] font-mono">Syncing with Menu Studio...</span>
          </div>
        )}
      </div>

      {/* Horizontal Dish Selector Tabs */}
      <div className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-md p-3 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {menu.dishes.map((dish) => {
            const isSelected = dish.id === selectedDish.id;
            return (
              <button
                key={dish.id}
                onClick={() => setSelectedDishId(dish.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#1F2022] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#F1EDE3] text-[#555046] hover:bg-[#E5DFD2] hover:text-[#1E1F22]'
                }`}
              >
                <span>{dish.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-[#3C3E42] text-white' : 'bg-[#E3DC CE] text-[#696254]'
                  }`}
                >
                  ₹{dish.price}
                </span>
                {dish.isBestseller && <span className="text-amber-400 text-xs">★</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Dish Detail & Copy Generation Workspace */}
      <div className="space-y-6">
        {/* Dish Spec Bar */}
        <div className="p-4 bg-[#F2EDE2] rounded-md border border-[#E0D8C8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7B7365] uppercase font-mono tracking-wider font-semibold">
                {selectedDish.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#A89F90]" />
              <div className="flex items-center gap-1">
                {selectedDish.dietary.map((tag) => (
                  <DietaryBadge key={tag} tag={tag} />
                ))}
              </div>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2022] mt-0.5">
              {selectedDish.name}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-[#787265] text-[10px] block">PRICE</span>
              <span className="font-bold text-[#1E2022] text-sm">₹{selectedDish.price}</span>
            </div>
            <div>
              <span className="text-[#787265] text-[10px] block">FOOD COST</span>
              <span className="font-semibold text-[#1E2022] text-sm">₹{selectedDish.cost}</span>
            </div>
            <div>
              <span className="text-[#787265] text-[10px] block">MARGIN</span>
              <span className="font-bold text-[#225739] text-sm">{selectedDish.margin}%</span>
            </div>
            <div>
              <span className="text-[#787265] text-[10px] block">ACTIVE STYLE</span>
              <span className="font-semibold text-[#874A2B] capitalize text-xs">
                {selectedDish.selectedDescriptionType || 'Original'}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Original Description Card (Baseline) */}
        <div className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A89F90]" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#696357]">
                Original Menu Copy (Current Baseline)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#8C8477]">
              {selectedDish.originalDescription.split(' ').length} words • Basic grocery phrasing
            </span>
          </div>

          <div className="p-3.5 bg-[#F4F0E8] border border-[#E3DCCF] rounded text-sm text-[#4E493F] italic font-serif leading-relaxed">
            "{selectedDish.originalDescription}"
          </div>
        </div>

        {/* 2. Three Generated AI Versions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {variantsList.map(({ type, variant, archetype }) => {
            const isCurrentlySelected = selectedDish.selectedDescriptionType === type;
            const isEditing = editingVariant === type;
            const isRegenerating = regeneratingVariant === type;

            return (
              <div
                key={type}
                className={`bg-[#FAF8F5] rounded-md border transition-all flex flex-col justify-between ${
                  isCurrentlySelected
                    ? 'border-[#1E1F22] ring-1 ring-[#1E1F22] shadow-sm'
                    : 'border-[#E5DFD5] hover:border-[#CDC4B5]'
                }`}
              >
                {/* Variant Header */}
                <div className="p-4 border-b border-[#EAE4D8]">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1E2022] font-mono">
                      {variant.label}
                    </span>
                    {isCurrentlySelected && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1F2022] text-[#F9F8F6] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#706A5E] leading-snug">
                    {archetype}
                  </p>
                </div>

                {/* Content Body */}
                <div className="p-4 flex-1 space-y-3">
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={5}
                        className="w-full text-xs p-2.5 rounded bg-white border border-[#D5CDBD] text-[#1E2022] focus:outline-none focus:border-[#1E1F22] leading-relaxed resize-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingVariant(null)}
                          className="px-2.5 py-1 text-xs text-[#6B655A] hover:bg-[#EFE9DD] rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(type)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-[#1E1F22] hover:bg-[#34353A] rounded"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {isRegenerating && (
                        <div className="absolute inset-0 bg-[#FAF8F5]/80 backdrop-blur-[1px] flex items-center justify-center rounded">
                          <RotateCw className="w-5 h-5 text-[#874A2B] animate-spin" />
                        </div>
                      )}
                      <p className="text-xs text-[#2E2C28] leading-relaxed font-sans">
                        {variant.description}
                      </p>
                    </div>
                  )}

                  {/* Highlights & Metadata */}
                  <div className="pt-2 border-t border-[#EFE9DD] space-y-1.5">
                    <div className="text-[10px] text-[#7A7468] uppercase font-mono">
                      Sensory Highlights:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {variant.highlightWords.map((word) => (
                        <span
                          key={word}
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#ECE7DC] text-[#4E493F]"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] font-mono text-[#8C8477] pt-1">
                      Word Count: {variant.wordCount} words
                    </div>
                  </div>
                </div>

                {/* Card Action Controls: Use This, Edit, Regenerate */}
                <div className="p-3 bg-[#F4F0E8] border-t border-[#EAE4D8] flex items-center justify-between gap-1">
                  <button
                    onClick={() => handleSelectVariant(type)}
                    disabled={isCurrentlySelected}
                    className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors ${
                      isCurrentlySelected
                        ? 'bg-[#E3DCCF] text-[#696254] cursor-default'
                        : 'bg-[#1E1F22] hover:bg-[#35363B] text-white shadow-xs'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isCurrentlySelected ? 'Selected' : 'Use This'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(type, variant.description)}
                      className="p-1.5 text-xs text-[#555046] hover:text-[#1E2022] hover:bg-[#EAE3D5] rounded transition-colors"
                      title="Edit Description"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleRegenerate(type)}
                      disabled={isRegenerating}
                      className="p-1.5 text-xs text-[#555046] hover:text-[#1E2022] hover:bg-[#EAE3D5] rounded transition-colors"
                      title="Regenerate with fresh culinary phrasing"
                    >
                      <RotateCw
                        className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-[#874A2B]' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
