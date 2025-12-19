'use client';

import React, { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';
import { GA_MEASUREMENT_ID } from '../constants';

const AnalyticsTrackerInner: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize Google Analytics
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
        ReactGA.initialize(GA_MEASUREMENT_ID);
    }
  }, []);

  useEffect(() => {
    // Send pageview on route change
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        ReactGA.send({ hitType: "pageview", page: url });
    }
  }, [pathname, searchParams]);

  return null;
};

export const AnalyticsTracker: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerInner />
    </Suspense>
  );
};
