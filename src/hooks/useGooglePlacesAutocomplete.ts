import { useEffect, useRef, useState } from "react";

type UseGooglePlacesAutocompleteParams = {
  input: HTMLInputElement | null;
  onPlaceSelected: (placeLabel: string) => void;
  enabled?: boolean;
};

let googleMapsScriptPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places) return Promise.resolve();

  if (!googleMapsScriptPromise) {
    googleMapsScriptPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps script")), {
          once: true,
        });
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.dataset.googleMaps = "true";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        apiKey
      )}&libraries=places`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Google Maps script"));
      document.head.appendChild(script);
    });
  }
  return googleMapsScriptPromise;
}

export function useGooglePlacesAutocomplete({
  input,
  onPlaceSelected,
  enabled = true,
}: UseGooglePlacesAutocompleteParams) {
  const [ready, setReady] = useState(false);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    if (!enabled || !input || !key) return;

    let cancelled = false;

    loadGoogleMapsScript(key)
      .then(() => {
        if (cancelled) return;
        const g = window.google;
        if (!g?.maps?.places?.Autocomplete) return;

        autocompleteRef.current = new g.maps.places.Autocomplete(input, {
          fields: ["formatted_address", "name", "geometry"],
          // Allow worldwide suggestions (cities, regions, countries).
          types: ["(regions)"],
        });

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace?.();
          const label =
            (place?.formatted_address as string | undefined) ||
            (place?.name as string | undefined) ||
            "";
          if (label) onPlaceSelected(label);
        });

        setReady(true);
      })
      .catch(() => {
        // If the script fails to load, we silently fall back to plain input.
      });

    return () => {
      cancelled = true;
      autocompleteRef.current = null;
    };
  }, [enabled, input, onPlaceSelected]);

  return { ready };
}

