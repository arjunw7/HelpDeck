import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MenuItem {
  id: string;
  label: string;
  url: string;
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string | null;
  primaryFont: string | null;
  secondaryFont: string | null;
  headerBackground: string;
  headerText: string;
  headerLink: string;
  headerLinkHover: string;
  primary: string;
  text: string;
  link: string;
  linkHover: string;
  background: string;
}

export interface KnowledgeBaseSettings {
  general: {
    title: string;
    description: string;
    logo: string;
    favicon: string;
    headerImage: string;
    socialImage: string;
  };
  theme: ThemeSettings;
  navigation: {
    menuItems: MenuItem[];
    footerItems: MenuItem[];
    homepageUrl: string;
    homepageLabel: string;
    enableChangeLogs: boolean;
  };
  content: {
    pinnedArticles: string[];
    popularArticles: string[];
    showContactSupport: boolean;
    contactEmail: string;
    categoriesPerRow: number;
    articlesPerRow: number;
    showChangeLogs: boolean;
    showAuthors: boolean;
    showAuthorAvatar: boolean;
    showArticleDescription: boolean;
    truncateDescription: boolean;
    showCollectionIcon: boolean;
    largeCollectionIcon: boolean;
    showCollectionDescription: boolean;
    searchBarLength: "short" | "medium" | "long";
    searchBarAlignment: "left" | "center" | "right";
    instantSearch: boolean;
    segmentedSearch: boolean;
    showRelatedArticles: boolean;
  };
}

interface CustomizeStore {
  settings: KnowledgeBaseSettings;
  updateGeneralSettings: (settings: Partial<KnowledgeBaseSettings["general"]>) => void;
  updateThemeSettings: (settings: Partial<KnowledgeBaseSettings["theme"]>) => void;
  updateNavigationSettings: (settings: Partial<KnowledgeBaseSettings["navigation"]>) => void;
  updateContentSettings: (settings: Partial<KnowledgeBaseSettings["content"]>) => void;
  updateSettings: (settings: KnowledgeBaseSettings) => void;
}

const defaultSettings: KnowledgeBaseSettings = {
  general: {
    title: "Knowledge Base",
    description: "Find answers to your questions",
    logo: "",
    favicon: "",
    headerImage: "",
    socialImage: "",
  },
  theme: {
    primaryColor: "#0091FF",
    accentColor: "#00C2FF",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontFamily: null,
    primaryFont: null,
    secondaryFont: null,
    headerBackground: "#ffffff",
    headerText: "#000000",
    headerLink: "#0091FF",
    headerLinkHover: "#0070CC",
    primary: "#0091FF",
    text: "#000000",
    link: "#0091FF",
    linkHover: "#0070CC",
    background: "#ffffff",
  },
  navigation: {
    menuItems: [],
    footerItems: [],
    homepageUrl: "",
    homepageLabel: "Website",
    enableChangeLogs: false,
  },
  content: {
    pinnedArticles: [],
    popularArticles: [],
    showContactSupport: true,
    contactEmail: "",
    categoriesPerRow: 3,
    articlesPerRow: 3,
    showChangeLogs: false,
    showAuthors: true,
    showAuthorAvatar: true,
    showArticleDescription: true,
    truncateDescription: true,
    showCollectionIcon: true,
    largeCollectionIcon: false,
    showCollectionDescription: true,
    searchBarLength: "medium",
    searchBarAlignment: "center",
    instantSearch: true,
    segmentedSearch: true,
    showRelatedArticles: true,
  },
};

export const useCustomizeStore = create<CustomizeStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateGeneralSettings: (generalSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            general: { ...state.settings.general, ...generalSettings },
          },
        })),
      updateThemeSettings: (themeSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            theme: { ...state.settings.theme, ...themeSettings },
          },
        })),
      updateNavigationSettings: (navigationSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            navigation: { ...state.settings.navigation, ...navigationSettings },
          },
        })),
      updateContentSettings: (contentSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            content: { ...state.settings.content, ...contentSettings },
          },
        })),
      updateSettings: (settings) => set({ settings }),
    }),
    {
      name: "knowledge-base-settings",
    }
  )
);