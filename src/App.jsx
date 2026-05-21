import { useState, useEffect } from 'react'
import RouterPage from './Pages/RouterPage';
import FremorLoader from './Components/Loader/loader';

function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setShowLoader(false);
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
  }, []);

  return (
    <div className="App">
      <RouterPage />
      <FremorLoader show={showLoader} />
    </div>
  );
}

export default App;