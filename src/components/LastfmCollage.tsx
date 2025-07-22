import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Album, Loader2, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CollageGrid from "./CollageGrid";
import { getLastfmTopItems } from "@/services/lastfmService";
import {
  initiateSpotifyLogin,
  getStoredSpotifyToken,
  logoutSpotify
} from "@/services/spotifyService";

interface LastfmItem {
  name: string;
  artist: string;
  image: string;
  playcount: number;
}

const LastfmCollage = () => {
  const [username, setUsername] = useState("");
  const [type, setType] = useState<"albums" | "artists" | "tracks">("albums");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<LastfmItem[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [authMethod, setAuthMethod] = useState<"lastfm" | "spotify">("lastfm");
  const [spotifyUser, setSpotifyUser] = useState<{ display_name: string; id: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const token = getStoredSpotifyToken();
    if (token) {
      setAuthMethod("spotify");
      checkSpotifyUser();
    }
  }, []);

  const token = getStoredSpotifyToken();
  console.log("Spotify Token usado na fetch:", token);


  const checkSpotifyUser = async () => {
    try {
      const token = getStoredSpotifyToken();
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error fetching Spotify user");

      const user = await response.json();
      setSpotifyUser({ display_name: user.display_name, id: user.id });
    } catch (error) {
      console.error("Erro ao verificar usuário do Spotify:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMethod === "lastfm" && !username.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Last.fm username",
        variant: "destructive",
      });
      return;
    }

    if (authMethod === "spotify" && !getStoredSpotifyToken()) {
      toast({
        title: "Error",
        description: "Please log in to Spotify first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let topItems;
      if (authMethod === "lastfm") {
        topItems = await getLastfmTopItems(username, type as "albums" | "tracks");
      } else {
        const token = getStoredSpotifyToken();
        const endpoint = type === "artists" ? "artists" : "tracks";
        const response = await fetch(`https://api.spotify.com/v1/me/top/${endpoint}?limit=25`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error fetching data from Spotify");

        const data = await response.json();
        topItems = data.items.map((item: any) => ({
          name: item.name,
          artist: type === "artists" ? item.name : item.artists?.map((a: any) => a.name).join(", ") || "Unknown",
          image: type === "artists" ? item.images?.[0]?.url : item.album?.images?.[0]?.url || "",
          playcount: item.popularity || 0,
        }));
      }

      setItems(topItems);
      setHasGenerated(true);
      toast({
        title: "Success!",
        description: `Chart of ${type === "albums" ? "álbuns" : type === "artists" ? "artistas" : "músicas"} generated!`,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error!",
        description: error instanceof Error ? error.message : "Could not generate the collage. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSpotifyLogin = () => {
    initiateSpotifyLogin();
  };

  const handleSpotifyLogout = () => {
    logoutSpotify();
    setSpotifyUser(null);
    setAuthMethod("lastfm");
    setHasGenerated(false);
    setItems([]);
    toast({
      title: "Logged out",
      description: "You have been disconnected from Spotify",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-white/95 backdrop-blur-lg border-red-200 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-red-600">
            <img src="/logo.png" alt="Logo" className="w-6 h-6" />
            Generate your track chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Método de autenticação */}
            <div className="space-y-3">
              <Label className="text-red-700 font-medium">Select a Social Media:</Label>
              <RadioGroup
                value={authMethod}
                onValueChange={(value: "lastfm" | "spotify") => {
                  setAuthMethod(value);
                  setHasGenerated(false);
                  setItems([]);
                  // Reset type to appropriate default for each auth method
                  setType(value === "lastfm" ? "albums" : "artists");
                }}
                className="flex gap-6"
                disabled={loading}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lastfm" id="lastfm" />
                  <Label htmlFor="lastfm" className="flex items-center gap-2 cursor-pointer text-red-600">
                    <img src="/lastfm.png" alt="Spotify logo" className="w-4 h-4" />
                    Last.fm
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spotify" id="spotify" />
                  <Label htmlFor="spotify" className="flex items-center gap-2 cursor-pointer text-red-600">
                    <img src="/spotify.png" alt="Spotify logo" className="w-4 h-4" />
                    Spotify
                  </Label>
                </div>
                </div>
              </RadioGroup>
            </div>

            {/* Input para Last.fm */}
            {authMethod === "lastfm" && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-red-700 font-medium">
                  Last.fm Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="user_lastfm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background border-red-300 focus:border-red-500"
                  disabled={loading}
                />
              </div>
            )}

            {/* Status do Spotify */}
            {authMethod === "spotify" && (
              <div className="space-y-3">
                {getStoredSpotifyToken() && spotifyUser ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-700 font-medium">Connected to Spotify</p>
                        <p className="text-green-600 text-sm">User: {spotifyUser.display_name}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSpotifyLogout}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        Log out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium mb-2">Connect to Spotify</p>
                    <Button
                      type="button"
                      onClick={handleSpotifyLogin}
                      className="bg-stone-800 hover:bg-green-600 text-white"
                    >
                      <img src="/spotify.png" alt="Spotify logo" className="w-4 h-4" />
                      Log in with Spotify
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Tipo de conteúdo - dinâmico baseado no método */}
            <div className="space-y-3">
              <Label className="text-red-700 font-medium">Select a Metric:</Label>
              <RadioGroup
                value={type}
                onValueChange={(value: "albums" | "artists" | "tracks") => setType(value)}
                className="flex gap-6"
                disabled={loading}
              >
                {authMethod === "lastfm" ? (
                  <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                        Tracks
                      </Label>
                    </div>
                  </div>
                  </>
                ) : (
                  <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="artists" id="artists" />
                      <Label htmlFor="artists" className="flex items-center gap-2 cursor-pointer text-red-600">
                        <User className="w-4 h-4" />
                        Artists
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tracks" id="tracks" />
                      <Label htmlFor="tracks" className="flex items-center gap-2 cursor-pointer text-red-600">
                        <Music className="w-4 h-4" />
                        Tracks
                      </Label>
                    </div>
                  </div>
                  </>
                )}
              </RadioGroup>
            </div>

            <Button
              type="submit"
              disabled={loading || (authMethod === "spotify" && !getStoredSpotifyToken())}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-lg transition-all duration-300 hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating chart...
                </>
              ) : (
                "Generate Chart"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {hasGenerated && (
        <CollageGrid 
          items={items} 
          type={type} 
          username={authMethod === "lastfm" ? username : spotifyUser?.display_name || "Spotify User"}
        />
      )}
    </div>
  );
};

export default LastfmCollage;