import React from 'react';
import { buttonClass, iconButtonClass, ButtonSize, ButtonVariant, IconButtonTone } from './buttonStyles';

interface BaseButtonProps {
  onClick?: (e?: any) => void;
  className?: string;
  disabled?: boolean;
}

interface ActionButtonProps extends BaseButtonProps {
  label?: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
}

/** Tombol dasar dengan gaya seragam (lihat buttonStyles.ts). */
export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', icon, className = '', children, type = 'button', ...rest }) => (
  <button type={type} className={buttonClass(variant, size, className)} {...rest}>
    {icon && <i className={`${icon} text-sm`}></i>}
    {children}
  </button>
);

const LabeledButton = (variant: ButtonVariant, icon: string, defaultLabel: string): React.FC<ActionButtonProps> =>
  function LabeledActionButton({ onClick, label = defaultLabel, className = '', disabled = false }) {
    return (
      <Button variant={variant} icon={icon} onClick={onClick} disabled={disabled} className={className}>
        {label}
      </Button>
    );
  };

export const HistoryButton: React.FC<BaseButtonProps> = ({ onClick, className = '', disabled }) => (
  <Button variant="outline" icon="ri-history-line" onClick={onClick} disabled={disabled} className={className}>
    Riwayat Perubahan
  </Button>
);

export const AddButton = LabeledButton('primary', 'ri-add-line', 'Tambah');
export const EditButton = LabeledButton('outline', 'ri-edit-box-line', 'Edit');
export const ManageButton = LabeledButton('outline', 'ri-settings-4-line', 'Kelola');
export const ExportButton = LabeledButton('secondary', 'ri-download-2-line', 'Export Laporan');
export const FilterButton = LabeledButton('primary', 'ri-filter-3-line', 'Filter');
export const ResetButton = LabeledButton('secondary', 'ri-refresh-line', 'Reset');
export const SaveButton = LabeledButton('primary', 'ri-save-line', 'Simpan');
export const CancelButton = LabeledButton('outline', 'ri-close-line', 'Batal');

interface IconButtonProps extends BaseButtonProps {
  title?: string;
}

const IconButton = (tone: IconButtonTone, icon: string, defaultTitle: string): React.FC<IconButtonProps> =>
  function ActionIconButton({ onClick, title = defaultTitle, className = '', disabled }) {
    return (
      <button type="button" onClick={onClick} title={title} aria-label={title} disabled={disabled} className={iconButtonClass(tone, className)}>
        <i className={icon}></i>
      </button>
    );
  };

export const ViewIconButton = IconButton('emerald', 'ri-eye-line', 'Lihat Detail');
export const EditIconButton = IconButton('blue', 'ri-edit-line', 'Edit');
export const DeleteIconButton = IconButton('rose', 'ri-delete-bin-line', 'Hapus');

export const TableEditBtn = ({ onClick, id }: { onClick?: (id: string) => void; id: string }) => (
  <button type="button" title="Edit" aria-label="Edit" onClick={() => onClick?.(id)} className={iconButtonClass('blue', 'me-1')}>
    <i className="ri-edit-line"></i>
  </button>
);

export const TableRemoveBtn = ({ onClick, id }: { onClick?: (id: string) => void; id: string }) => (
  <button type="button" title="Hapus" aria-label="Hapus" onClick={() => onClick?.(id)} className={iconButtonClass('rose')}>
    <i className="ri-delete-bin-line"></i>
  </button>
);

export const TableViewBtn = ({ onClick, id }: { onClick?: (id: string) => void; id: string }) => (
  <button type="button" title="Lihat" aria-label="Lihat" onClick={() => onClick?.(id)} className={iconButtonClass('emerald', 'me-1')}>
    <i className="ri-eye-line"></i>
  </button>
);
