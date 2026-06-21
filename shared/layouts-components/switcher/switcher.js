"use client"
import { ThemeChanger } from "@/shared/redux/action"
import React, { Fragment,  useEffect, useState } from 'react'
import { connect } from "react-redux"
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button"
import SpkOverlay from "../../../shared/@spk-reusable-components/uielements/spk-overlay"
import { ClosedMenu, DefaultMenu, DetachedFn, DoubletFn, iconOverlayFn, IconText, Reset, setBgImage, setDirection, setHeaderPosition, setHeaderStyle, setLayout, setMenuPosition, setMenuStyle, setPageStyle, setPrimaryColor, ThemeBackgroundColor, ThemePrimaryColor, updateBackgroundColor, updateLayout, updateNavStyle, updateTheme } from "@/shared/data/switcherdata/switcherdata"
import { data$, getState } from "../services/switcherServices"
import Link from "next/link"
const Switcher = () => {

  let [variable, setVariable] = useState(getState());
  useEffect(() => {
    const subscription = data$.subscribe((e) => {
      setVariable(e);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Fragment>
      <div id="hs-overlay-switcher" className="hs-overlay hidden ti-offcanvas ti-offcanvas-right" tabIndex={-1}>
        <div className="ti-offcanvas-header z-10 relative">
          <h5 className="ti-offcanvas-title">
            Switcher
          </h5>
          <SpkButton buttontype="button"
            customClass="ti-btn flex-shrink-0 p-0 !mb-0  transition-none text-defaulttextcolor dark:text-defaulttextcolor/80 hover:text-gray-700 focus:ring-gray-400 focus:ring-offset-white  dark:hover:text-white/80 dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
            Overlay="#hs-overlay-switcher">
            <span className="sr-only">Close modal</span>
            <i className="ri-close-circle-line leading-none text-lg"></i>
          </SpkButton>
        </div>
        <div className="ti-offcanvas-body !p-0 !border-b dark:border-white/10 z-10 relative !h-auto">
          <div className="flex rtl:space-x-reverse" aria-label="Tabs" role="tablist">
            <SpkButton buttontype="button"
              customClass="hs-tab-active:bg-danger/20 w-full !py-2 !px-4 hs-tab-active:border-b-transparent text-[0.813rem] border-0 hs-tab-active:text-danger dark:hs-tab-active:bg-danger/20 dark:hs-tab-active:border-b-white/10 dark:hs-tab-active:text-danger -mb-px bg-white font-normal text-center  text-defaulttextcolor dark:text-defaulttextcolor/80 rounded-none hover:text-gray-700 dark:bg-bodybg dark:border-white/10  active"
              Id="switcher-item-1" Tab="#switcher-1" Controls="switcher-1" Role="tab">
              Theme Style
            </SpkButton>
            <SpkButton buttontype="button"
              customClass="hs-tab-active:bg-danger/20 w-full !py-2 !px-4 hs-tab-active:border-b-transparent text-[0.813rem] border-0 hs-tab-active:text-danger dark:hs-tab-active:bg-danger/20 dark:hs-tab-active:border-b-white/10 dark:hs-tab-active:text-danger -mb-px  bg-white font-normal text-center  text-defaulttextcolor dark:text-defaulttextcolor/80 rounded-none hover:text-gray-700 dark:bg-bodybg dark:border-white/10  dark:hover:text-gray-300"
              Id="switcher-item-2" Tab="#switcher-2" Controls="switcher-2" Role="tab">
              Theme Colors
            </SpkButton>
          </div>
        </div>
        <div className="ti-offcanvas-body !p-0 !pb-[20rem]" id="switcher-body">
          <div id="switcher-1" role="tabpanel" aria-labelledby="switcher-item-1" className="">
            <div className="">
              <p className="switcher-style-head">Theme Color Mode:</p>
              <div className="grid grid-cols-3 switcher-style">
                <div className="flex items-center">
                  <input type="radio" name="theme-style" className="ti-form-radio" id="switcher-light-theme"
                    checked={variable.class === 'light'}
                    onChange={(_e) => { }}
                    onClick={() => updateTheme('light', 'clicked')} />
                  <label htmlFor="switcher-light-theme"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2 font-normal">Light</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="theme-style" className="ti-form-radio" id="switcher-dark-theme" checked={variable.class === 'dark'}
                    onChange={(_e) => { }}
                    onClick={() => updateTheme('dark', 'clicked')} />
                  <label htmlFor="switcher-dark-theme"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2 font-normal">Dark</label>
                </div>
              </div>
            </div>
            <div>
              <p className="switcher-style-head">Directions:</p>
              <div className="grid grid-cols-3  switcher-style">
                <div className="flex items-center">
                  <input type="radio" name="direction" className="ti-form-radio" id="switcher-ltr" checked={variable.dir === 'ltr'}
                    onChange={(_e) => { }}
                    onClick={() => setDirection('ltr')} />
                  <label htmlFor="switcher-ltr" className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">LTR</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="direction" className="ti-form-radio" id="switcher-rtl" checked={variable.dir === 'rtl'}
                    onChange={(_e) => { }}
                    onClick={() => setDirection('rtl')} />
                  <label htmlFor="switcher-rtl" className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">RTL</label>
                </div>
              </div>
            </div>
            <div>
              <p className="switcher-style-head">Navigation Styles:</p>
              <div className="grid grid-cols-3  switcher-style">
                <div className="flex items-center">
                  <input type="radio" name="navigation-style" className="ti-form-radio" id="switcher-vertical" checked={variable.dataNavLayout === 'vertical'}
                    onChange={(_e) => { }}
                    onClick={() => updateLayout('vertical')}
                  />
                  <label htmlFor="switcher-vertical"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Vertical</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="navigation-style" className="ti-form-radio" id="switcher-horizontal" checked={variable.dataNavLayout === 'horizontal'}
                    onChange={(_e) => { }}
                    onClick={() => updateLayout('horizontal')} />
                  <label htmlFor="switcher-horizontal"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Horizontal</label>
                </div>
              </div>
            </div>
            <div>
              <p className="switcher-style-head">Navigation Menu Style:</p>
              <div className="grid grid-cols-2 gap-2 switcher-style">
                <div className="flex">
                  <input type="radio" name="navigation-data-menu-styles" className="ti-form-radio" id="switcher-menu-click"
                    checked={variable.dataNavStyle === 'menu-click'  && variable.dataVerticalStyle != "overlay"}
                    onChange={(_e) => { }}
                    onClick={() => updateNavStyle('menu-click', 'menu-click-closed')} />
                  <label htmlFor="switcher-menu-click" className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Menu
                    Click</label>
                </div>
                <div className="flex">
                  <input type="radio" name="navigation-data-menu-styles" className="ti-form-radio" id="switcher-menu-hover" checked={variable.dataNavStyle === 'menu-hover'  && variable.dataVerticalStyle != "overlay"}
                    onChange={(_e) => { }}
                    onClick={() => updateNavStyle('menu-hover', 'menu-hover-closed')} />
                  <label htmlFor="switcher-menu-hover" className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Menu
                    Hover</label>
                </div>
                <div className="flex">
                  <input type="radio" name="navigation-data-menu-styles" className="ti-form-radio" id="switcher-icon-click" checked={variable.dataNavStyle === 'icon-click'  && variable.dataVerticalStyle != "overlay"}
                    onChange={(_e) => { }}
                    onClick={() => updateNavStyle('icon-click', 'icon-click-closed')} />
                  <label htmlFor="switcher-icon-click" className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Icon
                    Click</label>
                </div>
                <div className="flex">
                  <input type="radio" name="navigation-data-menu-styles" className="ti-form-radio" id="switcher-icon-hover" checked={variable.dataNavStyle === 'icon-hover'  && variable.dataVerticalStyle != "overlay"}
                    onChange={(_e) => { }}
                    onClick={() => updateNavStyle('icon-hover', 'icon-hover-closed')} />
                  <label htmlFor="switcher-icon-hover" className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Icon
                    Hover</label>
                </div>
              </div>
            </div>
            <div className=" sidemenu-layout-styles">
              <p className="switcher-style-head">Sidemenu Layout Syles:</p>
              <div className="grid grid-cols-2 gap-2 switcher-style">
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-default-menu" defaultChecked
                    onChange={(_e) => { }}
                    onClick={DefaultMenu} />
                  <label htmlFor="switcher-default-menu"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal ">Default
                    Menu</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-closed-menu" checked={variable.dataVerticalStyle === 'closed'}
                    onChange={(_e) => { }}
                    onClick={ClosedMenu} />
                  <label htmlFor="switcher-closed-menu" className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal ">
                    Closed
                    Menu</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-icontext-menu" checked={variable.toggled === 'icon-text-close'}
                    onChange={(_e) => { }}
                    onClick={IconText} />
                  <label htmlFor="switcher-icontext-menu" className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal ">Icon
                    Text</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-icon-overlay"
                    checked={variable.toggled === 'icon-overlay-close'}
                    onChange={(_e) => { }}
                    onClick={iconOverlayFn} />
                  <label htmlFor="switcher-icon-overlay" className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal ">Icon
                    Overlay</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-detached" checked={variable.toggled === 'detached-close'}
                    onChange={(_e) => { }}
                    onClick={DetachedFn} />
                  <label htmlFor="switcher-detached"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal ">Detached</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-double-menu" checked={variable.dataVerticalStyle === 'doublemenu'}
                    onChange={(_e) => { }}
                    onClick={DoubletFn} />
                  <label htmlFor="switcher-double-menu" className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Double
                    Menu</label>
                </div>
              </div>
            </div>
            <div>
              <p className="switcher-style-head">Page Styles:</p>
              <div className="grid grid-cols-3  switcher-style">
                <div className="flex">
                  <input type="radio" name="data-page-styles" className="ti-form-radio" id="switcher-regular" checked={variable.dataPageStyle === 'regular'}
                    onChange={(_e) => { }}
                    onClick={() => setPageStyle('regular')} />
                  <label htmlFor="switcher-regular"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Regular</label>
                </div>
                <div className="flex">
                  <input type="radio" name="data-page-styles" className="ti-form-radio" id="switcher-classic" checked={variable.dataPageStyle === 'classic'}
                    onChange={(_e) => { }}
                    onClick={() => setPageStyle('classic')} />
                  <label htmlFor="switcher-classic"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Classic</label>
                </div>
                <div className="flex">
                  <input type="radio" name="data-page-styles" className="ti-form-radio" id="switcher-modern" checked={variable.dataPageStyle === 'modern'}
                    onChange={(_e) => { }}
                    onClick={() => setPageStyle('modern')} />
                  <label htmlFor="switcher-modern"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal"> Modern</label>
                </div>
              </div>
            </div>
            <div>
              <p className="switcher-style-head">Layout Width Styles:</p>
              <div className="grid grid-cols-3 switcher-style">
                <div className="flex">
                  <input type="radio" name="layout-width" className="ti-form-radio" id="switcher-full-width" checked={variable.dataWidth === 'fullwidth'}
                    onChange={(_e) => { }}
                    onClick={() => setLayout('fullwidth')} />
                  <label htmlFor="switcher-full-width"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">FullWidth</label>
                </div>
                <div className="flex">
                  <input type="radio" name="layout-width" className="ti-form-radio" id="switcher-boxed" checked={variable.dataWidth === 'boxed'}
                    onChange={(_e) => { }}
                    onClick={() => setLayout('boxed')} />
                  <label htmlFor="switcher-boxed" className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Boxed</label>
                </div>
              </div>
            </div>
            <div>
              <p className="switcher-style-head">Menu Positions:</p>
              <div className="grid grid-cols-3  switcher-style">
                <div className="flex">
                  <input type="radio" name="data-menu-positions" className="ti-form-radio" id="switcher-menu-fixed" checked={variable.dataMenuPosition === 'fixed'}
                    onChange={(_e) => { }}
                    onClick={() => setMenuPosition('fixed')} />
                  <label htmlFor="switcher-menu-fixed"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Fixed</label>
                </div>
                <div className="flex">
                  <input type="radio" name="data-menu-positions" className="ti-form-radio" id="switcher-menu-scroll" checked={variable.dataMenuPosition === 'scrollable'}
                    onChange={(_e) => { }}
                    onClick={() => setMenuPosition('scrollable')} />
                  <label htmlFor="switcher-menu-scroll"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Scrollable </label>
                </div>
              </div>
            </div>
            <div>
              <p className="switcher-style-head">Header Positions:</p>
              <div className="grid grid-cols-3 switcher-style">
                <div className="flex">
                  <input type="radio" name="data-header-positions" className="ti-form-radio" id="switcher-header-fixed" checked={variable.dataHeaderPosition === 'fixed'}
                    onChange={(_e) => { }}
                    onClick={() => setHeaderPosition('fixed')} />
                  <label htmlFor="switcher-header-fixed" className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">
                    Fixed</label>
                </div>
                <div className="flex">
                  <input type="radio" name="data-header-positions" className="ti-form-radio" id="switcher-header-scroll" checked={variable.dataHeaderPosition === 'scrollable'}
                    onChange={(_e) => { }}
                    onClick={() => setHeaderPosition('scrollable')} />
                  <label htmlFor="switcher-header-scroll"
                    className="text-[0.813rem] text-defaulttextcolor dark:text-defaulttextcolor/80 ms-2  font-normal">Scrollable
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div id="switcher-2" className="hidden" role="tabpanel" aria-labelledby="switcher-item-2">
            <div className="theme-colors">
              <p className="switcher-style-head">Menu Colors:</p>
              <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                <SpkOverlay customClass="ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-white" type="radio" name="menu-colors"
                    id="switcher-menu-light" checked={variable.dataMenuStyles === 'light'}
                    onChange={(_e) => { }}
                    onClick={() => setMenuStyle('light')} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Light Menu
                  </span>
                </SpkOverlay>
                <SpkOverlay customClass="ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-dark" type="radio" name="menu-colors"
                    id="switcher-menu-dark" checked={variable.dataMenuStyles === 'dark'}
                    onChange={(_e) => { }}
                    onClick={() => setMenuStyle('dark')} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Dark Menu
                  </span>
                </SpkOverlay>
                <SpkOverlay customClass="ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-primary" type="radio" name="menu-colors"
                    id="switcher-menu-primary" checked={variable.dataMenuStyles === 'color'}
                    onChange={(_e) => { }}
                    onClick={() => setMenuStyle('color')} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Color Menu
                  </span>
                </SpkOverlay>
                <SpkOverlay customClass="ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-gradient" type="radio" name="menu-colors"
                    id="switcher-menu-gradient" checked={variable.dataMenuStyles === 'gradient'}
                    onChange={(_e) => { }}
                    onClick={() => setMenuStyle('gradient')} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Gradient Menu
                  </span>
                </SpkOverlay>
                <SpkOverlay customClass="ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-transparent" type="radio" name="menu-colors"
                    id="switcher-menu-transparent" checked={variable.dataMenuStyles === 'transparent'}
                    onChange={(_e) => { }}
                    onClick={() => setMenuStyle('transparent')} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs !font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Transparent Menu
                  </span>
                </SpkOverlay>
              </div>
              <div className="px-4 text-textmuted dark:text-textmuted/50 text-[.6875rem]"><b className="me-2 font-normal">Note:</b>If you want to change color Menu
                dynamically
                change from below Theme Primary color picker.</div>
            </div>
            <div className="theme-colors">
              <p className="switcher-style-head">Header Colors:</p>
              <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                <SpkOverlay customClass="ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-white !border" type="radio" name="header-colors"
                    id="switcher-header-light" checked={variable.dataHeaderStyles === 'light'}
                    onChange={(_e) => { }}
                    onClick={() => setHeaderStyle('light')} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Light Header
                  </span>
                </SpkOverlay>
                <SpkOverlay customClass="ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-dark" type="radio" name="header-colors"
                    id="switcher-header-dark" checked={variable.dataHeaderStyles === 'dark'}
                    onChange={(_e) => { }}
                    onClick={() => setHeaderStyle('dark')} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Dark Header
                  </span>
                </SpkOverlay>
                <SpkOverlay customClass="ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-primary" type="radio" name="header-colors"
                    id="switcher-header-primary" checked={variable.dataHeaderStyles === 'color'}
                    onChange={(_e) => { }}
                    onClick={() => setHeaderStyle('color')} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Color Header
                  </span>
                </SpkOverlay>
                <SpkOverlay customClass="ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-gradient" type="radio" name="header-colors"
                    id="switcher-header-gradient" checked={variable.dataHeaderStyles === 'gradient'}
                    onChange={(_e) => { }}
                    onClick={() => setHeaderStyle('gradient')} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Gradient Header
                  </span>
                </SpkOverlay>
                <SpkOverlay customClass="ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-transparent" type="radio"
                    name="header-colors" id="switcher-header-transparent" checked={variable.dataHeaderStyles === 'transparent'}
                    onChange={(_e) => { }}
                    onClick={() => setHeaderStyle('transparent')} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Transparent Header
                  </span>
                </SpkOverlay>
              </div>
              <div className="px-4 text-textmuted dark:text-textmuted/50 text-[.6875rem]"><b className="me-2 !font-normal">Note:</b>If you want to change color
                Header dynamically
                change from below Theme Primary color picker.</div>
            </div>
            <div className="theme-colors">
              <p className="switcher-style-head">Theme Primary:</p>
              <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-primary-1" type="radio" name="theme-primary"
                    id="switcher-primary" checked={variable.colorPrimaryRgb === '118, 71, 229'}
                    onChange={(_e) => { }}
                    onClick={() => setPrimaryColor('118, 71, 229','118 71 229')} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-primary-2" type="radio" name="theme-primary"
                    id="switcher-primary1" checked={variable.colorPrimaryRgb === '63, 75, 236'}
                    onChange={(_e) => { }}
                    onClick={() => setPrimaryColor('63, 75, 236','63 75 236')} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-primary-3" type="radio" name="theme-primary"
                    id="switcher-primary2" checked={variable.colorPrimaryRgb === '55, 125, 206'}
                    onChange={(_e) => { }}
                    onClick={() => setPrimaryColor('55, 125, 206','55 125 206')} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-primary-4" type="radio" name="theme-primary"
                    id="switcher-primary3" checked={variable.colorPrimaryRgb === '1, 159, 162'}
                    onChange={(_e) => { }}
                    onClick={() => setPrimaryColor('1, 159, 162','1 159 162')} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-primary-5" type="radio" name="theme-primary"
                    id="switcher-primary4" checked={variable.colorPrimaryRgb === '139, 149, 4'}
                    onChange={(_e) => { }}
                    onClick={() => setPrimaryColor('139, 149, 4','139 149 4')} />
                </div>
                <div className="ti-form-radio switch-select ps-0 mt-1 color-primary-light">
                  <div className='theme-container-primary'>
                    <SpkButton customClass="">nano</SpkButton>
                  </div>
                  <div className='pickr-container-primary'>
                    <div className='pickr'>
                      <SpkButton customClass='pcr-button' onclickfunc={(ele) => {
                        if (ele.target.querySelector("input")) {
                          ele.target.querySelector("input").click();
                        }
                      }}>
                        <ThemePrimaryColor />
                      </SpkButton>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="theme-colors">
              <p className="switcher-style-head">Theme Background:</p>
              <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-bg-1" type="radio" name="theme-background"
                    id="switcher-background" checked={variable.bodyBg === '12 23 91'}
                    onChange={(_e) => { }}
                    onClick={() => updateBackgroundColor('12 23 91', '17 31 96')} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-bg-2" type="radio" name="theme-background"
                    id="switcher-background1" checked={variable.bodyBg === '50 11 110'}
                    onChange={(_e) => { }}
                    onClick={() => updateBackgroundColor('50 11 110', '57 16 120')} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-bg-3" type="radio" name="theme-background"
                    id="switcher-background2" checked={variable.bodyBg === '8 81 113'}
                    onChange={(_e) => { }}
                    onClick={() => updateBackgroundColor('8 81 113', '27 101 133')} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-bg-4" type="radio" name="theme-background"
                    id="switcher-background3" checked={variable.bodyBg === '3 81 60'}
                    onChange={(_e) => { }}
                    onClick={() => updateBackgroundColor('3 81 60', '8 99 75')} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-bg-5" type="radio" name="theme-background"
                    id="switcher-background4" checked={variable.bodyBg === '73 78 1'}
                    onChange={(_e) => { }}
                    onClick={() => updateBackgroundColor('73 78 1', '84 89 4')} />
                </div>
                <div className="ti-form-radio switch-select ps-0 mt-1 color-bg-transparent">
                  <div className='theme-container-background' >
                    <SpkButton customClass="">nano</SpkButton>
                  </div>
                  <div className='pickr-container-background'>
                    <div className='pickr'>
                      <SpkButton customClass='pcr-button' onclickfunc={(ele) => {
                        if (ele.target.querySelector("input")) {
                          ele.target.querySelector("input").click();
                        }
                      }}>
                        <ThemeBackgroundColor />
                      </SpkButton>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="menu-image theme-colors">
              <p className="switcher-style-head">Menu With Background Image:</p>
              <div className="flex switcher-style space-x-3 rtl:space-x-reverse flex-wrap gap-3">
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio bgimage-input bg-img1" type="radio" name="theme-images" id="switcher-bg-img" checked={variable.bgImg === 'bgimg1'}
                    onChange={(_e) => { }}
                    onClick={() => setBgImage(1)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio bgimage-input bg-img2" type="radio" name="theme-images" id="switcher-bg-img1" checked={variable.bgImg === 'bgimg2'}
                    onChange={(_e) => { }}
                    onClick={() => setBgImage(2)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio bgimage-input bg-img3" type="radio" name="theme-images" id="switcher-bg-img2" checked={variable.bgImg === 'bgimg3'}
                    onChange={(_e) => { }}
                    onClick={() => setBgImage(3)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio bgimage-input bg-img4" type="radio" name="theme-images" id="switcher-bg-img3" checked={variable.bgImg === 'bgimg4'}
                    onChange={(_e) => { }}
                    onClick={() => setBgImage(4)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio bgimage-input bg-img5" type="radio" name="theme-images" id="switcher-bg-img4" checked={variable.bgImg === 'bgimg5'}
                    onChange={(_e) => { }}
                    onClick={() => setBgImage(5)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ti-offcanvas-footer sm:flex justify-between">
          <Link scroll={false} href="#!" id="reset-all" className="ti-btn ti-btn-danger w-full m-1" onClick={Reset}>Reset</Link>
        </div>
      </div>
    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  local_varaiable: state.reducer
});

export default connect(mapStateToProps, { ThemeChanger })(Switcher);