
'use client';

import { useContext } from 'react';
import { TimeContext, type TimeContextType } from '@/components/time/time-provider';

export const useTime = (): TimeContextType => {
  const context = useContext(TimeContext);
  if (context === undefined) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};
