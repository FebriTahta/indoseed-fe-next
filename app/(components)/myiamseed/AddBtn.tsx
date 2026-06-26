import React from 'react';

const AddBtn = ({ onClick }: { onClick?: () => void }) => {
    return (
        <button
            onClick={onClick}
            className="ti-btn ti-btn-primary"
        >
            <i className="ri-add-line align-middle me-1"></i> Add User
        </button>
    );
};

export default AddBtn;
