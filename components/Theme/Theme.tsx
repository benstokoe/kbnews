import { Title } from "components/Title/Title";
import { useTheme } from "context/ThemeContext";
import themes from "themes";

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
