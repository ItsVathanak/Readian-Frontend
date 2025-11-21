import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import { mockCurrentUser } from './data/mockUser';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
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
import BookEditPage from './pages/BookEditPage';
import ChapterEditorPage from './pages/ChapterEditorPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import ConfirmPaymentPage from './pages/ConfirmPaymentPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Overview from './components/admin/Overview';
import AllWorks from './components/admin/AllWorks';
import AllUsers from './components/admin/AllUsers';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  

  const handleAuthClick = () => {
    if (currentUser) {
      setCurrentUser(null);
    } else {
      setCurrentUser(mockCurrentUser);
    }
  };

  //check if signed in by seeing if currentUser is not null
  const signedIn = currentUser !== null;

  return (
    <>
      <Navbar signedIn={signedIn} onAuthClick={handleAuthClick} currentUser={currentUser}/>
      <Routes>
        <Route path="/" element={<LandingPage signedIn={signedIn} currentUser={currentUser}/>} />
        <Route path="/instruction" element={<InstructionPage />} />
        <Route path="/browse" element={<BrowsePage currentUser={currentUser}/>} />
        <Route path={`/book/:id`} element={<BookDetailPage signedIn={signedIn} currentUser={currentUser}/>}/>
        <Route path={`/book/:bookId/chapter/:chapterId`} element={<ReadChapterPage />} />
        <Route path={`/edit/:bookId`} element={<BookEditPage currentUser={currentUser} />}/>
        <Route path={"/edit/:bookId/chapter/:chapterId"} element={<ChapterEditorPage currentUser={currentUser} />} />
        {/* Author Dash */}
        <Route path={`/authordash`} element={<AuthorDashboardPage currentUser={currentUser} />}>
          <Route index element={<Navigate to="works" replace />} /> 

          <Route path="works" element={<MyWorks />} />
          <Route path="drafts" element={<MyDrafts />} />
          <Route path="liked" element={<MyLiked />}/>
        </Route>
        {/* Admin Dash */}
        <Route path={`/admindash`} element={<AdminDashboardPage currentUser={currentUser} />} >
          <Route index element={<Navigate to="overview" replace />} />

          {/* Admin routes */}
          <Route path='overview' element={<Overview />} />
          <Route path="allworks" element={<AllWorks />} />
          <Route path="allusers" element={<AllUsers />} />

          {/* Reuse auth components */}
          <Route path="works" element={<MyWorks />} />
          <Route path="drafts" element={<MyDrafts />} />
          <Route path="liked" element={<MyLiked />}/>
        </Route>

        <Route path={`/profile`} element={<ProfilePage currentUser={currentUser} onLogout={handleAuthClick}/>} />
        <Route path={`/settings`} element={<SettingsPage />} />
        <Route path={`/analytics`} element={<AnalyticsPage />} />
        <Route path={`/signin`} element={<SignInPage onLogin={handleAuthClick} />} />
        <Route path={`/signup`} element={<SignUpPage onLogin={handleAuthClick} />} />
        <Route path={`/subscribe`} element={<SubscriptionPage currentUser={currentUser} setCurrentUser={setCurrentUser}/>}/>
        <Route path={`/confirm-payment`} element={<ConfirmPaymentPage currentUser={currentUser} setCurrentUser={setCurrentUser}/>}/>
      </Routes>
      
      <Footer />
    </>
    
  )
}

export default App
