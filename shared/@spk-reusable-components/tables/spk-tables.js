
import React, { Fragment } from 'react';


const Spktables = ({ children, tableClass="", headerClass="",  Bodytag=true,header,checkboxclass="", footerClass="", footchildren, headerContent, tBodyClass="", checked, showCheckbox = false, Customcheckclass="", onChange ,tableRowclass=""}) => {
    return (
        <Fragment>
            <table className={tableClass}>
                {headerContent}
                <thead className={headerClass}>
                    <tr className={tableRowclass}>
                        {showCheckbox && (
                            <th className={Customcheckclass}>
                                <input className={`form-check-input ${checkboxclass}`} type="checkbox" id="checkboxNoLabel02" defaultValue="" checked={checked} aria-label="..." onChange={onChange} />
                            </th>
                        )}
                        {header && header.map((headerItem, index) => (
                            <th key={index} className={headerItem.headerClassname}>
                                {headerItem.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                  {Bodytag?  
               <tbody className={tBodyClass}>
                    {children}
                </tbody>
                : children
                }
                <tfoot className={footerClass}>
                    {footchildren}
                </tfoot>
            </table>
        </Fragment>
    );
}

export default Spktables;
