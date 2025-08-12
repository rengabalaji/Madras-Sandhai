
'use client';

import { useContext } from 'react';
import { LocalizationContext, type LocalizationContextType } from '@/components/localization/localization-provider';

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
