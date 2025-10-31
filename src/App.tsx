import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import useWebVitals from "./hooks/useWebVitals";

// Lazy load all page components for code splitting
const Graduation = lazy(() => import("./pages/Graduation"));
const Memories = lazy(() => import("./pages/Memories"));
const Meetings = lazy(() => import("./pages/Meetings"));
const History = lazy(() => import("./pages/History"));
const Timeline = lazy(() => import("./pages/Timeline"));
const HistoricalPhotos = lazy(() => import("./pages/HistoricalPhotos"));
const Colleagues = lazy(() => import("./pages/Colleagues"));
const ColleagueDetails = lazy(() => import("./pages/ColleagueDetails"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const MemoryBook = lazy(() => import("./pages/MemoryBook"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 404s
        if (error instanceof Error && error.message.includes('404')) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  // Track Core Web Vitals for performance monitoring
  useWebVitals((metric) => {
    if (process.env.NODE_ENV === 'production') {
      console.log('Web Vital:', metric);
      // In production, you might want to send this to an analytics service
    }
  });

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
          <Route path="/" element={<Graduation />} />
                  <Route path="/graduation" element={<Graduation />} />
                  <Route path="/memories" element={<Memories />} />
                  <Route path="/memories/category/:id" element={<CategoryPage />} />
                  <Route path="/meetings" element={<Meetings />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/history/timeline" element={<Timeline />} />
                  <Route path="/history/photos" element={<HistoricalPhotos />} />
                  <Route path="/colleagues" element={<Colleagues />} />
                  <Route path="/colleagues/:id" element={<ColleagueDetails />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/memory-book" element={<MemoryBook />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
