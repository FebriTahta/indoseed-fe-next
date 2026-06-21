"use client"
import PrelineScript from '@/app/PrelineScript';
import Backtotop from '@/shared/layouts-components/backtotop/backtotop';
import LandingSwitcher from '@/shared/layouts-components/switcher/landing-switcher';
import { usePathname } from 'next/navigation';
import React, { Fragment, useEffect, useRef} from 'react'
import { connect } from "react-redux"
import { ThemeChanger } from "@/shared/redux/action"

const Layout = ({ children }) => {
  
    const pathname = usePathname();
    const bodyRef = useRef(null);
    useEffect(() => {
      bodyRef.current=document.body
      // Add 'landing-body' for landing page
      if (pathname.includes("/landing")) {
        bodyRef.current.classList.add('landing-body');
      } else {
        bodyRef.current.classList.remove('landing-body');
      }
  
      // Clean up classes on route change
      return () => {
        bodyRef.current.classList.remove('landing-body');
      };
    }, [pathname]);

    
    
  return (
    <Fragment>
      <div>
        <LandingSwitcher />
        {children}
      </div>
      <Backtotop />
      <PrelineScript/>
    </Fragment>
  )
}


const mapStateToProps = (state) => ({
  local_varaiable: state.reducer
});

export default connect(mapStateToProps, { ThemeChanger })(Layout);