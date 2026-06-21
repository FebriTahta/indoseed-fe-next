"use client";
import React, {  Fragment,} from "react";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import dynamic from "next/dynamic";
const Draggabledata = dynamic(() => import("@/shared/data/adavanec-ui/draggabledata"), { ssr: false });


const DraggableCards   = () => {
return (
<Fragment>
        <Seo title={"Draggable Cards"} />
        <Pageheader title="Advanced Ui" currentpage="Draggable Cards" activepage="Draggable Cards" />
            <Draggabledata/>
        {/* <!--End::row-1 --> */}
</Fragment>
);
};

export default DraggableCards;