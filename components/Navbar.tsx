import Logo from "./navbar/Logo";
import Avatar from "./navbar/Avatar";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between py-2 px-6 border border-white/20 bg-gray-600 backdrop-blur-3xl shadow-lg rounded-lg mx-7 my-2">
      <Logo />
      <Avatar />
    </div>
  );
};

export default Navbar;
