"use client"
import PrelineScript from '@/app/PrelineScript';
import LandingSwitcher from '@/shared/layouts-components/switcher/landing-switcher';
import { usePathname } from 'next/navigation';
import React, { Fragment, useEffect, useRef } from 'react'

const Layout = ({ children }) => {

const pathname = usePathname();
const bodyRef = useRef(null);

  useEffect(() => {
    bodyRef.current = document.body
    // Add 'authentication-background' for authentication-related pages
    if (pathname.includes("/basic")) {
      bodyRef.current.classList.add('authentication-background');
    } else {
      bodyRef.current.classList.remove('authentication-background');
    }

    // Add 'coming-soon-main' for the coming soon page
    if (pathname.includes('/coming-soon') || pathname.includes('/under-maintainance')) {
       console.log("comingsoon")
      bodyRef.current.classList.add('coming-soon-main');
    } else {
      bodyRef.current.classList.remove('coming-soon-main');
    }
    if (pathname.includes('/sign-up/cover')) {
      bodyRef.current.classList.add('bg-white');
    } else {
      bodyRef.current.classList.remove('bg-white');
    }
    // Clean up classes on route change
    return () => {
      bodyRef.current.classList.remove('authentication-background');
      bodyRef.current.classList.remove('coming-soon-main');
      bodyRef.current.classList.remove('bg-white');
    };
  }, [pathname]);

  return (
    <Fragment>
      <LandingSwitcher />
      {children}
      <PrelineScript/>
    </Fragment>
  )

}

export default Layout;