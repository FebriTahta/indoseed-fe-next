
import React, { useState } from 'react'
import { MENUITEMS } from '@/shared/layouts-components/sidebar/nav';
import { getState, setState } from '@/shared/layouts-components/services/switcherServices';

const switcherSelector = (selector) => {
    if (typeof selector !== 'string' || selector.trim() === '') {
        return null;
    }
    return document?.querySelector(selector);
};
const switcherDoucmentIdSelector = (selector) => {
    return document.getElementById(selector);
};

const getDocumentElement = () => {
    return document.documentElement;
};

export const updateTheme = (themeType, clicked) => {
    const newState = {
        class: themeType === "dark" ? "dark" : "light",
        dataHeaderStyles: themeType === "dark" ? "dark" : "light",
        dataMenuStyles: themeType === "dark" ? "dark" : "light",
        bodyBg: "",
        darkBg: "",
        inputBorder: "",
        formControlBg: '',
        lightRgb: "",
        gray: ""
    }
    setState(newState)
    localStorage.setItem(`xintra${themeType}Theme`, themeType);
    localStorage.removeItem(`xintra${themeType === "dark" ? "light" : "dark"}Theme`);

    if (clicked === 'clicked') {
        localStorage.removeItem("bodyBg");
        localStorage.removeItem("darkBg");
        localStorage.removeItem("bgImg");
        localStorage.removeItem("xintraheader");
        localStorage.removeItem("xintramenu");
        localStorage.removeItem("lightRgb");
        localStorage.removeItem("formControlBg")
    }

};

export const setDirection = (direction) => {
    const newState = {
        dir: direction
    };

    setState(newState);

    // Manage localStorage based on the direction
    if (direction === 'rtl') {
        localStorage.setItem("xintrartl", 'rtl');
        localStorage.removeItem("xintraltr");
    } else {
        localStorage.removeItem("xintrartl");
    }
};

export function closeMenu() {
    const closeMenudata = (items) => {
        items?.forEach((item) => {
            item.active = false;
            closeMenudata(item.children);
        });
    };
    closeMenudata(MENUITEMS);
}

export const updateLayout = (layoutType) => {
    setTimeout(() => {
        switcherSelector('')?.click();
    }, 100);
    const theme = getState()
    const darkmenu = theme.dataMenuStyles ? theme.dataMenuStyles : "dark"
    const darkmenu1 = theme.dataMenuStyles ? theme.dataMenuStyles : "light"
    const newState = {
        dataNavLayout: layoutType === "horizontal" ? "horizontal" : "vertical",
        dataVerticalStyle: layoutType === "vertical" ? "overlay" : "",
        dataMenuStyles: layoutType === "horizontal" ? theme.class === 'dark' ? darkmenu : darkmenu1 : darkmenu,
        dataNavStyle: localStorage.xintranavstyles ? localStorage.xintranavstyles : "menu-click",
        toggled: layoutType === "vertical" ? "" : undefined
    };

    setState(newState);
    localStorage.setItem('xintraLayout', layoutType);

    if (layoutType === "vertical") {
        localStorage.removeItem('xintranavstyles');
    } else {
        localStorage.removeItem("xintraverticalstyles");
    }

    const Sidebar = switcherSelector('.main-menu');
    if (Sidebar) {
        Sidebar.style.marginInline = '0px';
    }

    closeMenu();

};

export const updateNavStyle = (actionType, toggledState) => {

    const newState = {
        dataNavStyle: actionType,
        toggled: toggledState,
        dataVerticalStyle: "",
    }
    setState(newState);
    localStorage.setItem('xintranavstyles', actionType);
    localStorage.removeItem('xintraverticalstyles')

    if (actionType === "icon-click" || actionType === "icon-hover") {
        const Sidebar = switcherSelector('.main-menu');
        if (Sidebar) {
            Sidebar.style.marginInline = '0px';
        }
    }

};

export const DefaultMenu = () => {
    const newState = {
        dataVerticalStyle: "overlay",
        dataNavLayout: "vertical",
        toggled: "",
        dataNavStyle: "",
    }
    setState(newState);
    localStorage.setItem('xintraverticalstyles', 'default');
    localStorage.removeItem('xintranavstyles');
};


export const ClosedMenu = () => {
    const newState = {
        dataNavLayout: "vertical",
        dataVerticalStyle: "closed",
        toggled: "close-menu-close",
    }
    setState(newState);
    localStorage.setItem('xintraverticalstyles', 'closed');
    localStorage.removeItem('xintranavstyles');
};


const IconTextOpenFn = () => {
    let html = getDocumentElement();
    if (html.getAttribute('data-toggled') === 'icon-text-close') {
        html.setAttribute('data-icon-text', 'open');
    }
}


const IconTextCloseFn = () => {
    let html = getDocumentElement();
    if (html.getAttribute('data-toggled') === 'icon-text-close') {
        html.removeAttribute('data-icon-text');
    }
}

export const IconText = () => {
    const newState = {
        dataNavLayout: "vertical",
        dataVerticalStyle: "icontext",
        toggled: "icon-text-close",
        dataNavStyle: "",
    }
    setState(newState);
    localStorage.setItem('xintraverticalstyles', 'icontext');
    localStorage.removeItem('xintranavstyles');
    const MainContent = switcherSelector('.main-content');
    const appSidebar = switcherSelector('.app-sidebar');

    appSidebar?.addEventListener('click', () => {
        IconTextOpenFn();
    });

    MainContent?.addEventListener('click', () => {
        IconTextCloseFn();
    });
};

export const iconOverlayFn = () => {
    const newState = {
        dataNavLayout: "vertical",
        dataVerticalStyle: "overlay",
        toggled: "icon-overlay-close",
    };
    setState(newState);
    localStorage.setItem('xintraverticalstyles', 'overlay');
    localStorage.removeItem('xintranavstyles');
    const icon = switcherDoucmentIdSelector('switcher-icon-overlay');
    if (icon) {
        icon.checked = true;
    }

    const MainContent = switcherSelector('.main-content');
    const appSidebar = switcherSelector('.app-sidebar');


    if (appSidebar) {
        appSidebar.addEventListener("mouseenter", DetachedOpenFn);
        appSidebar.removeEventListener("mouseenter", DetachedOpenFn);
    }

    if (MainContent) {
        MainContent.addEventListener("mouseleave", DetachedCloseFn);
        MainContent.removeEventListener("mouseleave", DetachedCloseFn);
    }
};

function DetachedOpenFn() {
    let html = getDocumentElement();
    if (window.innerWidth > 992) {
        if (html.getAttribute('data-toggled') === 'detached-close' || html.getAttribute('data-toggled') === 'icon-overlay-close') {
            html.setAttribute('data-icon-overlay', 'open');
        }
    }
}

function DetachedCloseFn() {
    let html = getDocumentElement();
    if (window.innerWidth > 992) {
        if (html.getAttribute('data-toggled') === 'detached-close' || html.getAttribute('data-toggled') === 'icon-overlay-close') {
            html.removeAttribute('data-icon-overlay');
        }
    }
}

export const DetachedFn = () => {

    const newState = {
        dataNavLayout: "vertical",
        dataVerticalStyle: "detached",
        toggled: "detached-close",
        dataNavStyle: "",
    }
    setState(newState);
    localStorage.setItem('xintraverticalstyles', 'detached');
    localStorage.removeItem('xintranavstyles');
    const MainContent = switcherSelector('.main-content');
    const appSidebar = switcherSelector('.app-sidebar');

    appSidebar?.addEventListener("click", () => {
        DetachedOpenFn();
    });
    MainContent?.addEventListener("click", () => {
        DetachedCloseFn();
    });
}

function closeMenu1() {
    const closeMenudata = (items) => {
        items?.forEach((item) => {
            item.active = true;
            closeMenudata(item.children);
        });
    };
    closeMenudata(MENUITEMS);
}


export const DoubletFn = () => {
    const newState = {
        dataNavLayout: "vertical",
        dataVerticalStyle: "doublemenu",
        toggled: "double-menu-open",
        dataNavStyle: "",
    }
    setState(newState);

    localStorage.setItem('xintraverticalstyles', 'doublemenu');
    localStorage.removeItem('xintranavstyles');
    setTimeout(() => {
        if (!switcherSelector(".main-menu .slide.active ul")) {
            const theme = getState();
            const newState = {
                ...theme,
                toggled: "double-menu-close",
            }
            setState(newState)
        }
    }, 100);

};

export const setPageStyle = (style) => {
    const newState = {
        dataPageStyle: style
    };

    setState(newState);
    localStorage.setItem(`xintra${style}`, style.charAt(0).toUpperCase() + style.slice(1));

    const styles = ['regular', 'classic', 'modern'];
    styles.forEach(item => {
        if (item !== style) {
            localStorage.removeItem(`xintra${item}`);
        }
    });
};

export const setLayout = (layout) => {
    const newState = {
        dataWidth: layout
    };

    setState(newState);

    localStorage.setItem(`xintra${layout}`, layout.charAt(0).toUpperCase() + layout.slice(1));

    const layouts = ['default', 'fullwidth', 'boxed'];
    layouts.forEach(item => {
        if (item !== layout) {
            localStorage.removeItem(`xintra${item}`);
        }
    });
};

export const setMenuPosition = (position) => {
    const newState = {
        dataMenuPosition: position
    };

    setState(newState);

    // Set the corresponding menu position in localStorage and remove the other
    localStorage.setItem(`xintramenu${position}`, `Menu${position.charAt(0).toUpperCase() + position.slice(1)}`);
    const otherPosition = position === 'fixed' ? 'scrollable' : 'fixed';
    localStorage.removeItem(`xintramenu${otherPosition}`);
};

export const setHeaderPosition = (position) => {
    const newState = {
        dataHeaderPosition: position
    };

    setState(newState);

    // Set the corresponding menu position in localStorage and remove the other
    localStorage.setItem(`xintraheader${position}`, `Header${position.charAt(0).toUpperCase() + position.slice(1)}`);
    const otherPosition = position === 'fixed' ? 'scrollable' : 'fixed';
    localStorage.removeItem(`xintraheader${otherPosition}`);
};

export const setMenuStyle = (style) => {

    localStorage.setItem('xintramenu', style);

    const currentColor = localStorage.getItem('xintramenu') || style
    const newState = {
        dataMenuStyles: currentColor
    };

    setState(newState);
    // Set the corresponding menu style in localStorage
    localStorage.setItem('xintramenu', style);

};

export const setHeaderStyle = (style) => {
    const newState = {
        dataHeaderStyles: style
    };

    setState(newState);

    // Set the corresponding menu style in localStorage
    localStorage.setItem('xintraheader', style);

};

export const setPrimaryColor = (colorRgb, Primarycolor) => {
    const newState = {
        colorPrimaryRgb: colorRgb,
        PrimaryRgb: Primarycolor,
    };

    setState(newState);
    localStorage.setItem("primaryRGB", colorRgb);
    localStorage.setItem("PrimaryRgb", Primarycolor);
    localStorage.removeItem("dynamiccolor")
};


export const updateBackgroundColor = (bgColor1, bgColor2) => {
    const newState = {
        bodyBg: bgColor1,
        darkBg: bgColor2,
        inputBorder: 'rgba(255,255,255,0.1)',
        lightRgb: bgColor2,
        class: 'dark',
        dataMenuStyles: 'dark',
        dataHeaderStyles: 'dark',
        gray: 'rgba(255,255,255,0.1)',
    };

    setState(newState);

    localStorage.setItem('bodyBg', bgColor1);
    localStorage.setItem('darkBg', bgColor2);
    localStorage.setItem('lightRgb', bgColor2);
    localStorage.removeItem('xintraheader');
    localStorage.setItem('xintramenu', newState.dataMenuStyles);
    localStorage.removeItem("xintralightTheme");
    localStorage.removeItem("xintradarkTheme");

};


const ColorPicker = (props) => {
    return (
        <div className='color-picker-input'>
            <input type="color" {...props} />
        </div>
    )
}

const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null
}


export const ThemePrimaryColor = () => {
    const [color, updateColor] = useState("#FFFFFF");
    const [rgb, setRgb] = useState({ PrimaryRgb: "" });

    const handleInput = (e) => {
        const color = e.target.value;
        let { r, g, b } = hexToRgb(color);

        // Update color only if it's different
        if (color !== updateColor) {
            updateColor(color);
        }

        // Only update RGB state if the value has changed
        if (rgb.PrimaryRgb !== `${r} ${g} ${b}`) {
            const newState = {
                colorPrimaryRgb: `${r} , ${g} , ${b}`,
                PrimaryRgb: `${r} ${g} ${b}`,
            };
            setState(newState);
            localStorage.setItem("dynamiccolor", `${r} ${g} ${b}`);
        }
    };

    return (
        <div className='Themeprimarycolor theme-container-primary pickr-container-primary'>
            <ColorPicker onChange={handleInput} value={color} />
        </div>
    );
};

// color picker for background colors 

export const ThemeBackgroundColor = () => {
    const [state, updateState] = useState('#FFFFFF');

    const handleInput = (e) => {
        let { r, g, b } = hexToRgb(e.target.value);
        updateState(e.target.value);
        const newState = {
            bodyBg: `${r + 14} ${g + 14} ${b + 14}`,
            darkBg: `${r} ${g} ${b}`,
            inputBorder: "rgba(255,255,255,0.1)",
            lightRgb: `${r + 5} ${g + 5} ${b + 5}`,
            class: "dark",
            dataHeaderStyles: "dark",
            dataMenuStyles: "dark",
            gray: `rgb(${r} ${g} ${b})`
        }
        setState(newState);

        localStorage.setItem("bodyBg", `${r}, ${g}, ${b}`);
        localStorage.setItem("darkBg", `${r + 14}, ${g + 14}, ${b + 14}`);
        localStorage.setItem('lightRgb', `${r + 5} ${g + 5} ${b + 5}`)
        localStorage.setItem('formControlBg', `rgb(${r} ${g} ${b})`)
        localStorage.removeItem("xintramenu");
        localStorage.removeItem("xintraheader");
        localStorage.removeItem("xintralightTheme");
        localStorage.removeItem("xintradarkTheme");
    }

    return (
        <div className="Themebackgroundcolor">
            <ColorPicker onChange={handleInput} value={state} />
        </div>
    )

}


export const setBgImage = (bgImageNumber) => {
    const bgImgKey = `bgimg${bgImageNumber}`;

    const newState = {
        bgImg: bgImgKey
    };

    setState(newState);

    // Loop through bgimage keys to remove the ones that aren't selected
    for (let i = 1; i <= 5; i++) {
        if (i === bgImageNumber) {
            localStorage.setItem(`bgimage${i}`, bgImgKey);
        } else {
            localStorage.removeItem(`bgimage${i}`);
        }
    }
};

export const Reset = () => {
    const newState = {
        lang: "en",
        dir: "ltr",
        class: "light",
        dataMenuStyles: "dark",
        dataNavLayout: "vertical",
        dataHeaderStyles: "light",
        dataVerticalStyle: "overlay",
        toggled: "",
        dataNavStyle: "",
        horStyle: "",
        dataPageStyle: "regular",
        dataWidth: "fullwidth",
        dataMenuPosition: "fixed",
        dataHeaderPosition: "fixed",
        iconOverlay: "",
        colorPrimaryRgb: "",
        PrimaryRgb: "",
        bodyBg: "",
        darkBg: "",
        inputBorder: "",
        lightRgb: "",
        formControlBg: "",
        gray: "",
        bgImg: "",
        loader: "disable",
        iconText: "",
        body: {
            class: ""
        }
    };

    setState(newState);
    localStorage.clear()

    const icon = switcherDoucmentIdSelector('switcher-default-menu');
    if (icon) {
        icon.checked = true;
    }
};

export const Reset1 = () => {
    const newState = {
        lang: "en",
        dir: "ltr",
        class: "light",
        dataMenuStyles: "light",
        dataNavLayout: "horizontal",
        dataHeaderStyles: "light",
        dataVerticalStyle: "overlay",
        toggled: "",
        dataNavStyle: "menu-click",
        horStyle: "",
        dataPageStyle: "regular",
        dataWidth: "fullwidth",
        dataMenuPosition: "fixed",
        dataHeaderPosition: "fixed",
        iconOverlay: "",
        colorPrimaryRgb: "",
        PrimaryRgb: "",
        bodyBg: "",
        darkBg: "",
        inputBorder: "",
        lightRgb: "",
        formControlBg: "",
        gray: "",
        bgImg: "",
        loader: "disable",
        iconText: "",
        body: {
            class: ""
        }
    };

    setState(newState);
    localStorage.clear()

    const icon = switcherDoucmentIdSelector("switcher-default-menu");
    if (icon) {
        icon.checked = true;
    }
};


export const LocalStorageBackup = (setpageloading) => {
    // toggling the theme 
    (localStorage.xintradarkTheme) ? updateTheme('dark', true) : '';
    (localStorage.xintralightTheme) ? updateTheme('light', true) : '';
    //  toggling the direction 
    (localStorage.xintrartl) ? setDirection('rtl') : '';
    // Page Styles:
    (localStorage.xintraregular) ? setPageStyle('regular') : '';
    (localStorage.xintraclassic) ? setPageStyle('classic') : '';
    (localStorage.xintramodern) ? setPageStyle('modern') : '';
    // Layout Width Styles:
    (localStorage.xintrafullwidth) ? setLayout('fullwidth') : '';
    (localStorage.xintradefault) ? setLayout('default') : '';
    (localStorage.xintraboxed) ? setLayout('boxed') : '';
    // Menu Positions:
    (localStorage.xintramenufixed) ? setMenuPosition('fixed') : '';
    (localStorage.xintramenuscrollable) ? setMenuPosition('scrollable') : '';
    // Header Positions:
    (localStorage.xintraheaderfixed) ? setHeaderPosition('fixed') : '';
    (localStorage.xintraheaderscrollable) ? setHeaderPosition('scrollable') : '';
    // Menu With Background Image
    (localStorage.bgimage1) ? setBgImage(1) : '';
    (localStorage.bgimage2) ? setBgImage(2) : '';
    (localStorage.bgimage3) ? setBgImage(3) : '';
    (localStorage.bgimage4) ? setBgImage(4) : '';
    (localStorage.bgimage5) ? setBgImage(5) : '';
    // Vertical & Horizontal Menu Styles
    (localStorage.xintranavstyles === "menu-click") ? updateNavStyle('menu-click', 'menu-click-closed') : '';
    (localStorage.xintranavstyles === "menu-hover") ? updateNavStyle('menu-hover', 'menu-hover-closed') : '';
    (localStorage.xintranavstyles === "icon-click") ? updateNavStyle('icon-click', 'icon-click-closed') : '';
    (localStorage.xintranavstyles === "icon-hover") ? updateNavStyle('icon-hover', 'icon-hover-closed') : '';
    // toggling the layOut
    (localStorage.xintraLayout == 'horizontal') && updateLayout('horizontal');


    // Menu Colors:
    switch (localStorage.xintramenu) {
        case 'light':
            setMenuStyle('light');
            break;
        case 'dark':
            setMenuStyle('dark');
            break;
        case 'color':
            setMenuStyle('color');
            break;
        case 'gradient':
            setMenuStyle('gradient');
            break;
        case 'transparent':
            setMenuStyle('transparent');
            break;
        default:
            break;
    }

    // Header Colors:

    switch (localStorage.xintraheader) {
        case 'light':
            setHeaderStyle('light');
            break;
        case 'dark':
            setHeaderStyle('dark');
            break;
        case 'color':
            setHeaderStyle('color');
            break;
        case 'gradient':
            setHeaderStyle('gradient');
            break;
        case 'transparent':
            setHeaderStyle('transparent');
            break;
        default:
            break;
    }

    // Theme Primary Colors
    switch (localStorage.primaryRGB) {
        case '118, 71, 229':
            setPrimaryColor('118, 71, 229', '118 71 229');
            break;
        case '63, 75, 236':
            setPrimaryColor('63, 75, 236', '63 75 236');
            break;
        case '55, 125, 206':
            setPrimaryColor('55, 125, 206', '55 125 206');
            break;
        case '1, 159, 162':
            setPrimaryColor('1, 159, 162', '1 159 162');
            break;
        case '139, 149, 4':
            setPrimaryColor('139, 149, 4', '139 149 4');
            break;
        default:
            break;
    }

    // Theme background colors

    switch (localStorage.bodyBg) {
        case '53, 3, 141':
            updateBackgroundColor('53, 3, 141', '67, 19, 151');
            break;
        case '0, 84, 151':
            updateBackgroundColor('0, 84, 151', '22, 92, 149');
            break;
        case '0, 86, 81':
            updateBackgroundColor('0, 86, 81', '0, 96, 91');
            break;
        case '73, 0, 133':
            updateBackgroundColor('73,0,133', '84, 16, 141');
            break;
        case '45, 52, 0':
            updateBackgroundColor('45, 52, 0', '54, 62, 0');
            break;
        default:
            break;
    }

    if (localStorage.dynamiccolor) {
        const dynamiccolor = localStorage.getItem('dynamiccolor')
        const newState = {
            colorPrimaryRgb: dynamiccolor,
            PrimaryRgb: dynamiccolor
        }
        setState(newState);
    }
    //Theme BAckground:
    if (localStorage.bodyBg) {
        const newState = {
            bodyBg: localStorage.bodyBg,
            darkBg: localStorage.darkBg,
            class: "dark",
            dataHeaderStyles: localStorage.xintraheader ? localStorage.xintraheader : localStorage.xintradarkTheme ? "dark" : "dark",
            lightRgb: localStorage.lightRgb,
            formControlBg: localStorage.formControlBg,
            inputBorder: localStorage.inputBorder,
            gray: localStorage.gray,
            dataMenuStyles: localStorage.xintramenu ? localStorage.xintramenu : localStorage.xintradarkTheme ? "dark" : "dark"
        }
        setState(newState)

    }

    // Sidemenu Layout Styles:

    if (localStorage.xintraverticalstyles) {
        let verticalstyles = localStorage.getItem('xintraverticalstyles');

        switch (verticalstyles) {
            case 'default':
                let defaultId = switcherDoucmentIdSelector('switcher-default-menu');
                if (defaultId) {
                    defaultId.checked = true;
                }
                DefaultMenu();
                break;

            case 'closed':
                let closedId = switcherDoucmentIdSelector('switcher-icontext-menu');
                if (closedId) {
                    closedId.checked = true;
                };
                ClosedMenu();
                break;

            case 'icontext':
                let icontextId = switcherDoucmentIdSelector('switcher-icontext-menu');
                if (icontextId) {
                    icontextId.checked = true;
                };
                IconText();
                break;

            case 'overlay':
                let overlayId = switcherDoucmentIdSelector('switcher-detached');
                if (overlayId) {
                    overlayId.checked = true;
                };
                iconOverlayFn();
                break;

            case 'detached':
                let detachedId = switcherDoucmentIdSelector('switcher-detached');
                if (detachedId) {
                    detachedId.checked = true;
                };
                DetachedFn();
                break;

            case 'doublemenu':
                let doubleId = switcherDoucmentIdSelector('switcher-double-menu');
                if (doubleId) {
                    doubleId.checked = true;
                };
                DoubletFn();
                break;

            default:
                let defaultbutton = switcherDoucmentIdSelector('switcher-default-menu');
                if (defaultbutton) {
                    defaultbutton.checked = true;
                }
                break;
        }

    }

    setpageloading(true)
};

