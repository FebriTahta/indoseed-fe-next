"use client"
import React, { Fragment } from 'react'
import { connect } from "react-redux"
import { ThemeChanger } from "../../../shared/redux/action"
import PrelineScript from "../../PrelineScript"
import Sidebar from '../../../shared/layouts-components/sidebar/sidebar'
import Header from '../../../shared/layouts-components/header/header'
import Backtotop from '../../../shared/layouts-components/backtotop/backtotop'
import Footer from '@/shared/layouts-components/footer/footer';
import Loader from '@/shared/layouts-components/loader/loader';
import Switcher from '@/shared/layouts-components/switcher/switcher';

const Layout = ({ children, }) => {

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

export default connect(mapStateToProps, { ThemeChanger })(Layout);