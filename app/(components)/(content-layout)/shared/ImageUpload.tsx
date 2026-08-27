import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  label?: string;
  imageUrl?: string; // Preview URL that comes from server or object URL
  onImageChange: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
}

export default function ImageUpload({
  label = 'Upload Gambar',
  imageUrl,
  onImageChange,
  disabled = false,
  className = ''
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setPreview(imageUrl || null);
  }, [imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the file input click
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <div
        className={`
          relative flex items-center justify-center
          w-full h-40 rounded-md border-2 border-dashed
          transition-colors duration-300
          ${disabled ? 'bg-gray-100 cursor-not-allowed border-gray-300' : 'cursor-pointer hover:border-[#1B4E3B] hover:bg-emerald-50'}
          ${preview ? 'border-transparent' : 'border-gray-300'}
        `}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
        />

        {preview ? (
          <div className="relative w-full h-full rounded-md overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="object-contain w-full h-full"
            />
            {/* Overlay for replacing/removing */}
            {!disabled && isHovered && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-2 transition-opacity">
                <span className="text-white text-sm font-semibold flex items-center gap-1">
                  <i className="ri-image-edit-line"></i> Ganti Gambar
                </span>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors shadow-sm flex items-center gap-1"
                >
                  <i className="ri-delete-bin-line"></i> Hapus
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <i className="ri-upload-cloud-2-line text-3xl mb-2 text-[#1B4E3B]"></i>
            <span className="text-sm font-medium">Klik untuk upload gambar</span>
            <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (Max. 5MB)</span>
          </div>
        )}
      </div>
    </div>
  );
}
