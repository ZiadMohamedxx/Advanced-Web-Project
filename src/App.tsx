import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

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
import EmployerDashboard from "./pages/Employerdashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();


function AuthSuccess() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

 useEffect(() => {
  const token = params.get("token");
  const user = params.get("user");

  if (token && user) {

    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      decodeURIComponent(user)
    );

    navigate("/jobs");
  }
}, [params, navigate]);

  return <p>Signing you in...</p>
}
function RoleRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return; // not signed in → stay on Index

    try {
      const parsed = JSON.parse(user);
      if (parsed.role === "candidate") navigate("/jobs", { replace: true });
      else if (parsed.role === "corporate") navigate("/employer-portal", { replace: true });
    } catch {
      // invalid data → stay on Index
    }
  }, [navigate]);

  return <Index />;
}

const App = () => (
  <LanguageProvider>
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
              <Route path="/employer-dashboard" element={<EmployerDashboard />} />
              <Route path="/apply/:jobId" element={<ApplyJob />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;