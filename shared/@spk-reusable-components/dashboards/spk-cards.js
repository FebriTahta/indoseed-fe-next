import React, { Fragment } from 'react';

const Spkcardscomponent = ({ card, cardClass="", textbefore=false, textafter=true, Icon, svgIcon, mainClass="", parentClass="", dataClass="", badgeClass="", headingClass="", badgeColor="", iconClass="" }) => {

    return (
        <Fragment>
            <div className={`box ${cardClass}`}>
                <div className="box-body">
                    <div className={mainClass}>
                        <div className={parentClass}>
                            <span className={`text-textmuted dark:text-textmuted/50 ${headingClass}`}>{card.title}</span>
                            <h4 className={`font-medium ${dataClass}`}>{card.count}</h4>
                            {textbefore ? 
                                <div className={`text-textmuted dark:text-textmuted/50 text-[13px]`}> {card.inc}
                                 <span className={`text-${card.color}`}> {card.percentageChange}  
                                <i className={`${card.icon} text-[1rem]`}></i></span></div>
                            :""}
                        </div>
                        <div className="leading-none">
                            <span className={`avatar avatar-md avatar-${badgeClass} bg-${card.backgroundColor} ${badgeColor}`}>
                            {svgIcon || (Icon ?<i className={`${iconClass} text-xl`}></i>  : null)}
                            </span>
                        </div>
                    </div>
                    {textafter ? 
                    <div className={`text-textmuted dark:text-textmuted/50 text-[13px]`}> {card.inc} <span className={`text-${card.color}`}>{card.percentageChange}  
                    <i className={`${card.icon} text-[1rem]`}></i></span></div>
                    :""}
                </div>
            </div>

        </Fragment>
    );
}

export default Spkcardscomponent;
