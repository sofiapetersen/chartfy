interface LastfmItem {
  name: string;
  artist: string;
  image: string;
  playcount: number;
}

// Chave de API pública do Last.fm 
const LASTFM_API_KEY = "PUT YOUR LASTFM API HERE";
const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export const getLastfmTopItems = async (
  username: string,
  type: "albums" | "tracks"
): Promise<LastfmItem[]> => {
  const method = type === "albums" ? "user.gettopalbums" : "user.gettoptracks";
  const period = "1month"; // últimos 30 dias
  const limit = 25; // para grade 5x5

  const url = new URL(LASTFM_BASE_URL);
  url.searchParams.append("method", method);
  url.searchParams.append("user", username);
  url.searchParams.append("api_key", LASTFM_API_KEY);
  url.searchParams.append("format", "json");
  url.searchParams.append("period", period);
  url.searchParams.append("limit", limit.toString());

  console.log("Fazendo requisição para:", url.toString());

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Dados recebidos:", data);

    if (data.error) {
      throw new Error(data.message || "Erro na API do Last.fm");
    }

    const items = type === "albums" ? data.topalbums?.album : data.toptracks?.track;
    
    if (!items || !Array.isArray(items)) {
      throw new Error("Nenhum dado encontrado para este usuário");
    }

    // Para tracks, buscar imagem do álbum de cada track
    if (type === "tracks") {
      const itemsWithAlbumImages = await Promise.all(
        items.map(async (item: any) => {
          console.log("Processando track:", item);
          
          const artistName = item.artist?.["#text"] || item.artist?.name || item.artist || "Artista desconhecido";
          const albumName = item.album?.["#text"] || "";
          const trackName = item.name || "Sem título";
          
          let imageUrl = "";
          
          // Estratégia 1: Se tiver álbum, buscar a imagem do álbum
          if (albumName && albumName.trim()) {
            try {
              imageUrl = await getAlbumImage(artistName, albumName);
              console.log("Imagem do álbum encontrada:", imageUrl);
            } catch (error) {
              console.warn("Erro ao buscar imagem do álbum:", error);
            }
          }
          
          // Estratégia 2: Se não conseguiu imagem do álbum, buscar info da track
          if (!imageUrl || imageUrl.trim() === "") {
            try {
              imageUrl = await getTrackAlbumImage(artistName, trackName);
              console.log("Imagem via track.getInfo encontrada:", imageUrl);
            } catch (error) {
              console.warn("Erro ao buscar imagem via track.getInfo:", error);
            }
          }
          
          // Estratégia 3: Fallback para imagem direta da track (se existir)
          if (!imageUrl || imageUrl.trim() === "") {
            imageUrl = getImageUrl(item.image);
            console.log("Usando imagem direta da track:", imageUrl);
          }
          
          // Estratégia 4: Último recurso - buscar imagem do artista
          if (!imageUrl || imageUrl.trim() === "") {
            try {
              imageUrl = await getArtistImage(artistName);
              console.log("Imagem do artista encontrada:", imageUrl);
            } catch (error) {
              console.warn("Erro ao buscar imagem do artista:", error);
            }
          }
          
          return {
            name: trackName,
            artist: artistName,
            image: imageUrl,
            playcount: parseInt(item.playcount) || 0,
          };
        })
      );
      
      return itemsWithAlbumImages;
    }

    // Para albums, usar a imagem direta
    return items.map((item: any) => {
      console.log("Processando album:", item);
      
      const artistName = item.artist?.name || item.artist || "Artista desconhecido";
      const imageUrl = getImageUrl(item.image);
      console.log("URL da imagem extraída:", imageUrl);
      
      return {
        name: item.name || "Sem título",
        artist: artistName,
        image: imageUrl,
        playcount: parseInt(item.playcount) || 0,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar dados do Last.fm:", error);
    throw error;
  }
};

const getArtistImage = async (artist: string): Promise<string> => {
  const url = new URL(LASTFM_BASE_URL);
  url.searchParams.append("method", "artist.getinfo");
  url.searchParams.append("artist", artist);
  url.searchParams.append("api_key", LASTFM_API_KEY);
  url.searchParams.append("format", "json");

  console.log("Buscando imagem do artista:", artist);

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || "Erro na API do Last.fm");
    }

    const artistInfo = data.artist;
    if (artistInfo && artistInfo.image) {
      const imageUrl = getImageUrl(artistInfo.image);
      console.log("Imagem do artista encontrada:", imageUrl);
      return imageUrl;
    }
    
    return "";
  } catch (error) {
    console.error("Erro ao buscar imagem do artista:", error);
    return "";
  }
};

const getTrackAlbumImage = async (artist: string, track: string): Promise<string> => {
  const url = new URL(LASTFM_BASE_URL);
  url.searchParams.append("method", "track.getinfo");
  url.searchParams.append("artist", artist);
  url.searchParams.append("track", track);
  url.searchParams.append("api_key", LASTFM_API_KEY);
  url.searchParams.append("format", "json");

  console.log("Buscando imagem via track.getInfo:", artist, "-", track);

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || "Erro na API do Last.fm");
    }

    const trackInfo = data.track;
    if (trackInfo && trackInfo.album && trackInfo.album.image) {
      const imageUrl = getImageUrl(trackInfo.album.image);
      console.log("Imagem do álbum via track.getInfo encontrada:", imageUrl);
      return imageUrl;
    }
    
    return "";
  } catch (error) {
    console.error("Erro ao buscar imagem via track.getInfo:", error);
    return "";
  }
};

const getAlbumImage = async (artist: string, album: string): Promise<string> => {
  const url = new URL(LASTFM_BASE_URL);
  url.searchParams.append("method", "album.getinfo");
  url.searchParams.append("artist", artist);
  url.searchParams.append("album", album);
  url.searchParams.append("api_key", LASTFM_API_KEY);
  url.searchParams.append("format", "json");

  console.log("Buscando imagem do álbum:", artist, "-", album);

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || "Erro na API do Last.fm");
    }

    const albumInfo = data.album;
    if (albumInfo && albumInfo.image) {
      const imageUrl = getImageUrl(albumInfo.image);
      console.log("Imagem do álbum encontrada:", imageUrl);
      return imageUrl;
    }
    
    return "";
  } catch (error) {
    console.error("Erro ao buscar imagem do álbum:", error);
    return "";
  }
};

const getImageUrl = (images: any[]): string => {
  console.log("Imagens recebidas:", images);
  
  if (!images || !Array.isArray(images)) {
    console.log("Nenhuma imagem encontrada ou formato inválido");
    return "";
  }
  
  // Procurar pela maior imagem disponível
  const sizes = ["extralarge", "large", "medium", "small"];
  
  for (const size of sizes) {
    const image = images.find(img => img.size === size);
    if (image && image["#text"] && image["#text"].trim()) {
      console.log(`Imagem ${size} encontrada:`, image["#text"]);
      return image["#text"];
    }
  }
  
  // Se não encontrar nenhuma imagem com tamanho específico, tentar a primeira disponível
  const firstImage = images.find(img => img["#text"] && img["#text"].trim());
  if (firstImage) {
    console.log("Usando primeira imagem disponível:", firstImage["#text"]);
    return firstImage["#text"];
  }
  
  console.log("Nenhuma imagem válida encontrada");
  return "";
};