import { Grid } from "gridjs-react";
import React, { Fragment } from 'react';


const SpkGridjstables = ({ Data, Columns, Search, Pagination, Sort, reSizable, Height, width, fixedHeader}) => {

    return (
        <Fragment>
            <Grid data={Data} columns={Columns} search={Search} pagination={Pagination} sort={Sort} resizable={reSizable} fixedHeader={fixedHeader} height={Height} width={width} />
        </Fragment>
    );
}

export default SpkGridjstables;
