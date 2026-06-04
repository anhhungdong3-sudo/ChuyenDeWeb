import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Auth from "./components/Auth";
import AppRoutes from "./routes/AppRoutes";
import { ChatBox } from "./components/ChatBox"; // Đảm bảo import đúng đường dẫn

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");

  const handleOpenAuth = (tabType) => {
    setAuthTab(tabType);
    setIsAuthOpen(true);
  };

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={false} onOpenAuth={handleOpenAuth} />

        <main style={{ minHeight: "80vh" }}>
          <AppRoutes />
          {/* ChatBox nằm ở đây sẽ luôn hiển thị trên mọi trang */}
          <ChatBox />
        </main>

        <Footer />

        <Auth
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          defaultTab={authTab}
        />
      </div>
    </Router>
  );
}

export default App;
