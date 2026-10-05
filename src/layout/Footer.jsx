import { Github, Linkedin, Mail, Heart } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com/mohamediflal", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/mohamediflal0811cs", label: "LinkedIn" },
  { icon: Mail, href: "mailto:iflalmohammed0311@gmail.com", label: "Email" },
];

const footerLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];


export const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Custom click scroll handler to prevent HashRouter routing issues and scroll smoothly
  const handleScrollToSection = (e, href) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const navbarOffset = 90; // Height offset for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <a
              href="#"
              onClick={handleScrollToTop}
              className="text-xl font-bold tracking-tight hover:text-primary transition-colors cursor-pointer"
            >
              Mohamed Iflal<span className="text-primary">.</span>
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              <a href="#/login" className="hover:text-primary transition-colors duration-300">
                ©
              </a>{" "}
              {currentYear} Mohamed Iflal. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollToSection(e, link.href)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={social.label}
                className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
