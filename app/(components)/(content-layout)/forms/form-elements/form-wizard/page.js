"use client"
import HorizontalNonLinearStepper from "@/shared/data/forms/formwizarddata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import React, { FC, Fragment } from "react";



const FormWizard = () => {
    return (
        <Fragment>
            {/* <!-- Page Header --> */}
            <Seo title="Forms-Form Wizard" />

            <Pageheader title="Forms" subtitle="Form Elements" currentpage="Form Wizard" activepage="Form Wizard" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">
                                FORM WIZARD
                            </div>
                        </div>
                        <div className="box-body pb-7 custom-form custom-wizard">
                            <HorizontalNonLinearStepper />
                        </div>
                    </div>
                </div>
            </div>
            {/* <!--End::row-1 --> */}

        </Fragment>
    );
};

export default FormWizard;