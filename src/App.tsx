import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import CandidatePortal from "./pages/CandidatePortal";
import EmployerPortal from "./pages/EmployerPortal";
import Jobs from "./pages/Jobs";
import AccessibilityPage from "./pages/AccessibilityPage";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ApplyJob from "./pages/ApplyJob";
import PostJob from "./pages/PostJob";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
        <Route element={<Layout />}>
  <Route path="/" element={<Index />} />
  <Route path="/candidate-portal" element={<CandidatePortal />} />
  <Route path="/employer-portal" element={<EmployerPortal />} />
  <Route path="/jobs" element={<Jobs />} />
  <Route path="/accessibility" element={<AccessibilityPage />} />
  <Route path="/about" element={<About />} />
  <Route path="/signup" element={<SignUp />} />
  <Route path="/signin" element={<SignIn />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/apply/:jobId" element={<ApplyJob />} />
  <Route path="/post-job" element={<PostJob />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
