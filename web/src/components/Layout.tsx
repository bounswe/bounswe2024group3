import Header from "./Header";

const Layout = ({ children }: any) => {
  return (
    <div className="p-3">
      <Header />
      <div className="mx-auto w-full md:w-3/4 lg:w-1/2 p-4 w-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
