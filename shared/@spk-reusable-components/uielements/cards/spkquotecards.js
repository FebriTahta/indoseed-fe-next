import Link from 'next/link';
import React, { Fragment } from 'react'


const SpkQuotecards = ({ Customclass="", Linktag = false, CustomBodyclass="", Navigate="#!", Headingclass="", Text, Title, Footerclass="", Footertext }) => {
  return (
    <Fragment>
    
       <div className={`box ${Customclass}`}>
            {Linktag ?  <Link aria-label="anchor" href={Navigate} className="card-anchor"></Link>  : ''}
            <div className={`box-body ${CustomBodyclass}`}>
                <blockquote className="blockquote mb-0 text-center">
                    <h6 className={Headingclass}>{Text}</h6>
                    <footer className={`blockquote-footer mt-3 ${Footerclass}`}>
                       {Footertext} <cite title="Source Title">{Title}</cite>
                    </footer>
                </blockquote>
            </div>
        </div>
    </Fragment>
  )
}

export default SpkQuotecards