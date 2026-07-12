import React from 'react';

const RemoveBtn = ({ onClick, id }: { onClick?: (id: string) => void; id: string }) => {
    return (
        <button
            onClick={() => onClick && onClick(id)}
            className="ti-btn ti-btn-sm ti-btn-danger"
        >
            <i className="ri-delete-bin-line"></i>
        </button>
    );
};

export default RemoveBtn;
