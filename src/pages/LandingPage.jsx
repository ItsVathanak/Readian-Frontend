import React from 'react'
import Hero from '../components/landing/Hero'
import Trending from '../components/landing/Trending';
import Tags from '../components/landing/Tags';
import AboutReadian from '../components/landing/AboutReadian';
import Subscribe from '../components/landing/Subscribe';
import Help from '../components/landing/Help';
import { useAuth } from '../services/auth/authContext';


const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const dashboardPath = user?.role === "admin" ? "/admindash" : "/authordash/works";


  return (
    <div className='w-full'>
        <Hero signedIn={isAuthenticated} dashboardPath={dashboardPath}/>
        <Trending />
        <Tags />
        <AboutReadian />
        <Subscribe signedIn={isAuthenticated} />
        <Help />
    </div>
  )
}

export default LandingPage;
