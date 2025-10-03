import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { QueryProvider } from './providers/QueryProvider';
import { ToastContainer } from './components/ui/Toast';
import { LoadingOverlay } from './components/ui/LoadingOverlay';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppLayout, AuthLayout } from './components/layout';

// Import des pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { ContactListPage } from './pages/ContactListPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { EmailEditorPage } from './pages/EmailEditorPage';
import { ComponentsDemo } from './pages/ComponentsDemo';

// Styles globaux
import './styles/globals.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system">
        <QueryProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Routes d'authentification avec AuthLayout */}
                <Route path="/auth/*" element={
                  <AuthLayout>
                    <Routes>
                      <Route path="login" element={
                        <PublicRoute>
                          <LoginPage />
                        </PublicRoute>
                      } />
                      
                      <Route path="register" element={
                        <PublicRoute>
                          <RegisterPage />
                        </PublicRoute>
                      } />
                    </Routes>
                  </AuthLayout>
                } />

                {/* Routes principales avec AppLayout */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Routes>
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="campaigns" element={<CampaignsPage />} />
                        <Route path="contacts" element={<ContactListPage />} />
                        <Route path="campaigns/:id/edit" element={<EmailEditorPage />} />
                        
                        {/* Routes pour l'éditeur d'emails */}
                        <Route path="email-editor" element={<EmailEditorPage />} />
                        <Route path="email-editor/:templateId" element={<EmailEditorPage />} />

                        <Route path="templates" element={<TemplatesPage />} />
                        <Route path="statistics" element={<StatisticsPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="demo" element={<ComponentsDemo />} />
                        
                        {/* Redirection par défaut */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        
                        {/* Page 404 */}
                        <Route path="*" element={
                          <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                              <p className="text-gray-600 dark:text-gray-400 mb-8">Page non trouvée</p>
                              <button 
                                onClick={() => window.history.back()}
                                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                              >
                                Retour
                              </button>
                            </div>
                          </div>
                        } />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Routes>

              {/* Composants globaux */}
              <ToastContainer />
              <LoadingOverlay />
            </Router>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
