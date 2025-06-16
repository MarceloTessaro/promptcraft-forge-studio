
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Builder from '@/pages/Builder';
import Templates from '@/pages/Templates';
import Optimizer from '@/pages/Optimizer';
import Learn from '@/pages/Learn';
import Community from '@/pages/Community';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import Analytics from '@/pages/Analytics';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/builder" element={<Layout><Builder /></Layout>} />
            <Route path="/templates" element={<Layout><Templates /></Layout>} />
            <Route path="/templates/shared/:id" element={<Layout><Templates /></Layout>} />
            <Route path="/optimizer" element={<Layout><Optimizer /></Layout>} />
            <Route path="/learn" element={<Layout><Learn /></Layout>} />
            <Route path="/community" element={<Layout><Community /></Layout>} />
            <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
