import React, { Fragment } from 'react'
import SpkBadge from '../spk-badge';
import Link from 'next/link';

import Image from 'next/image';



const Spkgridmarkupcard = ({ Imgsrc, Customimgclass="", Navigate="#!", Customtextclass="", Customtitleclass="", Linktag = false, Title, Color, Buttontext, Badge = false, Badgeclass, Text, Badgetext, }) => {
  return (
    <Fragment>
      <div className="box">
        <div className="box-body">
          <Image fill src={Imgsrc} className={Customimgclass} alt="..." />
          <h6 className={`box-title !font-medium ${Customtitleclass}`}>{Title}
            {Badge ? <SpkBadge customClass={Badgeclass}>{Badgetext}</SpkBadge> : ""}
          </h6>
          <p className={`card-text ${Customtextclass}`}>{Text}</p>
          {Linktag ? <Link scroll={false} href={Navigate} className={`ti-btn ${Color ? `ti-btn-${Color}` : ''}`}>{Buttontext}</Link> : ""}
        </div>
      </div>
    </Fragment>
  )
}

export default Spkgridmarkupcard