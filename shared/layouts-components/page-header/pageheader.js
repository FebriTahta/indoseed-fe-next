import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button'
import Link from 'next/link'
import React, { Fragment } from 'react'

const Pageheader = (props) => {
  return (
    <Fragment>

      {/* <!-- Page Header --> */}
      <div className="flex items-center justify-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          <nav>
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item"><Link scroll={false} href="#!">{props.title}</Link></li>
              {props.subtitle && (
                <li className="breadcrumb-item"><Link scroll={false} href="#!">{props.subtitle}</Link></li>
              )}
              <li className="breadcrumb-item active" aria-current="page">{props.currentpage}</li>
            </ol>
          </nav>
          <h1 className="page-title font-medium text-lg mb-0">{props.activepage}</h1>
          <span className='text-xs'>{props.description}</span>
        </div>
        {/* <div className="ti-btn-list">
          {props.customButton ? props.customButton : (
            !props.hideExport && (
              <SpkButton style={{ backgroundColor: "#078836", color: "white" }} className="hover:bg-[#078836] hover:text-white" customClass="ti-btn !border-0 btn-wave !me-0">
                <i className="ri-file-excel-2-line me-1"></i> Export Data
              </SpkButton>
            )
          )}
        </div> */}
      </div>
      {/* <!-- Page Header Close --> */}

    </Fragment>
  )
}

export default Pageheader