import { useState, useEffect } from 'react'
import RouterPage from './Pages/RouterPage';
import FremorLoader from './Components/Loader/loader';

function App() {
  const hasShownBrand = sessionStorage.getItem('brandPreloaderShown');
  const [showLoader, setShowLoader] = useState(!hasShownBrand);

  useEffect(() => {
    if (hasShownBrand) return;

    const handleLoad = () => {
      setShowLoader(false);
      sessionStorage.setItem('brandPreloaderShown', 'true');
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      
      // Safety fallback timer of 6 seconds in case of slow resources
      const fallback = setTimeout(handleLoad, 6000);
      
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(fallback);
      };
    }
  }, [hasShownBrand]);

  return (
    <div className="App">
      <RouterPage />
      {showLoader && <FremorLoader show={showLoader} />}
    </div>
  );
}

export default App;