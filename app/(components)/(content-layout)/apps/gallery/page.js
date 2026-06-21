"use client"
import { Gallerylist } from "@/shared/data/apps/gallerydata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import React, { Fragment } from "react";



const Gallery   = () => {
return (
<Fragment>
    {/* <!-- Page Header --> */}
    <Seo title="Gallery" />

    <Pageheader title="Apps" currentpage="Gallery" activepage="Gallery" />

    {/* <!-- Page Header Close --> */}
    {/* <!-- Start::row-1 --> */}
    <Gallerylist/>
    {/* <!--End::row-1 --> */}
</Fragment>
);
};

export default Gallery;