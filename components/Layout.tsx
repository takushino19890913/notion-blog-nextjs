

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FullPageLoader from './FullPageLoader';

type Props = {
  children?: ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FCF2DC] overflow-hidden">
      <nav className="bg-[#FCB05D] px-20 py-3 h-[15vh] text-[#002066] text-xl font-bold relative flex items-center justify-between">
          <Link href="/" passHref>
          <div className="absolute inset-y-0 left-20 w-auto max-w-full h-full flex items-center py-3">
            <Image src="/images/logo.png" alt={"logo"} width={300} height={65} className='object-contain h-full'/>
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/blog" passHref>
              Blog
            </Link>
            <Link href="/contact" passHref>
              Contact
            </Link>
          </div>
          <div className="md:hidden">
            <button
              className="text-gray-600 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className={`h-6 w-6 ${menuOpen ? 'hidden' : 'block'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`h-6 w-6 ${menuOpen ? 'block' : 'hidden'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link href="/blog" passHref>
                Blog
            </Link>
            <Link href="/contact" passHref>
                Contact
            </Link>
          </div>
        )}
      </nav>
      <FullPageLoader>
      <main className="mx-auto">{children}</main>
      </FullPageLoader>
    </div>
   
  )}

export default Layout;
