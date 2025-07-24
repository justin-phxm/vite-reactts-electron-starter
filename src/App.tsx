import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppBar from "./AppBar";

import SwitchDarkMode from "./SwitchDarkMode";
import SelectLanguage from "./SelectLanguage";

function App() {
  console.log(window.ipcRenderer);

  const [isOpen, setOpen] = useState(false);
  const [isSent, setSent] = useState(false);
  const [fromMain, setFromMain] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleToggle = () => {
    if (isOpen) {
      setOpen(false);
      setSent(false);
    } else {
      setOpen(true);
      setFromMain(null);
    }
  };
  const sendMessageToElectron = () => {
    if (window.Main) {
      window.Main.sendMessage(t("common.helloElectron"));
    } else {
      setFromMain(t("common.helloBrowser"));
    }
    setSent(true);
  };

  useEffect(() => {
    window.Main.removeLoading();
  }, []);

  useEffect(() => {
    if (isSent && window.Main)
      window.Main.on("message", (message: string) => {
        setFromMain(message);
      });
  }, [fromMain, isSent]);

  return (
    <div className="flex flex-col">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
      <div className="flex-auto">
        <div className="mx-4 mt-4 flex items-center justify-between">
          <SwitchDarkMode />
          <SelectLanguage />
        </div>
        <div className="flex h-full flex-col items-center justify-center space-y-4 pt-32">
          <h1 className="text-2xl dark:text-gray-200">
            Vite + React + Typescript + Electron + Tailwind
          </h1>
          <button
            className="rounded bg-yellow-400 px-4 py-2 shadow hover:bg-yellow-200 focus:outline-none dark:text-black"
            onClick={handleToggle}>
            {t("common.clickMe")}
          </button>
          {isOpen && (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex space-x-3">
                <h1 className="text-xl dark:text-gray-50">
                  {t("common.welcome")}
                </h1>
                <button
                  onClick={sendMessageToElectron}
                  className=" rounded bg-green-400 px-4 py-0 hover:bg-green-300 focus:outline-none dark:text-black">
                  {t("common.send")}
                </button>
              </div>
              {isSent && (
                <div>
                  <h4 className="text-green-600 dark:text-green-500">
                    {t("common.messageSent")}
                  </h4>
                </div>
              )}
              {fromMain && (
                <div>
                  {" "}
                  <h4 className="text-yellow-800 dark:text-yellow-200">
                    {t(fromMain)}
                  </h4>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
