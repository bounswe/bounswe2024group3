import Header from "./Header";

const Layout = ({ children }: any) => {
  return (
    <div className="p-3">
      <Header />
      <div className="mx-auto w-full w-4/5 p-4 w-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
