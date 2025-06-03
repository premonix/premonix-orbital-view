
import Navigation from "@/components/Navigation";
import WorldMap from "@/components/WorldMap";
import ThreatIndicator from "@/components/ThreatIndicator";
import Footer from "@/components/Footer";
import ThreatFeed from "@/components/ThreatFeed";

const ThreatMap = () => {
  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white overflow-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <div className="relative">
        {/* World Map Background */}
        <WorldMap />
        
        {/* Live Threat Indicator */}
        <ThreatIndicator />
        
        {/* Live Threat Feed */}
        <ThreatFeed />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ThreatMap;
