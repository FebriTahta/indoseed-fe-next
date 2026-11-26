"use client"
import { BehaviorSubject } from "rxjs"



//  Initial state with default values
const initialState = {
    lang: "en",
    dir: "ltr",
    class: "light",
    dataMenuStyles: "light",
    dataNavLayout: "vertical",
    dataHeaderStyles: "light",
    dataVerticalStyle: "overlay",
    toggled: "",
    dataNavStyle: "",
    dataPageStyle: "regular",
    dataWidth: "fullwidth",
    dataMenuPosition: "fixed",
    dataHeaderPosition: "fixed",
    loader: "disable",
    iconOverlay: "",
    colorPrimaryRgb: "",
    PrimaryRgb: "",
    bodyBg: "",
    darkBg: "",
    inputBorder: "",
    lightRgb: "",
    gray: "",
    bgImg: "",
    iconText: "",
    body: {
        class: ""
    },
};

const stateSubject = new BehaviorSubject(initialState);

export const data$ = stateSubject.asObservable();

const setAttributeIfValid = (element, attribute, value) => {
    if (element && value) {
        element.setAttribute(attribute, value);
    } else {
        element.removeAttribute(attribute);
    }
}

const setAttributes = () => {
    const currentState = stateSubject.value;
    const html = document.documentElement;

    setAttributeIfValid(html, 'lang', currentState.lang);
    setAttributeIfValid(html, 'dir', currentState.dir);
    setAttributeIfValid(html, 'data-toggled', currentState.toggled);
    setAttributeIfValid(html, 'class', currentState.class);
    setAttributeIfValid(html, 'data-menu-styles', currentState.dataMenuStyles);
    setAttributeIfValid(html, 'data-nav-layout', currentState.dataNavLayout);
    setAttributeIfValid(html, 'data-header-styles', currentState.dataHeaderStyles);
    setAttributeIfValid(html, 'data-vertical-style', currentState.dataVerticalStyle);
    setAttributeIfValid(html, 'data-nav-style', currentState.dataNavStyle);
    setAttributeIfValid(html, 'data-page-style', currentState.dataPageStyle);
    setAttributeIfValid(html, 'data-width', currentState.dataWidth);
    setAttributeIfValid(html, 'data-menu-position', currentState.dataMenuPosition);
    setAttributeIfValid(html, 'data-header-position', currentState.dataHeaderPosition);
    setAttributeIfValid(html, 'data-icon-overlay', currentState.iconOverlay);
    setAttributeIfValid(html, 'data-bg-img', currentState.bgImg);
    setAttributeIfValid(html, 'icon-text', currentState.iconText);
    setAttributeIfValid(html, 'loader', currentState.loader);
}

export const setState = (newState) => {
    const currentState = stateSubject.value;
    stateSubject.next({ ...currentState, ...newState });
    setAttributes()
}

export const getState = () => stateSubject.value;
