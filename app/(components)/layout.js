"use client"
import { data$, getState } from '@/shared/layouts-components/services/switcherServices';
import * as switcherdata from '../../shared/data/switcherdata/switcherdata';
import { Initialload } from '../../shared/layouts-components/contextapi';
import { ThemeChanger } from '../../shared/redux/action';
import React, { useContext, useEffect, useState } from 'react'
import { connect } from 'react-redux';

const Layout = ({ children }) => {


  const [localVariable, setLocalVariable] = useState(getState());

  const customstyles = {
    ...(localVariable.colorPrimaryRgb !== '' && { '--primary-rgb': localVariable.colorPrimaryRgb }),
    ...(localVariable.PrimaryRgb !== '' && { '--primary': localVariable.PrimaryRgb }),
    ...(localVariable.bodyBg !== '' && { '--body-bg': localVariable.bodyBg }),
    ...(localVariable.darkBg !== '' && { '--dark-bg': localVariable.darkBg }),
    ...(localVariable.lightRgb !== '' && { '--light': localVariable.lightRgb }),
    ...(localVariable.gray !== '' && { '--gray-3': localVariable.gray }),
    ...(localVariable.inputBorder !== '' && { '--input-border': localVariable.inputBorder }),
  };

  useEffect(() => {
    const subscription = data$.subscribe((e) => {
      setLocalVariable(e);
    });

    return () => subscription.unsubscribe();
  }, []);

  const theme = useContext(Initialload);
  useEffect(() => {
    if (typeof window !== 'undefined' && !theme.pageloading) {
      switcherdata.LocalStorageBackup(theme.setpageloading);
    }
  }, []);

  return (
    <html
      suppressHydrationWarning={true}
      lang={localVariable.lang || undefined}
      dir={localVariable.dir || undefined}
      className={localVariable.class || undefined}
      data-header-styles={localVariable.dataHeaderStyles || undefined}
      data-vertical-style={localVariable.dataVerticalStyle || undefined}
      data-nav-layout={localVariable.dataNavLayout || undefined}
      data-menu-styles={localVariable.dataMenuStyles || undefined}
      data-toggled={localVariable.toggled || undefined}
      data-nav-style={localVariable.dataNavStyle || undefined}
      data-page-style={localVariable.dataPageStyle || undefined}
      data-width={localVariable.dataWidth || undefined}
      data-menu-position={localVariable.dataMenuPosition || undefined}
      data-header-position={localVariable.dataHeaderPosition || undefined}
      data-icon-overlay={localVariable.iconOverlay || undefined}
      bg-img={localVariable.bgImg || undefined}
      icon-text={localVariable.iconText || undefined}
      style={customstyles}>
      <head>
        <meta name="keywords" content="dashboard js ,dashboard nextjs ,dashboard template nextjs ,javascript next js ,javascript template ,next js admin panel ,next js dashboard template ,next js ui framework ,nextjs admin panel ,nextjs dashboard ,nextjs styled components ,nextjs template ,nextjs ui ,tailwind admin dashboard ,tailwind css nextjs" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

const mapStateToProps = (state) => ({
  local_varaiable: state.reducer
});

export default connect(mapStateToProps, { ThemeChanger })(Layout);