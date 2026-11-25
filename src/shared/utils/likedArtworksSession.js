const LIKED_ARTWORKS_SESSION_KEY = 'm12p:liked-artwork-ids';

export const readLikedArtworkIds = () => {
  try {
    const raw = sessionStorage.getItem(LIKED_ARTWORKS_SESSION_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
};

export const writeLikedArtworkId = (artworkId, isLiked) => {
  if (!artworkId) return;
  const next = readLikedArtworkIds();
  const key = String(artworkId);
  if (isLiked) next.add(key);
  else next.delete(key);
  try {
    sessionStorage.setItem(
      LIKED_ARTWORKS_SESSION_KEY,
      JSON.stringify([...next]),
    );
  } catch {
    // Ignore quota / private-mode write failures
  }
};

export const hasLikedArtworkInSession = (artworkId) => {
  if (!artworkId) return false;
  return readLikedArtworkIds().has(String(artworkId));
};
