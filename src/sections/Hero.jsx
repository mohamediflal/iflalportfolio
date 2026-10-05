import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import {
  ArrowRight,
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Download,
} from "lucide-react";
import { AnimatedBorderButton } from "../components/AnimatedBorderButton";
import { usePortfolio } from "@/context/PortfolioDataContext";

export const Hero = () => {
  const { data, visibility } = usePortfolio();
  
  // Group the flat skills data into the categories expected by the UI design
  const skillCategories = [
    {
      title: "Frontend",
      skills: data.skills.filter((s) => s.category === "Frontend")
    },
    {
      title: "Backend & Databases",
      skills: data.skills.filter((s) => s.category === "Backend & Databases")
    },
    {
      title: "Mobile & Design",
      skills: data.skills.filter((s) => s.category === "Mobile & Design")
    },
    {
      title: "Tools ",
      skills: data.skills.filter((s) => s.category === "Tools ")
    }
  ].filter(category => category.skills.length > 0); // Only render categories with skills

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollToContact = (e) => {
    e.preventDefault();
    const element = document.getElementById("contact");
    if (element) {
      const navbarOffset = 90; // Align with the sticky navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Bg */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt="Hero image"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background" />
      </div>

      {/* Green Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full opacity-60"
            style={{
              backgroundColor: "#20B2A6",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `slow-drift ${15 + Math.random() * 20
                }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Computer Science Undergraduate • Full Stack & Mobile Developer
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in animation-delay-100">
                Crafting  <span className="text-primary glow-text">modern</span>
                <br />
                scalable
                <br />
                <span className="font-serif italic font-normal text-white">
                  web & mobile applications.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg animate-fade-in animation-delay-200">
                Hi, I'm Nawas Mohamed Iflal — a Computer Science undergraduate and Full Stack & Mobile Developer from Sri Lanka. I build scalable web and mobile applications using React, React Native, Flutter, Node.js, Laravel, and PostgreSQL, with a passion for software engineering and AI-powered solutions.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-300">
              <Button size="lg" onClick={handleScrollToContact}>
                Get In Touch <ArrowRight className="w-5 h-5" />
              </Button>
              <AnimatedBorderButton>
                <Download className="w-5 h-5" />
                View CV
              </AnimatedBorderButton>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 animate-fade-in animation-delay-400">
              <span className="text-sm text-muted-foreground">Connect with me: </span>
              {[
                { icon: Github, href: "https://github.com/mohamediflal" },
                { icon: Linkedin, href: "https://linkedin.com/in/mohamediflal0811cs" },
                { icon: Mail, href: "mailto:iflalmohammed0311@gmail.com" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  {<social.icon className="w-5 h-5" />}
                </a>
              ))}
            </div>
          </div>
          {/* Right Column - Profile Image */}
          <div className="relatice animate-fade-in animation-delay-300">
            {/* Profile Image */}
            <div className="relative max-w-md mx-auto">
              <div
                className="absolute inset-0 
              rounded-3xl bg-gradient-to-br 
              from-primary/30 via-transparent 
              to-primary/10 blur-2xl animate-pulse"
              />
              <div className="relative glass rounded-3xl p-2 glow-border">
                <img
                  src="/profile-photo.jpg"
                  alt="Nawas Mohamed Iflal"
                  className="w-full aspect-[4/5] object-cover rounded-2xl"
                />

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 glass rounded-xl px-4 py-3 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">
                      Available for work
                    </span>
                  </div>
                </div>
                {/* Stats Badge */}
                <div className="absolute -top-4 -left-4 glass rounded-xl px-4 py-3 animate-float animation-delay-500">
                  <div className="text-2xl font-bold text-primary">4+</div>
                  <div className="text-xs text-muted-foreground">
                    Projects.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {visibility.skills && (
          <div id="skills" className="mt-32 animate-fade-in animation-delay-600">
            <p className="text-sm font-medium text-primary tracking-wider uppercase text-center mb-4">
              Tech Stack & Expertise
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-foreground tracking-tight">
              Technologies I <span className="text-primary glow-text font-serif italic font-normal">Work With</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {skillCategories.map((category, catIdx) => {
                // Custom gradient card glows depending on category index
                const cardGlowColors = [
                  "from-purple-500/10 via-transparent to-primary/5 hover:from-purple-500/20 hover:to-primary/10",
                  "from-primary/10 via-transparent to-blue-500/5 hover:from-primary/20 hover:to-blue-500/10",
                  "from-blue-500/10 via-transparent to-purple-500/5 hover:from-blue-500/20 hover:to-purple-500/10",
                  "from-teal-500/10 via-transparent to-primary/5 hover:from-teal-500/20 hover:to-primary/10"
                ];
                const borderStyles = [
                  "hover:border-purple-500/30 hover:shadow-purple-500/5",
                  "hover:border-primary/30 hover:shadow-primary/5",
                  "hover:border-blue-500/30 hover:shadow-blue-500/5",
                  "hover:border-teal-500/30 hover:shadow-teal-500/5"
                ];

                return (
                  <div
                    key={catIdx}
                    className={`glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl border border-border/50 group ${borderStyles[catIdx]}`}
                  >
                    {/* Card ambient blur backdrop glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${cardGlowColors[catIdx]} transition-all duration-500 -z-10`} />

                    {/* Card header */}
                    <div className="flex justify-between items-baseline mb-8">
                      <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
                        {category.title}
                      </h3>
                      <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest font-bold">
                        {category.skills.length} Tools
                      </span>
                    </div>

                    {/* Skills lists inside cards */}
                    <div className="space-y-6">
                      {category.skills.map((skill, skillIdx) => (
                        <div key={skillIdx} className="space-y-2 group/row">
                          <div className="flex justify-between items-center">
                            <span className="text-sm md:text-base font-medium text-foreground group-hover/row:text-primary transition-colors duration-200">
                              {skill.name}
                            </span>
                            <span className="text-xs font-mono text-muted-foreground/80">
                              {skill.level}
                            </span>
                          </div>
                          {/* Progress Bar Track */}
                          <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden relative">
                            {/* Progress Bar Fill */}
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-primary transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(32,178,166,0.3)]"
                              style={{ width: animate ? skill.level : "0%" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 
      animate-fade-in animation-delay-800"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >

        </a>
      </div>
    </section>
  );
};
