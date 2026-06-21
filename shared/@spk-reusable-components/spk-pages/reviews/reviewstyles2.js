

import Image from 'next/image';
import React, { Fragment } from 'react';



const getBadgeClass = (() => {
    const count = {};

    return (rating) => {
        if (!count[rating]) count[rating] = 0;
        const classes = {
            4.5: ["bg-primarytint2color", "bg-primarytint3color"],
            4.3: ["bg-primary", "bg-danger"],
            4.1: ["bg-primary", "bg-info"],
            3.8: ["bg-primarytint1color", "bg-light"],
        };

        const classArray = classes[rating] || ["bg-default"];

        const classToReturn = classArray[count[rating] % classArray.length];

        count[rating]++;

        return classToReturn;
    };
})();

const ReviewCard = ({ testimonial }) => (
    <Fragment>
        <div className="box overflow-hidden">
            <div
                className={`p-4 text-center items-center justify-content-start gap-2 border-b border-dashed border-defaultborder dark:border-defaultborder/10 ${testimonial.bgClass}`}>
                <Image width={64} height={64} src={testimonial.image} alt="img"
                    className="mb-2 mx-auto text-center avatar avatar-xl !rounded-full shadow-sm" />
                <div className="grow">
                    <p className="mb-0 font-semibold h6">{testimonial.name}</p>
                    <span
                        className="font-normal text-textmuted dark:text-textmuted/50 text-xs">{testimonial.role}</span>
                </div>
            </div>
            <div className="box-body">
                <div className="mb-0">
                    "{testimonial.content}".<i
                        className="op-4 text-[11px] font-medium">--- {testimonial.name}</i>
                </div>
                <div className={`badge !rounded-full float-end ${getBadgeClass(testimonial.rating)}  `}> {testimonial.rating}
                    <i className="ri-star-fill text-warning"></i>
                </div>
                <i
                    className={`bx bxs-quote-alt-right review-quote !text-${testimonial.quotecolor}/50`}></i>
            </div>
        </div>

    </Fragment>
);

export default ReviewCard;
