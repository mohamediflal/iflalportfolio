import { usePortfolio } from "@/context/PortfolioDataContext";
import { Award, Calendar } from "lucide-react";

export const Achievements = () => {
  const { data } = usePortfolio();
  const achievements = data.achievements;

  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-32 relative overflow-hidden bg-surface/10">
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mx-auto max-w-3xl mb-16">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase">
            Milestones & Honors
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-secondary-foreground">
            Achievements &
            <span className="font-serif italic font-normal text-white">
              {" "}
              Awards.
            </span>
          </h2>
          <p className="text-muted-foreground">
            Highlights of competitions, awards, and professional recognition I have earned.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {achievements.map((ach, idx) => (
            <div
              key={ach.id || idx}
              className="group glass rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              {/* Optional Image */}
              {ach.image && (
                <div className="relative overflow-hidden aspect-[16/10] border-b border-border/30 bg-muted/10">
                  <img
                    src={ach.image}
                    alt={ach.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-40" />
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-primary font-medium tracking-wide">
                    <span className="inline-flex items-center gap-1 bg-primary/10 border border-primary/15 px-2 py-0.5 rounded-full">
                      <Award size={10} /> Honor
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar size={10} /> {ach.date}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors duration-300">
                    {ach.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
