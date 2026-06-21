

import Image from 'next/image';
import React, { Fragment } from 'react';



const SpkCountrycard = ({ src, states, count, now, color, listClass="" }) => {

    return (
        <Fragment>
            <li className={listClass}>
                <div className="flex items-start gap-4">

                    {src && (
                        <div className="leading-none">
                            <span className="avatar avatar-sm p-1 bg-light border dark:border-defaultborder/10">
                                <Image fill src={src} alt="img" />
                            </span>
                        </div>
                    )}
                    <div className="flex-auto w-full">
                        <div className="flex items-center justify-between">
                            <span className="block font-medium mb-2 leading-none">{states}</span>
                            <span className="text-[14px] font-medium block">{count}</span>
                        </div>
                        <div className="progress progress-md p-1" role="progressbar" aria-valuenow={now} aria-valuemin={0} aria-valuemax={100}>
                            <div className={`progress-bar ${color ? `bg-${color}` : ''} !rounded-s-full w-[${now}%]`}>
                            </div>
                        </div>
                    </div>
                </div>
            </li>

        </Fragment>
    );
};

export default SpkCountrycard;
