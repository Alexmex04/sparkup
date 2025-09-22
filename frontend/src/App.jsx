import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";

import "./App.css";

function App() {

 
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
   
   
    </BrowserRouter>
    
  );
}

export default App;
