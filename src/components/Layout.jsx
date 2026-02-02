import React from 'react';
import Navigation from '@/components/Navigation';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation />
      <main className="pb-12">
        {children}
      </main>
    </div>
  );
};

export default Layout;