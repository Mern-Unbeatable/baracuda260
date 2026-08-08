import React, { memo, useEffect } from "react";
import { useApi } from '@/shared/hooks/useApi';
import { httpMethods } from '@/shared/lib/httpMethods';
import API_ENDPOINTS from '@/shared/lib/httpEndpoint';

const ServiceCard = memo(({ title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-blue-600 mb-3">{title}</h2>
    <p className="text-gray-600">{description}</p>
  </div>
));

ServiceCard.displayName = "ServiceCard";

const ServicesContent = memo(() => {
  const { data, loading, error, execute } = useApi(httpMethods.get);

  useEffect(() => {
    execute(API_ENDPOINTS.SERVICES.LIST);
  }, [execute]);

  const services = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Services</h1>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500">
          Failed to load services. Please try again.
        </p>
      ) : services.length === 0 ? (
        <p className="text-gray-400">No services available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id ?? service._id}
              title={service.title ?? service.name}
              description={service.description}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ServicesContent.displayName = "ServicesContent";

export default ServicesContent;
