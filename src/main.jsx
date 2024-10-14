import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './router/adm/login/Login.jsx'
import App from './App.jsx'
import './index.css'
import Initial from './router/adm/initial/Initial.jsx'
import ListaEvento from './router/adm/evento/ListaEvento.jsx'
import CriarEvento from './router/adm/evento/CriarEvento.jsx'
import ListaPontoColeta from "./router/adm/pontoColeta/ListaPontoColeta.jsx"
import CriarPontoColeta from './router/adm/pontoColeta/CriarPontoColeta.jsx'
import ListaDoacoesRetirar from './router/adm/doacoes/ListaDoacoesRetirar.jsx'
import Prioridade from './router/adm/doacoes/prioridade/Prioridade.jsx'
import EditarPrioridade from './router/adm/doacoes/prioridade/editPrioridade/EditarPrioridade.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Login/>,
      },
      {
        path: '/home',
        element: <Initial/>,
      },
      {
        path: '/listaEvento',
        element: <ListaEvento/>,
      },
      {
        path: '/criarEvento',
        element: <CriarEvento/>,
      },
      {
        path: '/listaPontoColeta',
        element: <ListaPontoColeta/>,
      },
      {
        path: '/criarPontoColeta',
        element: <CriarPontoColeta/>,
      },
      {
        path: '/listaDoacoesRetirar',
        element: <ListaDoacoesRetirar/>,
      },
      {
        path: '/prioridade',
        element: <Prioridade/>,
      },
      {
        path: '/editarPrioridade',
        element: <EditarPrioridade/>,
      },

    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
