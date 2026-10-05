import { usePortfolio } from "@/context/PortfolioDataContext";
import { GraduationCap, Award, ExternalLink, Calendar } from "lucide-react";

export const EducationCertifications = () => {
  const { data, visibility } = usePortfolio();
  const { education, certifications } = data;

  const showEducation = visibility.education && education.length > 0;
  const showCertifications = visibility.certifications && certifications.length > 0;

  if (!showEducation && !showCertifications) return null;

  // Use a balanced single-column layout if only one section is enabled
  const containerClass = showEducation && showCertifications
    ? "grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
    : "max-w-3xl mx-auto";

  // Customize header title based on what is shown
  let sectionTitle = (
    <>
      Education &
      <span className="font-serif italic font-normal text-white">
        {" "}
        Certifications.
      </span>
    </>
  );

  if (showEducation && !showCertifications) {
    sectionTitle = (
      <>
        Academic
        <span className="font-serif italic font-normal text-white">
          {" "}
          Education.
        </span>
      </>
    );
  } else if (!showEducation && showCertifications) {
    sectionTitle = (
      <>
        Professional
        <span className="font-serif italic font-normal text-white">
          {" "}
          Certifications.
        </span>
      </>
    );
  }

  return (
    <section id="education" className="py-32 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-highlight/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mx-auto max-w-3xl mb-20">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase">
            Qualifications & Badges
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-secondary-foreground">
            {sectionTitle}
          </h2>
          <p className="text-muted-foreground">
            A comprehensive look at my formal learning, academic background, and industry credentials.
          </p>
        </div>

        {/* Dynamic content columns */}
        <div className={containerClass}>
          {/* Education Column */}
          {showEducation && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3 border-b border-border/50 pb-4">
                <GraduationCap className="text-primary w-6 h-6" /> Education
              </h3>

              <div className="space-y-6">
                {education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="glass p-6 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 relative group overflow-hidden"
                  >
                    {/* Tiny decorative corner glow */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors" />
                    
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface text-xs rounded-full text-primary font-medium border border-primary/15 mb-4">
                      <Calendar size={10} />
                      {edu.startDate} — {edu.endDate}
                    </span>

                    <h4 className="text-xl font-semibold text-white group-hover:text-primary transition-colors duration-300">
                      {edu.degree}
                    </h4>
                    <p className="text-sm text-secondary-foreground mt-1 font-medium">
                      {edu.institutionName} • <span className="text-muted-foreground font-normal">{edu.field}</span>
                    </p>

                    {edu.description && (
                      <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Column */}
          {showCertifications && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3 border-b border-border/50 pb-4">
                <Award className="text-primary w-6 h-6" /> Certifications
              </h3>

              <div className="space-y-6">
                {certifications.map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="glass p-6 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row gap-4 items-start relative group"
                  >
                    {/* Badge Image */}
                    {cert.image ? (
                      <img
                        src={cert.image}
                        alt=""
                        className="w-16 h-16 object-contain rounded-xl border border-border/30 bg-white p-1 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center text-xs text-muted-foreground flex-shrink-0 font-bold uppercase">
                        Cert
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-lg font-semibold text-white group-hover:text-primary transition-colors duration-300">
                          {cert.certificateName}
                        </h4>
                        {cert.credentialLink && cert.credentialLink !== "#" && (
                          <a
                            href={cert.credentialLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-surface hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                            title="Verify credential"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                      
                      <p className="text-sm text-secondary-foreground font-medium">
                        {cert.organization}
                      </p>
                      
                      <span className="inline-block text-[11px] font-mono text-muted-foreground/80 mt-2">
                        Issued: {cert.issueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
