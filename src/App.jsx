import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/layout/Navbar";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Projects } from "@/sections/Projects";
import { Experience } from "@/sections/Experience";
import { Testimonials } from "@/sections/Testimonials";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/layout/Footer";
import { Login } from "@/admin/Login";
import { Dashboard } from "@/admin/Dashboard";
import { PortfolioDataProvider } from "@/context/PortfolioDataContext";

// Custom new sections we will create
import { EducationCertifications } from "@/sections/EducationCertifications";
import { Achievements } from "@/sections/Achievements";

import { usePortfolio } from "@/context/PortfolioDataContext";

const PortfolioHome = () => {
  const { visibility } = usePortfolio();

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        {visibility.about && <About />}
        {visibility.projects && <Projects />}
        {visibility.experience && <Experience />}
        {/* Render Education and Certifications if at least one is enabled */}
        {(visibility.education || visibility.certifications) && <EducationCertifications />}
        {/* Render Achievements if enabled */}
        {visibility.achievements && <Achievements />}
        {visibility.testimonials && <Testimonials />}
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <PortfolioDataProvider>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Dashboard />} />
      </Routes>
    </PortfolioDataProvider>
  );
}

export default App;
