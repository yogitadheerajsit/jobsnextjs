import React from "react";
import JsAdditionalInfo from "./desktop/JsAdditionalInfo";
import JsAdditionalInfoMobile from "./mobile/JsAdditionalInfoMobile";

const viewportContext = React.createContext({});

const ViewportProvider = ({ children }) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <viewportContext.Provider value={{ width, height }}>
      {children}
    </viewportContext.Provider>
  );
};

const useViewport = () => {
  const { width, height } = React.useContext(viewportContext);
  return { width, height };
};

const MobileComponent = () => <JsAdditionalInfoMobile />;
const DesktopComponent = () => <JsAdditionalInfo />;

const MyComponent = () => {
  const { width } = useViewport();
  const breakpoint = 600;

  return width < breakpoint ? <MobileComponent /> : <DesktopComponent />;
};

export default function JsAdditionalInfoResponsiveLayOut() {
  return (
    <ViewportProvider>
      <MyComponent />
    </ViewportProvider>
  );
}
