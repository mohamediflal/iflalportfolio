import { Button } from "@/components/Button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePortfolio } from "@/context/PortfolioDataContext";

export const Navbar = () => {
  const { visibility } = usePortfolio();

  const allLinks = [
    { key: "about", href: "#about", label: "About" },
    { key: "projects", href: "#projects", label: "Projects" },
    { key: "experience", href: "#experience", label: "Experience" },
    { key: "skills", href: "#skills", label: "Skills" },
    { key: "education", href: "#education", label: "Education" },
    { key: "certifications", href: "#education", label: "Certificates" },
    { key: "achievements", href: "#achievements", label: "Achievements" },
    { key: "testimonials", href: "#testimonials", label: "Testimonials" }
  ];

  const navLinks = allLinks.filter((link) => visibility[link.key]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Custom click scroll handler to prevent HashRouter routing issues
  const handleScrollToSection = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const navbarOffset = 90; // Height offset for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 transition-all duration-500 shadow-none ${
        isScrolled ? "bg-transparent py-3" : "bg-transparent py-5"
      }  z-50`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <a
          href="#"
          className="text-xl font-bold tracking-tight hover:text-primary glass rounded-full px-4 py-2 transition-all duration-300"
        >
          Mohamed Iflal<span className="text-primary">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <div className="glass rounded-full px-2 pt-1 pb-2 flex flex-col items-center gap-1 relative overflow-hidden">
            <div className="flex items-center gap-1">
              {navLinks.map((link, index) => (
                <a
                  href={link.href}
                  key={index}
                  onClick={(e) => handleScrollToSection(e, link.href.replace("#", ""))}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-primary/10 transition-all duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
            {/* Scroll Progress Indicator Line */}
            <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-primary/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-100 ease-out"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <Button size="sm" onClick={(e) => handleScrollToSection(e, "contact")}>Contact Me</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground cursor-pointer"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-strong animate-fade-in">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <a
                href={link.href}
                key={index}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleScrollToSection(e, link.href.replace("#", ""));
                }}
                className="text-lg text-muted-foreground hover:text-foreground py-2"
              >
                {link.label}
              </a>
            ))}

            <Button onClick={(e) => {
              setIsMobileMenuOpen(false);
              handleScrollToSection(e, "contact");
            }}>
              Contact Me
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
