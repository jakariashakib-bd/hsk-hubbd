import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import CoursePage from "./pages/CoursePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LessonDetailPage from "./pages/LessonDetailPage";
import PracticePage from "./pages/PracticePage";
import VocabularyPage from "./pages/VocabularyPage";
import ListeningPage from "./pages/ListeningPage";
import ProgressPage from "./pages/ProgressPage";
import CommunityPage from "./pages/CommunityPage";
import PinyinDictionaryPage from "./pages/PinyinDictionaryPage";
import MockTestPage from "./pages/MockTestPage";
import MockTestTakingPage from "./pages/MockTestTakingPage";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminVocabulary from "./pages/admin/AdminVocabulary";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminGuard from "./components/AdminGuard";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/course" element={<CoursePage />} />
              <Route path="/course/:level" element={<CourseDetailPage />} />
              <Route path="/course/:level/lesson/:lessonId" element={<LessonDetailPage />} />
              <Route path="/course/:level/vocabulary" element={<VocabularyPage />} />
              <Route path="/course/:level/grammar" element={<VocabularyPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/listening" element={<ListeningPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/pinyin-dictionary" element={<PinyinDictionaryPage />} />
              <Route path="/mock-test" element={<MockTestPage />} />
              <Route path="/mock-test/:level" element={<MockTestTakingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/admin/users" element={<AdminGuard><AdminUsers /></AdminGuard>} />
              <Route path="/admin/lessons" element={<AdminGuard><AdminLessons /></AdminGuard>} />
              <Route path="/admin/vocabulary" element={<AdminGuard><AdminVocabulary /></AdminGuard>} />
              <Route path="/admin/analytics" element={<AdminGuard><AdminAnalytics /></AdminGuard>} />
              <Route path="/admin/settings" element={<AdminGuard><AdminSettings /></AdminGuard>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
