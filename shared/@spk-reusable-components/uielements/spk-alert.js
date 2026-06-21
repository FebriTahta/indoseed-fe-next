import  { Fragment } from 'react'

const SpkAlert = ({customClass="",children, Role, Id}) => {
  return (
    <Fragment>
        <div className={`alert ${customClass}`} role={Role} {...(Id ? { id: Id } : {})}>
            {children}
        </div>
    </Fragment>
  )
}

export default SpkAlert