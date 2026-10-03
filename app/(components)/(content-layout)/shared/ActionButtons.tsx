import React from 'react';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';

interface BaseButtonProps {
  onClick?: (e?: any) => void;
  className?: string;
  disabled?: boolean;
}

interface ActionButtonProps extends BaseButtonProps {
  label?: string;
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

export const AddButton: React.FC<ActionButtonProps> = ({ onClick, label = "Tambah", className = '' }) => {
  return (
    <SpkButton
      onclickfunc={onClick}
      variant="primary"
      customClass={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all font-semibold bg-[#1B4E3B] text-white border-transparent ${className}`}
    >
      <i className="ri-add-line text-lg"></i> <span className="font-medium">{label}</span>
    </SpkButton>
  );
};

export const EditButton: React.FC<ActionButtonProps> = ({ onClick, label = "Edit", className = '', disabled = false }) => {
  return (
    <SpkButton
      buttontype="button"
      onClick={onClick}
      onclickfunc={onClick}
      variant="success"
      disabled={disabled}
      customClass={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all font-semibold ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''} ${className}`}
    >
      <i className="ri-edit-box-line text-lg"></i> <span className="font-medium">{label}</span>
    </SpkButton>
  );
};

export const ManageButton: React.FC<ActionButtonProps> = ({ onClick, label = "Kelola", className = '' }) => {
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
      className={`w-6 h-6 flex items-center justify-center rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 hover:scale-110 transition-all duration-200 shadow-sm border border-emerald-100 ${className}`}
      title={title}
    >
      <i className="ri-eye-line text-sm"></i>
    </button>
  );
};

export const EditIconButton: React.FC<IconButtonProps> = ({ onClick, title = "Edit", className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-6 h-6 flex items-center justify-center rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:scale-110 transition-all duration-200 shadow-sm border border-blue-100 ${className}`}
      title={title}
    >
      <i className="ri-edit-line text-sm"></i>
    </button>
  );
};

export const ExportButton: React.FC<BaseButtonProps & { label?: string }> = ({ onClick, label = "Export Laporan", className = '' }) => {
  return (
    <SpkButton
      onclickfunc={onClick}
      variant="light"
      customClass={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all bg-white border border-gray-200 text-gray-700 ${className}`}
    >
      <i className="ri-download-2-line text-lg"></i> <span className="font-medium">{label}</span>
    </SpkButton>
  );
};

export const FilterButton: React.FC<BaseButtonProps & { label?: string }> = ({ onClick, label = "Filter", className = '', disabled = false }) => {
  return (
    <SpkButton
      buttontype="button"
      onClick={onClick}
      onclickfunc={onClick}
      variant="primary"
      disabled={disabled}
      customClass={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all font-semibold bg-[#1B4E3B] text-white border-transparent ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''} ${className}`}
    >
      <i className="ri-filter-3-line text-lg"></i> <span className="font-medium">{label}</span>
    </SpkButton>
  );
};

export const ResetButton: React.FC<BaseButtonProps & { label?: string }> = ({ onClick, label = "Reset", className = '', disabled = false }) => {
  return (
    <SpkButton
      buttontype="button"
      onClick={onClick}
      onclickfunc={onClick}
      variant="light"
      disabled={disabled}
      customClass={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''} ${className}`}
    >
      <i className="ri-refresh-line text-lg"></i> <span className="font-medium">{label}</span>
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

export const DeleteIconButton: React.FC<IconButtonProps> = ({ onClick, title = "Hapus", className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-6 h-6 flex items-center justify-center rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 hover:scale-110 transition-all duration-200 shadow-sm border border-rose-100 ${className}`}
      title={title}
    >
      <i className="ri-delete-bin-line text-sm"></i>
    </button>
  );
};

export const SaveButton: React.FC<BaseButtonProps & { label?: string }> = ({ onClick, label = "Simpan", className = '', disabled = false }) => {
  return (
    <SpkButton
      buttontype="button"
      onClick={onClick}
      onclickfunc={onClick}
      variant="primary"
      disabled={disabled}
      customClass={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all font-semibold bg-[#1B4E3B] text-white border-transparent ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''} ${className}`}
    >
      <i className="ri-save-line text-lg"></i> <span className="font-medium">{label}</span>
    </SpkButton>
  );
};

export const CancelButton: React.FC<BaseButtonProps & { label?: string }> = ({ onClick, label = "Batal", className = '', disabled = false }) => {
  return (
    <SpkButton
      buttontype="button"
      onClick={onClick}
      onclickfunc={onClick}
      variant="outline-primary"
      disabled={disabled}
      customClass={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all font-semibold bg-white text-[#1B4E3B] border border-[#1B4E3B] ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''} ${className}`}
    >
      <i className="ri-close-line text-lg"></i> <span className="font-medium">{label}</span>
    </SpkButton>
  );
};
