"use client"
import React, { useEffect } from 'react'
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
import { ConfirmProvider } from './shared/ConfirmDialog';
import RoleGuard from './shared/RoleGuard';
import ImpersonationBanner from './shared/ImpersonationBanner';

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
        <ConfirmProvider>
            <Switcher />
            {/*<Loader/>*/}
            <div className='page'>
                <Header />
                <Sidebar />
                <div className='main-content app-content'>
                    <div className='container-fluid'>
                        <ImpersonationBanner />
                        <RoleGuard>{children}</RoleGuard>
                    </div>
                </div>
                <Footer />
            </div>
            <Backtotop />
            <PrelineScript/>
        </ConfirmProvider>
    )

}

const mapStateToProps = (state) => ({
    local_varaiable: state.reducer
});

export default connect(mapStateToProps, { ThemeChanger, setSettings })(Layout);