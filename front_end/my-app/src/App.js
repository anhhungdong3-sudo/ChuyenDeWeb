import React, { useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Auth from "./components/Auth";
import AppRoutes from "./routes/AppRoutes";
import { ChatBox } from "./components/ChatBox";
 // Đảm bảo import đúng đường dẫn

function AppContent({ user, handleOpenAuth, isAuthOpen, setIsAuthOpen, authTab }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="App">
      {!isAdminRoute && <Header isLoggedIn={!!user} onOpenAuth={handleOpenAuth} />}

      <main style={{ minHeight: isAdminRoute ? "100vh" : "80vh" }}>
        <AppRoutes />
        {/* ChatBox chỉ hiển thị ở trang khách hàng */}
        {!isAdminRoute && <ChatBox />}
      </main>

      {!isAdminRoute && <Footer />}

      <Auth
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab={authTab}
      />
    </div>
  );
}

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [user] = useState(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleOpenAuth = (tabType) => {
    setAuthTab(tabType);
    setIsAuthOpen(true);
  };

  return (
    <Router>
      <AppContent
        user={user}
        handleOpenAuth={handleOpenAuth}
        isAuthOpen={isAuthOpen}
        setIsAuthOpen={setIsAuthOpen}
        authTab={authTab}
      />
    </Router>
  );
}

export default App;
