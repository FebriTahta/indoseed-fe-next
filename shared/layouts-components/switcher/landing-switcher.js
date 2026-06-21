"use client"
import { ThemeChanger } from "@/shared/redux/action"
import React, { Fragment,  useEffect, useState } from 'react'
import { connect } from "react-redux"
import SpkButton from "../../@spk-reusable-components/uielements/spk-button"
import Link from "next/link"
import { data$, getState } from "../services/switcherServices"
import { Reset1, setDirection, setPrimaryColor, ThemePrimaryColor, updateTheme } from "@/shared/data/switcherdata/switcherdata"

const Landingswitcher = () => {

    
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
                <div className="ti-offcanvas-header border-defaultborder dark:border-defaultborder/10">
                    <h5 className="ti-offcanvas-title">
                        Switcher
                    </h5>
                    <SpkButton buttontype="button" customClass="ti-btn flex-shrink-0 p-0 transition-none text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-gray-700 focus:ring-gray-400 focus:ring-offset-white  dark:hover:text-white/80 dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                        Overlay="#hs-overlay-switcher">
                        <span className="sr-only">Close modal</span>
                        <i className="ri-close-circle-line leading-none text-lg"></i>
                    </SpkButton>
                </div>
                <div className="ti-offcanvas-body !p-0" id="switcher-body">
                    <div>
                        <div>
                            <p className="switcher-style-head">Theme Color Mode:</p>
                            <div className="grid grid-cols-3 gap-6 switcher-style">
                                <div className="flex">
                                    <input type="radio" name="theme-style" className="ti-form-radio" id="switcher-light-theme"
                                        checked={variable.class === 'light'}
                                                            onChange={(_e) => { }}
                                                            onClick={() => updateTheme('light', 'clicked')} />
                                    <label htmlFor="switcher-light-theme"
                                        className="text-xs text-defaulttextcolor dark:text-defaulttextcolor/70 font-semibold ms-2 ">Light</label>
                                </div>
                                <div className="flex">
                                    <input type="radio" name="theme-style" className="ti-form-radio" id="switcher-dark-theme" checked={variable.class === 'dark'}
                                                        onChange={(_e) => { }}
                                                        onClick={() => updateTheme('dark', 'clicked')} />
                                    <label htmlFor="switcher-dark-theme"
                                        className="text-xs text-defaulttextcolor dark:text-defaulttextcolor/70 font-semibold ms-2 ">Dark</label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="switcher-style-head">Directions:</p>
                            <div className="grid grid-cols-3 gap-6 switcher-style">
                                <div className="flex">
                                    <input type="radio" name="direction" className="ti-form-radio" id="switcher-ltr" checked={variable.dir === 'ltr'}
                                                        onChange={(_e) => { }}
                                                        onClick={() => setDirection('ltr')} />
                                    <label htmlFor="switcher-ltr"
                                        className="text-xs font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 ">LTR</label>
                                </div>
                                <div className="flex">
                                    <input type="radio" name="direction" className="ti-form-radio" id="switcher-rtl" checked={variable.dir === 'rtl'}
                                                        onChange={(_e) => { }}
                                                        onClick={() => setDirection('rtl')} />
                                    <label htmlFor="switcher-rtl"
                                        className="text-xs font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 ">RTL</label>
                                </div>
                            </div>
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
                    </div>
                </div>
                <div className="ti-offcanvas-footer sm:flex justify-between">
                    <Link scroll={false} href="#!" id="reset-all" className="w-full ti-btn ti-btn-danger m-1" onClick={Reset1}>Reset</Link>
                </div>
            </div>
        </Fragment>
    )
}

const mapStateToProps = (state) => ({
    local_varaiable: state.reducer
});

export default connect(mapStateToProps, { ThemeChanger })(Landingswitcher);