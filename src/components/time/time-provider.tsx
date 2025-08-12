
'use client';

import { createContext, useState, ReactNode, useCallback } from 'react';

export interface TimeContextType {
  simulatedTime: number;
  advanceTime: (days: number) => void;
  resetTime: () => void;
}

export const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const TimeProvider = ({ children }: { children: ReactNode }) => {
  const [simulatedTime, setSimulatedTime] = useState<number>(Date.now());

  const advanceTime = useCallback((days: number) => {
    setSimulatedTime(prevTime => prevTime + days * 24 * 60 * 60 * 1000);
  }, []);

  const resetTime = useCallback(() => {
    setSimulatedTime(Date.now());
  }, []);

  const value = {
    simulatedTime,
    advanceTime,
    resetTime,
  };

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
};
