import React, { Fragment } from 'react';



const Spkwidgetscrad1component = ({ cardClass="", card}) => {
    return (
        <Fragment>
        <div className={`box ${cardClass}`}>
            <div className="box-body">
                <div className="flex items-start justify-between">
                    <div className="grow">
                        <span className={`!text-${card.color1} font-semibold me-1 inline-block badge bg-${card.color1}/10`}>
                        <i className={`fe fe-arrow-${card.icon} !text-[0.75rem]`}></i>{card.percent}</span>
                        <h4 className="mt-2 mb-2 font-medium">{card.data}</h4>
                        <p className="mb-0 text-xs font-medium">{card.total}</p>
                    </div>
                    <div>
                        <span className={`avatar avatar-md bg-${card.color} svg-white text-white`}>
                            {card.svgIcon}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
    );
};

export default Spkwidgetscrad1component;
