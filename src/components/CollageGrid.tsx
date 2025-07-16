import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, EyeOff } from "lucide-react";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

interface LastfmItem {
  name: string;
  artist: string;
  image: string;
  playcount: number;
}

interface CollageGridProps {
  items: LastfmItem[];
  type: "albums" | "tracks";
  username: string;
}

const CollageGrid = ({ items, type, username }: CollageGridProps) => {
  const collageRef = useRef<HTMLDivElement>(null);
  const [showNames, setShowNames] = useState(false);
  const { toast } = useToast();

  // Garantir que sempre temos 25 items para a grade 5x5
  const gridItems = [...items];
  while (gridItems.length < 25) {
    gridItems.push({
      name: "",
      artist: "",
      image: "",
      playcount: 0,
    });
  }

  const downloadCollage = async () => {
    if (!collageRef.current) return;

    try {
      const canvas = await html2canvas(collageRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      link.download = `lastfm-${type}-${username}-colagem.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Download concluído!",
        description: "Sua colagem foi baixada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao fazer download:", error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar a colagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-lg border-red-200 shadow-xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Top {type === "albums" ? "Albums" : "Musics"} - @{username}
        </h2>
        <Badge variant="secondary" className="bg-red-600 text-white">
          Last month
        </Badge>
      </div>
      
      {/* Colagem oculta para download - apenas quadrados */}
      <div ref={collageRef} className="absolute -left-[9999px] bg-white">
        <div className="grid grid-cols-5 gap-0 w-[500px]">
          {gridItems.slice(0, 25).map((item, index) => (
            <div key={index} className="aspect-square w-full relative">
              {item.name ? (
                <div className="w-full h-full">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={`${item.name} - ${item.artist}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  {showNames && (
                    <div className="absolute inset-0">
                      <div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 80%, transparent 100%)"
                        }}
                      />
                      <div className="relative flex flex-col justify-end h-full text-white px-1 pb-[8px]">
                        <p className="text-[7px] font-semibold leading-tight whitespace-normal break-words text-left mb-[1px]">
                          {item.name}
                        </p>
                        <p className="text-[6px] text-gray-300 leading-tight whitespace-normal break-words text-left">
                          {item.artist}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-red-50"></div>
              )}
            </div>
          ))}
        </div>
      </div>



      {/* Grade visual para navegação - com hover effects e textos melhorados */}
      <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
        {gridItems.slice(0, 25).map((item, index) => (
          <div
            key={index}
            className="aspect-square relative group hover:scale-105 transition-transform duration-300"
          >
            {item.name ? (
              <>
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={`${item.name} - ${item.artist}`}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                {/* Overlay com informações no hover */}
                <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-center items-center p-2 text-center">
                  <p className="text-white text-xs font-semibold mb-1 line-clamp-2 leading-tight">
                    {item.name}
                  </p>
                  <p className="text-gray-300 text-xs mb-1 line-clamp-2 leading-tight">
                    {item.artist}
                  </p>
                  <Badge variant="outline" className="text-xs px-1 py-0 bg-white/20 text-white border-white/40">
                    {item.playcount} plays
                  </Badge>
                </div>
                
                {/* Nomes sempre visíveis quando ativados */}
                {showNames && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white p-1 rounded-b-lg">
                    <p className="text-[10px] font-semibold leading-tight mb-0.5" 
                       style={{ 
                         display: '-webkit-box',
                         WebkitLineClamp: 2,
                         WebkitBoxOrient: 'vertical',
                         overflow: 'hidden'
                       }}>
                      {item.name}
                    </p>
                    <p className="text-[9px] text-gray-300 leading-tight"
                       style={{ 
                         display: '-webkit-box',
                         WebkitLineClamp: 1,
                         WebkitBoxOrient: 'vertical',
                         overflow: 'hidden'
                       }}>
                      {item.artist}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-red-50 rounded-lg border border-red-200 flex items-center justify-center">
                <div className="text-red-400 text-xs">#{index + 1}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-center mt-6 space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => setShowNames(!showNames)}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            {showNames ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showNames ? "Hide info" : "Show info"}
          </Button>
          <Button
            onClick={downloadCollage}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 transition-all duration-300 hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Track Collage
          </Button>
        </div>
        <p className="text-red-500 text-sm">
          Hover over the covers to see more details
        </p>
      </div>
    </Card>
  );
};

export default CollageGrid;