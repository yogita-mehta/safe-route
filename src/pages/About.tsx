import { Navbar } from "@/components/Navbar";
import { Shield, Users, Target, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              About SafeRoute
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted companion for safer journeys. We help you navigate cities with confidence by providing real-time safety insights and optimized routing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <Target className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Our Mission</h2>
              <p className="text-muted-foreground">
                To empower everyone with the information they need to travel safely, whether walking, cycling, or commuting through urban areas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Community Driven</h2>
              <p className="text-muted-foreground">
                Built with input from communities worldwide, SafeRoute leverages collective knowledge to provide accurate safety assessments.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center">
            <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Safety First, Always
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We believe everyone deserves to feel safe while traveling. SafeRoute combines real-time data with smart routing to help you make informed decisions about your journey.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
