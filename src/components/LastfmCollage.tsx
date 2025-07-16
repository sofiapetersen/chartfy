
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Album, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CollageGrid from "./CollageGrid";
import { getLastfmTopItems } from "@/services/lastfmService";

interface LastfmItem {
  name: string;
  artist: string;
  image: string;
  playcount: number;
}

const LastfmCollage = () => {
  const [username, setUsername] = useState("");
  const [type, setType] = useState<"albums" | "tracks">("albums");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<LastfmItem[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Erro",
        description: "Last.fm username",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const topItems = await getLastfmTopItems(username, type);
      setItems(topItems);
      setHasGenerated(true);
      toast({
        title: "Success!",
        description: `Track collage ${type === "albums" ? "álbuns" : "músicas"} generated!`,
      });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast({
        title: "Error!",
        description: "Could not generate the collage. Please check the username and try again.",
        variant: "destructive",
            });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-white/95 backdrop-blur-lg border-red-200 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-red-600">
            <img src="/logo.png" alt="Logo" className="w-6 h-6" />
            Generate your track collage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-red-700 font-medium">
                Last.fm Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="your_user_lastfm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background border-red-300 focus:border-red-500"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-red-700 font-medium">Choose</Label>
              <RadioGroup
                value={type}
                onValueChange={(value: "albums" | "tracks") => setType(value)}
                className="flex gap-6"
                disabled={loading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="albums" id="albums" />
                  <Label htmlFor="albums" className="flex items-center gap-2 cursor-pointer text-red-600">
                    <Album className="w-4 h-4" />
                    Albums
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tracks" id="tracks" />
                  <Label htmlFor="tracks" className="flex items-center gap-2 cursor-pointer text-red-600">
                    <Music className="w-4 h-4" />
                    Musics
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-lg transition-all duration-300 hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating track collage...
                </>
              ) : (
                "Generate Track Collage"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {hasGenerated && (
        <CollageGrid 
          items={items} 
          type={type} 
          username={username}
        />
      )}
    </div>
  );
};

export default LastfmCollage;
