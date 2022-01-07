import { useEffect } from "react";
import { useLocalStorage } from "hooks/useSessionStorage";
import { Title } from "components/Title/Title";
import { useTheme } from "context/ThemeContext";

const themes = [
  {
    name: "BOW",
    class: "light",
  },
  {
    name: "WOB",
    class: "dark",
  },
  {
    name: "Red Samurai",
    class: "red-samurai",
  },
  {
    name: "Laser",
    class: "laser",
  },
  {
    name: "Susuwatari",
    class: "susuwatari",
  },
  {
    name: "Modern Dolch",
    class: "modern-dolch",
  },
];

const Theme = () => {
  const { currentTheme, setCurrentTheme } = useTheme();

  return (
    <div>
      <Title>Theme</Title>

      <div className="grid gap-1 grid-cols-2">
        {themes.map((theme) => (
          <div
            className={`${
              theme.class
            } bg-primary p-2 rounded-md hover:border-yellow-500 border-2 ${
              theme.class === currentTheme && "border-yellow-500"
            }`}
            key={theme.name}
            onClick={() => setCurrentTheme(theme.class)}
          >
            <p className="text-primary">{theme.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Theme;
