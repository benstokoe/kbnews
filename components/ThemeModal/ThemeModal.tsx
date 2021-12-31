import { useEffect } from "react";
import Modal from "components/Modal/Modal";
import { useLocalStorage } from "hooks/useSessionStorage";

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
    name: "Nord",
    class: "nord",
  },
  {
    name: "Solarized Light",
    class: "solarized-light",
  },
  {
    name: "Solarized Dark",
    class: "solarized-dark",
  },
];

const ThemeModal = ({ showing, toggle }) => {
  const [currentTheme, setCurrentTheme] = useLocalStorage(
    "currentTheme",
    "light"
  );

  useEffect(() => {
    document.body.classList.add(currentTheme);

    return () => {
      document.body.classList.remove(currentTheme);
    };
  }, [currentTheme]);
  return (
    <Modal title="Theme" showing={showing} toggle={toggle}>
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
    </Modal>
  );
};

export default ThemeModal;
