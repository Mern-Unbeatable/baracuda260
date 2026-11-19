import { Plus, X } from 'lucide-react';
import React, { memo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_COURIERS,
  getSavedCustomCouriers,
  removeCustomCourierPreset,
  saveCustomCourierPreset,
} from '@/portals/member/data/courierPresets';

const CourierSelector = memo(
  ({
    value = '',
    onChange,
    required = false,
    theme = 'light',
    label,
    showHeading = true,
  }) => {
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    const [customCouriers, setCustomCouriers] = useState(() =>
      getSavedCustomCouriers(),
    );
    const [isAdding, setIsAdding] = useState(false);
    const [newCourier, setNewCourier] = useState('');

    const handleAdd = () => {
      const trimmed = newCourier.trim();
      if (!trimmed) return;
      const updated = saveCustomCourierPreset(trimmed);
      setCustomCouriers(updated);
      if (onChange) onChange(trimmed);
      setNewCourier('');
      setIsAdding(false);
      toast.success(`"${trimmed}" added to courier presets.`);
    };

    const handleRemove = (e, courierToRemove) => {
      e.stopPropagation();
      const updated = removeCustomCourierPreset(courierToRemove);
      setCustomCouriers(updated);
      if (
        value.toLowerCase().trim() === courierToRemove.toLowerCase().trim()
      ) {
        if (onChange) onChange('Royal Mail');
      }
    };

    const isCurrentInPresets =
      DEFAULT_COURIERS.some(
        (c) => c.toLowerCase() === value.toLowerCase().trim(),
      ) ||
      customCouriers.some(
        (c) => c.toLowerCase() === value.toLowerCase().trim(),
      ) ||
      !value.trim();

    return (
      <div>
        {showHeading ? (
          <div className="mb-1.5 flex items-center justify-between">
            <label
              className={`block text-[13px] font-semibold ${
                isDark ? 'text-white/80' : 'text-[#374151]'
              }`}
            >
              {label ||
                t(
                  'storeOrders.dispatchModal.courierName',
                  'Courier / Shipping Carrier',
                )}
              {required ? <span className="text-red-500 ml-0.5">*</span> : null}
            </label>
            <span
              className={`text-[11px] ${
                isDark ? 'text-white/40' : 'text-[#6b7280]'
              }`}
            >
              Select preset or type custom name
            </span>
          </div>
        ) : null}

        {/* Preset Pills */}
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {DEFAULT_COURIERS.map((c) => {
            const isSelected =
              value.toLowerCase().trim() === c.toLowerCase().trim();
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange && onChange(c)}
                className={`cursor-pointer rounded-lg px-2.5 py-1 text-[12px] font-medium transition ${
                  isSelected
                    ? isDark
                      ? 'bg-[#ffc107] text-[#111827] shadow-xs font-semibold'
                      : 'bg-[#4048cd] text-white shadow-xs font-semibold'
                    : isDark
                      ? 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/15'
                      : 'border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]'
                }`}
              >
                {c}
              </button>
            );
          })}

          {/* User Custom Added Couriers */}
          {customCouriers.map((c) => {
            const isSelected =
              value.toLowerCase().trim() === c.toLowerCase().trim();
            return (
              <div
                key={c}
                onClick={() => onChange && onChange(c)}
                className={`group inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-[12px] font-medium transition ${
                  isSelected
                    ? isDark
                      ? 'bg-[#ffc107] text-[#111827] shadow-xs font-semibold'
                      : 'bg-[#4048cd] text-white shadow-xs font-semibold'
                    : isDark
                      ? 'border border-[#c7d2fe]/40 bg-[#4048cd]/20 text-[#c7d2fe] hover:bg-[#4048cd]/35'
                      : 'border border-[#c7d2fe] bg-[#f0f4ff] text-[#3730a3] hover:bg-[#e0e7ff]'
                }`}
              >
                <span>{c}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, c)}
                  title="Remove custom courier preset"
                  className="ml-0.5 inline-flex size-3.5 items-center justify-center rounded-full opacity-60 transition hover:bg-black/20 hover:opacity-100"
                >
                  <X size={10} />
                </button>
              </div>
            );
          })}

          {/* Add New Courier Mini-Action */}
          {!isAdding ? (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border border-dashed px-2.5 py-1 text-[12px] font-semibold transition ${
                isDark
                  ? 'border-[#ffc107]/40 bg-white/5 text-[#ffc107] hover:border-[#ffc107] hover:bg-white/10'
                  : 'border-[#4048cd]/40 bg-[#f8faff] text-[#4048cd] hover:border-[#4048cd] hover:bg-[#eef2ff]'
              }`}
            >
              <Plus size={12} />
              <span>{t('storeOrders.dispatchModal.addCustomCourier', '+ Add Courier')}</span>
            </button>
          ) : (
            <div
              className={`flex items-center gap-1 rounded-lg border p-0.5 shadow-xs ${
                isDark
                  ? 'border-[#ffc107] bg-[#18181b]'
                  : 'border-[#4048cd] bg-white'
              }`}
            >
              <input
                type="text"
                autoFocus
                value={newCourier}
                onChange={(e) => setNewCourier(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  } else if (e.key === 'Escape') {
                    setIsAdding(false);
                  }
                }}
                placeholder="Courier name..."
                className={`h-6 w-28 rounded px-1.5 text-[12px] outline-none ${
                  isDark ? 'bg-transparent text-white' : 'text-[#111827]'
                }`}
              />
              <button
                type="button"
                onClick={handleAdd}
                className={`cursor-pointer rounded px-1.5 py-0.5 text-[11px] font-bold transition ${
                  isDark
                    ? 'bg-[#ffc107] text-[#111827] hover:bg-[#f5b800]'
                    : 'bg-[#4048cd] text-white hover:bg-[#343cb0]'
                }`}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="cursor-pointer p-0.5 text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Main Text Input */}
        <input
          type="text"
          required={required}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={t(
            'storeOrders.dispatchModal.courierPlaceholder',
            'e.g. Royal Mail, InPost, DHL, Evri, GLS, Sundarban, etc.',
          )}
          className={`h-10.5 w-full rounded-xl border px-3.5 text-[14px] outline-none transition ${
            isDark
              ? 'border-white/15 bg-[#18181b] text-white placeholder:text-white/30 focus:border-[#ffc107]'
              : 'border-[#d1d5db] bg-white text-[#111827] placeholder:text-[#9ca3af] focus:border-[#4048cd] focus:ring-1 focus:ring-[#4048cd]'
          }`}
        />

        {/* Quick Save Prompt if typing an unsaved custom courier */}
        {!isCurrentInPresets && value.trim() ? (
          <div className="mt-1.5 flex items-center justify-between">
            <p
              className={`text-[11px] ${
                isDark ? 'text-white/60' : 'text-[#6b7280]'
              }`}
            >
              Custom carrier: <strong className={isDark ? 'text-white' : 'text-[#111827]'}>{value.trim()}</strong>
            </p>
            <button
              type="button"
              onClick={() => {
                const updated = saveCustomCourierPreset(value.trim());
                setCustomCouriers(updated);
                toast.success(`"${value.trim()}" saved to presets.`);
              }}
              className={`inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold hover:underline ${
                isDark ? 'text-[#ffc107]' : 'text-[#4048cd]'
              }`}
            >
              <Plus size={11} />
              Save to quick presets
            </button>
          </div>
        ) : null}
      </div>
    );
  },
);

CourierSelector.displayName = 'CourierSelector';

export default CourierSelector;
