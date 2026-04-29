
import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/Spinner";
import { ScrollToTop } from "@/components/ScrollToTop";

const HomePage = lazy(() => import("@/pages/HomePage"));
const DirectoryPage = lazy(() => import("@/pages/DirectoryPage"));
const StationDetailPage = lazy(() => import("@/pages/StationDetailPage"));
const ComparisonPage = lazy(() => import("@/pages/ComparisonPage"));
const DataSourcesPage = lazy(() => import("@/pages/DataSourcesPage"));
const DisclaimerPage = lazy(() => import("@/pages/DisclaimerPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const AccessibilityPage = lazy(() => import("@/pages/AccessibilityPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Most lazy-route loads resolve in well under 200ms. Showing any loading UI
// for those brief loads causes a visible flicker on refresh. Delay the
// spinner by 200ms so fast loads render nothing, and only genuinely slow
// loads show the indicator.
function RouteLoadingFallback() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(id);
  }, []);
  if (!show) return null;
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      aria-busy="true"
    >
      <Spinner size="lg" label="Loading page" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/station/:id" element={<StationDetailPage />} />
              <Route path="/compare" element={<ComparisonPage />} />
              <Route path="/data-sources" element={<DataSourcesPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
