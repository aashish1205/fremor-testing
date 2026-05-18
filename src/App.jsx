import { useState, useEffect } from 'react'
import RouterPage from './Pages/RouterPage';
import FremorLoader from './Components/Loader/loader';

function App() {
  const [loading, setLoading] = useState(true)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setTimeout(() => setShowLoader(false), 500)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="App">
      {loading && <FremorLoader show={showLoader} />}
      {!loading && <RouterPage />}
    </div>
  );
}

export default App;