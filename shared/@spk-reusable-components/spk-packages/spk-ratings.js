import React, { Fragment } from 'react';
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";


const SpkRatings = ({
    name,
    value,
    size = 'medium',
    defaultValue = null,
    max = 5,
    icon,
    sx = {},
    precision = 1,
    readOnly = false,
    onChange,
    getLabelText = (value) => `${value} Star`, // Default label text function
    onChangeActive,
    emptyIcon,
}) => {
    return (
        <Fragment>
            <Box sx={sx}>
                <Rating
                    name={name}
                    icon={icon}
                    value={value ?? undefined} // Convert null to undefined for value
                    onChange={onChange}
                    onChangeActive={onChangeActive} // Active change handler
                    getLabelText={getLabelText} // Label text function
                    emptyIcon={emptyIcon} // Custom empty icon
                    size={size}
                    defaultValue={defaultValue ?? undefined} // Convert null to undefined for defaultValue
                    precision={precision}
                    max={max}
                    readOnly={readOnly}
                />
            </Box>
        </Fragment>
    );
};

export default SpkRatings;
