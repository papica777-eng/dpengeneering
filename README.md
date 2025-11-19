# DP Portfolio - Desktop Application for Windows

This is the desktop application version of Димитър Продромов's Portfolio, built with Electron for Windows.

## Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

## Installation

1. Install the dependencies:
```bash
npm install
```

## Running the Application

To run the application in development mode:

```bash
npm start
```

## Building for Windows

To build the Windows installer:

```bash
npm run build
```

This will create a Windows installer in the `dist` directory.

The installer will be named something like `DP Portfolio Setup 1.0.0.exe`

## Building for Multiple Platforms

To build for Windows, macOS, and Linux:

```bash
npm run build:all
```

## Application Features

- **Offline Support**: The application can run without an internet connection (for the UI)
- **Native Windows Application**: Runs as a native Windows desktop application
- **Firebase Integration**: Connects to Firebase backend for data
- **Modern UI**: Built with Tailwind CSS
- **Menu Bar**: Includes File, View, and Help menus

## Firebase Backend

The application connects to Firebase Cloud Functions at:
- Development: `http://127.0.0.1:5001/kodi-backend/us-central1/`

To run the Firebase emulators for local development:

```bash
cd functions
npm install
cd ..
firebase emulators:start
```

## Directory Structure

```
.
├── electron/          # Electron main process files
│   ├── main.js       # Main Electron application
│   └── preload.js    # Preload script for security
├── public/           # Frontend files
│   ├── index.html    # Main HTML file
│   └── manifest.json # PWA manifest
├── functions/        # Firebase Cloud Functions
├── build/            # Build resources (icons, etc.)
├── dist/             # Build output (generated)
└── package.json      # Project dependencies and scripts
```

## Icon

To customize the application icon:
1. Place a 512x512 PNG icon in `build/icon.png`
2. For Windows, also provide `build/icon.ico`

The default icon URL is used from the manifest, but you can customize it.

## Troubleshooting

### Application won't start
- Make sure you've run `npm install`
- Check that Node.js version 16+ is installed

### Build fails
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Make sure you have the latest version of electron-builder

### Firebase connection issues
- Make sure the Firebase emulators are running
- Check the API_BASE URL in `public/index.html`

## License

ISC

## Author

Димитър Продромов - Junior Backend Developer
