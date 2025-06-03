
import Navigation from "@/components/Navigation";
import WorldMap from "@/components/WorldMap";
import HeroPanel from "@/components/HeroPanel";
import ThreatIndicator from "@/components/ThreatIndicator";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white overflow-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <div className="relative">
        {/* World Map Background */}
        <WorldMap />
        
        {/* Hero Content Panel */}
        <HeroPanel />
        
        {/* Live Threat Indicator */}
        <ThreatIndicator />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
