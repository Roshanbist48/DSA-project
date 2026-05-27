const Navbar = ({ onLogin }) => {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 text-white">
      <div className="text-2xl font-extrabold tracking-tight text-white">
        CRICKET<span className="text-brand-orange">SCORE</span>
      </div>
      <ul className="flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-200">
        <li><a href="#services" className="transition hover:text-white">Services</a></li>
        <li><a href="#about" className="transition hover:text-white">About</a></li>
        <li><a href="#contact" className="transition hover:text-white">Contact</a></li>
        <li>
          <button
            onClick={onLogin}
            className="rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-orange-500"
          >
            Login
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
