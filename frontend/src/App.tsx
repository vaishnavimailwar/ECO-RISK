import AppShell from './components/layout/AppShell';
import ErrorBoundary from './components/ErrorBoundary';
import EcoRiskWorkspace from './pages/EcoRiskWorkspace';

export const useAuth = () => ({
  user: null as { name: string; role: string } | null,
});

function App() {
  return (
    <ErrorBoundary>
      <AppShell>
        <EcoRiskWorkspace />
      </AppShell>
    </ErrorBoundary>
  );
}

export default App;


