import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between border-b border-solid border-stone-200 px-4 sm:px-6 lg:px-10 py-4 sm:py-5 sticky top-0 bg-white/80 backdrop-blur-sm z-10 gap-2">
      <div className="flex items-center gap-3 text-stone-900">
        <h1 className="text-xl font-black tracking-tighter">ABOJC</h1>
      </div>
      <nav className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 text-sm font-medium w-full sm:w-auto justify-center sm:justify-end">
        <Link href="#about" className="text-stone-600 hover:text-stone-900 transition-colors">
          About Us
        </Link>
        <Link href="#papers" className="text-stone-600 hover:text-stone-900 transition-colors">
          論文紹介
        </Link>
        <Link href="#members" className="text-stone-600 hover:text-stone-900 transition-colors">
          Group Members
        </Link>
        <Link href="#contact" className="text-stone-600 hover:text-stone-900 transition-colors">
          Contact Us
        </Link>
      </nav>
    </header>
  );
};

export default Header;
