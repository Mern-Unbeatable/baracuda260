export const DEFAULT_COURIERS = [
  'Royal Mail',
  'InPost',
  'DHL',
  'DPD',
  'FedEx',
  'UPS',
];

const STORAGE_KEY = 'user_custom_couriers';

export const getSavedCustomCouriers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveCustomCourierPreset = (courierName) => {
  if (!courierName || typeof courierName !== 'string') return getSavedCustomCouriers();
  const trimmed = courierName.trim();
  if (!trimmed) return getSavedCustomCouriers();

  if (DEFAULT_COURIERS.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
    return getSavedCustomCouriers();
  }

  const existing = getSavedCustomCouriers();
  if (existing.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
    return existing;
  }

  const updated = [...existing, trimmed];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
  return updated;
};

export const removeCustomCourierPreset = (courierName) => {
  const existing = getSavedCustomCouriers();
  const updated = existing.filter(
    (c) => c.toLowerCase() !== String(courierName).toLowerCase(),
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
  return updated;
};
