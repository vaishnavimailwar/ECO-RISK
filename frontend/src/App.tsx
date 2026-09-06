import { useState } from 'react';
import AppShell from './components/layout/AppShell';
import ErrorBoundary from './components/ErrorBoundary';
import EcoRiskWorkspace from './pages/EcoRiskWorkspace';
import EcoRiskOnboarding from './components/onboarding/EcoRiskOnboarding';

export const useAuth = () => ({
  user: null as { name: string; role: string } | null,
});

function App() {
  const [onboardingComplete, setOnboardingComplete] =
    useState(() => {
      return (
        localStorage.getItem(
          'eco-risk-onboarding-complete',
        ) === 'true'
      );
    });

  return (
    <ErrorBoundary>
      {onboardingComplete ? (
        <AppShell>
          <EcoRiskWorkspace />
        </AppShell>
      ) : (
        <EcoRiskOnboarding
          onComplete={() =>
            setOnboardingComplete(true)
          }
        />
      )}
    </ErrorBoundary>
  );
}

export default App;