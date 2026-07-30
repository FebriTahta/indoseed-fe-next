"use client"
import Link from 'next/link';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import SimpleBar from 'simplebar-react';
import { MENUITEMS } from '../../layouts-components/sidebar/nav';
import Menuloop from './menuloop';
import { data$, getState, setState } from '../services/switcherServices';
import { usePathname } from 'next/navigation';
import { basePath } from '../../../next.config';
import SpkButton from '../../../shared/@spk-reusable-components/uielements/spk-button';
import Image from 'next/image';
import { catchError, map, of } from 'rxjs';
const Sidebar = () => {
	let [variable, setVariable] = useState(getState());
	useEffect(() => {
		const subscription = data$.subscribe((e) => {
			// No need to manually update component state, the UI will re-render automatically
			setVariable(e);
		});

		return () => subscription.unsubscribe(); // Clean up the subscription
	}, []);

	const local_varaiable = variable;

	const [openMenu, setOpenMenu] = useState(MENUITEMS || [])

	const slidesArrow = (selector) => document.querySelector(selector);
	const sidebarQuerySelectorAll = (selector) => document.querySelectorAll(selector);

	useEffect(() => {
		const observal = of(MENUITEMS);

		const subscription = observal.pipe(
			map(res => res),
			catchError((err) => {
				return of([]);
			})
		).subscribe({
			next: (result) => {
				setOpenMenu(result)
			}
		})

		return () => subscription.unsubscribe()

	}, [openMenu]);

	function Onhover() {
		const theme = local_varaiable;
		if ((theme.toggled == 'icon-overlay-close' || theme.toggled == 'detached-close') && theme.iconOverlay != 'open') {
			const newState = {
				"iconOverlay": "open"
			}
			setState(newState)
		}
	}
	function Outhover() {
		// const theme = local_varaiable;
		if ((variable.toggled == 'icon-overlay-close' || variable.toggled == 'detached-close') && variable.iconOverlay == 'open') {
			const newState = {
				"iconOverlay": ""
			}
			setState(newState)
		}
	}

	// closing the menu when widnow width is <= 992

	const overlayRef = useRef(null);

	function menuClose() {
		const currentState = getState();
		if (window.innerWidth <= 992) {
			const newState = {
				toggled: "close"
			}
			setState(newState);
		}
		if (overlayRef.current) {
			overlayRef.current.classList.remove("active");
		}
		if (currentState.dataNavLayout == "horizontal" || currentState.dataNavStyle == "menu-click" || currentState.dataNavStyle == "icon-click") {
			closeMenu();
		}
	}

	//  closing the menu 
	const [isSticky, setIsSticky] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsSticky(window.scrollY > 30);
		};

		// Attach event listener
		window.addEventListener("scroll", handleScroll);

		// Cleanup function to remove listener on unmount
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	function closeMenu() {
		const closeMenudata = (items) => {
			items?.forEach((item) => {
				item.active = false;
				closeMenudata(item.children);
			});
		};
		closeMenudata(MENUITEMS);
		setOpenMenu((arr) => [...arr]);
	}

	const getDocumentElement = () => {
		return document.documentElement;
	};

	//  whenEver the width is <=992 it closes the menu 

	useEffect(() => {
		const resizeEventListeners = [
			{ event: 'resize', handler: menuResizeFn },
			{ event: 'resize', handler: checkHoriMenu }
		];
		resizeEventListeners.forEach(({ event, handler }) => {
			window.addEventListener(event, handler);
		});
		const mainContent = slidesArrow(".main-content");
		if (window.innerWidth <= 992) {
			if (mainContent) {
				const newState = {
					toggled: "close"
				}
				setState(newState)

			}
			else if (getDocumentElement().getAttribute('data-nav-layout') == 'horizontal') {
				closeMenu();
			}
		}
		mainContent.addEventListener('click', menuClose);
		return () => {
			resizeEventListeners.forEach(({ event, handler }) => {
				window.removeEventListener(event, handler);
			});
			if (mainContent) {
				mainContent.removeEventListener('click', menuClose);
			}
		};
	}, []);

	//  widow resize 

	const WindowPreSize = typeof window !== 'undefined' ? [window.innerWidth] : [];

	function menuResizeFn() {

		if (typeof window === 'undefined') {
			// Handle the case where window is not available (server-side rendering)
			return;
		}

		WindowPreSize.push(window.innerWidth);
		if (WindowPreSize.length > 2) { WindowPreSize.shift() }

		const theme = variable;
		const currentWidth = WindowPreSize[WindowPreSize.length - 1];
		const prevWidth = WindowPreSize[WindowPreSize.length - 2];

		if (WindowPreSize.length > 1) {
			if (currentWidth < 992 && prevWidth >= 992) {
				// less than 992;
				const newState = {
					toggled: "close"
				}
				setState(newState)
			}

			if (currentWidth >= 992 && prevWidth < 992) {
				// greater than 992
				const newState = {
					toggled: theme.dataVerticalStyle === "doublemenu" ? "double-menu-open" : ""
				}
				setState(newState)
			}
		}
	}


	function switcherArrowFn() {
		function slideClick() {
			const slide = sidebarQuerySelectorAll('.slide');
			const slideMenu = sidebarQuerySelectorAll(".slide-menu");

			slide.forEach((element) => {
				if (element.classList.contains("is-expanded")) {
					element.classList.remove("is-expanded");
				}
			});

			slideMenu.forEach((element) => {
				if (element.classList.contains("open")) {
					element.classList.remove("open");
					// element.style.display = "none";
				}
			});
		}
		slideClick();
	}

	const menuNavRef = useRef(null);
	const mainContainerRef = useRef(null);

	const checkHoriMenu = () => {
		const menuNav = menuNavRef.current;
		const mainContainer1 = mainContainerRef.current;

		if (menuNav && mainContainer1) {
			const computedStyle = window.getComputedStyle(menuNav);
			const marginLeftValue = Math.ceil(
				Number(computedStyle.marginLeft.split("px")[0])
			);
			const marginRightValue = Math.ceil(
				Number(computedStyle.marginRight.split("px")[0])
			);
			const check = menuNav.scrollWidth - mainContainer1.offsetWidth;

			// Show/Hide the arrows
			if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
			} else {
				menuNav.style.marginLeft = "0px";
				menuNav.style.marginRight = "0px";
				menuNav.style.marginInlineStart = "0px";
			}

			if (!(slidesArrow("html")?.getAttribute("dir") === "rtl")) {
				// LTR check the width and adjust the menu in screen
				if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
					if (Math.abs(check) < Math.abs(marginLeftValue)) {
						menuNav.style.marginLeft = -check + "px";
					}
				}

			} else {
				// RTL check the width and adjust the menu in screen
				if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
					if (Math.abs(check) < Math.abs(marginRightValue)) {
						menuNav.style.marginRight = -check + "px";
					}
				}

			}
		}

	};



	function slideRight() {
		const menuNav = slidesArrow(".main-menu");
		const mainContainer1 = slidesArrow(".main-sidebar");
		const slideRightButton = slidesArrow("#slide-right");
		const slideLeftButton = slidesArrow("#slide-left");
		const element = slidesArrow(".main-menu > .slide.open");
		const element1 = slidesArrow(".main-menu > .slide.open > ul");
		if (menuNav && mainContainer1) {
			const marginLeftValue = Math.ceil(
				Number(window.getComputedStyle(menuNav).marginInlineStart.split("px")[0])
			);
			const marginRightValue = Math.ceil(
				Number(window.getComputedStyle(menuNav).marginInlineEnd.split("px")[0])
			);
			const check = menuNav.scrollWidth - mainContainer1.offsetWidth;
			let mainContainer1Width = mainContainer1.offsetWidth;

			const local_varaiable = variable
			// If the menu content exceeds the container width
			if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
				// Check if the direction is RTL or LTR
				if (!(local_varaiable.dir === "rtl")) {
					// Non-RTL case
					if (Math.abs(check) > Math.abs(marginLeftValue)) {
						menuNav.style.marginInlineEnd = "0"; // Ensure no margin on the end

						// Update the width and hide the button if necessary
						if (!(Math.abs(check) > Math.abs(marginLeftValue) + mainContainer1Width)) {
							mainContainer1Width = Math.abs(check) - Math.abs(marginLeftValue);
							if (slideRightButton) {
								slideRightButton.classList.add("hidden");
							}
						}

						// Adjust the start margin to create the sliding effect
						menuNav.style.marginInlineStart =
							(Number(menuNav.style.marginInlineStart.split("px")[0]) - Math.abs(mainContainer1Width)) + "px";

						// Show the button again after the slide
						if (slideRightButton) {
							slideRightButton.classList.remove("hidden");
						}
					}
				} else {
					// RTL case
					if (Math.abs(check) > Math.abs(marginRightValue)) {
						menuNav.style.marginInlineEnd = "0"; // Ensure no margin on the end

						// Update the width and hide the button if necessary
						if (!(Math.abs(check) > Math.abs(marginRightValue) + mainContainer1Width)) {
							mainContainer1Width = Math.abs(check) - Math.abs(marginRightValue);
							if (slideRightButton) {
								slideRightButton.classList.add("hidden");
							}
						}

						// Adjust the start margin to create the sliding effect
						menuNav.style.marginInlineStart =
							(Number(menuNav.style.marginInlineStart.split("px")[0]) - Math.abs(mainContainer1Width)) + "px";

						// Show the button again after the slide
						if (slideLeftButton) {
							slideLeftButton.classList.remove("hidden");
						}
					}
				}
			}

			// Hide active/open elements after slide
			if (element) {
				element.classList.remove("active"); // Remove the active class from the menu item
			}
			if (element1) {
				element1.style.display = "none"; // Hide the dropdown if necessary
			}
		}

		switcherArrowFn();
		checkHoriMenu();
	}

	function slideLeft() {
		const menuNav = slidesArrow(".main-menu");
		const mainContainer1 = slidesArrow(".main-sidebar");
		const slideRightButton = slidesArrow("#slide-right");
		const slideLeftButton = slidesArrow("#slide-left");
		const element = slidesArrow(".main-menu > .slide.open");
		const element1 = slidesArrow(".main-menu > .slide.open > ul");
		if (menuNav && mainContainer1) {
			const marginLeftValue = Math.ceil(
				Number(window.getComputedStyle(menuNav).marginInlineStart.split("px")[0])
			);
			const marginRightValue = Math.ceil(
				Number(window.getComputedStyle(menuNav).marginInlineEnd.split("px")[0])
			);
			const check = menuNav.scrollWidth - mainContainer1.offsetWidth;
			let mainContainer1Width = mainContainer1.offsetWidth;

			if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
				if (!(local_varaiable.dataVerticalStyle.dir === "rtl")) {
					if (Math.abs(check) <= Math.abs(marginLeftValue)) {
						menuNav.style.marginInlineStart = "0px";
					}
				} else {
					if (Math.abs(check) > Math.abs(marginRightValue)) {
						menuNav.style.marginInlineStart = "0";

						if (!(Math.abs(check) > Math.abs(marginRightValue) + mainContainer1Width)) {
							mainContainer1Width = Math.abs(check) - Math.abs(marginRightValue);
							if (slideRightButton) {
								slideRightButton.classList.add("hidden");
							}
						}

						menuNav.style.marginInlineStart =
							(Number(menuNav.style.marginInlineStart.split("px")[0]) -
								Math.abs(mainContainer1Width)) +
							"px";

						if (slideLeftButton) {
							slideLeftButton.classList.remove("hidden");
						}
					}
				}
			}
			if (element) {
				element.classList.remove("active");
			}
			if (element1) {
				element1.style.display = "none";
			}
		}

		switcherArrowFn();
	}


	const Baselocation = usePathname();

	useEffect(() => {
		const normalizePath = (path) => {
			return path && path.endsWith('/') ? path.slice(0, -1) : path;
		};

		const pathName = normalizePath(Baselocation);

		const updateMenu = (menu) => {
			return menu?.map((menuItem) => {
				const menuItemPath = normalizePath(menuItem?.path);
				if (menuItemPath === pathName) {
					menuItem.active = true;
					menuItem.selected = true;
				} else if (menuItem.children) {
					menuItem.children = updateMenu(menuItem.children);

					if (menuItem.children.some((subMenu) => subMenu.active)) {
						menuItem.active = true;
						menuItem.selected = true; // Parent gets selected if any child is active
					} else {
						menuItem.active = false;
						menuItem.selected = false;
					}
				} else {
					menuItem.active = false;
					menuItem.selected = false;
				}

				return menuItem;
			});
		};

		const updatedMenu = updateMenu(openMenu);

		setOpenMenu(updatedMenu);

	}, [Baselocation]);




	function handleToMenu(event, targetObject, MenuItems = openMenu, state, level = 0) {
		const theme = variable;
		let element = event.target;
		if ((theme.dataNavStyle != "icon-hover" && theme.dataNavStyle != "menu-hover") || (window.innerWidth < 992) || (theme.dataNavLayout != "horizontal") && (theme.toggled != "icon-hover-closed" && theme.toggled != "menu-hover-closed")) {
			for (const item of MenuItems) {
				if (item === targetObject) {
					if (theme.dataVerticalStyle == 'doublemenu' && item.active && item.children) {
						return;
					}
					item.active = !item.active;
					if (item.active) {
						closeOtherMenus(MenuItems, item);
					} else {
						if (theme.dataVerticalStyle == 'doublemenu') {
							const newState = {
								toggled: 'double-menu-close'
							}
							setState(newState)
						}
					}
					setAncestorsActive(MenuItems, item);

				}
				else if (!item.active) {
					if (theme.dataVerticalStyle != 'doublemenu') {
						item.active = false; // Set active to false for items not matching the target
					}
				}
				if (item.children && item.children.length > 0) {
					handleToMenu(event, targetObject, item.children, level++);
				}
			}
			if (targetObject?.children && targetObject.active) {
				if (theme.dataVerticalStyle == 'doublemenu' && theme.toggled != 'double-menu-open') {
					const newState = {
						toggled: "double-menu-open"
					}
					setState(newState)
				}
			}
			if (element && theme.dataNavLayout == 'horizontal' && (theme.dataNavStyle == 'menu-click' || theme.dataNavStyle == 'icon-click')) {
				const listItem = element.closest("li");
				if (listItem) {
					// Find the first sibling <ul> element
					const siblingUL = listItem.querySelector("ul");
					let outterUlWidth = 0;
					let listItemUL = listItem.closest('ul:not(.main-menu)');
					while (listItemUL) {
						listItemUL = listItemUL.parentElement.closest('ul:not(.main-menu)');
						if (listItemUL) {
							outterUlWidth += listItemUL.clientWidth;
						}
					}
					if (siblingUL) {
						// You've found the sibling <ul> element
						let siblingULRect = listItem.getBoundingClientRect();
						if (theme.dir == 'rtl') {
							if ((siblingULRect.left - siblingULRect.width - outterUlWidth + 150 < 0 && outterUlWidth < window.innerWidth) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
								targetObject.dirchange = true;
							} else {
								targetObject.dirchange = false;
							}
						} else {
							if ((outterUlWidth + siblingULRect.right + siblingULRect.width + 50 > window.innerWidth && siblingULRect.right >= 0) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
								targetObject.dirchange = true;
							} else {
								targetObject.dirchange = false;
							}
						}
					}
				}
			}
		}
		setOpenMenu((arr) => [...arr]);
	}

	function closeOtherMenus(MenuItems, targetObject) {
		for (const item of MenuItems) {
			if (item !== targetObject) {
				item.active = false;
				if (item.children && item.children.length > 0) {
					closeOtherMenus(item.children, targetObject);
				}
			}
		}
	}

	function setAncestorsActive(MenuItems, targetObject) {
		const theme = variable;
		const parent = findParent(MenuItems, targetObject);
		if (parent) {
			parent.active = true;
			if (parent.active) {
				const newState = {
					toggled: "double-menu-open"
				}
				setState(newState)
				// ThemeChanger({ ...theme, toggled: "double-menu-open" });
			}

			setAncestorsActive(MenuItems, parent);
		}

		function findParent(MenuItems, targetObject) {
			for (const item of MenuItems) {
				if (item.children && item.children.includes(targetObject)) {
					return item;
				}
				if (item.children && item.children.length > 0) {
					const parent = findParent(MenuItems = item.children, targetObject);
					if (parent) {
						return parent;
					}
				}
			}
			return null;
		}

	}

	let level = 0
	let hasParent = false;
	let hasParentLevel = 0;

	function setSubmenu(event, targetObject, MenuItems = openMenu) {
		const theme = getState();
		if ((window.screen.availWidth <= 992 || theme.dataNavStyle != "icon-hover") && (window.screen.availWidth <= 992 || theme.dataNavStyle != "menu-hover")) {
			if (!event?.ctrlKey) {
				for (const item of MenuItems) {
					if (item === targetObject) {
						item.active = true;
						item.selected = true;
						setMenuAncestorsActive(item);
					} else if (!item.active && !item.selected) {
						item.active = false; // Set active to false for items not matching the target
						item.selected = false; // Set active to false for items not matching the target
					} else {
						removeActiveOtherMenus(item);
					}
					if (item.children && item.children.length > 0) {
						setSubmenu(event, targetObject, item.children);
					}
				}
			}
		}
		setOpenMenu((arr) => [...arr]);
	}
	function getParentObject(obj, childObject) {
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (typeof obj[key] === 'object' && JSON.stringify(obj[key]) === JSON.stringify(childObject)) {
					return obj; // Return the parent object
				}
				if (typeof obj[key] === 'object') {
					const parentObject = getParentObject(obj[key], childObject);
					if (parentObject !== null) {
						return parentObject;
					}
				}
			}
		}
		return null; // Object not found
	}


	function setMenuAncestorsActive(targetObject) {
		const parent = getParentObject(openMenu, targetObject);
		const theme = variable;
		if (parent) {
			if (hasParentLevel > 2) {
				hasParent = true;
			}
			parent.active = true;
			parent.selected = true;
			hasParentLevel += 1;
			setMenuAncestorsActive(parent);
		}
		// else if (!hasParent) {
		//   hasParentLevel = 0;
		//   if (theme.dataVerticalStyle == 'doublemenu'  ) {
		//     // ThemeChanger({ ...theme, toggled:  "double-menu-close" });
		//     // theme.dataVerticalStyle('data-toggled', 'double-menu-close');
		//     console.log(theme.dataVerticalStyle)
		//     const newState = {
		//       toggled: 'double-menu-close'
		//     }
		//     setState(newState)
		//   }
		//   else {
		//     hasParentLevel = 0;
		//     hasParent = false;
		//   }
		// }
	}

	function removeActiveOtherMenus(item) {
		if (item) {
			if (Array.isArray(item)) {
				for (const val of item) {
					val.active = false;
					val.selected = false;
				}
			}
			item.active = false;
			item.selected = false;

			if (item.children && item.children.length > 0) {
				removeActiveOtherMenus(item.children);
			}
		}
		else {

		}
	}

	function setMenuUsingUrl(currentPath) {
		hasParent = false;
		hasParentLevel = 1;
		// Check current url and trigger the setSidemenu method to active the menu.
		const setSubmenuRecursively = (items) => {

			items?.forEach((item) => {
				if (item.path == '') { }
				else if (item.path === currentPath) {
					setSubmenu(null, item);
				}
				setSubmenuRecursively(item.children);
			});
		};
		setSubmenuRecursively(openMenu);
	}

	const [previousUrl, setPreviousUrl] = useState("/");

	useEffect(() => {

		// Select the target element
		const targetElement = getDocumentElement();

		// Create a MutationObserver instance
		const observer = new MutationObserver(handleAttributeChange);

		// Configure the observer to watch for attribute changes
		const config = { attributes: true };

		// Start observing the target element
		observer.observe(targetElement, config);
		let currentPath = Baselocation.endsWith("/") ? Baselocation.slice(0, -1) : Baselocation;
		if (currentPath !== previousUrl) {
			setMenuUsingUrl(currentPath);
			setPreviousUrl(currentPath);
		}
	}, [Baselocation]);


	const Sideclick = () => {
		if (window.innerWidth > 992) {
			const theme = getState()
			if (theme.iconOverlay != "open") {
				const newState = {
					iconOverlay: 'open'
				}
				setState(newState)
			}
		}
	};

	function HoverToggleInnerMenuFn(event, item) {
		const theme = getState();
		let element = event.target;
		if (element && theme.dataNavLayout == "horizontal" && (theme.dataNavStyle == "menu-hover" || theme.dataNavStyle == "icon-hover")) {
			const listItem = element.closest("li");
			if (listItem) {
				// Find the first sibling <ul> element
				const siblingUL = listItem.querySelector("ul");
				let outterUlWidth = 0;
				let listItemUL = listItem.closest("ul:not(.main-menu)");
				while (listItemUL) {
					listItemUL = listItemUL.parentElement.closest("ul:not(.main-menu)");
					if (listItemUL) {
						outterUlWidth += listItemUL.clientWidth;
					}
				}
				if (siblingUL) {
					// You've found the sibling <ul> element
					let siblingULRect = listItem.getBoundingClientRect();
					if (theme.dir == "rtl") {
						if ((siblingULRect.left - siblingULRect.width - outterUlWidth + 150 < 0 && outterUlWidth < window.innerWidth) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
							item.dirchange = true;
						} else {
							item.dirchange = false;
						}
					} else {
						if ((outterUlWidth + siblingULRect.right + siblingULRect.width + 50 > window.innerWidth && siblingULRect.right >= 0) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
							item.dirchange = true;
						} else {
							item.dirchange = false;
						}
					}
				}
			}
		}
	}
	function handleAttributeChange(mutationsList) {
		for (const mutation of mutationsList) {
			if (mutation.type === 'attributes' && mutation.attributeName === 'data-nav-layout') {
				const newValue = mutation.target.getAttribute('data-nav-layout');
				if (newValue == 'vertical') {
					// let currentPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
					let currentPath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1).replace(basePath, '') : location.pathname.replace(basePath, '');
					currentPath = !currentPath ? '/dashboard/ecommerce' : currentPath;
					setMenuUsingUrl(currentPath);
				} else {
					closeMenu();
				}
			}
		}
	}

	const handleClick = (event) => {

		event.preventDefault(); // Prevents the default anchor behavior (navigation)

	};

	return (
		<Fragment>
			<div ref={overlayRef} id="responsive-overlay" onClick={menuClose}></div>
			<aside className={`app-sidebar ${isSticky ? "sticky-pin" : ""}`} id="sidebar" onMouseOver={Onhover} onMouseLeave={Outhover} >
				<div className="main-sidebar-header">
					<Link href="/dashboard/sales" className="header-logo">
						<Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/logo-web-green.png`} alt="logo" className="desktop-logo" />
						<Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/toggle-dark.png`} alt="logo" className="toggle-dark" />
						<Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/logo-web-green.png`} alt="logo" className="desktop-dark" />
						<Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/toggle-logo.png`} alt="logo" className="toggle-logo" />
						<Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/toggle-white.png`} alt="logo" className="toggle-white" />
						<Image fill src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/logo-web-green.png`} alt="logo" className="desktop-white" />
					</Link>
				</div>
				<SimpleBar className='main-sidebar' id="sidebar-scroll">
					
					<nav className='main-menu-container nav nav-pills flex-col sub-open'>
						<div className="slide-left" id="slide-left" onClick={() => { slideLeft(); }}> <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24"> <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path> </svg> </div>

						<ul className="main-menu">
							{MENUITEMS.map((levelone, index) => (
								<Fragment key={index}>
									<li className={`${levelone.menutitle ? 'slide__category' : ''} ${levelone.type === 'link' ? 'slide' : ''}
                                               ${levelone.type === 'sub' ? 'slide has-sub' : ''} ${levelone?.active ? 'open' : ''} ${levelone?.selected ? 'active' : ''}`}>
										{levelone.menutitle ?
											<span className='category-name'>
												{levelone.menutitle}
											</span>
											: ""}
										{levelone.type === "link" ?
											<Link href={levelone.path + "/"} className={`side-menu__item ${levelone.selected ? 'active' : ''}`} >
												<span className={`${local_varaiable?.dataVerticalStyle == 'doublemenu' ? '' : 'd-none'}`}>

													<span className={`hs-tooltip inline-block [--placement:right] leading-none ${local_varaiable?.dataVerticalStyle == 'doublemenu' ? '' : 'hidden'}`}>
														<SpkButton buttontype="button" customClass="hs-tooltip-toggle  inline-flex justify-center items-center">
															{levelone.icon}
															<span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 !py-2 !px-3 !rounded-md bg-black text-xs font-medium text-white shadow-sm dark:bg-black" role="tooltip">
																{levelone.title}
															</span>
														</SpkButton>
													</span>
												</span>
												{local_varaiable.dataVerticalStyle != "doublemenu" ? levelone.icon : ""}
												<span className="side-menu__label">{levelone.title} {levelone.badgetxt ? (<span className={levelone.class}> {levelone.badgetxt}</span>
												) : (
													""
												)}
												</span>
											</Link>
											: ""}
										{levelone.type === "empty" ?
											<Link href="#!" className='side-menu__item'
												onClick={handleClick}
											>{levelone.icon}<span className=""> {levelone.title} {levelone.badgetxt ? (
												<span className={levelone.class}>{levelone.badgetxt} </span>
											) : (
												""
											)}
												</span>
											</Link>
											: ""}
										{levelone.type === "sub" ?
											<Menuloop MenuItems={levelone} level={level + 1} handleToMenu={handleToMenu} HoverToggleInnerMenuFn={HoverToggleInnerMenuFn} />
											: ''}
									</li>
								</Fragment>
							))}
						</ul>
						<div className="slide-right" id="slide-right" onClick={slideRight}><svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24"> <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path> </svg></div>
					</nav>
				</SimpleBar>
				<div className="p-4 mt-auto sticky bottom-0 z-10" style={{ backgroundColor: 'inherit' }}>
					<Link href="/support" className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/10 transition-colors">
						<div className="text-white">
							<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.102.034.209.04.314.015l1.696-.424A3 3 0 0013.293 18.6L12.5 17.027a1.5 1.5 0 011.692-2.115l.182.046a3 3 0 003.585-1.921l1.642-4.106c.219-.548.219-1.157 0-1.705l-1.642-4.106A3 3 0 0014.375 5.2l-.182.046A1.5 1.5 0 0112.5 3.13L13.293 1.56a3 3 0 00-2.444-2.474l-1.696-.424a1.36 1.36 0 00-.314-.015C2.865 3.834 2 7.582 2 12z" />
							</svg>
						</div>
						<div className="flex flex-col">
							<span className="text-white text-[13px] font-semibold leading-tight">Butuh Bantuan?</span>
							<span className="text-white/70 text-[11px]">Hubungi Support</span>
						</div>
					</Link>
				</div>
			</aside>
		</Fragment>
	)
}

export default Sidebar;