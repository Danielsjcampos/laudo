import React from 'react';
import '../landing.css'; // Import the new styles

import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Problem from '../components/landing/Problem';
import Solution from '../components/landing/Solution';
import Audience from '../components/landing/Audience';
import AISection from '../components/landing/AISection';
import Steps from '../components/landing/Steps';
import BusinessModel from '../components/landing/BusinessModel';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="lp-wrapper">
      <Header onNavigateToLogin={onNavigateToLogin} />
      <main>
        <Hero onNavigateToLogin={onNavigateToLogin} />
        <Problem />
        <Solution />
        <Audience />
        <AISection />
        <Steps />
        <BusinessModel />
        <Testimonials />
        <CTA onNavigateToLogin={onNavigateToLogin} />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
