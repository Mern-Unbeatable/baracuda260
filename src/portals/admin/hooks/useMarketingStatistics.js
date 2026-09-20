import { useState, useEffect } from 'react';

/**
 * Mock hook for Marketing Statistics data matching the backend handoff document.
 */
export function useMarketingStatistics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setData({
        totalRegisteredProfiles: 12456,
        storeStats: {
          activeStores: 2100,
          storesWithProducts: 1800,
          storesBoughtPromote: 450,
        },
        behaviorStats: {
          addedPhotosAndCompetitions: 4254,
          onlyAddedPhotos: 3100,
        },
        promotionStats: {
          boughtPhotoAlbumPromote: 850,
        },
        competitionPopularity: {
          singlePhotoEntries: 5000,
          sixPhotoStoryEntries: 2500,
          twelvePhotoStoryEntries: 1000,
        },
        activeUsers: {
          last3Days: 8000,
          last7Days: 9500,
          last14Days: 10200,
          last30Days: 11000,
          last90Days: 12000,
        },
        traffic: {
          dailyWebsiteVisits: 45000,
        },
        postingUsers: {
          last3Days: 1200,
          last7Days: 2500,
          last14Days: 4000,
          last30Days: 7500,
          last90Days: 10000,
        },
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading, error };
}
