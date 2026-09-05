"use client"
import React, { Fragment, useEffect } from 'react'
import { connect } from "react-redux"
import { ThemeChanger, setSettings } from "../../../shared/redux/action"
import PrelineScript from "../../PrelineScript"
import Sidebar from '../../../shared/layouts-components/sidebar/sidebar'
import Header from '../../../shared/layouts-components/header/header'
import Backtotop from '../../../shared/layouts-components/backtotop/backtotop'
import Footer from '@/shared/layouts-components/footer/footer';
import Loader from '@/shared/layouts-components/loader/loader';
import Switcher from '@/shared/layouts-components/switcher/switcher';
import api from '@/app/lib/axios';

const Layout = ({ children, local_varaiable, ThemeChanger, setSettings }) => {
    
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                const data = res.data;
                if (data.status === 'success' && data.data) {
                    setSettings(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            }
        };
        fetchSettings();
    }, [setSettings]);

    useEffect(() => {
        if (local_varaiable?.settings?.titleWebsite) {
            document.title = local_varaiable.settings.titleWebsite;
        }
    }, [local_varaiable?.settings?.titleWebsite]);

    return (
        <Fragment>
            <Switcher />
            {/*<Loader/>*/}
            <div className='page'>
                <Header />
                <Sidebar />
                <div className='main-content app-content'>
                    <div className='container-fluid'>
                        {children}
                    </div>
                </div>
                <Footer />
            </div>
            <Backtotop />
            <PrelineScript/>
        </Fragment>
    )

}

const mapStateToProps = (state) => ({
    local_varaiable: state.reducer
});

export default connect(mapStateToProps, { ThemeChanger, setSettings })(Layout);