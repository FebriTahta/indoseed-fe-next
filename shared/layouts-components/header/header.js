"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { ThemeChanger, removeFromCart } from "@/shared/redux/action";
import { connect, useDispatch, useSelector } from "react-redux";
import { MENUITEMS } from "../sidebar/nav";
import SimpleBar from "simplebar-react";
import SpkBadge from "@/shared/@spk-reusable-components/uielements/spk-badge";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import Image from "next/image";
import { basePath } from '@/next.config';
import { data$, getState, setState } from "../services/switcherServices";

const Header = () => {
    const router = useRouter();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
            if (token) {
                await fetch(`${baseUrl}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('token');
            router.push('/');
        }
    };

    //Menu-Close
    let [variable, setVariable] = useState(getState());

    useEffect(() => {
        const subscription = data$.subscribe((e) => {
            // No need to manually update component state, the UI will re-render automatically
            setVariable(e);
        });

        return () => subscription.unsubscribe(); // Clean up the subscription
    }, []);
  //MenuClose
    function menuClose() {
      const theme = variable;

      if (window.innerWidth <= 992) {
          const newState = {
              toggled: "close"
          }
          setState(newState);
      }

      if (window.innerWidth >= 992) {
          const local_varaiable = theme;
          const newToggledValue = local_varaiable.toggled ? local_varaiable.toggled : '';

          setState({ toggled: newToggledValue });
      }
  }

  const overlayRef = useRef(null);
 //Toggle-Function
  const toggleSidebar = () => {
      const theme = variable;
      const sidemenuType = theme.dataNavLayout;

      if (window.innerWidth >= 992) {
          if (sidemenuType === "vertical") {
              const verticalStyle = theme.dataVerticalStyle;
              const navStyle = theme.dataNavStyle;
              // Handle vertical styles
              switch (verticalStyle) {
                  case "closed":
                      // Toggle between open/close state for "closed" vertical style
                      setState({
                          dataNavStyle: "",
                          toggled: theme.toggled === "close-menu-close" ? "" : "close-menu-close"
                      });
                      break;
                  case "overlay":
                      // Handle icon-overlay state with window width check
                      setState({
                          dataNavStyle: "",
                          toggled: theme.toggled === "icon-overlay-close" ? "" : "icon-overlay-close",
                          iconOverlay: ""
                      });

                      if (theme.toggled !== "icon-overlay-close" && window.innerWidth >= 992) {
                          setState({
                              toggled: "icon-overlay-close",
                              iconOverlay: "",
                          });
                      }
                      break;
                  case "icontext":
                      // Handle icon-text state
                      setState({
                          dataNavStyle: "",
                          toggled: theme.toggled === "icon-text-close" ? "" : "icon-text-close"
                      });
                      break;
                  case "doublemenu":
                      // Handle double menu state
                      setState({ dataNavStyle: "" });
                      if (theme.toggled === "double-menu-open") {
                          setState({ toggled: "double-menu-close" });
                      } else {
                          if (theme.activeMenuItem) {
                              const activeIndex = theme.menuItems.findIndex((item) => item.id === theme.activeMenuItem);

                              if (activeIndex !== -1 && theme.menuItems[activeIndex].next) {
                                  const newState = {
                                      toggled: 'double-menu-open',
                                      activeMenuItem: theme.menuItems[activeIndex].next.id,
                                  }
                                  setState(newState)
                              }
                              else {
                                  const newState = {
                                      toggled: 'double-menu-close'
                                  }
                                  setState(newState)
                              }
                          }
                      }
                      break;
                  case "detached":
                      // Handle detached menu state
                      setState({
                          toggled: theme.toggled === "detached-close" ? "" : "detached-close",
                          iconOverlay: ""
                      });
                      break;
                  default:
                      setState({ toggled: "" });
                      break;
              }

              // Handle navStyle changes
              switch (navStyle) {
                  case "menu-click":
                      setState({
                          toggled: theme.toggled === "menu-click-closed" ? "" : "menu-click-closed"
                      });
                      break;
                  case "menu-hover":
                      setState({
                          toggled: theme.toggled === "menu-hover-closed" ? "" : "menu-hover-closed"
                      });
                      break;
                  case "icon-click":
                      setState({
                          toggled: theme.toggled === "icon-click-closed" ? "" : "icon-click-closed"
                      });
                      break;
                  case "icon-hover":
                      setState({
                          toggled: theme.toggled === "icon-hover-closed" ? "" : "icon-hover-closed"
                      });
                      break;
              }
          }
      } else {
          // For mobile view (screen width < 992px)
          if (theme.toggled === "close") {
              setState({ toggled: "open" });
              setTimeout(() => {
                  if (theme.toggled === "open") {
                      const overlay = overlayRef.current
                      if (overlay) {
                          overlay.classList.add("active");
                          overlay.addEventListener("click", () => {
                              const overlay = overlayRef.current
                              if (overlay) {
                                  overlay.classList.remove("active");
                                  menuClose();
                              }
                          });
                      }
                  }

                  window.addEventListener("resize", () => {
                      if (window.innerWidth >= 992) {
                          const overlay = overlayRef.current
                          if (overlay) {
                              overlay.classList.remove("active");
                          }
                      }
                  });
              }, 100);
          } else {
              setState({ toggled: "close" });
          }
      }
  };

  //full screen
  const [fullScreen, setFullScreen] = useState(false);

  const toggleFullScreen = () => {
    const elem = document.documentElement;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => setFullScreen(true));
    } else {
      document.exitFullscreen().then(() => setFullScreen(false));
    }
  };
 


  //Dark Model

    //Dark-Theme
    const toggleTheme = () => {
      const currentTheme = getState();
      const newState = {
          class: currentTheme.class === 'dark' ? 'light' : 'dark',
          dataHeaderStyles: currentTheme.class === 'dark' ? 'light' : 'dark',
          dataMenuStyles: 'dark',
      }
      setState(newState)
      if (newState.class != 'dark') {
          const newState = {
              bodyBg: '',
              lightRgb: '',
              darkBg: '',
              inputBorder: '',
              gray: '',
          }
          setState(newState)
          localStorage.setItem("xintralightTheme", "light");
          localStorage.removeItem("xintradarkTheme");
          localStorage.removeItem("xintramenu");
          localStorage.removeItem("xintraheader");
          localStorage.removeItem("bodyBg");
          localStorage.removeItem("darkBg");
          localStorage.removeItem("bgImg");
          localStorage.removeItem("lightRgb");
      }
      else {
          localStorage.setItem("xintradarkTheme", "dark");
          localStorage.removeItem("xintralightTheme");
          localStorage.removeItem("xintramenu");
          localStorage.removeItem("xintraheader");
          localStorage.removeItem("bodyBg");
          localStorage.removeItem("darkBg");
          localStorage.removeItem("inputBorder");
          localStorage.removeItem("lightRgb");
          localStorage.removeItem("gray");
      }
  }

  //Switcher-Icon


  //Search Functionality

  const searchRef = useRef(null);
  const containerRef = useRef(null);

  const handleClick = (event) => {
    const searchInput = searchRef.current;
    const container = containerRef.current;

    // Check if the click is outside the search input and container
    if (searchInput && container && !searchInput.contains(event.target) && !container.contains(event.target)) {
      // If the click is outside, remove 'searchdrop' class
      container.classList.remove("searchdrop");
    } else if (searchInput && container && (searchInput === event.target || searchInput.contains(event.target))) {
      // If the click is inside the search input, add 'searchdrop' class
      container.classList.add("searchdrop");
    }
  };
  const bodyRef = useRef(null);
  useEffect(() => {
    bodyRef.current = document.body
    // Add event listener when the component is mounted
    bodyRef.current.addEventListener("click", handleClick);

    return () => {
      // Clean up the event listener when the component unmounts
      bodyRef.current.removeEventListener("click", handleClick);
    };
  }, []);

  const searchResultRef = useRef(null);
  const [showa, setShowa] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [show2, setShow2] = useState(false);
  const [searchcolor, setsearchcolor] = useState("text-dark");
  const [searchval, setsearchval] = useState("Type something");
  const [NavData, setNavData] = useState([]);

  useEffect(() => {
    const clickHandler = (event) => {
      if (searchResultRef.current && !searchResultRef.current.contains(event.target)) {
        searchResultRef.current.classList.add("hidden");
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  const myfunction = (inputvalue) => {
    if (searchResultRef.current) {
      searchResultRef.current.classList.remove("hidden");
    }


    const i = [];
    const allElement2 = [];
    MENUITEMS.forEach((mainLevel) => {
      if (mainLevel.children) {
        setShowa(true);
        mainLevel.children.forEach((subLevel) => {
          i.push(subLevel);
          if (subLevel.children) {
            subLevel.children.forEach((subLevel1) => {
              i.push(subLevel1);
              if (subLevel1.children) {
                subLevel1.children.forEach((subLevel2) => {
                  i.push(subLevel2);
                });
              }
            });
          }
        });
      }
    });
    for (const allElement of i) {
      if (allElement.title.toLowerCase().includes(inputvalue.toLowerCase())) {
        if (
          allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())
        ) {
          setShow2(true);

          // Check if the element has a path and doesn't already exist in allElement2 before pushing
          if (
            allElement.path &&
            !allElement2.some((el) => el.title === allElement.title)
          ) {
            allElement2.push(allElement);
          }
        }
      }
    }

    if (!allElement2.length || inputvalue === "") {
      if (inputvalue === "") {
        setShow2(false);
        setsearchval("Type something");
        setsearchcolor("text-dark");
      }
      if (!allElement2.length) {
        setShow2(false);
        setsearchcolor("text-danger");
        setsearchval("There is no component with this name");
      }
    }
    setNavData(allElement2);
  };

  //Responsive Search
  //Notification
  const img = <span className="avatar avatar-md avatar-rounded bg-primary"> <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/faces/1.jpg`} alt="user1" /> </span>
  const img1 = <span className="avatar avatar-md bg-primary avatar-rounded text-xl"> <i className="fe fe-shopping-cart leading-none  "></i> </span>
  const img2 = <span className="avatar avatar-md bg-orange avatar-rounded"> <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/faces/10.jpg`} alt="user1" /> </span>
  const img3 = <span className="avatar avatar-md bg-success avatar-rounded"> <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/faces/11.jpg`} alt="user1" /> </span>
  const img4 = <span className="avatar avatar-md bg-primarytint2color avatar-rounded"> <i className="ri-gift-line leading-none text-[1rem]"></i> </span>

  const content = <div className="text-muted fw-normal fs-12 header-notification-text text-truncate">Jane Sam sent you a message.</div>
  const content1 = <div className="text-muted fw-normal fs-12 header-notification-text text-truncate">Order <span className="text-primarytint1color">#54321</span> has been shipped.</div>
  const content2 = <div className="text-muted fw-normal fs-12 header-notification-text text-truncate">Reacted: <span className="text-primary3">John Richard</span> on your next purchase!</div>
  const content3 = <div className="text-muted fw-normal fs-12 header-notification-text text-truncate"><span className="text-info">Kelin Brown</span> has sent you the request.</div>
  const content4 = <div className="text-muted fw-normal fs-12 header-notification-text text-truncate">Enjoy<span className="text-success">   20% off</span> on your next purchase!</div>

  const Notifications = [
    { id: 1, src: img, heading: "New Messages", data: content, data1: "Now" },
    { id: 2, src: img1, heading: "Order Updates", data: content1, data1: "2 hours ago" },
    { id: 3, src: img2, heading: "Comment on Post", data: content2, data1: "2 hours ago" },
    { id: 4, src: img3, heading: "Follow Request", data: content3, data1: "1 Day ago" },
    { id: 5, src: img4, heading: "Exclusive Offers", data: content4, data1: "5 hours ago" },
  ]

  const [notifications, setNotifications] = useState(Notifications); // assuming 'data' is an array of notifications
  const [unreadCount, setUnreadCount] = useState(5); // initial unread count

  const hasNotifications = notifications.length > 0;

  const handleRemove1 = (id) => {
    if (event) {
      event.stopPropagation();
    }
    // Filter out the notification by id
    const updatedNotifications = notifications.filter((notification) => notification.id !== id);
    setNotifications(updatedNotifications);
    setUnreadCount(unreadCount - 1); // decrease unread count
  };

  //Cart function

  const cartProduct = [
    {
      id: 1,
      productpicture: "/assets/images/ecommerce/png/30.png",
      title: "Wireless Headphones",
      price: "$75",
      discount: "$75",
      quantity: "1",
      data: "Wireless freedom with crystal-clear sound and comfortable "
    },
    {
      id: 2,
      productpicture: "/assets/images/ecommerce/png/29.png",
      title: "Ladies Hand Bag",
      price: "$15",
      discount: "$30",
      quantity: "2",
      data: "Both fashion and functionality. "
    },
    {
      id: 3,
      productpicture: "/assets/images/ecommerce/png/32.png",
      title: "Alarm Clock",
      price: "$84",
      discount: "$84",
      quantity: "1",
      data: "Add natural beauty to your space "
    },
    {
      id: 4,
      productpicture: "/assets/images/ecommerce/png/12.png",
      title: "Kids' Party Wear Frock",
      price: "$37",
      discount: "$37",
      quantity: "1",
      data: "Crafted from soft, breathable fabric and adorned with delightful "
    },
    {
      id: 5,
      productpicture: "/assets/images/ecommerce/png/16.png",
      title: "Advanced Smart Watch",
      price: "$29",
      discount: "$48",
      quantity: "2",
      data: "ultimate in wearable technology,combining cutting-edge "
    },
  ];

  const maxDisplayItems = 5;

  const dispatch = useDispatch();
  const reduxCart = useSelector((state) => state.reducer.cart);
  const [localCart, setLocalCart] = useState(cartProduct);
  const [remainingCount2, setRemainingCount2] = useState(0);

  // Combine local and redux carts whenever they change
  const card = [...localCart, ...reduxCart];

  useEffect(() => {
    setRemainingCount2(card.length);
    setCartItemCount(localCart.length);
  }, [card, localCart]);

  const handleDelete = (id, event) => {
    event.stopPropagation();
    // Remove item from local cart
    const updatedLocalCart = localCart.filter(item => item.id !== id);
    setLocalCart(updatedLocalCart);
    // Update cart item count
    setCartItemCount(updatedLocalCart.length);
    // Remove item from redux cart
    dispatch(removeFromCart(id));
  };
  const [cartItems, setCartItems] = useState([...cartProduct]);
  const [cartItemCount, setCartItemCount] = useState(cartProduct.length);

  useEffect(() => {
    setCartItemCount(localCart.length);
  }, [localCart]);

  const handleRemove = (itemId, event) => {
    event.stopPropagation();
    const updatedCart = localCart.filter((item) => item.id !== itemId);
    setLocalCart(updatedCart);
    setCartItemCount(updatedCart.length);
  };


  return (
    <Fragment>
      <header className="app-header" id="header">
        {/* <!-- Start::main-header-container --> */}
        <div className="main-header-container container-fluid">
        {variable.toggled === "open" && (

<div ref={overlayRef} id="responsive-overlay"></div>
)}

          {/* <!-- Start::header-content-left --> */}
          <div className="header-content-left">
            {/* <!-- Start::header-element --> */}
            <div className="header-element">
              <div className="horizontal-logo">
                <Link href="/dashboard/sales" className="header-logo">
                  <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/desktop-logo.png`} alt="logo" className="desktop-logo" />
                  <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/toggle-dark.png`} alt="logo" className="toggle-dark" />
                  <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/desktop-dark.png`} alt="logo" className="desktop-dark" />
                  <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/toggle-logo.png`} alt="logo" className="toggle-logo" />
                  <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/toggle-white.png`} alt="logo" className="toggle-white" />
                  <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/desktop-white.png`} alt="logo" className="desktop-white" />
                </Link>
              </div>
            </div>
            {/* <!-- End::header-element --> */}

            {/* <!-- Start::header-element --> */}
            <div className="header-element mx-lg-0">
              <Link
                aria-label="Hide Sidebar"
                onClick={toggleSidebar}
                className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle"
                data-bs-toggle="sidebar"
                scroll={false}
                href="#!"
              >
                <span></span>
              </Link>
            </div>
            {/* <!-- End::header-element --> */}

            {/* <!-- Start::header-element --> */}

            <div ref={containerRef} className="header-element header-search md:!block !hidden my-auto auto-complete-search" id="search-modal">
              {/* Start::header-link */}
              <input
                type="text"
                className="header-search-bar form-control"
                id="header-search"
                placeholder="Search for Results..."
                onClick={() => { }}
                autoComplete="off"
                ref={searchRef}
                defaultValue={InputValue}
                onChange={(ele) => {
                  myfunction(ele.target.value);
                  setInputValue(ele.target.value);
                }}
                autoCapitalize="off"
              />
              {showa ? (
                <div className="box search-result absolute z-[9] search-fix border border-gray-200 dark:border-white/10 mt-1 w-full" ref={searchResultRef} >
                  <div className="box-header">
                    <div className="box-title mb-0 text-break">
                      Search result of {InputValue}
                    </div>
                  </div>
                  <div className="box-body overflow-auto p-2 px-4 flex flex-col max-h-[250px]">
                    {show2 ? (
                      NavData.map((e, index) => (
                        <div key={index} className="ti-list-group gap-x-3.5 text-gray-800 dark:bg-bgdark dark:border-white/10 dark:text-white">
                          <Link
                            href={`${e.path}/`}
                            className="search-result-item"
                            onClick={() => {
                              setShowa(false), setInputValue("");
                            }}
                          >
                            {e.title}
                          </Link>
                        </div>
                      ))
                    ) : (
                      <b className={`${searchcolor} `}>{searchval}</b>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
              <Link
                scroll={false}
                href="#!"
                className="header-search-icon border-0"
              >
                <i className="ri-search-line"></i>
              </Link>
            </div>
            {/* <!-- End::header-element --> */}
          </div>
          {/* <!-- End::header-content-left --> */}

          {/* <!-- Start::header-content-right --> */}
          <ul className="header-content-right">
            {/* <!-- Start::header-element --> */}
            <li className="header-element md:!hidden block">
              <Link scroll={false}
                aria-label="anchor"
                href="#!"
                className="header-link"
                data-bs-toggle="modal"
                data-hs-overlay="#header-responsive-search"
              >
                {/* <!-- Start::header-link-icon --> */}
                <i className="bi bi-search header-link-icon"></i>
                {/* <!-- End::header-link-icon --> */}
              </Link>
            </li>
            {/* <!-- End::header-element --> */}

            {/* <!-- Start::header-element --> */}
            <SpkDropdown Customclass="header-element country-selector  hidden sm:block [--placement:bottom-right] rtl:[--placement:bottom-left]" Linktag={true} Navigate='#!' Customtoggleclass='header-link hs-dropdown-toggle ti-dropdown-toggle' Svgicon='m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802'
              SvgClass='w-6 h-6 header-link-icon' Linkclass='header-link hs-dropdown-toggle ti-dropdown-toggle' Svg={true} Custommenuclass='main-header-dropdown min-w-[10rem] hidden' SvgStroke="currentColor" Strokewidth="1.5" Svvgviewbox="0 0 24 24">
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="#!"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2">
                        <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/us_flag.jpg`} alt="img" />
                      </span>
                      English
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="#!"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2">
                        <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/spain_flag.jpg`} alt="img" />
                      </span>
                      español
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="#!"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2">
                        <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/french_flag.jpg`} alt="img" />
                      </span>
                      français
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="#!"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2">
                        <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/uae_flag.jpg`} alt="img" />
                      </span>
                      عربي
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="#!"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2">
                        <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/germany_flag.jpg`} alt="img" />
                      </span>
                      Deutsch
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="#!"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2">
                        <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/china_flag.jpg`} alt="img" />
                      </span>
                      中国人
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="#!"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2">
                        <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/italy_flag.jpg`} alt="img" />
                      </span>
                      Italiano
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="#!"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2">
                        <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/russia_flag.jpg`} alt="img" />
                      </span>
                      Русский
                    </div>
                  </div>
                </Link>
              </li>
            </SpkDropdown>
            {/* <!-- End::header-element --> */}

            {/* <!-- Start::header-element --> */}
            {/* <!-- light and dark theme --> */}
            <li className="header-element header-theme-mode hidden !items-center sm:block md:!px-[0.5rem] px-2" onClick={() => toggleTheme()}>
              <Link scroll={false}
                aria-label="anchor"
                className="hs-dark-mode-active:hidden flex hs-dark-mode group flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 text-textmuted dark:text-textmuted/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                href="#!"
                
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 header-link-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              </Link>
              <Link scroll={false}
                aria-label="anchor"
                className="hs-dark-mode-active:flex hidden hs-dark-mode group flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium text-defaulttextcolor  transition-all text-xs dark:bg-bodybg dark:bg-bgdark dark:hover:bg-black/20  dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                href="#!"
                
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 header-link-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </svg>
              </Link>
            </li>
            {/* <!-- End light and dark theme --> */}

            {/* <!-- End::header-element --> */}

            {/* <!-- Start::header-element --> */}
            <SpkDropdown Customclass="header-element cart-dropdown [--auto-close:inside]" Linktag={true} Navigate='#!' Svg={true} Linkclass='header-link hs-dropdown-toggle ti-dropdown-toggle' Badgetag={true} Badgeclass='rounded-full header-icon-badge text-white' Custommenuclass='main-header-dropdown'
              Badgecolor='secondary' Badgeid='cart-icon-badge' Badgetext={remainingCount2} Badgepill={true} SvgClass='w-6 h-6 header-link-icon' SvgStroke="currentColor" Strokewidth="1.5" Svvgviewbox="0 0 24 24"
              Svgicon='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'>

              {/* <!-- Start::header-link|dropdown-toggle --> */}

              {/* <!-- End::header-link|dropdown-toggle --> */}
              {/* <!-- Start::main-header-dropdown --> */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="mb-0 text-[15px] font-medium">
                    Cart Items
                    <SpkBadge variant="primarytint2color"
                      customClass="text-white ms-1 !py-[0.15rem] rounded-full"
                      Id="cart-data"
                    >
                      {remainingCount2} {remainingCount2 !== 1 ? '' : ''}
                    </SpkBadge>
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-textmuted dark:text-textmuted/50">
                      Sub Total :
                    </span>
                    <h6 className="mb-0"> $740</h6>
                  </div>
                </div>
              </div>
              <hr className="dropdown-divider" />
              <SimpleBar className="list-none mb-0" id="header-cart-items-scroll">
                {card.slice(0, maxDisplayItems).map((idx, index) => (
                  <li className="ti-dropdown-item block" key={index}>
                    {!card.includes(idx.id) && (
                      <div className="flex items-center cart-dropdown-item gap-4">
                        <div className="leading-none">
                          <span className="avatar avatar-xl bg-primary/10">
                            <Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}${idx.productpicture}`} alt="Wireless Headphones" />
                          </span>
                        </div>
                        <div className="flex-auto">
                          <div className="flex items-center justify-between mb-0">
                            <div className="mb-0 text-[14px] font-medium">
                              <Link scroll={false} href="/apps/ecommerce/cart">{idx.title}</Link>
                              <div className="truncate">
                                <p className="mb-0 header-cart-text truncate text-[11px] text-textmuted dark:text-textmuted/50">
                                  {idx.data}
                                </p>
                                <h6 className="font-medium mb-0 mt-1">
                                  <span className="text-success font-normal me-1 text-[11px] inline-block">
                                    (Qty : {idx.quantity})
                                  </span>
                                  {idx.price}
                                </h6>
                              </div>
                            </div>
                            <div className="text-end">
                              <Link scroll={false} onClick={(event) => handleDelete(idx.id, event)}
                                href="#!"
                                className="header-cart-remove dropdown-item-close"
                                aria-label="anchor"
                              >
                                <i className="ri-close-line"></i>
                              </Link>
                              <h6 className="font-medium mb-0 mt-3">
                                <span className="text-info op-4 font-normal me-1 text-[11px] inline-block">
                                  Total :
                                </span>
                                {idx.discount}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}

              </SimpleBar>
              <div className={`p-4 empty-header-item border-t grid items-center ${cartItemCount === 0 ? 'hidden' : 'block'}`}>
                <Link scroll={false}
                  href="/apps/ecommerce/checkout"
                  className="ti-btn ti-btn-primary btn-wave text-center"
                >
                  Proceed to checkout
                </Link>
              </div>
              <div className={`p-[3rem] empty-item ${cartItemCount === 0 ? 'block' : 'hidden'}`}>
                <div className="text-center">
                  <span className="avatar avatar-xl avatar-rounded bg-primary/10 !text-primary">
                    <i className="ri-shopping-cart-2-line fs-2"></i>
                  </span>
                  <h6 className="font-medium mb-1 mt-3">
                    Your Cart is Empty
                  </h6>
                  <span className="mb-3 font-normal text-[13px] block">
                    Add some items to make me happy :)
                  </span>
                  <Link scroll={false}
                    href="/apps/ecommerce/products"
                    className="ti-btn bg-primarytint1color text-white btn-wave ti-btn-sm m-1"
                    data-abc="true"
                  >
                    continue shopping{" "}
                    <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
              {/* <!-- End::main-header-dropdown --> */}
            </SpkDropdown>
            {/* <!-- End::header-element --> */}

            {/* <!-- Start::header-element --> */}
            <SpkDropdown Linkclass='header-link hs-dropdown-toggle ti-dropdown-toggle' Linktag={true} Customclass="header-element notifications-dropdown !hidden xl:!block hs-dropdown ti-dropdown [--auto-close:inside]" Navigate='#!'
              Id='messageDropdown' Svg={true} SvgClass='w-6 h-6 header-link-icon' Badgetag={true} Badgecolor='primarytint2color' Badgeclass='header-icon-pulse rounded custom-header-icon-pulse pulse pulse-secondary' Custommenuclass='main-header-dropdown' SvgStroke="currentColor" Strokewidth="1.5" Svvgviewbox="0 0 24 24"
              Svgicon='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5' >

              {/* <!-- Start::header-link|dropdown-toggle --> */}

              {/* <!-- End::header-link|dropdown-toggle --> */}
              {/* <!-- Start::main-header-dropdown --> */}

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="mb-0 text-[15px] font-medium">
                    Notifications
                  </p>
                  <SpkBadge variant="secondary"
                    customClass="text-white rounded-sm"
                    id="notifiation-data"
                  >
                    {unreadCount} Unread
                  </SpkBadge>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <SimpleBar className="list-none mb-0" id="header-notification-scroll">

                {notifications.map((notification) => (
                  <li className="ti-dropdown-item block" key={notification.id}>
                    <div className="flex items-center">
                      <div className="pe-2 leading-none">
                        <span className="avatar avatar-md avatar-rounded bg-primary">
                          {notification.src}
                        </span>
                      </div>
                      <div className="grow flex items-center justify-between">
                        <div>
                          <p className="mb-0 font-medium">
                            <Link scroll={false} href="/pages/chat">{notification.heading}</Link>
                          </p>
                          <div className="text-textmuted dark:text-textmuted/50 font-normal text-xs header-notification-text truncate">
                            {notification.data}
                          </div>
                          <div className="font-normal text-[10px] text-textmuted dark:text-textmuted/50 op-8">
                            {notification.data1}
                          </div>
                        </div>
                        <div>
                          <Link scroll={false} onClick={() => handleRemove1(notification.id)}
                            aria-label="anchor"
                            href="#!"
                            className="min-w-fit-content dropdown-item-close1"
                          >
                            <i className="ri-close-line"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}



              </SimpleBar>
              <div className={`p-4 empty-header-item1 border-t ${notifications.length === 0 ? 'hidden' : 'block'}`}>
                <div className="grid">
                  <Link scroll={false} href="#!" className="ti-btn ti-btn-primary btn-wave">View All</Link>
                </div>
              </div>
              <div className={`p-[3rem] empty-item1 ${notifications.length === 0 ? 'block' : 'hidden'}`}>
                <div className="text-center">
                  <span className="avatar avatar-xl avatar-rounded bg-secondary/10 text-secondary">
                    <i className="ri-notification-off-line text-[2rem]"></i>
                  </span>
                  <h6 className="font-medium mt-4">No New Notifications</h6>
                </div>
              </div>

              {/* <!-- End::main-header-dropdown --> */}
            </SpkDropdown>
            {/* <!-- End::header-element --> */}

            {/* <!-- Start::header-element --> */}
            <li className="header-element header-fullscreen" onClick={toggleFullScreen}>
              {/* <!-- Start::header-link --> */}
              <Link scroll={false}
                // onclick="openFullscreen();"
                href="#!"
                className="header-link"
                aria-label="anchor"
              >
                {fullScreen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 full-screen-close header-link-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
                    />
                  </svg>

                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 full-screen-open header-link-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                    />
                  </svg>
                )}
              </Link>
              {/* <!-- End::header-link --> */}
            </li>
            {/* <!-- End::header-element --> */}

            {/* <!-- Start::header-element --> */}
            <SpkDropdown Customclass="header-element" Linktag={true} Navigate='#!' Linkclass='header-link hs-dropdown-toggle ti-dropdown-toggle' Id="mainHeaderProfile" Imagetag={true}
              Imageclass='flex items-center avatar avatar-sm mb-0' image={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/faces/15.jpg`}
              Custommenuclass='main-header-dropdown  pt-0 overflow-hidden header-profile-dropdown ' Menulabel='mainHeaderProfile'>

              {/* <!-- End::header-link|dropdown-toggle --> */}

              <li>
                <div className="ti-dropdown-item text-center border-b border-defaultborder dark:border-defaultborder/10 block">
                  <span>Mr.Henry</span>
                  <span className="block text-xs text-textmuted dark:text-textmuted/50">
                    UI/UX Designer
                  </span>
                </div>
              </li>
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="/pages/profile"
                >
                  <i className="fe fe-user p-1 rounded-full bg-primary/10 text-primary me-2 text-[1rem]"></i>
                  Profile
                </Link>
              </li>
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="/pages/email/mail-app"
                >
                  <i className="fe fe-mail p-1 rounded-full bg-primary/10 text-primary me-2 text-[1rem]"></i>
                  Mail Inbox
                </Link>
              </li>
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="/pages/file-manager"
                >
                  <i className="fe fe-database p-1 rounded-full bg-primary/10 text-primary klist me-2 text-[1rem]"></i>
                  File Manager
                  <SpkBadge variant="primarytint1color" customClass="text-white ms-auto text-[0.5625rem]">
                    2
                  </SpkBadge>
                </Link>
              </li>
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="/pages/email/mail-settings"
                >
                  <i className="fe fe-settings p-1 rounded-full bg-primary/10 text-primary ings me-2 text-[1rem]"></i>
                  Settings
                </Link>
              </li>
              <li className="border-t border-defaultborder dark:border-defaultborder/10 bg-light">
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="/pages/chat"
                >
                  <i className="fe fe-help-circle p-1 rounded-full bg-primary/10 text-primary set me-2 text-[1rem]"></i>
                  Help
                </Link>
              </li>
              <li>
                <Link scroll={false}
                  className="ti-dropdown-item flex items-center"
                  href="#!"
                  onClick={handleLogout}
                >
                  <i className="fe fe-lock p-1 rounded-full bg-primary/10 text-primary ut me-2 text-[1rem]"></i>
                  Log Out
                </Link>
              </li>
            </SpkDropdown>
            {/* <!-- End::header-element --> */}

            {/* <!-- Start::header-element --> */}
            <li className="header-element">
              {/* <!-- Start::header-link|switcher-icon --> */}
              <Link scroll={false}
                href="#!"
                className="header-link switcher-icon"
                data-hs-overlay="#hs-overlay-switcher"
                aria-label="anchor"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 header-link-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </Link>
              
              {/* <!-- End::header-link|switcher-icon --> */}
            </li>
            {/* <!-- End::header-element --> */}
          </ul>
          {/* <!-- End::header-content-right --> */}
        </div>
        {/* <!-- End::main-header-container --> */}

      </header>
      <div className="hs-overlay ti-modal hidden" id="header-responsive-search" tabIndex={-1} aria-labelledby="header-responsive-search" aria-hidden="true">
        <div className="ti-modal-box">
          <div className="ti-modal-dialog">
            <div className="ti-modal-content">
              <div className="ti-modal-body">
                <div className="input-group">
                  <input type="text" className="form-control border-end-0 !border-s" placeholder="Search Anything ..."
                    aria-label="Search Anything ..." aria-describedby="button-addon2" />
                  <SpkButton variant="primary" customClass="ti-btn !m-0" buttontype="button"
                    Id="button-addon2"><i className="bi bi-search"></i></SpkButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  local_varaiable: state.reducer
});
export default connect(mapStateToProps, { ThemeChanger })(Header);
