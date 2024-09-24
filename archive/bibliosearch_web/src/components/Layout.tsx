import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: any) => {
  return (
    <div className="p-3">
      <Header />
      <div className="mx-auto w-full md:w-3/4 lg:w-1/2 p-4 w-screen">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
