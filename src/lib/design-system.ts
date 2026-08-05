export const designSystem = {
  breakpoints: {
    mobile: "0px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1440px",
  },
  icon: {
    size: { sm: 16, md: 20, lg: 24 },
    strokeWidth: 1.75,
  },
  animation: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
  zIndex: {
    dropdown: 40,
    dialog: 50,
    drawer: 50,
    toast: 60,
    tooltip: 70,
    loading: 80,
    modal: 90,
  },
} as const;
