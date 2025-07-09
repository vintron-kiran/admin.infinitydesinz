'use client';

import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import AuthWrapper from '@/components/AuthWrapper';
import { useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="stylesheet" href="/assets/icon/themify-icons/themify-icons.css" />
        <link rel="stylesheet" href="/assets/icon/simple-line-icons/css/simple-line-icons.css" />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/flex-utilities.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="shortcut icon" href="/assets/images/mini-logo.png" />
        <title>Infinity Admin</title>
      </head>
      <body className="min-h-screen flex flex-col">
        <Header onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)} />
        <div className={`flex flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-[60px]" : "ml-[250px]"}`}>
          <Sidebar collapsed={sidebarCollapsed} />
          <main className={`layout-content ${sidebarCollapsed ? "collapsed" : "shifted"}`}>
            <AuthWrapper>{children}</AuthWrapper>
          </main>
        </div>
        <div id="modal-root" /> {/* Move modal-root outside */}
        <Footer />
      </body>
    </html>
  );
}
