import Link from 'next/link';
import React, { Fragment } from 'react'


const Spkutilitiescards = ({ Customcardclass="", Title, Text , Navigate="#!"}) => {
    return (
        <Fragment>
            <div className={`box ${Customcardclass}`}>
                <div className="box-header">
                    <div className="box-title">{Title}</div>
                </div>
                <div className="box-body">
                    <div className="card-text">
                         {Text}
                    </div>
                </div>
                <div className="box-footer">
                    <Link scroll={false} href={Navigate}
                        className="ti-btn ti-btn-primary !grid">Button</Link>
                </div>
            </div>
        </Fragment>
    )
}

export default Spkutilitiescards