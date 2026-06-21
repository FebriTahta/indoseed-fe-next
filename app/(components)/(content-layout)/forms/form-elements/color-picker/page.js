"use client"
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import { ChromePicker } from 'react-color';
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import Showcode from "@/shared/layouts-components/showcode/showcode";
import { color1, picker3, tailwindpicker2 } from "@/shared/data/prism/forms-prism";


const ColorPickers  = () => {
    const [isVisible, setIsVisible] = useState(false);
    const colorPickerRef = useRef(null);
  
    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    };
  
    // Function to handle clicks outside the ColorPicker
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
          setIsVisible(false);
        }
      };
  
      if (isVisible) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }
  
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isVisible]);
    //color picker
    const [color, setColor] = useColor("#561ecb");

    //color picker
    const [color2, setColor2] = useState("#6c5ffc");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const pickerRef = useRef(null);

    const handleChangeComplete = (color) => {
        console.log(color);
    };

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowColorPicker(false);
            }
        };

        if (showColorPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showColorPicker]);

return (
<Fragment>
            {/* <!-- Page Header --> */}
            <Seo title="Forms-Colorpicker" />
            <Pageheader title="Forms" subtitle="Form Elements" currentpage="Color Picker" activepage="Color Picker" />

            {/* <!-- Page Header Close --> */}
           {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-6 col-span-12">
                            <Showcode title="Color Picker" reactCode={color1}>
                                <input type="color" className="form-control form-control-color !border-0"
                                    id="exampleColorInput" defaultValue="#136ad0" title="Choose your color"/>
                            </Showcode>
                    </div>
                    <div className="col-span-12 xl:col-span-6">
                            <Showcode title="Tailwind colorpicker" reactCode={tailwindpicker2}>
                                <input type="color"
                                    className="p-1 h-10 w-10 block bg-white dark:bg-bodybg border border-gray-200 cursor-pointer rounded-sm 
                                    disabled:opacity-50 disabled:pointer-events-none dark:bg-bgdark dark:border-white/10"
                                    id="hs-color-input" defaultValue="#5a66f1" title="Choose your color"/>
                            </Showcode>
                    </div>
                </div>
                {/* <!--End::row-1 --> */}

                {/* <!--Start::row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-12 col-span-12">
                            <Showcode title="React-Color-Palette & React-Color" reactCode={picker3} customCardBodyClass="flex justify-between" >
                                <div className="grid grid-cols-12 gap-x-2 sm:gap-x-6 gap-y-3">
                                    <div className="col-span-12 xl:col-span-3 md:col-span-4 custom-color custom-color-picker">
                                        <SpkButton 
                                            variant="primary" 
                                            onclickfunc={toggleVisibility} 
                                            customClass="ti-btn ti-btn-primary !bg-primary !text-white !py-1 !px-2 !text-[0.75rem] !m-0 !gap-0 !font-medium"
                                        >
                                            <i className="ri-palette-line"></i>
                                        </SpkButton>

                                        {isVisible && (
                                            <div ref={colorPickerRef} className="absolute top-full mt-2 z-50">
                                            <ColorPicker color={color} onChange={setColor} hideInput={["hex", "hsv"]} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-12 xl:col-span-6 custom-color-picker">
                                    <SpkButton
                                        variant="primary"
                                        customClass="pcr-button ti-btn ti-btn-primary !bg-primary !text-white !py-1 !px-2 !text-[0.75rem] !m-0 !gap-0 !font-medium"
                                            onclickfunc={() => setShowColorPicker(!showColorPicker)}
                                        >
                                            {showColorPicker ? "Close Picker" : "Pick Color"}
                                        </SpkButton>

                                        {showColorPicker && (
                                            <div ref={pickerRef} style={{ position: "absolute", zIndex: 1000 }}>
                                                <ChromePicker
                                                    disableAlpha={true}
                                                    color={color2}
                                                    onChange={(updatedColor) => setColor2(updatedColor.hex)}
                                                    onChangeComplete={handleChangeComplete}
                                                />
                                            </div>
                                        )}
                                        
                                    </div>
                                </div>
                            </Showcode>
                    </div>
                </div>
                {/* <!--End::row-2 --> */}
</Fragment>
);
};

export default ColorPickers;