import {createBrowserRouter, RouterProvider} from "react-router-dom"
import { PageDummy } from "./Components/PageDummy"
import { Home } from "./Components/Home"
import Chats from "./Components/Chats"
import './App.css'
import ToastProvider from "./Components/ToastProvider"
import ProtectRoute from "./Components/ProtectRoute"
import { Provider } from "react-redux"
import {store} from "./redux/store"
function App() {

  const router = createBrowserRouter([
    {path : "/", element :<Home/>},
    {path : "/chats", element : <ProtectRoute><Chats /></ProtectRoute>}
  ])

  return (
    <Provider store={store}>
      <div className="App">
        <RouterProvider router={router}/>
        <ToastProvider />  {/*This ToastProvider is in root i.e App.jsx so when this app.jsx gets rendered it gets rendered with it and listen for its call. and if any component gets rendered with the provided router it doesnot gets rerendered as it has been rendered with App.jsx   */}
        
      </div>
    </Provider>
  )
}

export default App
