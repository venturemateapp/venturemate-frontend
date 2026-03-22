import React, { createContext, useContext, useState, useCallback } from 'react';
import { businessApi } from '@/lib/api/client';
import { Business } from '@/types';

interface BusinessContextType {
  businesses: Business[];
  currentBusiness: Business | null;
  isLoading: boolean;
  fetchBusinesses: () => Promise<void>;
  setCurrentBusiness: (business: Business | null) => void;
  createBusiness: (data: { name: string; industry: string; country_code: string; description?: string }) => Promise<Business>;
  updateBusiness: (id: string, data: any) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  refreshCurrentBusiness: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await businessApi.getAll();
      setBusinesses(data.businesses || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBusiness = async (data: { name: string; industry: string; country_code: string; description?: string }) => {
    const response = await businessApi.create(data);
    const newBusiness = response.business;
    setBusinesses(prev => [...prev, newBusiness]);
    return newBusiness;
  };

  const updateBusiness = async (id: string, data: any) => {
    const response = await businessApi.update(id, data);
    const updated = response.business;
    setBusinesses(prev => prev.map(b => b.id === id ? updated : b));
    if (currentBusiness?.id === id) {
      setCurrentBusiness(updated);
    }
  };

  const deleteBusiness = async (id: string) => {
    await businessApi.delete(id);
    setBusinesses(prev => prev.filter(b => b.id !== id));
    if (currentBusiness?.id === id) {
      setCurrentBusiness(null);
    }
  };

  const refreshCurrentBusiness = useCallback(async () => {
    if (!currentBusiness) return;
    try {
      const data = await businessApi.getById(currentBusiness.id);
      setCurrentBusiness(data.business);
    } catch (error) {
      console.error('Failed to refresh business:', error);
    }
  }, [currentBusiness]);

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        currentBusiness,
        isLoading,
        fetchBusinesses,
        setCurrentBusiness,
        createBusiness,
        updateBusiness,
        deleteBusiness,
        refreshCurrentBusiness,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
