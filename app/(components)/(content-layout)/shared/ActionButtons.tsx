import React from 'react';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';

interface BaseButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

interface ActionButtonProps extends BaseButtonProps {
  label: string;
}

export const HistoryButton: React.FC<BaseButtonProps> = ({ onClick, className = '' }) => {
  return (
    <SpkButton
      onclickfunc={onClick}
      variant="outline-success"
      customClass={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:bg-success hover:text-white transition-all ${className}`}
    >
      <i className="ri-history-line text-lg"></i> <span className="font-medium">Riwayat Perubahan</span>
    </SpkButton>
  );
};

export const AddButton: React.FC<ActionButtonProps> = ({ onClick, label, className = '' }) => {
  return (
    <SpkButton
      onclickfunc={onClick}
      variant="primary"
      customClass={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all font-semibold bg-[#1B4E3B] ${className}`}
    >
      <i className="ri-add-circle-line text-lg"></i> <span className="font-medium">{label}</span>
    </SpkButton>
  );
};

export const EditButton: React.FC<ActionButtonProps> = ({ onClick, label, className = '' }) => {
  return (
    <SpkButton
      onclickfunc={onClick}
      variant="success"
      customClass={`flex items-center justify-center gap-2 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all font-semibold ${className}`}
    >
      <i className="ri-edit-box-line text-lg"></i> {label}
    </SpkButton>
  );
};

export const ManageButton: React.FC<ActionButtonProps> = ({ onClick, label, className = '' }) => {
  return (
    <SpkButton
      onclickfunc={onClick}
      variant="outline-success"
      customClass={`flex items-center justify-center gap-2 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:bg-success hover:text-white transition-all font-semibold ${className}`}
    >
      <i className="ri-settings-4-line text-lg"></i> {label}
    </SpkButton>
  );
};

interface IconButtonProps extends BaseButtonProps {
  title?: string;
}

export const ViewIconButton: React.FC<IconButtonProps> = ({ onClick, title = "Lihat Detail", className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-sm btn-icon btn-primary-light rounded-full hover:scale-110 transition-transform shadow-sm ${className}`}
      title={title}
    >
      <i className="ri-eye-line"></i>
    </button>
  );
};

export const EditIconButton: React.FC<IconButtonProps> = ({ onClick, title = "Edit", className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-sm btn-icon btn-info-light rounded-full hover:scale-110 transition-transform shadow-sm ${className}`}
      title={title}
    >
      <i className="ri-edit-line"></i>
    </button>
  );
};

export const ExportButton: React.FC<BaseButtonProps> = ({ onClick, className = '' }) => {
  return (
    <SpkButton
      onclickfunc={onClick}
      variant="light"
      customClass={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all bg-white border border-gray-200 text-gray-700 ${className}`}
    >
      <i className="ri-download-2-line text-lg"></i> <span className="font-medium">Export Laporan</span>
    </SpkButton>
  );
};

export const FilterButton: React.FC<BaseButtonProps & { label?: string }> = ({ onClick, label = "Terapkan", className = '' }) => {
  return (
    <SpkButton
      onclickfunc={onClick}
      variant="primary"
      customClass={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all font-semibold bg-[#1B4E3B] ${className}`}
    >
      <i className="ri-filter-3-line text-lg"></i> {label}
    </SpkButton>
  );
};

export const ResetButton: React.FC<BaseButtonProps & { label?: string }> = ({ onClick, label = "", className = '' }) => { // ini untuk reset
  return (
    <SpkButton
      onclickfunc={onClick}
      variant="light"
      customClass={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 ${className}`}
    >
      <i className="ri-refresh-line text-lg"></i> {label}
    </SpkButton>
  );
};

export const TableEditBtn = ({ onClick, id }: { onClick?: (id: string) => void; id: string }) => {
  return (
    <button
      onClick={() => onClick && onClick(id)}
      className="ti-btn ti-btn-sm ti-btn-info me-1"
    >
      <i className="ri-edit-line"></i>
    </button>
  );
};

export const TableRemoveBtn = ({ onClick, id }: { onClick?: (id: string) => void; id: string }) => {
  return (
    <button
      onClick={() => onClick && onClick(id)}
      className="ti-btn ti-btn-sm ti-btn-danger"
    >
      <i className="ri-delete-bin-line"></i>
    </button>
  );
};

export const TableViewBtn = ({ onClick, id }: { onClick?: (id: string) => void; id: string }) => {
  return (
    <button
      onClick={() => onClick && onClick(id)}
      className="ti-btn ti-btn-sm ti-btn-success me-1"
    >
      <i className="ri-eye-line"></i>
    </button>
  );
};
