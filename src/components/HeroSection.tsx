import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowRight, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(217 91% 60% / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, hsl(160 84% 39% / 0.1) 0%, transparent 40%)"
        }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Shield className="w-5 h-5 text-safe" />
            <span className="text-sm font-medium text-foreground">
              AI-Powered Safety Navigation
            </span>
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Navigate with
            <br />
            <span className="text-gradient">Confidence</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            SafeRoute uses real-time safety data to find routes that prioritize 
            your security — not just speed. Walk safer, day or night.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/map">
              <Button variant="hero" size="xl" className="group">
                Start Safe Navigation
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              variant="glass" 
              size="xl"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn How It Works
            </Button>
          </div>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-[10%] w-20 h-20 rounded-full bg-safe/10 flex items-center justify-center animate-float"
            style={{ animationDelay: "0s" }}
          >
            <MapPin className="w-8 h-8 text-safe" />
          </motion.div>
          <motion.div
            className="absolute bottom-1/3 right-[15%] w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-float"
            style={{ animationDelay: "1s" }}
          >
            <Navigation className="w-6 h-6 text-primary" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-[20%] w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center animate-float"
            style={{ animationDelay: "2s" }}
          >
            <Shield className="w-5 h-5 text-warning" />
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20"
        >
          {[
            { value: "10K+", label: "Safe Routes" },
            { value: "99%", label: "Accuracy" },
            { value: "24/7", label: "Protection" },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
