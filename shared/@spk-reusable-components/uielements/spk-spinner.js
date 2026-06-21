import  {  Fragment } from 'react'

const SpkSpinner = ({children, customClass="", Label, Hidden}) => {
  return (
    <Fragment>
         <div className={`ti-spinner ${customClass}`} role="status" aria-label={Label} aria-hidden={Hidden}>
            {children}
        </div>
    </Fragment>
  )
}

export default SpkSpinner