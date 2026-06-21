import  { Fragment } from 'react'

const SpkToast = ({customClass="", children, Id}) => {
  return (
    <Fragment>
        <div id={Id} className={`ti-toast ${customClass}`} role="alert">
              {children}  
        </div>
    </Fragment>
  )
}

export default SpkToast