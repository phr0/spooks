import { Layout, Menu } from "antd";
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "./auth/authContext";
import { createImplicitAuthFlow } from "./auth/implicitAuthFlow";
import { Home } from "./components/pages/home";
import { Book } from "./components/pages/book";


const useImplicitAuthFlow = createImplicitAuthFlow({
  clientId: 'bcf8c6c229c740a390fd19b3d9de57d7',
  redirectUri: `${window.location.href}`,
  authorizationUri: "https://accounts.spotify.com/authorize",
  query: {
    "response_type": "token"
  },
  scopes: ['user-read-private',"streaming", "user-read-email"]
},{
  silentLoginUrl: "http://localhost:3000/favicon.ico"
});



const App: React.FC = () => {
  return (
    <AuthProvider useAuthFlow={useImplicitAuthFlow}>
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/books/:bookId" component={Book} />
      </Router>
      </AuthProvider>
    
  );
};

export default App;
