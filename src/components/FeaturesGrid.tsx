import { motion } from "framer-motion";
import { Shield, MapPin, AlertTriangle, Route, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Route,
    title: "Safety-First Routing",
    description: "Our algorithm prioritizes well-lit streets, low-crime areas, and pedestrian-friendly paths.",
    color: "text-safe",
    bgColor: "bg-safe/10",
  },
  {
    icon: Shield,
    title: "Real-Time Safety Scores",
    description: "Every route segment is scored based on crime data, lighting conditions, and foot traffic.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: AlertTriangle,
    title: "Live SOS Alerts",
    description: "One-button emergency alert that sends your location to trusted contacts instantly.",
    color: "text-danger",
    bgColor: "bg-danger/10",
  },
  {
    icon: MapPin,
    title: "Smart Destinations",
    description: "Save frequent locations and get personalized safe route recommendations.",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: Users,
    title: "Community Reports",
    description: "Crowdsourced safety updates from users help keep data current and accurate.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Clock,
    title: "Time-Aware Routes",
    description: "Safety scores adapt to time of day — different routes for day vs. night travel.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-gradient">SafeRoute</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Traditional navigation apps find the fastest path. We find the safest one — 
            using real data to protect you every step of the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group glass rounded-xl p-6 hover:scale-[1.02] transition-all duration-300"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                  feature.bgColor
                )}
              >
                <feature.icon className={cn("w-6 h-6", feature.color)} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
