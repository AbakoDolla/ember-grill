import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import WelcomeCelebration from "@/components/WelcomeCelebration";

import MainLayout from "@/layout/MainLayout";

import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import CartPage from "@/pages/CartPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "./pages/NotFound";
import AuthScreen from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Favorites from "./pages/Favorites";

const queryClient = new QueryClient();

const AppContent = () => {
  const { showWelcome, setShowWelcome, user } = useAuth()

  return (
    <>
      <WelcomeCelebration
        show={showWelcome}
        userName={user?.user_metadata?.name}
        onComplete={() => setShowWelcome(false)}
      />

      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner
              theme="dark"
              toastOptions={{
                style: {
                  background: 'hsl(220 15% 10%)',
                  border: '1px solid hsl(220 10% 20%)',
                  color: 'hsl(40 20% 95%)',
                },
              }}
            />

            <BrowserRouter>
              <Routes>
                {/* AUTH ROUTES (NO NAVBAR) */}
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthScreen />} />

                {/* APP ROUTES (WITH NAVBAR) */}
                <Route element={<MainLayout />}>
                  <Route path="/menu" element={
                    <ProtectedRoute>
                      <MenuPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />
                  <Route path="/favorites" element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </QueryClientProvider>
    </>
  )
}

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
