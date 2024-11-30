import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { GenerateQuote } from './pages/GenerateQuote';
import { PresetValues } from './pages/PresetValues';
import { Catalog } from './pages/Catalog';
import { Quotes } from './pages/Quotes';
import { QuoteTemplate } from './pages/QuoteTemplate';
import { OrderStatusTemplatePage } from './pages/OrderStatusTemplate';
import { QuoteView } from './pages/QuoteView';
import { QuoteEdit } from './pages/QuoteEdit';
import { SignUp } from './pages/SignUp';
import { UserDetail } from './pages/UserDetail';
import { UserManagement } from './pages/UserManagement';
import { Login } from './pages/Login';
import { ClientQuoteView } from './pages/ClientQuoteView';
import { ClientReceiptView } from './pages/ClientReceiptView';
import { ClientOrderStatus } from './pages/ClientOrderStatus';
import { NotFound } from './pages/NotFound';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { OrderEdit } from './pages/OrderEdit';
import { ReceiptTemplate } from './pages/ReceiptTemplate';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Client Views - No Layout */}
          <Route path="/client/quote/:id" element={<ClientQuoteView />} />
          <Route path="/client/receipt/:orderId/:receiptId" element={<ClientReceiptView />} />
          <Route path="/client/order/:id" element={<ClientOrderStatus />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Admin Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="generate-quote" element={<ProtectedRoute allowedRoles={['sales', 'admin']}><GenerateQuote /></ProtectedRoute>} />
            <Route path="preset-values" element={<ProtectedRoute requiredRole="admin"><PresetValues /></ProtectedRoute>} />
            <Route path="catalog" element={<ProtectedRoute requiredRole="admin"><Catalog /></ProtectedRoute>} />
            <Route path="quotes" element={<ProtectedRoute allowedRoles={['sales', 'admin']}><Quotes /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute allowedRoles={['sales', 'admin']}><Orders /></ProtectedRoute>} />
            <Route path="orders/:id" element={<ProtectedRoute allowedRoles={['sales', 'admin']}><OrderDetail /></ProtectedRoute>} />
            <Route path="orders/:id/edit" element={<ProtectedRoute allowedRoles={['sales', 'admin']}><OrderEdit /></ProtectedRoute>} />
            <Route path="receipt-template" element={<ProtectedRoute requiredRole="admin"><ReceiptTemplate /></ProtectedRoute>} />
            <Route path="order-status-template" element={<ProtectedRoute requiredRole="admin"><OrderStatusTemplatePage /></ProtectedRoute>} />
            <Route path="quotes/:id/view" element={<ProtectedRoute allowedRoles={['sales', 'admin']}><QuoteView /></ProtectedRoute>} />
            <Route path="quotes/:id/edit" element={<ProtectedRoute allowedRoles={['sales', 'admin']}><QuoteEdit /></ProtectedRoute>} />
            <Route path="quote-template" element={<ProtectedRoute requiredRole="admin"><QuoteTemplate /></ProtectedRoute>} />
            <Route path="users" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
            <Route path="users/:id" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}