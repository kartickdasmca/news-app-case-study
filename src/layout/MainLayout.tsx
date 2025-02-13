import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Contactus from "../components/contactus";
import Footer from "../components/footer";
const MainLayout = () => {
  return (
    <div className="app bg-gray-20">
      {/* Navbar or Menubar  */}
      <Navbar />
      {/* Main content  */}
      <div>
        <Outlet />
      </div>
      {/* Contact Us  */}\
      <Contactus />
      {/* Footer  */}
      <Footer />
    </div>
  );
};

export default MainLayout;
