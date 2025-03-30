import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SearchProvider } from './components/context/SearchContext.tsx'
import { AuthProvider } from "./components/context/AuthContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SearchProvider>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </SearchProvider>
    </StrictMode>,
)
