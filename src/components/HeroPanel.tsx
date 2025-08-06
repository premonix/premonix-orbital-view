
import { Button } from "@/components/ui/button";
import { Globe, Bell } from "lucide-react";
import CreateAccountForm from "./CreateAccountForm";

const HeroPanel = () => {
  return (
    <div className="fixed top-1/2 left-4 lg:left-8 transform -translate-y-1/2 z-30 w-72 lg:w-80 xl:max-w-md">
      <div className="glass-panel rounded-xl p-4 lg:p-8 space-y-4 lg:space-y-6">
        <div className="space-y-3 lg:space-y-4">
          <h1 className="text-2xl lg:text-4xl font-bold text-starlink-white leading-tight">
            See the Storm
            <br />
            <span className="text-starlink-blue">Before It Hits</span>
          </h1>
          
          <p className="text-starlink-grey-light text-sm lg:text-lg leading-relaxed">
            PREMONIX scans 10,000+ military, economic, cyber and political signals to predict emerging conflict hotspots. Built for resilience—at home and in business.
          </p>
        </div>

        <div className="space-y-2 lg:space-y-3">
          <CreateAccountForm variant="modal">
            <Button 
              size="lg" 
              className="w-full bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-semibold flex items-center space-x-2 group text-sm lg:text-base"
            >
              <Globe className="w-4 h-4 lg:w-5 lg:h-5 group-hover:animate-spin" />
              <span>Create Account</span>
            </Button>
          </CreateAccountForm>
          
          <CreateAccountForm variant="modal">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full glass-panel border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light flex items-center space-x-2 text-sm lg:text-base"
            >
              <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>Start Free</span>
            </Button>
          </CreateAccountForm>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 lg:gap-4 pt-3 lg:pt-4 border-t border-starlink-grey/20">
          <div className="text-center">
            <div className="text-lg lg:text-xl font-bold text-starlink-blue">24/7</div>
            <div className="text-xs text-starlink-grey-light">Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-lg lg:text-xl font-bold text-starlink-orange">10K+</div>
            <div className="text-xs text-starlink-grey-light">Data Sources</div>
          </div>
          <div className="text-center">
            <div className="text-lg lg:text-xl font-bold text-starlink-green">Live</div>
            <div className="text-xs text-starlink-grey-light">Platform</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPanel;
