import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { StorageContextProvider } from './reducers/storageReducer.jsx'

createRoot(document.getElementById('root')).render(
    <StorageContextProvider>
        <App />
    </StorageContextProvider>
)