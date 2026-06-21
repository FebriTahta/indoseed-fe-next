import  { Fragment } from 'react'

const SpkBadge = ({variant = 'primary', children, customClass="", Id, onclickfun}) => {
  return (
    <Fragment>
         <span className={`badge bg-${variant} ${customClass}`}   {...(Id ? { id: Id } : {})} onClick={onclickfun} >{children}</span>
    </Fragment>
  )
}

export default SpkBadge