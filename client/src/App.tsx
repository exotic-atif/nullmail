import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { ComposerPage } from '@/components/composer/ComposerPage';
import { DraftsPage } from '@/components/drafts/DraftsPage';
import { ContactsPage } from '@/components/contacts/ContactsPage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { LoginPage } from '@/components/auth/LoginPage';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import { useThemeInit } from '@/hooks/useThemeInit';

import { useEffect } from 'react';
import { useDraftStore } from '@/store/draftStore';
import { useContactStore } from '@/store/contactStore';

function ProtectedRoute() {
  const { user, isAdmin, isLoading } = useAuth();
  const fetchDrafts = useDraftStore((s) => s.fetchDrafts);
  const fetchData = useContactStore((s) => s.fetchData);

  useEffect(() => {
    if (user && isAdmin) {
      fetchDrafts(user.id);
      fetchData(user.id);
    }
  }, [user, isAdmin, fetchDrafts, fetchData]);

  if (isLoading) {
    return <div className="h-screen w-screen bg-nm-black" />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function AppContent() {
  useThemeInit();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<ComposerPage />} />
          <Route path="/drafts" element={<DraftsPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(17, 17, 20, 0.9)',
              border: '1px solid rgba(39, 39, 42, 0.5)',
              color: '#fafafa',
              backdropFilter: 'blur(24px)',
              borderRadius: '16px',
              fontSize: '13px',
            },
          }}
          closeButton
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
