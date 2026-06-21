"use client"

import React from 'react';
import { basePath } from '@/next.config'


const BaseImage = ({ src, alt, className, height, width, ...props }) => {
    // Check if the src is an absolute URL (starts with 'http' or 'https')
    const isExternalUrl = /^https?:\/\//.test(src);

    // Only prepend basePath if it's not an external URL
    const basePathValue = !isExternalUrl && process.env.NODE_ENV === 'production' ? basePath : '';
    const imageUrl = `${basePathValue}${src}`;

    return <img src={imageUrl} alt={alt} className={className} height={height} width={width} {...props} />;
};

export default BaseImage;
