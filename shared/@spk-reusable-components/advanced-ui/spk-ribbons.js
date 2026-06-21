import React, { Fragment } from 'react';


const SpkRibbons = ({ children, ribbonColor, ribbonPosition="", ribbonClass="" }) => {
    return (
        <Fragment>
            <div className={`${ribbonClass} ${ribbonColor ? `ribbon-${ribbonColor}` : ''} ${ribbonPosition}`}>
                {children}
            </div>
        </Fragment>
    );
};

export default SpkRibbons;
