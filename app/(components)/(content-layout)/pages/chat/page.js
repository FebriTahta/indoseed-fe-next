"use client"
import SpkBadge from "@/shared/@spk-reusable-components/uielements/spk-badge";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import { Chat1, Chat2, Chat3, LightboxGallery } from "@/shared/data/pages/chatdata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Link from "next/link";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import EmojiPicker from 'emoji-picker-react';
import Image from "next/image";



const Chat = () => {
    const [activeUser, setActiveUser] = useState({
        name: 'Kerina Cherish',
        image: '../../assets/images/faces/6.jpg',
        status: 'online',
    });

    const handleChatClick = (user) => {
        setActiveUser({
            name: user.heading,
            image: user.src,
            status: user.status,
        });
    };


    const chartWrapperRef = useRef(null); // Create a reference to the chart wrapper

    const toggleChat = () => {
        chartWrapperRef.current?.classList.add("responsive-chat-open");
    };

    const toggleChat1 = () => {
        chartWrapperRef.current?.classList.remove("responsive-chat-open");
    };

    const [showPicker, setShowPicker] = useState(false);
    const [inputValue, setInputValue] = useState(""); // state for input value
    const pickerRef = useRef(null);

    const handleEmojiClick = (emojiData) => {
        // Add the selected emoji to the input field value
        setInputValue((prevValue) => prevValue + emojiData.emoji);
    };

    useEffect(() => {
        const handleClickOutside = (eventData) => {
            if (pickerRef.current && !(pickerRef.current).contains(event.target)) {
                setShowPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (
        <Fragment>
            {/* <!-- Page Header --> */}
            <Seo title="Pages-Chat" />

            <Pageheader title="Pages" currentpage="Chat" activepage="Chat" />

            {/* <!-- Page Header Close --> */}
            <div ref={chartWrapperRef} className="main-chart-wrapper lg:gap-2 gap-0 mb-2 lg:flex" onClick={() => setShowPicker(false)}>
                <div className="chat-info border border-defaultborder dark:border-defaultborder/10">
                    <div className="chat-search p-4 border-b border-defaultborder dark:border-defaultborder/10">
                        <div className="input-group">
                            <input type="text" className="form-control !border-s border-defaultborder dark:border-defaultborder/10" placeholder="Search Chat" aria-describedby="button-addon01" />
                            <SpkButton Label="button" customClass="ti-btn ti-btn-soft-primary !m-0" buttontype="button" Id="button-addon01">
                                <i className="ri-search-line"></i>
                            </SpkButton>
                        </div>
                    </div>
                    <nav className="flex rtl:space-x-reverse p-4 border-b border-defaultborder dark:border-defaultborder/10 flex-wrap sm:flex-nowrap gap-2" aria-label="Tabs" role="tablist">
                        <SpkButton buttontype="button" customClass="hs-tab-active:bg-primary hs-tab-active:text-white flex-grow sm:flex-grow-0 bg-primary/10 py-2 px-[1.35rem] inline-flex items-center gap-2 text-sm font-medium text-center text-primary rounded-sm hover:text-primary  dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white active" Id="users-tab" Tab="#users-tab1" Controls="users-tab1">
                            Recent
                            <span className="!text-[0.63rem] py-[0.3rem] px-2 leading-none bg-primarytint1color !text-white rounded-full float-end shadow-sm">1</span>
                        </SpkButton>
                        <SpkButton buttontype="button" customClass="hs-tab-active:bg-primary hs-tab-active:text-white flex-grow sm:flex-grow-0 py-2 px-[1.35rem] inline-flex items-center gap-2 bg-primary/10 text-sm font-medium text-center text-primary rounded-sm hover:text-primary  dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white" Id="groups-tab" Tab="#groups-tab-pane" Controls="groups-tab-pane">
                            Groups
                            <span className="!text-[0.63rem] py-[0.3rem] px-2 leading-none bg-primarytint3color !text-white rounded-full float-end shadow-sm">2</span>
                        </SpkButton>
                        <SpkButton buttontype="button" customClass="hs-tab-active:bg-primary hs-tab-active:text-white flex-grow sm:flex-grow-0 py-2 px-[1.35rem] inline-flex items-center gap-2 bg-primary/10 text-sm font-medium text-center text-primary rounded-sm hover:text-primary  dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white" Id="contacts-tab" Tab="#contacts-tab-pane" Controls="contacts-tab-pane">
                            Contacts
                        </SpkButton>
                    </nav>

                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane show active border-0 chat-users-tab" id="users-tab1" role="tabpanel" aria-labelledby="users-tab">
                            <SimpleBar className="list-none mb-0 mt-2 chat-users-tab" id="chat-msg-scroll">
                                <li className="pb-0">
                                    <p className="text-textmuted dark:text-textmuted/50 text-[11px] font-medium mb-2 opacity-70">ACTIVE CHATS</p>
                                </li>
                                {Chat1.map((idx, index) => (
                                    <li className={`checkforactive ${activeUser.name === idx.heading ? 'active' : ''} ${idx.activeclass}`} key={index} onClick={() => handleChatClick(idx)}>
                                        <Link scroll={false} href="#!" >
                                            <div className="flex items-top">
                                                <div className="me-1 leading-none">
                                                    <span className={`avatar avatar-md ${idx.status} me-2`}>
                                                        <Image fill src={idx.src} alt="img" />
                                                    </span>
                                                </div>
                                                <div className="flex-auto" onClick={toggleChat}>
                                                    <p className="mb-0 font-medium">
                                                        {idx.heading}
                                                        <span className="float-end text-textmuted dark:text-textmuted/50 font-normal text-[11px]">{idx.time}</span>
                                                    </p>
                                                    <p className={`text-xs mb-0 ${idx.textclass}`}>
                                                        <span className="chat-msg truncate">{idx.description}</span>
                                                        {idx.badge}
                                                        {idx.Icon === true ? <span className="chat-read-icon float-end align-middle"><i className="ri-check-double-fill"></i></span>
                                                            : ""
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                                <li className="pb-0">
                                    <p className="text-textmuted dark:text-textmuted/50 text-[11px] font-medium mb-2 opacity-70">ALL CHATS</p>
                                </li>
                                {Chat2.map((idx) => (
                                    <li className={`chat-item ${activeUser?.name === idx.heading ? 'active' : 'chat-inactive'}`} key={idx.id}
                                        onClick={() => handleChatClick(idx)}>
                                        <Link scroll={false} href="#!" >
                                            <div className="flex items-top">
                                                <div className="me-1 leading-none">
                                                    <span className={`avatar avatar-md ${idx.status} me-2`} >
                                                        <Image fill src={idx.src} alt="img" />
                                                    </span>
                                                </div>
                                                <div className="flex-auto" onClick={toggleChat}>
                                                    <p className="mb-0 font-medium">
                                                        {idx.heading} <span
                                                            className="float-end text-textmuted dark:text-textmuted/50 font-normal text-[11px]">{idx.time}</span>
                                                    </p>
                                                    <p className="text-xs mb-0">
                                                        <span className="chat-msg truncate">{idx.description}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </SimpleBar>
                        </div>
                        <SimpleBar className="tab-pane border-0 chat-groups-tab hidden" id="groups-tab-pane" role="tabpanel" aria-labelledby="groups-tab">

                            <ul className="list-none mb-0 mt-2 ">
                                <li className="pb-0">
                                    <p className="text-textmuted dark:text-textmuted/50 text-[11px] font-medium mb-1 opacity-70">MY CHAT GROUPS</p>
                                </li>
                                <li>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="mb-0 font-medium"><i className="ri-checkbox-blank-circle-fill leading-none text-primary me-1 text-[8px] align-middle"></i>Huge Rocks </p>
                                            <p className="mb-0"><SpkBadge variant="primarytint3color/10" customClass="text-primarytint3color">4
                                                Online</SpkBadge></p>
                                        </div>
                                        <div className="avatar-list-stacked my-auto">
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/2.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/8.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/2.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/10.jpg" alt="img" />
                                            </span>
                                            <Link scroll={false} className="avatar avatar-sm bg-primary text-white avatar-rounded"
                                                href="#!">
                                                +19
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="mb-0 font-medium"><i className="ri-checkbox-blank-circle-fill leading-none text-primarytint2color me-1 text-[8px] align-middle"></i>Creative Group </p>
                                            <p className="mb-0"><SpkBadge variant="primarytint2color/10" customClass="text-primarytint2color">32
                                                Online</SpkBadge></p>
                                        </div>
                                        <div className="avatar-list-stacked my-auto">
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/1.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/7.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/3.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/9.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/12.jpg" alt="img" />
                                            </span>
                                            <Link scroll={false} className="avatar avatar-sm bg-primary text-white avatar-rounded"
                                                href="#!">
                                                +123
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="mb-0 font-medium"><i className="ri-checkbox-blank-circle-fill leading-none text-primary3 me-1 text-[8px] align-middle"></i>Anyside Spriritual</p>
                                            <p className="mb-0"><SpkBadge variant="primarytint1color/10" customClass="text-primarytint1color">3
                                                Online</SpkBadge></p>
                                        </div>
                                        <div className="avatar-list-stacked my-auto">
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/4.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/8.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/13.jpg" alt="img" />
                                            </span>
                                            <Link scroll={false} className="avatar avatar-sm bg-primary text-white avatar-rounded"
                                                href="#!">
                                                +15
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="mb-0 font-medium"><i className="ri-checkbox-blank-circle-fill leading-none text-secondary me-1 text-[8px] align-middle"></i>Fun Time</p>
                                            <p className="mb-0"><SpkBadge variant="secondary/10" customClass="text-secondary">5
                                                Online</SpkBadge></p>
                                        </div>
                                        <div className="avatar-list-stacked my-auto">
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/1.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/7.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/14.jpg" alt="img" />
                                            </span>
                                            <Link scroll={false} className="avatar avatar-sm bg-primary text-white avatar-rounded"
                                                href="#!">
                                                +28
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="mb-0 font-medium"><i className="ri-checkbox-blank-circle-fill leading-none text-warning me-1 text-[8px] align-middle"></i>Latest News</p>
                                            <p className="mb-0"><SpkBadge variant="warning/10" customClass="text-warning">2 Online</SpkBadge>
                                            </p>
                                        </div>
                                        <div className="avatar-list-stacked my-auto">
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/5.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/6.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/12.jpg" alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image fill src="../../assets/images/faces/3.jpg" alt="img" />
                                            </span>
                                            <Link scroll={false} className="avatar avatar-sm bg-primary text-white avatar-rounded"
                                                href="#!">
                                                +53
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <ul className="list-none mb-0 mt-2 ">

                                <li className="pb-0">
                                    <p className="text-textmuted dark:text-textmuted/50 text-[11px] font-medium mb-1 opacity-70">GROUP CHATS</p>
                                </li>
                                {Chat3.map((idx,index) => (
                                    <li key={index} className={`checkforactive ${activeUser.name === idx.heading ? 'active' : ''} ${idx.cardclass}`} onClick={() => handleChatClick(idx)}>
                                    <Link scroll={false} href="#!">
                                        <div className="flex items-top">
                                            <div className="me-1 leading-none">
                                                <span className={`avatar avatar-md ${idx.status} me-2 `} >
                                                    <Image fill src={idx.src} alt="img" />
                                                </span>
                                            </div>
                                            <div className="flex-grow" onClick={toggleChat}>
                                                <p className="mb-0 font-medium">
                                                    {idx.heading}
                                                    <span className="float-end text-textmuted dark:text-textmuted/50 font-normal text-[0.6875rem]">
                                                        {idx.time}
                                                    </span>
                                                </p>
                                                <p className={`text-[0.75rem] ${idx.color}`} >
                                                    <span className="chat-msg truncate">{idx.message}</span>


                                                    {idx.unreadCount > 0 ? (
                                                        <span className="badge bg-primarytint3color !rounded-full float-end">
                                                            {idx.unreadCount}
                                                        </span>
                                                    ) : (
                                                        ""
                                                    )}

                                                    {
                                                        idx.readicon === true ? (
                                                            <span className="chat-read-icon float-end align-middle"><i className="ri-check-double-fill"></i></span>
                                                        ) : null
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                ))}
                            </ul>
                        </SimpleBar>
                        <div className="tab-pane border-0 chat-contacts-tab hidden" id="contacts-tab-pane" role="tabpanel" aria-labelledby="contacts-tab">
                            <SimpleBar>
                                <ul className="list-none mb-0 chat-contacts-tab">
                                    <li>
                                        <span className="text-defaulttextcolor font-semibold">A</span>
                                    </li>
                                    <li>
                                        <div className="flex items-center gap-4">
                                            <div className="leading-none">
                                                <span className="avatar avatar-sm">
                                                    <Image fill src="../../assets/images/faces/5.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <span className="block font-semibold">
                                                    Ava Taylor
                                                </span>
                                            </div>
                                            <SpkDropdown Customclass="hs-dropdown [--placement:bottom-right] rtl:[--placement:bottom-left]" Linktag={true}
                                                Linkclass="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-light" Icon={true} IconClass="ri-more-2-fill"
                                                Menulabel="dropdownMenuButton1">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-message-2-line me-2"></i>Chat</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-phone-line me-2"></i>Audio Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-live-line me-2"></i>Video Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-edit-line me-2"></i>Edit</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-spam-2-line me-2"></i>Block</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-delete-bin-line me-2"></i>Delete</Link></li>
                                            </SpkDropdown>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex items-center gap-4">
                                            <div className="leading-none">
                                                <span className="avatar avatar-sm">
                                                    <Image fill src="../../assets/images/faces/12.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <span className="block font-semibold">
                                                    Alice Angel
                                                </span>
                                            </div>
                                            <SpkDropdown Customclass="hs-dropdown [--placement:bottom-right] rtl:[--placement:bottom-left]" Linktag={true}
                                                Linkclass="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-light" Icon={true} IconClass="ri-more-2-fill"
                                                Menulabel="dropdownMenuButton1">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-message-2-line me-2"></i>Chat</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-phone-line me-2"></i>Audio Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-live-line me-2"></i>Video Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-edit-line me-2"></i>Edit</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-spam-2-line me-2"></i>Block</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-delete-bin-line me-2"></i>Delete</Link></li>
                                            </SpkDropdown>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="text-defaulttextcolor font-semibold">B</span>
                                    </li>
                                    <li>
                                        <div className="flex items-center gap-4">
                                            <div className="leading-none">
                                                <span className="avatar avatar-sm">
                                                    <Image fill src="../../assets/images/faces/14.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <span className="block font-semibold">
                                                    Blessy diamond
                                                </span>
                                            </div>
                                            <SpkDropdown Customclass="hs-dropdown [--placement:bottom-right] rtl:[--placement:bottom-left]" Linktag={true}
                                                Linkclass="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-light" Icon={true} IconClass="ri-more-2-fill"
                                                Menulabel="dropdownMenuButton1">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-message-2-line me-2"></i>Chat</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-phone-line me-2"></i>Audio Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-live-line me-2"></i>Video Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-edit-line me-2"></i>Edit</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-spam-2-line me-2"></i>Block</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-delete-bin-line me-2"></i>Delete</Link></li>
                                            </SpkDropdown>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="text-defaulttextcolor font-semibold">D</span>
                                    </li>
                                    <li>
                                        <div className="flex items-center gap-4">
                                            <div className="leading-none">
                                                <span className="avatar avatar-sm bg-primary">
                                                    C
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <span className="block font-semibold">
                                                    Catalina Keira
                                                </span>
                                            </div>
                                            <SpkDropdown Customclass="hs-dropdown [--placement:bottom-right] rtl:[--placement:bottom-left]" Linktag={true}
                                                Linkclass="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-light" Icon={true} IconClass="ri-more-2-fill"
                                                Menulabel="dropdownMenuButton1">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-message-2-line me-2"></i>Chat</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-phone-line me-2"></i>Audio Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-live-line me-2"></i>Video Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-edit-line me-2"></i>Edit</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-spam-2-line me-2"></i>Block</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-delete-bin-line me-2"></i>Delete</Link></li>
                                            </SpkDropdown>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="text-defaulttextcolor font-semibold">D</span>
                                    </li>
                                    <li>
                                        <div className="flex items-center gap-4">
                                            <div className="leading-none">
                                                <span className="avatar avatar-sm">
                                                    <Image fill src="../../assets/images/faces/7.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <span className="block font-semibold">
                                                    Danny Raj
                                                </span>
                                            </div>
                                            <SpkDropdown Customclass="hs-dropdown [--placement:bottom-right] rtl:[--placement:bottom-left]" Linktag={true}
                                                Linkclass="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-light" Icon={true} IconClass="ri-more-2-fill"
                                                Menulabel="dropdownMenuButton1">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-message-2-line me-2"></i>Chat</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-phone-line me-2"></i>Audio Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-live-line me-2"></i>Video Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-edit-line me-2"></i>Edit</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-spam-2-line me-2"></i>Block</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-delete-bin-line me-2"></i>Delete</Link></li>
                                            </SpkDropdown>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="text-defaulttextcolor font-semibold">G</span>
                                    </li>
                                    <li>
                                        <div className="flex items-center gap-4">
                                            <div className="leading-none">
                                                <span className="avatar avatar-sm">
                                                    <Image fill src="../../assets/images/faces/15.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <span className="block font-semibold">
                                                    Gatin Leo
                                                </span>
                                            </div>
                                            <SpkDropdown Customclass="hs-dropdown [--placement:bottom-right] rtl:[--placement:bottom-left]" Linktag={true}
                                                Linkclass="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-light" Icon={true} IconClass="ri-more-2-fill"
                                                Menulabel="dropdownMenuButton1">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-message-2-line me-2"></i>Chat</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-phone-line me-2"></i>Audio Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-live-line me-2"></i>Video Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-edit-line me-2"></i>Edit</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-spam-2-line me-2"></i>Block</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-delete-bin-line me-2"></i>Delete</Link></li>
                                            </SpkDropdown>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="text-defaulttextcolor font-semibold">L</span>
                                    </li>
                                    <li>
                                        <div className="flex items-center gap-4">
                                            <div className="leading-none">
                                                <span className="avatar avatar-sm bg-primary">
                                                    M
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <span className="block font-semibold">
                                                    Monte Christ
                                                </span>
                                            </div>
                                            <SpkDropdown Customclass="hs-dropdown [--placement:bottom-right] rtl:[--placement:bottom-left]" Linktag={true}
                                                Linkclass="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-light" Icon={true} IconClass="ri-more-2-fill"
                                                Menulabel="dropdownMenuButton1">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-message-2-line me-2"></i>Chat</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-phone-line me-2"></i>Audio Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-live-line me-2"></i>Video Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-edit-line me-2"></i>Edit</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-spam-2-line me-2"></i>Block</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-delete-bin-line me-2"></i>Delete</Link></li>
                                            </SpkDropdown>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex items-center gap-4">
                                            <div className="leading-none">
                                                <span className="avatar avatar-sm">
                                                    <Image fill src="../../assets/images/faces/2.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <span className="block font-semibold">
                                                    Thomas Lie
                                                </span>
                                            </div>
                                            <SpkDropdown Customclass="hs-dropdown [--placement:bottom-right] rtl:[--placement:bottom-left]" Linktag={true}
                                                Linkclass="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-light" Icon={true} IconClass="ri-more-2-fill"
                                                Menulabel="dropdownMenuButton1">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-message-2-line me-2"></i>Chat</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-phone-line me-2"></i>Audio Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-live-line me-2"></i>Video Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-edit-line me-2"></i>Edit</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-spam-2-line me-2"></i>Block</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-delete-bin-line me-2"></i>Delete</Link></li>
                                            </SpkDropdown>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="text-defaulttextcolor font-semibold">N</span>
                                    </li>
                                    <li>
                                        <div className="flex items-center gap-4">
                                            <div className="leading-none">
                                                <span className="avatar avatar-sm">
                                                    <Image fill src="../../assets/images/faces/10.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <span className="block font-semibold">
                                                    Nelson Gold
                                                </span>
                                            </div>
                                            <SpkDropdown Customclass="hs-dropdown [--placement:bottom-right] rtl:[--placement:bottom-left]" Linktag={true}
                                                Linkclass="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-light" Icon={true} IconClass="ri-more-2-fill"
                                                Menulabel="dropdownMenuButton1">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-message-2-line me-2"></i>Chat</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-phone-line me-2"></i>Audio Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-live-line me-2"></i>Video Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-edit-line me-2"></i>Edit</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-spam-2-line me-2"></i>Block</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-delete-bin-line me-2"></i>Delete</Link></li>
                                            </SpkDropdown>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="text-defaulttextcolor font-semibold">V</span>
                                    </li>
                                    <li>
                                        <div className="flex items-center gap-4">
                                            <div className="leading-none">
                                                <span className="avatar avatar-sm">
                                                    <Image fill src="../../assets/images/faces/16.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-auto">
                                                <span className="block font-semibold">
                                                    Victoria Gracie
                                                </span>
                                            </div>
                                            <SpkDropdown Customclass="hs-dropdown [--placement:bottom-right] rtl:[--placement:bottom-left]" Linktag={true}
                                                Linkclass="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-light" Icon={true} IconClass="ri-more-2-fill"
                                                Menulabel="dropdownMenuButton1">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-message-2-line me-2"></i>Chat</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-phone-line me-2"></i>Audio Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-live-line me-2"></i>Video Call</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-edit-line me-2"></i>Edit</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-spam-2-line me-2"></i>Block</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-delete-bin-line me-2"></i>Delete</Link></li>
                                            </SpkDropdown>
                                        </div>
                                    </li>
                                </ul>
                            </SimpleBar>
                        </div>
                    </div>
                </div>
                <div className="main-chat-area border border-defaultborder dark:border-defaultborder/10">
                    <div className="flex items-center border-b border-defaultborder dark:border-defaultborder/10 main-chat-head flex-wrap">
                        <span className="avatar avatar-md online chatstatusperson me-2 leading-none">
                            <Image fill className="chatimageperson" src={activeUser.image} alt="img" />
                        </span>
                        <div className="flex-auto">
                            <p className="mb-0 font-medium text-[14px] leading-none">
                                <Link scroll={false} href="#!" data-hs-overlay="#offcanvasRight" className="chatnameperson responsive-userinfo-open">{activeUser.name}</Link>
                            </p>
                            <p className="text-textmuted dark:text-textmuted/50 mb-0 chatpersonstatus">online</p>
                        </div>
                        <div className="flex flex-wrap rightIcons items-center gap-2">
                            <SpkButton Label="button" buttontype="button" variant="soft-primary1" customClass="ti-btn ti-btn-icon  my-0  ti-btn-sm">
                                <i className="ti ti-phone"></i>
                            </SpkButton>
                            <SpkButton Label="button" buttontype="button" variant="soft-primary2" customClass="ti-btn ti-btn-icon my-0 ti-btn-sm hidden sm:block">
                                <i className="ti ti-video"></i>
                            </SpkButton>
                            <SpkButton Label="button" buttontype="button" variant="outline-light" customClass="ti-btn ti-btn-icon responsive-userinfo-open ti-btn-sm">
                                <i className="ti ti-user-circle" id="responsive-chat-close"></i>
                            </SpkButton>
                            <SpkDropdown CustomToggleclass="ti-btn-icon ti-dropdown-toggle ti-btn-soft-primary2 btn-wave waves-light ti-btn-sm waves-effect waves-light" Icon={true} IconClass="ti ti-dots-vertical"
                                Menulabel="dropdownMenuButton1">
                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-user-3-line me-1"></i>Profile</Link></li>
                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-format-clear me-1"></i>Clear Chat</Link></li>
                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-user-unfollow-line me-1"></i>Delete User</Link></li>
                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-user-forbid-line me-1"></i>Block User</Link></li>
                                <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-error-warning-line me-1"></i>Report</Link></li>
                            </SpkDropdown>
                            <SpkButton Label="button" buttontype="button" customClass="ti-btn ti-btn-icon ti-btn-soft-danger my-0 responsive-chat-close ti-btn-sm" onclickfunc={toggleChat1}>
                                <i className="ri-close-line"></i>
                            </SpkButton>
                        </div>
                    </div>
                    <SimpleBar className="chat-content" id="main-chat-content">
                        <ul className="list-none">
                            <li className="chat-day-label">
                                <span>Today</span>
                            </li>
                            <li className="chat-item-start">
                                <div className="chat-list-inner">
                                    <div className="chat-user-profile">
                                        <span className="avatar avatar-md online chatstatusperson">
                                            <Image fill className="chatimageperson" src={activeUser.image} alt="img" />
                                        </span>
                                    </div>
                                    <div className="ms-3">
                                        <div className="main-chat-msg">
                                            <div>
                                                <p className="mb-0">Hey!&#128522; How are you? What have you been up to lately?</p>
                                            </div>
                                        </div>
                                        <span className="chatting-user-info">
                                            <span className="chatnameperson">{activeUser.name}</span> <span className="msg-sent-time">10:20PM</span>
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li className="chat-item-end">
                                <div className="chat-list-inner">
                                    <div className="me-3">
                                        <div className="main-chat-msg">
                                            <div>
                                                <p className="mb-0">Oh, hey! &#128516; I'm doing pretty well, thanks! Just been catching up on some reading and enjoying the nice weather. How about you?</p>
                                            </div>
                                        </div>
                                        <span className="chatting-user-info">
                                            <span className="msg-sent-time"><span className="chat-read-mark align-middle d-inline-flex"><i
                                                className="ri-check-double-line"></i></span>11:50PM</span> You
                                        </span>
                                    </div>
                                    <div className="chat-user-profile">
                                        <span className="avatar avatar-md online">
                                            <Image fill src="../../assets/images/faces/15.jpg" alt="img" />
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li className="chat-item-start">
                                <div className="chat-list-inner">
                                    <div className="chat-user-profile">
                                        <span className="avatar avatar-md online chatstatusperson">
                                            <Image fill className="chatimageperson" src={activeUser.image} alt="img" />
                                        </span>
                                    </div>
                                    <div className="ms-3">
                                        <div className="main-chat-msg">
                                            <div>
                                                <p className="mb-0">That sounds lovely! I've been keeping busy with work, but I'm looking forward to the weekend. Thinking of heading out for a hike if the weather holds up.</p>
                                            </div>
                                        </div>
                                        <span className="chatting-user-info">
                                            <span className="chatnameperson">{activeUser.name}</span> <span className="msg-sent-time">11:51PM</span>
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li className="chat-item-end">
                                <div className="chat-list-inner">
                                    <div className="me-3">
                                        <div className="main-chat-msg">
                                            <div>
                                                <p className="mb-0">Nice! Hiking sounds like a great way to unwind. Which trail are you thinking of exploring?</p>
                                            </div>
                                        </div>
                                        <span className="chatting-user-info">
                                            <span className="msg-sent-time"><span className="chat-read-mark align-middle d-inline-flex"><i
                                                className="ri-check-double-line"></i></span>11:52PM</span> You
                                        </span>
                                    </div>
                                    <div className="chat-user-profile">
                                        <span className="avatar avatar-md online">
                                            <Image fill src="../../assets/images/faces/15.jpg" alt="img" />
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li className="chat-item-start">
                                <div className="chat-list-inner">
                                    <div className="chat-user-profile">
                                        <span className="avatar avatar-md online chatstatusperson">
                                            <Image fill className="chatimageperson" src={activeUser.image} alt="img" />
                                        </span>
                                    </div>
                                    <div className="ms-3">
                                        <div className="main-chat-msg">
                                            <div>
                                                <p className="mb-0">I'm thinking of checking out the one up at Pine Ridge. It's got some amazing views of the valley. Would you be interested in joining?</p>
                                            </div>
                                        </div>
                                        <span className="chatting-user-info">
                                            <span className="chatnameperson">{activeUser.name}</span> <span className="msg-sent-time">11:55PM</span>
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li className="chat-item-end">
                                <div className="chat-list-inner">
                                    <div className="me-3">
                                        <div className="main-chat-msg">
                                            <div className="">
                                                <p className="mb-0">That sounds fantastic! I'd like to come along. Let me know what time you're planning to head out, and I'll make sure to pack some snacks for the trail.</p>
                                            </div>
                                        </div>
                                        <span className="chatting-user-info">
                                            <span className="msg-sent-time"><span className="chat-read-mark align-middle d-inline-flex"><i
                                                className="ri-check-double-line"></i></span>11:52PM</span> You
                                        </span>
                                    </div>
                                    <div className="chat-user-profile">
                                        <span className="avatar avatar-md online">
                                            <Image fill src="../../assets/images/faces/15.jpg" alt="img" />
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li className="chat-item-start">
                                <div className="chat-list-inner">
                                    <div className="chat-user-profile">
                                        <span className="avatar avatar-md online">
                                            <Image fill className="chatimageperson" src={activeUser.image} alt="img" />
                                        </span>
                                    </div>
                                    <div className="ms-3">
                                        <div className="main-chat-msg">
                                            <div>
                                                <p className="mb-0">okay. &#128516;</p>
                                            </div>
                                        </div>
                                        <span className="chatting-user-info chatnameperson">
                                            {activeUser.name} <span className="msg-sent-time">11:45PM</span>
                                        </span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </SimpleBar>
                    <div className="chat-footer !border-defaultborder dark:!border-defaultborder/10">
                        <Link scroll={false} aria-label="anchor" className="ti-btn bg-primarytint1color/10 text-primarytint1color me-2 ti-btn-icon btn-send" href="#!">
                            <i className="ri-attachment-2"></i>
                        </Link>
                        <Link
                            scroll={false}
                            aria-label="anchor"
                            className="ti-btn ti-btn-icon me-2 bg-primarytint2color text-white emoji-picker"
                            href="#!"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation(); // Prevent the click from bubbling to parent
                                setShowPicker((prev) => !prev);
                            }}
                        >
                            <i className="ri-emotion-line"></i>
                        </Link>

                        {showPicker && (
                            <div
                                ref={pickerRef}
                                style={{
                                    position: "absolute",
                                    zIndex: 1000,
                                    bottom: "3.5rem",
                                }}
                                onClick={(e) => e.stopPropagation()} // Prevent the picker itself from closing when clicked
                            >
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}

                        <input
                            className="form-control chat-message-space"
                            placeholder="Type your message here..."
                            type="text"
                            value={inputValue} // Set input value to the state
                            onChange={(e) => setInputValue(e.target.value)} // Update state as user types
                        />
                        <Link scroll={false} aria-label="anchor" className="ti-btn ti-btn-primary ms-2 ti-btn-icon btn-send" href="#!">
                            <i className="ri-send-plane-2-line"></i>
                        </Link>
                    </div>
                </div>
            </div>
            {/* <!-- Start::chat user details offcanvas --> */}
            <div className="hs-overlay hidden ti-offcanvas ti-offcanvas-right" id="offcanvasRight">
                <div className="ti-offcanvas-body">
                    <button type="button"
                        className="ti-btn  btn-wave flex-shrink-0 p-0 transition-none text-gray-500 hover:text-gray-700 focus:ring-gray-400 focus:ring-offset-white text-textmuted dark:text-textmuted/50 dark:hover:text-white/80 dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                        data-hs-overlay="#offcanvasRight">
                        <span className="sr-only">Close modal</span>
                        <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                                fill="currentColor"></path>
                        </svg>
                    </button>
                    <div className="chat-user-details" id="chat-user-details">
                        <div className="text-center mb-4">
                            <span className="avatar avatar-rounded online avatar-xxl me-2 mb-3 chatstatusperson">
                                <Image fill className="chatimageperson" src="../../assets/images/faces/2.jpg" alt="img" />
                            </span>
                            <p className="mb-1 text-[15px] font-medium text-dark leading-none chatnameperson">Jamison Jen</p>
                            <p className="text-xs text-textmuted dark:text-textmuted/50 mb-4"><span className="chatnameperson">jamisonjen0114</span>@gmail.com</p>
                            <p className="text-center mb-0 flex gap-2 flex-wrap">
                                <SpkButton Buttontype="button" aria-label="button" customClass="ti-btn ti-btn-soft-primary btn-wave flex-auto"><i
                                    className="ri-phone-line me-2 align-middle"></i>Call</SpkButton>
                                <SpkButton Buttontype="button" aria-label="button" customClass="ti-btn bg-primarytint1color/10 text-primarytint1color btn-wave flex-auto"><i
                                    className="ri-video-add-line me-2 align-middle"></i>Video Call</SpkButton>
                                <SpkButton Buttontype="button" aria-label="button" customClass="ti-btn bg-info/10 text-info btn-wave flex-auto"><i
                                    className="ri-chat-1-line me-2 align-middle"></i>Message</SpkButton>
                            </p>
                        </div>
                        <div className="mb-4 pt-2">
                            <div className="font-medium mb-4">Shared Files
                                <span className="badge bg-primarytint2color ms-1 rounded-full">17</span>
                                <span className="float-end text-[11px]"><Link scroll={false} href="#!" className="text-xs text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link></span>
                            </div>
                            <ul className="shared-files list-none">
                                <li>
                                    <div className="flex items-center">
                                        <div className="me-2 bg-primary/10 !rounded-full">
                                            <span className="shared-file-icon">
                                                <i className="ti ti-file-text text-primary"></i>
                                            </span>
                                        </div>
                                        <div className="flex-auto">
                                            <p className="text-xs font-medium mb-0">notification.pdf</p>
                                            <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[11px]">15,Dec 2024 - 12:45PM</p>
                                        </div>
                                        <div className="text-lg">
                                            <Link scroll={false} aria-label="anchor" href="#!"><i className="ri-download-2-line text-textmuted dark:text-textmuted/50"></i></Link>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <div className="me-2 bg-secondary/10 !rounded-full">
                                            <span className="shared-file-icon">
                                                <i className="ri-image-line text-secondary"></i>
                                            </span>
                                        </div>
                                        <div className="flex-auto">
                                            <p className="text-xs font-medium mb-0">Image_file1.Jpg</p>
                                            <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[11px]">03,Oct 2024 - 03:20AM</p>
                                        </div>
                                        <div className="text-lg">
                                            <Link scroll={false} aria-label="anchor" href="#!"><i className="ri-download-2-line text-textmuted dark:text-textmuted/50"></i></Link>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <div className="me-2 bg-success/10 !rounded-full">
                                            <span className="shared-file-icon">
                                                <i className="ri-image-line text-success"></i>
                                            </span>
                                        </div>
                                        <div className="flex-auto">
                                            <p className="text-xs font-medium mb-0">Imagefile_12.Jpg</p>
                                            <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[11px]">19,Oct 2024 - 01:23PM</p>
                                        </div>
                                        <div className="text-lg">
                                            <Link scroll={false} aria-label="anchor" href="#!"><i className="ri-download-2-line text-textmuted dark:text-textmuted/50"></i></Link>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <div className="me-2 bg-orangemain/10 !rounded-full">
                                            <span className="shared-file-icon">
                                                <i className="ri-video-line text-orangemain"></i>
                                            </span>
                                        </div>
                                        <div className="flex-auto">
                                            <p className="text-xs font-medium mb-0">Video-rec-20-10-2021.MP4</p>
                                            <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[11px]">13,May 2024 - 16:25AM</p>
                                        </div>
                                        <div className="text-lg">
                                            <Link scroll={false} href="#!"><i className="ri-download-2-line text-textmuted dark:text-textmuted/50"></i></Link>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="mb-0 pt-2">
                            <div className="font-medium mb-4">Photos & Media
                                <span className="badge bg-primarytint3color ms-1 rounded-full">15</span>
                                <span className="float-end text-[11px]"><Link scroll={false} href="#!" className="text-xs text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link></span>
                            </div>
                            <div className="grid grid-cols-12 gap-x-6 gap-y-3">
                                <LightboxGallery />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End::chat user details offcanvas --> */}
        </Fragment>
    );
};

export default Chat;