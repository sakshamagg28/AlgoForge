import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "../features/auth/LoginPage";
import { SignupPage } from "../features/auth/SignupPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { ProblemDetailPage } from "../features/problems/ProblemDetailPage";
import { SubmissionsPage } from "../features/submissions/SubmissionsPage";
import { TopicProblemsPage } from "../features/topics/TopicProblemsPage";
import { TopicsPage } from "../features/topics/TopicsPage";
import { GuestRoute } from "../routes/GuestRoute";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { AppLayout } from "./AppLayout";

export function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topics/:slug" element={<TopicProblemsPage />} />
          <Route path="/problems/:slug" element={<ProblemDetailPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
