import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './services/auth/authContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import LandingPage from './pages/LandingPage';
import InstructionPage from './pages/InstructionPage';
import BrowsePage from './pages/BrowsePage';
import BookDetailPage from './pages/BookDetailPage';
import ReadChapterPage from './pages/ReadChapterPage';
import AuthorDashboardPage from './pages/AuthorDashboardPage';
import MyWorks from './components/authordash/MyWorks';
import MyDrafts from './components/authordash/MyDrafts';
import MyLiked from './components/authordash/MyLiked';
import AuthorAnalytics from './components/authordash/AuthorAnalytics';
import BookEditPage from './pages/BookEditPage';
import ChapterEditorPage from './pages/ChapterEditorPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import ConfirmPaymentPage from './pages/ConfirmPaymentPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SubscriptionManagementPage from './pages/SubscriptionManagementPage';
import Overview from './components/admin/Overview';
import AllWorks from './components/admin/AllWorks';
import AllUsers from './components/admin/AllUsers';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import DownloadHistoryPage from './pages/DownloadHistoryPage';
import BecomeAuthorPage from './pages/BecomeAuthorPage';

function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#1A5632',
              },
            },
            error: {
              style: {
                background: '#DC2626',
              },
            },
          }}
        />
        <Navbar />
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/instruction" element={<InstructionPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/book/:id" element={<BookDetailPage />}/>
        <Route path="/book/:bookId/chapter/:chapterNumber" element={<ReadChapterPage />} />
        <Route path="/edit/:bookId" element={
          <ProtectedRoute requiredRole="author">
            <BookEditPage />
          </ProtectedRoute>
        }/>
        <Route path="/edit/:bookId/chapter/:chapterNumber" element={
          <ProtectedRoute requiredRole="author">
            <ChapterEditorPage />
          </ProtectedRoute>
        } />

        {/* Author Dash */}
        <Route path="/authordash" element={
          <ProtectedRoute requiredRole="AUTHOR">
            <AuthorDashboardPage />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="works" replace />} />
          <Route path="works" element={<MyWorks />} />
          <Route path="drafts" element={<MyDrafts />} />
          <Route path="liked" element={<MyLiked />}/>
          <Route path="analytics" element={<AuthorAnalytics />}/>
        </Route>

        {/* Admin Dash */}
        <Route path="/admindash" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboardPage />
          </ProtectedRoute>
        } >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="allworks" element={<AllWorks />} />
          <Route path="allusers" element={<AllUsers />} />
          <Route path="works" element={<MyWorks />} />
          <Route path="drafts" element={<MyDrafts />} />
          <Route path="liked" element={<MyLiked />}/>
          <Route path="analytics" element={<AuthorAnalytics />}/>
        </Route>

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
{/*         <Route path="/settings" element={ */}
{/*           <ProtectedRoute> */}
{/*             <SettingsPage /> */}
{/*           </ProtectedRoute> */}
{/*         } /> */}
        <Route path="/downloads" element={
          <ProtectedRoute>
            <DownloadHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute requiredRole="author">
            <AnalyticsPage />
          </ProtectedRoute>
        } />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/subscribe" element={<SubscriptionPage />}/>
        <Route path="/subscription/manage" element={
          <ProtectedRoute>
            <SubscriptionManagementPage />
          </ProtectedRoute>
        }/>
        <Route path="/become-author" element={<BecomeAuthorPage />}/>
{/*         <Route path="/confirm-payment" element={<ConfirmPaymentPage />}/> */}

        {/* 404 Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Footer />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
