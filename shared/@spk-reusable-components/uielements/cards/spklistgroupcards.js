import React, { Fragment } from 'react'


const SpkListgroupcards = ({ Headertext, children, CardHeader = false, Footertext, CardFooter = false, Customfooterclass="" }) => {
  return (
    <Fragment>
      <div className="box overflow-hidden">
            {CardHeader ?
                <div className="box-header  !text-start">
                    {Headertext}
                </div>
            :""}
            <ul className="ti-list-group list-group-flush">
                {children}
            </ul>
            {CardFooter ?
                <div className={`box-footer ${Customfooterclass}`}>
                   {Footertext}
                </div>
            :""}
        </div>
    </Fragment>
  )
}

export default SpkListgroupcards