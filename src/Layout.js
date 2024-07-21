const Layout = ({ className, children }) => {
  return <div className={`${className} content`}>{children}</div>;
};

export default Layout;
