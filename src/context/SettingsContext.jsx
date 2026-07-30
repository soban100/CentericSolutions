import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loaded, setLoaded] = useState(false);

  const applyBranding = (s) => {
    const root = document.documentElement;
    root.style.setProperty("--primary", s.primary_color || "#5B4FE5");
    root.style.setProperty("--secondary", s.secondary_color || "#0EA97A");
    root.style.setProperty("--accent", s.accent_color || "#E8B646");
  };

  useEffect(() => {
    api.getSettings()
      .then((data) => {
        const s = data || {};
        setSettings(s);
        applyBranding(s);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) return { settings: {}, loaded: false };
  return ctx;
}
