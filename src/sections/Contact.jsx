import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/Button";
import { useState } from "react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "iflalmohammed0311@gmail.com",
    href: "mailto:iflalmohammed0311@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+94 76 424 2885",
    href: "tel:+94764242885",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kalpitiya, Sri Lanka",
    href: "#",
  },
];

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: null, // 'success' or 'error'
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setSubmitStatus({ type: null, message: "" });
    try {
      // Create a hidden form to submit directly to FormSubmit via a new tab.
      // This bypasses browser CORS limits and handles activation/recaptcha screens automatically.
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://formsubmit.co/iflalmohammed0311@gmail.com";
      form.target = "_blank";

      const inputs = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        _subject: `New Portfolio Message from ${formData.name}`
      };

      for (const [key, val] of Object.entries(inputs)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = val;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      setSubmitStatus({
        type: "success",
        message: "A verification tab has opened to securely process and deliver your message. Once completed, your email will be sent successfully!",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section id="contact" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-4 sm:mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            Let's build{" "}
            <span className="font-serif italic font-normal text-white">
              something great.
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base animate-fade-in animation-delay-200">
            Have a project in mind? I'd love to hear about it. Send me a message
            and let's discuss how we can work together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-stretch">
          {/* Contact Form Card */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-primary/30 animate-fade-in animation-delay-300 flex flex-col">
            <form className="flex flex-col flex-1 justify-between gap-6" onSubmit={handleSubmit}>
              <div className="space-y-5 sm:space-y-6 flex-1 flex flex-col">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2 text-foreground"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Your name..."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2 text-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm sm:text-base"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2 text-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Your message..."
                    className="w-full flex-1 min-h-[140px] px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Button
                  className="w-full"
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>Sending...</>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                {submitStatus.type && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl ${
                      submitStatus.type === "success"
                        ? "bg-green-500/10 border border-green-500/20 text-green-400"
                        : "bg-red-500/10 border border-red-500/20 text-red-400"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <p className="text-sm">{submitStatus.message}</p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Contact Info & Availability Cards */}
          <div className="flex flex-col justify-between gap-6 animate-fade-in animation-delay-400">
            {/* Contact Information Card */}
            <div className="glass rounded-3xl p-6 sm:p-8 border border-primary/30 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-6">
                  Contact Information
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {contactInfo.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      className="flex items-center gap-4 p-3.5 sm:p-4 rounded-xl hover:bg-surface transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {item.label}
                        </div>
                        <div className="font-medium text-sm sm:text-base break-all sm:break-normal text-foreground">
                          {item.value}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability Card */}
            <div className="glass rounded-3xl p-6 sm:p-8 border border-primary/30">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="w-3 h-3 bg-green-500 rounded-full shrink-0 animate-pulse" />
                <span className="font-medium">Currently Available</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                I'm currently open to new opportunities and exciting projects.
                Whether you need a full-time engineer or a freelance consultant,
                let's talk!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
