import RootLayout from "./layouts/root-layout";
import Loader from "./app/common/loader";
import ScrollToTop from "./globals/scroll-to-top";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { prefetchHeaderCategoriesFast } from "./adminApi";
import { ensureCustomJsInitialized } from "./globals/constants";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const [isLoading, setLoading] = useState(true);
  

  useEffect(() => {
    ensureCustomJsInitialized().catch(() => {
      // Keep app interactive even if legacy script init fails.
    });
    prefetchHeaderCategoriesFast();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
       <ToastContainer position="top-right" autoClose={3000} />
      {isLoading && <Loader />}
      <ScrollToTop />
      <RootLayout />
    </>
  )
}

export default App;
