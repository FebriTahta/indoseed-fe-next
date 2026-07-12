import React from 'react';

const EditBtn = ({ onClick, id }: { onClick?: (id: string) => void; id: string }) => {
    return (
        <button
            onClick={() => onClick && onClick(id)}
            className="ti-btn ti-btn-sm ti-btn-info me-2"
        >
            <i className="ri-edit-line"></i>
        </button>
    );
};

export default EditBtn;
