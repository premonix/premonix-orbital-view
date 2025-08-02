
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ResilienceToolkitPreview from "@/components/ResilienceToolkitPreview";

const ResilienceToolkit = () => {
  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      <div className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ResilienceToolkitPreview />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResilienceToolkit;
