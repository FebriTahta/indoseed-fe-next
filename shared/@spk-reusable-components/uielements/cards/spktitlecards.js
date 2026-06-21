
import React, { Fragment } from 'react'
import SpkButton from '../spk-button';
import Link from 'next/link';

import Image from 'next/image';


const Spktitlecards = ({ ButtonTag, Imgsrc, Anchortagbefore = false, OnclickFunc, Navigate="#!", AnchortagNavigate="#!", Cardheader, Imagetag = false, Icontag = false, LinkClass="", CustomBodyclass="", Customfooterclass="", Icon, Cardfooter, Customclass="", CustomHeaderclass="", children, Footertext, Title, Linktag }) => {
  return (
    <Fragment>
      <div className={`box ${Customclass}`}>
        {Imagetag ? <Image fill src={Imgsrc} className="card-img-top" alt="..." /> : ''}
        {Anchortagbefore && AnchortagNavigate && (<Link scroll={false} aria-label="anchor" href={AnchortagNavigate} className="card-anchor"></Link>)}
        {Cardheader ?
          <div className={`box-header ${CustomHeaderclass}`}>
            <div className="box-title">{Title}</div>
            {Linktag && Navigate && (<Link scroll={false} aria-label="anchor" href={Navigate} className={LinkClass} onClick={OnclickFunc}>
              {Icontag ? <i className={Icon}></i> : ''}
            </Link>
            )}
          </div>

          : ''}
        <div className={`box-body ${CustomBodyclass}`}>
          {children}
        </div>
        {Cardfooter ? <div className={`box-footer ${Customfooterclass}`}>
          {ButtonTag ? <SpkButton buttontype="button" customClass="ti-btn ti-btn-primary">Read More</SpkButton> : Footertext}
        </div>
          : ""}
      </div>
    </Fragment>
  )
}

export default Spktitlecards