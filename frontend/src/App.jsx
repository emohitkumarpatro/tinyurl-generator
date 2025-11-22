import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import StatsPage from './pages/StatsPage';
import HealthCheck from './pages/HealthCheck';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F2E8] via-[#F0E7DB] to-[#E4D8C8]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F7F2E8 100%)',
            color: '#3B3024',
            border: '1px solid #E4D8C8',
            borderRadius: '16px',
            padding: '20px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 20px 40px rgba(139, 94, 52, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#8B5E34',
              secondary: '#F7F2E8',
            },
            style: {
              background: 'linear-gradient(135deg, #F0FFF4 0%, #F7F2E8 100%)',
              border: '1px solid #9AE6B4',
            },
          },
          error: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#FEE2E2',
            },
            style: {
              background: 'linear-gradient(135deg, #FEF2F2 0%, #F7F2E8 100%)',
              border: '1px solid #FECACA',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/code/:code" element={<StatsPage />} />
        <Route path="/health" element={<HealthCheck />} />
      </Routes>
    </div>
  );
}

export default App;