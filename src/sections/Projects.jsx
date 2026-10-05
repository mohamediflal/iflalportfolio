import { ArrowUpRight, Github, Globe, Smartphone, Bot, Palette, Layers, Lock } from "lucide-react";
import { AnimatedBorderButton } from "@/components/AnimatedBorderButton";
import { usePortfolio } from "@/context/PortfolioDataContext";

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "full-stack":
    case "fullstack":
    case "full stack":
      return Layers;
    case "mobile app":
    case "mobile":
      return Smartphone;
    case "web app":
    case "web":
      return Globe;
    case "ai / ml":
    case "ai":
    case "ml":
      return Bot;
    case "ui/ux design":
    case "ui/ux":
    case "design":
      return Palette;
    default:
      return Layers;
  }
};

export const Projects = () => {
  const { data } = usePortfolio();
  const projects = data.projects;

  // Sort projects according to defined order (1, 2, 3...)
  const sortedProjects = [...projects].sort((a, b) => {
    const orderA =
      a.order !== undefined && a.order !== null && a.order !== "" && !isNaN(Number(a.order))
        ? Number(a.order)
        : Infinity;
    const orderB =
      b.order !== undefined && b.order !== null && b.order !== "" && !isNaN(Number(b.order))
        ? Number(b.order)
        : Infinity;

    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return (a.id || 0) - (b.id || 0);
  });

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      {/* Bg glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mx-auto max-w-3xl mb-16">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            Featured Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            Projects that
            <span className="font-serif italic font-normal text-white">
              {" "}
              make an impact.
            </span>
          </h2>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            A selection of my recent work, from complex web applications to
            innovative tools that solve real-world problems.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {sortedProjects.map((project, idx) => {
            const isGithubDisabled = project.hasGithub === false;
            const isDemoDisabled = project.hasDemo === false;
            const isAllDisabled = isGithubDisabled && isDemoDisabled;
            const hasAnyDisabled = isGithubDisabled || isDemoDisabled;

            const demoLink = !isDemoDisabled ? (project.demo || project.link || "#") : "#";
            const githubLink = !isGithubDisabled ? (project.github || "#") : "#";
            const projectTags = project.technologies || project.tags || [];
            const CategoryIcon = getCategoryIcon(project.category);
            
            const githubNotice = project.githubMessage || "Source code is private under client NDA.";
            const demoNotice = project.demoMessage || "Live demo is restricted to internal/client environments.";
            const generalNotice = project.confidentialMessage || (
              isAllDisabled
                ? "Client Project – Source code and live demo are confidential under Non-Disclosure Agreement (NDA)."
                : isGithubDisabled
                ? "Client Project – Source code is confidential under client NDA."
                : "Client Project – Live deployment is private / restricted client access."
            );
            
            return (
              <div
                key={idx}
                className="group glass rounded-2xl overflow-hidden animate-fade-in md:row-span-1 flex flex-col justify-between"
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <div>
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={project.image || "/projects/project1.png"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 
                    bg-gradient-to-t from-card via-card/50
                     to-transparent opacity-60"
                    />
                    {/* Category Badge (Top-Left) */}
                    {project.category && (
                      <div className="absolute top-4 left-4 z-10 pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-background/80 backdrop-blur-md border border-primary/20 text-primary shadow-sm">
                          <CategoryIcon className="w-3.5 h-3.5" />
                          {project.category}
                        </span>
                      </div>
                    )}

                    {/* Confidential Badges (Top-Right) */}
                    {isAllDisabled ? (
                      <div className="absolute top-4 right-4 z-10 pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 shadow-sm">
                          <Lock className="w-3.5 h-3.5" />
                          Client Project (NDA)
                        </span>
                      </div>
                    ) : isGithubDisabled ? (
                      <div className="absolute top-4 right-4 z-10 pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 shadow-sm">
                          <Lock className="w-3 h-3" />
                          Private Code
                        </span>
                      </div>
                    ) : isDemoDisabled ? (
                      <div className="absolute top-4 right-4 z-10 pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 shadow-sm">
                          <Lock className="w-3 h-3" />
                          Internal Demo
                        </span>
                      </div>
                    ) : null}

                    {/* Overlay Links or Confidential Card */}
                    {isAllDisabled ? (
                      <div className="absolute inset-0 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/60 backdrop-blur-xs">
                        <div className="glass bg-background/95 backdrop-blur-md border border-amber-500/30 p-5 rounded-2xl text-center max-w-xs shadow-2xl flex flex-col items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Lock className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">Client Confidential</div>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {generalNotice}
                            </p>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                            Links Restricted under NDA
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Live Demo Link or Disabled Lock */}
                        {isDemoDisabled ? (
                          <div
                            className="p-3 rounded-full glass bg-amber-500/10 border border-amber-500/30 text-amber-400 cursor-help"
                            title={`Demo Private: ${demoNotice}`}
                          >
                            <Lock className="w-5 h-5" />
                          </div>
                        ) : demoLink && demoLink !== "#" ? (
                          <a
                            href={demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Live Demo"
                            className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                            title="Open Live Demo"
                          >
                            <ArrowUpRight className="w-5 h-5" />
                          </a>
                        ) : null}

                        {/* GitHub Link or Disabled Lock */}
                        {isGithubDisabled ? (
                          <div
                            className="p-3 rounded-full glass bg-amber-500/10 border border-amber-500/30 text-amber-400 cursor-help"
                            title={`Repository Private: ${githubNotice}`}
                          >
                            <Lock className="w-5 h-5" />
                          </div>
                        ) : githubLink && githubLink !== "#" ? (
                          <a
                            href={githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub Repository"
                            className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                            title="Open GitHub Repository"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      {isAllDisabled ? (
                        <div
                          className="p-1 rounded-full text-amber-400/90 cursor-help flex-shrink-0"
                          title={generalNotice}
                        >
                          <Lock className="w-5 h-5" />
                        </div>
                      ) : (
                        <ArrowUpRight
                          className="w-5 h-5 
                        text-muted-foreground group-hover:text-primary
                         group-hover:translate-x-1 
                         group-hover:-translate-y-1 transition-all flex-shrink-0"
                        />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {project.description}
                    </p>

                    {/* Notice for Confidential Client Work */}
                    {hasAnyDisabled && (
                      <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300/90 text-xs">
                        <Lock className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                        <div className="space-y-0.5 leading-snug">
                          {isAllDisabled ? (
                            <span>{generalNotice}</span>
                          ) : (
                            <>
                              {isGithubDisabled && (
                                <p><strong>Source Code:</strong> {githubNotice}</p>
                              )}
                              {isDemoDisabled && (
                                <p><strong>Live Demo:</strong> {demoNotice}</p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {projectTags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-4 py-1.5 rounded-full bg-surface text-xs font-medium border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12 animate-fade-in animation-delay-500">
          <AnimatedBorderButton>
            View All Projects
            <ArrowUpRight className="w-5 h-5" />
          </AnimatedBorderButton>
        </div>
      </div>
    </section>
  );
};
