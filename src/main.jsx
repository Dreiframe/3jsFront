import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { UrlContextProvider } from './reducers/urlReducer.jsx'

createRoot(document.getElementById('root')).render(
    <UrlContextProvider>
        <App />
    </UrlContextProvider>
)