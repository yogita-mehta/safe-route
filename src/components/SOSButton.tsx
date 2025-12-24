import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, X, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface SOSButtonProps {
  userLocation?: { lat: number; lng: number } | null;
}

export function SOSButton({ userLocation }: SOSButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [alertSent, setAlertSent] = useState(false);
  const { toast } = useToast();

  let holdTimer: NodeJS.Timeout | null = null;
  let progressTimer: NodeJS.Timeout | null = null;

  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);

    progressTimer = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          triggerSOS();
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    holdTimer = setTimeout(() => {
      triggerSOS();
    }, 2000);
  };

  const endHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimer) clearTimeout(holdTimer);
    if (progressTimer) clearInterval(progressTimer);
  };

  const triggerSOS = () => {
    endHold();
    setAlertSent(true);
    
    toast({
      title: "🚨 SOS Alert Sent!",
      description: "Emergency contacts have been notified with your location.",
      variant: "destructive",
    });

    // Simulate sending to backend
    console.log("SOS Alert triggered!", {
      location: userLocation,
      timestamp: new Date().toISOString(),
      contact: emergencyContact,
    });

    setTimeout(() => setAlertSent(false), 5000);
  };

  const saveContact = () => {
    if (emergencyContact) {
      toast({
        title: "Contact Saved",
        description: "Emergency contact has been saved.",
      });
      setIsExpanded(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-72 glass-strong rounded-xl p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground">
                Emergency Settings
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8"
              >
                <X size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Emergency Contact Phone
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={saveContact} variant="secondary">
                    <Send size={16} />
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                <div className="flex items-center gap-2 text-danger mb-2">
                  <AlertTriangle size={16} />
                  <span className="text-sm font-semibold">How to use SOS</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Hold the SOS button for 2 seconds to send an emergency alert with your
                  current location to your saved contacts.
                </p>
              </div>

              {userLocation && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin size={14} />
                  <span>
                    Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-end gap-3">
        <Button
          variant="glass"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-12 w-12"
        >
          <Phone size={20} />
        </Button>

        <motion.div className="relative">
          {isHolding && (
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="hsl(var(--danger))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={2 * Math.PI * 46 * (1 - holdProgress / 100)}
                className="transition-all duration-100"
              />
            </svg>
          )}
          
          <Button
            variant="sos"
            size="xl"
            className="h-16 w-16 rounded-full text-lg"
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
          >
            {alertSent ? "SENT" : "SOS"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
