
export const APP_VERSION = 1.0;
export const SETTINGS_KEY = "ePubViewer_settings_" + APP_VERSION
export const settingOptions = {
  themes: {
    "SepiaLight": {
      label: "Sepia",
      "background-color": "#FBF0D9",
      "color": "#704214",
      "light": true
    },
    "White": {
      label: "White",
      "color": "#000000",
      "background-color": "#FFFFFF",
      "light": true
    },
    "Black": {
      label: "Black",
      "background-color": "#000000",
      "color": "#FFFFFF",
      "light": false
    },
    "Gray": {
      label: "Gray",
      "background-color": "#333333",
      "color": "#EEEEEE",
      "light": false
    },
    "Dark": {
      label: "Dark",
      "background-color": "#262c2e",
      "color": "#f0f2f3",
      "light": false
    },
    "SolarizedLight": {
      label: "Solarized Light",
      "background-color": "#fdf6e3",
      "color": "#657b83",
      "light": true
    },
    "SolarizedDark": {
      label: "Solarized Dark",
      "color": "#839496",
      "background-color": "#002b36",
      "light": false
    },
  },
  fonts: {
    "ArbutusSlab": {
      label: "Arbutus Slab",
      "link": "https://fonts.googleapis.com/css?family=Arbutus+Slab",
      "font-family": "'Arbutus Slab', Georgia, serif"
    },
    "DroidSerif": {
      label: "Droid Serif",
      "link": "https://fonts.googleapis.com/css?family=Droid+Serif:400,400i,700,700i",
      "font-family": "'Droid Serif', Georgia, serif"
    },
    "OpenSans": {
      label: "Open Sans",
      "link": "https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i",
      "font-family": "'Open Sans', Ubuntu, Trebuchet, sans-serif"
    },
    "SourceCodePro": {
      label: "Source Code Pro",
      "link": "https://fonts.googleapis.com/css?family=Source+Code+Pro:200,300,400,500,600,700,900",
      "font-family": "'Source Code Pro', 'Open Sans', sans-serif"
    },
    "SourceSansPro": {
      label: "Source Sans Pro",
      "link": "https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese",
      "font-family": "'Source Sans Pro', sans-serif"
    }
  },
  fontSizes: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  lineHeights: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.2, 2.4, 2.6, 2.8, 3],
  margins: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}

export const defaultSettings = {
  "theme": "White",
  "font": "OpenSans",
  "line-height": "1.5",
  "font-size": "11",
  "margin": "5"
}
