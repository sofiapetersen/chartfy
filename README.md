# Chartfy

**Create beautiful music collages from your Last.fm listening history!**

## About the Project

Chartfy is a web application that transforms your Last.fm music history into stunning visual collages. Generate 5x5 grids featuring your top 25 albums or tracks from the last month and download them as images to share your musical discoveries!

## Features

- **Custom Collages** - Create 5x5 grids with your top 25 albums or tracks
- **Last.fm Integration** - Connect directly with your Last.fm account
- **Responsive Interface** - Modern design that works on all devices
- **High Quality Downloads** - Download your collages as PNG images
- **Interactive Visualization** - Hover to see details and toggle to show/hide information
- **Real-time Data** - Based on your last month's music history

## How It Works

1. **Enter your Last.fm username**
2. **Choose type**: Albums or Tracks
3. **Generate collage** - System automatically fetches your top 25
4. **Customize** - Toggle information display on/off
5. **Download** - Save your collage as PNG image

## Technologies Used

- **React** - Interactive user interface
- **TypeScript** - Static typing for better reliability
- **Tailwind CSS** - Modern and responsive styling
- **Vite** - Optimized build tool
- **Lucide React** - Elegant icons
- **HTML2Canvas** - DOM to image conversion
- **Shadcn/ui** - Consistent UI components

## Last.fm API

The project uses the official Last.fm API to fetch:
- User's top albums (last month)
- User's top tracks (last month)
- Album covers
- Play counts

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Last.fm account (to generate collages)

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

```
chartfy/
├── src/
│   ├── components/
│   │   ├── LastfmCollage.tsx    # Main form
│   │   ├── CollageGrid.tsx      # Collage grid
│   │   └── ui/                  # UI components
│   ├── services/
│       └── lastfmService.ts     # Last.fm API integration
│                 # Custom hooks
├── public/
└── index.html
```

## API Configuration

To use Chartfy, you need to:

1. Create a [Last.fm](https://www.last.fm) account
2. Get an API key at [Last.fm API](https://www.last.fm/api)

## Known Issues

- **Username not found**: Check if the username is correct
- **Images not loading**: Some covers may not be available in the API
- **Download error**: Check if browser allows downloads