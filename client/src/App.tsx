import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import RegisterPatient from "@/pages/RegisterPatient";
import SearchPatients from "@/pages/SearchPatients";
import RecordVitals from "@/pages/RecordVitals";
import BookAppointment from "@/pages/BookAppointment";
import Sidebar from "@/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/register" component={RegisterPatient} />
      <Route path="/search" component={SearchPatients} />
      <Route path="/vitals" component={RecordVitals} />
      <Route path="/vitals/:id" component={RecordVitals} />
      <Route path="/appointments" component={BookAppointment} />
      <Route path="/appointments/:id" component={BookAppointment} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-neutral-100">
          {/* Desktop sidebar */}
          {!isMobile && <Sidebar />}
          
          {/* Mobile menu dialog */}
          {isMobile && (
            <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DialogContent className="p-0 max-w-full h-full sm:max-w-full">
                <Sidebar isMobile onClose={() => setMobileMenuOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
          
          {/* Main content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Mobile header */}
            {isMobile && (
              <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-neutral-200">
                <h1 className="text-lg font-bold text-primary">CHC Patient System</h1>
                <button
                  className="p-1 text-neutral-600 rounded-md hover:text-neutral-900 focus:outline-none"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Content area */}
            <div className="relative flex-1 overflow-y-auto focus:outline-none">
              <Router />
              <Toaster />
            </div>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
