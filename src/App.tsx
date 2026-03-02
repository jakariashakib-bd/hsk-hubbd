import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import MockTestPage from "./pages/MockTestPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
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
            <Route path="/mock-test" element={<MockTestPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
