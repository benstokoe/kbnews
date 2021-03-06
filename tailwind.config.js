const generateColorClass = (variable, defaultVariable) => {
  if (defaultVariable) {
    return `var(--${variable}, var(--${defaultVariable}))`;
  }
  return `var(--${variable})`;
};

const textColor = {
  primary: generateColorClass("text-primary"),
  secondary: generateColorClass("text-secondary"),
  tertiary: generateColorClass("text-tertiary"),
  logo: generateColorClass("text-logo", "text-secondary"),
};

const backgroundColor = {
  primary: generateColorClass("bg-primary"),
  secondary: generateColorClass("bg-secondary"),
  tertiary: generateColorClass("bg-tertiary"),
};

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ["Inter", "system-ui", "sans-serif"],
      body: ["Inter", "system-ui", "sans-serif"],
    },
    extend: {
      textColor,
      backgroundColor,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
