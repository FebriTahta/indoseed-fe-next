"use client";
import { Fragment, useState } from 'react';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Link from 'next/link';
import SpkBadge from '@/shared/@spk-reusable-components/uielements/spk-badge';
import { Lightboxcomponent } from '@/shared/@spk-reusable-components/spk-packages/spk-lightbox-component';

import Image from 'next/image';



const data = <SpkBadge variant="primarytint2color" customClass="!rounded-full float-end">3</SpkBadge>

export const Chat1 = [
    { id: 1, src: "../../assets/images/faces/5.jpg", heading: "Rashid Khan", description: "Hey!! you are there? 😊", time: "11:12PM", badge: data, status: "online", Icon: false, activeclass: "" },
    { id: 2, src: "../../assets/images/faces/2.jpg", heading: "Jamison Jen", description: "Typing...", time: "06:52AM", badge: "", status: "online", Icon: false, activeclass: "" },
    { id: 3, src: "../../assets/images/faces/10.jpg", heading: "Andy Max", description: "Great! I am happy to here this from you. ☕", time: "10:15AM", badge: "", status: "online", Icon: true, activeclass: "" },
    { id: 4, src: "../../assets/images/faces/6.jpg", heading: "Kerina Cherish", description: "Looking forward about the matter", time: "03:15PM", badge: "", status: "online", Icon: true, activeclass: "" },

]

export const Chat2 = [
    { id: 1, src: "../../assets/images/faces/11.jpg", heading: "Rony Erick", description: "You should come definately🎬", time: "04:13PM", badge: "", status: "offline" },
    { id: 2, src: "../../assets/images/faces/3.jpg", heading: "Kenath kin", description: "Did you remember the date", time: "12:46AM", badge: "", status: "offline" },
    { id: 3, src: "../../assets/images/faces/13.jpg", heading: "Thomas Lie", description: "Hi, Thank you for everything", time: "07:30PM", badge: "", status: "offline" },
    { id: 4, src: "../../assets/images/faces/4.jpg", heading: "Peter Stark", description: "Going to Australia!", time: "01:18PM", badge: "", status: "offline" },
    { id: 5, src: "../../assets/images/faces/13.jpg", heading: "Monte Christ", description: "Little Busy 🍕", time: "08:07PM", badge: "", status: "offline" },
    { id: 6, src: "../../assets/images/faces/15.jpg", heading: "Regina Mos", description: "Have a Question?", time: "09:19PM", badge: "", status: "offline" },
]

export const Chat3 = [
    {
        heading: "Huge Rocks 😍",
        time: "12:24PM",
        message: "Mony Typing...",
        src: "../../assets/images/faces/17.jpg",
        status: "online",
        unreadCount: 2,
        color: "chat-msg-typing",
        cardclass:"",
    },
    {
        heading: "Creative Group",
        time: "1:16PM",
        message: (
            <>
            <span className="group-indivudial">Kin :</span> Have any updates today?
            </>
        ),
        src: "../../assets/images/faces/18.jpg",
        status: "online",
        unreadCount: 0,
        readicon:true,
        badge: "chat",
        cardclass:"chat-msg-unread",
    },
    {
        heading: " Anyside Spriritual 😎 ",
        time: "2 days ago",
        message: "Samantha, Adam, Jessica, Emily, Alex ",
        src: "../../assets/images/faces/19.jpg",
        status: "offline",
        unreadCount: 0,
        cardclass:"chat-inactive",
    },
    {
        heading: "Fun Time",
        time: "3 days ago",
        message: "Elsa,Henry,Susan, Emily, Ashlin",
        src: "../../assets/images/faces/20.jpg",
        status: "offline",
        unreadCount: 0,
        cardclass:"chat-inactive",
    },
    {
        heading: "Latest News",
        time: "10 days ago",
        message: "Emanuel, Rony, Alina, Lilly, Rush",
        src: "../../assets/images/faces/21.jpg",
        status: "offline",
        unreadCount: 0,
        cardclass:"chat-inactive",
    },
];
export const LightboxGallery = () => {

    const [open, setOpen] = useState(false);
    const value = true;
    const div = value.toString();
    const slidedata = [
        { src: "../../assets/images/media/media-40.jpg" },
        { src: "../../assets/images/media/media-41.jpg" },
        { src: "../../assets/images/media/media-43.jpg" },
        { src: "../../assets/images/media/media-44.jpg" },
        { src: "../../assets/images/media/media-45.jpg" },
        { src: "../../assets/images/media/media-46.jpg" },
        { src: "../../assets/images/media/media-60.jpg" },
        { src: "../../assets/images/media/media-61.jpg" }
    ]
    return (
        <Fragment>
            <div className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-12">
                <Link scroll={false} href="#!" className="glightbox box mb-0" data-gallery="gallery1" onClick={() => setOpen(true)}>
                    <Image fill src="../../assets/images/media/media-40.jpg" alt="image" />
                </Link>
            </div>
            <div className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-12">
                <Link scroll={false} href="#!" className="glightbox box mb-0" data-gallery="gallery1" onClick={() => setOpen(true)}>
                    <Image fill src="../../assets/images/media/media-41.jpg" alt="image" />
                </Link>
            </div>
            <div className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12">
                <Link scroll={false} href="#!" className="glightbox box mb-0" data-gallery="gallery1" onClick={() => setOpen(true)}>
                    <Image fill src="../../assets/images/media/media-42.jpg" alt="image" />
                </Link>
            </div>
            <div className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12">
                <Link scroll={false} href="#!" className="glightbox box mb-0" data-gallery="gallery1" onClick={() => setOpen(true)}>
                    <Image fill src="../../assets/images/media/media-43.jpg" alt="image" />
                </Link>
            </div>
            <div className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12">
                <Link scroll={false} href="#!" className="glightbox box mb-0" data-gallery="gallery1" onClick={() => setOpen(true)}>
                    <Image fill src="../../assets/images/media/media-44.jpg" alt="image" />
                </Link>
            </div>
            <div className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12">
                <Link scroll={false} href="#!" className="glightbox box mb-0" data-gallery="gallery1" onClick={() => setOpen(true)}>
                    <Image fill src="../../assets/images/media/media-45.jpg" alt="image" />
                </Link>
            </div>
            <div className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12">
                <Link scroll={false} href="#!" className="glightbox box mb-0" data-gallery="gallery1" onClick={() => setOpen(true)}>
                    <Image fill src="../../assets/images/media/media-46.jpg" alt="image" />
                </Link>
            </div>
            <div className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12">
                <Link scroll={false} href="#!" className="glightbox box mb-0" data-gallery="gallery1" onClick={() => setOpen(true)}>
                    <Image fill src="../../assets/images/media/media-60.jpg" alt="image" />
                </Link>
            </div>
            <div className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12">
                <Link scroll={false} href="#!" className="glightbox box mb-0" data-gallery="gallery1" onClick={() => setOpen(true)}>
                    <Image fill src="../../assets/images/media/media-61.jpg" alt="image" />
                </Link>
            </div>
            <Lightboxcomponent
                close={() => setOpen(false)}
                zoom={{ maxZoomPixelRatio: 10, scrollToZoom: true }}
                open={open}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                slides={slidedata}
            />

        </Fragment>
    );
};
