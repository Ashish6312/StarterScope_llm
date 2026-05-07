/// <reference types="vite/client" />

// Minimal typing so `window.google.maps.places.Autocomplete` can be used without adding extra deps.
declare global {
  interface Window {
    google?: any;
  }
}

export {};
