import { useEffect } from "react";
import { exchangeToken } from "../services/spotifyService";

export default function Callback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      exchangeToken(code)
        .then(() => {
          window.location.href = "/";
        })
        .catch((err) => {
          console.error("Erro ao trocar código por token:", err);
        });
    }
  }, []);

  return <p>Authenticating with Spotify...</p>;
}
