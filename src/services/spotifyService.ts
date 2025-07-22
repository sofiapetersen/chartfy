const CLIENT_ID = "SUA API AQUI";
const REDIRECT_URI = "https://chartfy.vercel.app/callback";
const SPOTIFY_API = "https://accounts.spotify.com";
const SCOPES = "user-top-read user-read-private";

function generateCodeVerifier(length = 128): string {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let codeVerifier = "";
  for (let i = 0; i < length; i++) {
    codeVerifier += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return codeVerifier;
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function initiateSpotifyLogin() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem("spotify_code_verifier", codeVerifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  window.location.href = `${SPOTIFY_API}/authorize?${params.toString()}`;
}

export async function exchangeToken(code: string): Promise<string> {
  const codeVerifier = localStorage.getItem("spotify_code_verifier");
  if (!codeVerifier) throw new Error("Code verifier não encontrado.");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  });

  const response = await fetch(`${SPOTIFY_API}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erro ao obter token.");

  localStorage.setItem("spotify_access_token", data.access_token);
  return data.access_token;
}

export function getStoredSpotifyToken(): string | null {
  return localStorage.getItem("spotify_access_token");
}

export function logoutSpotify() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_code_verifier");
}