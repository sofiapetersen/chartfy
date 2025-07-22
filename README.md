# Chartfy

**Create beautiful music charts from your Last.fm listening history!**

## About the Project

Chartfy is a web application that transforms your Last.fm music history into stunning visual charts. Generate 5x5 grids featuring your top 25 albums or tracks from the last month and download them as images to share your musical discoveries!

## Features

-  **Custom Collages** - Create 5x5 grids with your top 25 albums, tracks, or artists
-  **Last.fm Integration** - Connect directly with your Last.fm account
-  **Spotify Integration** - Connect with your Spotify account for personalized data
-  **Responsive Interface** - Modern design that works on all devices
-  **High Quality Downloads** - Download your collages as PNG images
-  **Interactive Visualization** - Hover to see details and toggle to show/hide information
-  **Real-time Data** - Based on your recent listening history
-  **Artist Grids** - Generate charts with your most listened artists

## How It Works

### Last.fm Mode:
1. **Enter your Last.fm username**
2. **Choose type**: Albums or Tracks
3. **Generate chart** - System automatically fetches your top 25 in the last 30 days
4. **Customize** - Toggle information display on/off
5. **Download** - Save your chart as PNG image

### Spotify Mode:
1. **Connect with Spotify** - Authenticate with your Spotify account
2. **Choose type**: Tracks or Artists
3. **Generate collage** - System fetches your personalized listening data in the last 30 days
4. **Customize & Download** - Same customization options as Last.fm

## Technologies Used

- **React** - Interactive user interface
- **TypeScript** - Static typing for better reliability
- **Tailwind CSS** - Modern and responsive styling
- **Vite** - Optimized build tool
- **Lucide React** - Elegant icons
- **HTML2Canvas** - DOM to image conversion
- **Shadcn/ui** - Consistent UI components

## Music APIs

### Last.fm API
- User's top albums (last month)
- User's top tracks (last month)
- Album covers
- Play counts

### Spotify Web API
- User's top tracks (last month)
- User's top artists (last month)
- Artist images and track album covers
- Popularity scores and follower counts

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Last.fm account or Spotify account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sofiapetersen/chartfy.git
cd chartfy
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
# Change file /src/services/lastfmService.ts with your Last.fm API key
```

4. Run the project:
```bash
npm run dev
# or
yarn dev
```

5. Access `http://localhost:8080`

## 📁 Project Structure

```
chartfy/
├── src/
│   ├── components/
│   │   ├── LastfmCollage.tsx    # Last.fm and Spotify integration  
│   │   ├── CollageGrid.tsx      # Collage grid display
│   │   └── ui/                  # UI components
│   ├── services/
│   │   ├── lastfmService.ts     # Last.fm API integration
│   │   └── spotifyService.ts    # Spotify API integration
│   └── hooks/                   # Custom hooks
├── public/
└── index.html
```

## API Configuration

### Last.fm Setup:
1. Create a [Last.fm](https://www.last.fm) account
2. Get an API key at [Last.fm API](https://www.last.fm/api)

### Spotify Setup:
1. Create a [Spotify Developer](https://developer.spotify.com) account
2. Create a new app in your Spotify Dashboard
3. Add `http://localhost:8080/callback` to your redirect URIs
4. Get your Client ID and Client Secret

**Important:** Due to Spotify's development mode restrictions, only users added to your app's dashboard can connect to Spotify.

## Future Features

- [ ] Support for different time periods in Last.fm and Spotify mode
- [ ] Variable grid sizes (3x3, 4x4, 6x6)
- [ ] Direct social media sharing
- [ ] Dark mode
- [ ] Spotify playlist creation from collages

## Known Issues

### Last.fm:
- **Username not found**: Check if the username is correct
- **Images not loading**: Some covers may not be available in the API

### Spotify:
- **Connection failed**: Only users added to the app's dashboard can connect due to Spotify's development mode restrictions
- **Limited users**: Free Spotify API only allows whitelisted users to authenticate
- **Rate limits**: Spotify API has rate limiting for requests

### General:
- **Download error**: Check if browser allows downloads
- **Slow loading**: Large image requests may take time to process

## Credits

- Music data provided by [Last.fm API](https://www.last.fm/api)
- Spotify data provided by [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- Inspired by the music enthusiast community

---

**Show your passion for music with Chartfy!** 
