
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment } from 'react'


const Spkgridcards = ({ Imgsrc, Button = false, Customheadingclass="", Navigate="#!", Customimgclass="", Ptag = true, Linktag = false, Color, Title, Buttontext, Text }) => {
  return (
    <Fragment>
      <div className="box">
        {Linktag ?
          <Link scroll={false} href={Navigate} className="card-anchor"></Link> : ""
        }
        <Image fill src={Imgsrc} className={`card-img-top ${Customimgclass}`} alt="..." />
        <div className="box-body">
          <h6 className={`box-title font-medium ${Customheadingclass}`}>{Title}</h6>
          {Ptag ?
            <p className="card-text">{Text}</p> : ""}

          {Button ?
            <Link scroll={false} href={Navigate} className={`btn ${Color ? `btn-${Color}` : ''}`}>{Buttontext}</Link>
            : ''
          }
        </div>
      </div>
    </Fragment>
  )
}

export default Spkgridcards