
interface FilePreviewProps {
  fileName: string;
  fileSize: string;
  onView?: () => void;
  onDelete?: () => void;
}

export default function FilePreview({
  fileName,
  fileSize,
  onView,
  onDelete,
}: FilePreviewProps) {
  return (
    <div className="flex items-center justify-between border rounded-lg p-4">
      <div className="flex items-center gap-3">
        < i className="ri-file-upload-line w-8 h-8 text-lg text-blue-600"></i>

        <div>
          <div className="font-medium">{fileName}</div>
          <div className="text-xs text-gray-500">
            PDF • {fileSize}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="btn btn-light"
          onClick={onView}
        >
          <i className="ri-eye-line w-4 h-4 text-lg"></i>
        </button>

        <button
          className="btn btn-light"
          onClick={onDelete}
        >
          <i className="ri-delete-bin-line w-4 h-4 text-lg"></i>
        </button>
      </div>
    </div>
  );
}