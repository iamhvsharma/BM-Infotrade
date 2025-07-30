import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FormBuilderProvider } from "@/contexts/FormBuilderContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoutes";
import { PublicRoute } from "@/components/PublicRoutes";
import { Navbar } from "@/components/layout/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/admin/Dashboard";
import FormBuilder from "./pages/admin/FormBuilder";
import FormResponses from "./pages/admin/FormResponses";
import PublicForm from "./pages/PublicForm";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FormBuilderProvider>
          <DndProvider backend={HTML5Backend}>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <Navbar />
                <Routes>
                  {/* Public Routes */}
                  <Route 
                    path="/" 
                    element={
                      <PublicRoute>
                        <Index />
                      </PublicRoute>
                    } 
                  />
                  
                  {/* Auth Routes - Redirect if already logged in */}
                  <Route 
                    path="/login" 
                    element={
                      <PublicRoute restricted>
                        <Login />
                      </PublicRoute>
                    } 
                  />
                  <Route 
                    path="/signup" 
                    element={
                      <PublicRoute restricted>
                        <Signup />
                      </PublicRoute>
                    } 
                  />

                  {/* Public Form Route - Anyone can fill forms */}
                  <Route 
                    path="/form/:formId" 
                    element={
                      <PublicRoute>
                        <PublicForm />
                      </PublicRoute>
                    } 
                  />

                  {/* Admin Protected Routes */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <AdminRoute>
                        <Dashboard />
                      </AdminRoute>
                    } 
                  />
                  <Route 
                    path="/admin/form/new" 
                    element={
                      <AdminRoute>
                        <FormBuilder />
                      </AdminRoute>
                    } 
                  />
                  <Route 
                    path="/admin/form/:id/edit" 
                    element={
                      <AdminRoute>
                        <FormBuilder />
                      </AdminRoute>
                    } 
                  />
                  <Route 
                    path="/admin/form/:formId/responses" 
                    element={
                      <AdminRoute>
                        <FormResponses />
                      </AdminRoute>
                    } 
                  />

                  {/* Error Routes */}
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Catch-all route - must be last */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </DndProvider>
        </FormBuilderProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;