import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";

function UserLayout() {
    return (
        <>
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <ChatBox />
            <Footer />
        </>
    );
}

export default UserLayout;