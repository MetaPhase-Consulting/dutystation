
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const DirectoryPage = lazy(() => import("@/pages/DirectoryPage"));
const StationDetailPage = lazy(() => import("@/pages/StationDetailPage"));
const ComparisonPage = lazy(() => import("@/pages/ComparisonPage"));
const DataSourcesPage = lazy(() => import("@/pages/DataSourcesPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function RouteLoadingFallback() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        Loading page content...
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/station/:id" element={<StationDetailPage />} />
              <Route path="/compare" element={<ComparisonPage />} />
              <Route path="/data-sources" element={<DataSourcesPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
