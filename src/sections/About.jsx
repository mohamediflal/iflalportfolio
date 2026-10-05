import { useState, useRef } from "react";
import { Code2, Lightbulb, Rocket, BookOpen } from "lucide-react";

const highlights = [
  {
    icon: Code2,
    title: "Clean Architecture",
    description:
      "Writing maintainable, scalable code that stands the test of time",
  },
  {
    icon: Rocket,
    title: "Performance",
    description:
      "Optimizing applications for speed and seamless cross-platform functionality",
  },
  {
    icon: BookOpen,
    title: "Adaptability",
    description: "Quickly learning new tools and technologies to meet project demands.",
  },
  {
    icon: Lightbulb,
    title: "Critical Thinking",
    description:
      "Analyzing problems and designing effective, user-focused solutions.",
  },
];

const TiltCard = ({ children, className, style }) => {
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width;
    const yPct = mouseY / height;

    const maxTilt = 12; // Moderate, natural-feeling tilt limit
    const rotateX = -(yPct - 0.5) * maxTilt;
    const rotateY = (xPct - 0.5) * maxTilt;

    setIsHovered(true);
    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`);
    setSpotlight({ x: xPct * 100, y: yPct * 100, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setSpotlight(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        ...style,
        transform,
        transition: isHovered 
          ? "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.15s ease" 
          : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease"
      }}
    >
      {/* Dynamic spotlight reflection inside card */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 -z-10"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(circle 140px at ${spotlight.x}% ${spotlight.y}%, rgba(32, 178, 166, 0.4) 0%, transparent 100%)`
        }}
      />
      {children}
    </div>
  );
};

export const About = () => {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase">
                About Me
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-secondary-foreground">
              Building digital solutions,
              <span className="font-serif italic font-normal text-white">
                {" "}
                from concept to deployment.
              </span>
            </h2>

            <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200">
              <p>
                I'm a results-driven Computer Science student with hands-on experience crafting cross-platform mobile and web applications that solve real-world problems. My journey into software engineering is defined by a passion for building user-centric products and a continuous drive to learn.
              </p>
              <p>
                I specialize in full-stack technologies like React Native, Flutter, and backend systems utilizing PostgreSQL, MongoDB, and Node.js. From developing AI-powered commerce solutions with relational data schemas to building platforms for regional marketplaces, my approach blends a solid technical foundation with a focus on intuitive user experience.
              </p>
              <p>
                When I'm not coding, you’ll find me exploring emerging tech, tackling problem-solving challenges, and looking for ways to contribute to impactful software projects in a collaborative environment.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300">
              <p className="text-lg font-medium italic text-foreground">
                "My mission is to engineer high-quality software that is not just functional, but delivers a seamless and impactful experience—products that users rely on and developers take pride in building."
              </p>
            </div>
          </div>

          {/* Right Column - Highlights */}
          <div className="grid sm:grid-cols-2 gap-6 lg:translate-y-12">
            {highlights.map((item, idx) => (
              <TiltCard
                key={idx}
                className="glass p-6 rounded-2xl animate-fade-in relative overflow-hidden group cursor-pointer"
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
