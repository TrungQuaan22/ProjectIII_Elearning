import useRouteElements from './routes/useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const routeElements = useRouteElements()
  return (
    <>
      {routeElements}
      <ToastContainer autoClose={1000} />
    </>
  )
}

export default App
