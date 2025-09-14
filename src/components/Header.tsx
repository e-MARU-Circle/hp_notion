import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-stone-200 px-10 py-5 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-3 text-stone-900">
        <h1 className="text-xl font-black tracking-tighter">ABOJC</h1>
      </div>
      <nav className="flex items-center gap-8 text-sm font-medium">
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
