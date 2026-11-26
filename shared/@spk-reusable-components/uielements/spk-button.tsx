import React, { Fragment, ReactNode, CSSProperties, MouseEventHandler } from 'react';

export interface SpkButtonProps {
  children?: ReactNode;
  variant?: string;
  disabled?: boolean;
  customClass?: string;
  className?: string;
  style?: CSSProperties;
  buttontype?: "button" | "submit" | "reset";
  Btnstyle?: CSSProperties;
  Role?: string;
  Themevalue?: string;
  Currentpage?: boolean | "time" | "true" | "false" | "page" | "step" | "location" | "date";
  Steppercomplete?: string;
  Decremenet?: string;
  Copymarkup?: string;
  Increment?: string;
  Togglepassword?: string;
  Size?: string;
  Stepperskip?: string;
  Stepperreset?: string;
  StepperBack?: string;
  Stepperfinish?: string;
  onclickfunc?: MouseEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  Steppernext?: string;
  removeelement?: string;
  Overlayoptions?: string;
  Id?: string;
  Expand?: boolean | "true" | "false";
  Label?: string;
  Collapse?: string;
  Controls?: string;
  Overlay?: string;
  Tab?: string;
  Overlayclose?: string;
}

const SpkButton: React.FC<SpkButtonProps> = ({ 
  children, variant, disabled, customClass="", className="", style, buttontype, Btnstyle, 
  Role, Themevalue, Currentpage, Steppercomplete, Decremenet, Copymarkup, Increment, 
  Togglepassword, Size, Stepperskip, Stepperreset, StepperBack, Stepperfinish, onclickfunc, onClick,
  Steppernext, removeelement, Overlayoptions, Id, Expand, Label, Collapse, Controls, 
  Overlay, Tab, Overlayclose 
}) => {
  return (
    <Fragment>
      <button 
        type={buttontype} 
        id={Id} 
        aria-expanded={Expand} 
        className={`${variant ? `ti-btn-${variant}` : ''}  ti-btn-wave ${customClass} ${className} ${Size ? `ti-btn-${Size}` : ''}`} 
        disabled={disabled}
        data-hs-tab={Tab} 
        role={Role}
        onClick={onClick || onclickfunc} 
        data-hs-remove-element={removeelement} 
        aria-label={Label} 
        data-hs-collapse={Collapse} 
        aria-controls={Controls} 
        data-hs-overlay={Overlay}
        data-hs-overlay-close={Overlayclose}
        data-hs-overlay-options={Overlayoptions}
        data-hs-stepper-back-btn={StepperBack}
        data-hs-stepper-next-btn={Steppernext}
        data-hs-stepper-finish-btn={Stepperfinish}
        data-hs-stepper-reset-btn={Stepperreset}
        data-hs-stepper-skip-btn={Stepperskip}
        data-hs-stepper-complete-step-btn={Steppercomplete}
        data-hs-toggle-password={Togglepassword}
        data-hs-input-number-decrement={Decremenet}
        data-hs-input-number-increment={Increment}
        data-hs-copy-markup={Copymarkup}
        data-hs-theme-click-value={Themevalue}
        aria-current={Currentpage}
        style={Btnstyle || style} 
      >
        {children}
      </button>
    </Fragment>
  )
}

export default SpkButton;
