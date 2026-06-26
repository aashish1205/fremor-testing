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

    // React has mounted, so DOM is interactive. Wait 800ms to show the preloader animation
    // without blocking the user on heavy assets like videos and images.
    const timer = setTimeout(handleLoad, 800);
    return () => clearTimeout(timer);
  }, [hasShownBrand]);

  return (
    <div className="App">
      <RouterPage />
      {showLoader && (
        <FremorLoader 
          show={showLoader} 
          isPlain={window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/team')} 
        />
      )}
    </div>
  );
}

export default App;