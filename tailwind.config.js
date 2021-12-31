const generateColorClass = (variable) => {
  return `var(--${variable})`;
};

const textColor = {
  primary: generateColorClass("text-primary"),
  secondary: generateColorClass("text-secondary"),
  tertiary: generateColorClass("text-tertiary"),
};

const backgroundColor = {
  primary: generateColorClass("bg-primary"),
  secondary: generateColorClass("bg-secondary"),
  tertiary: generateColorClass("bg-tertiary"),
};

module.exports = {
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ["Open Sans", "system-ui", "sans-serif"],
      body: ["Open Sans", "system-ui", "sans-serif"],
    },
    extend: {
      textColor,
      backgroundColor,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
