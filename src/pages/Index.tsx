
import LastfmCollage from "@/components/LastfmCollage";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#fcfcfc] to-[#ffffff]">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-700 mb-4 animate-fade-in">
            Chartfy
          </h1>
          <p className="text-xl text-red-700 animate-fade-in">
            Create album and music track collages based on your Last.fm history!
          </p>
        </div>
        
        <LastfmCollage />
      </div>
    </div>
  );
};

export default Index;
