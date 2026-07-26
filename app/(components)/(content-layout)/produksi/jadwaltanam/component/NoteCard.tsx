
interface NoteCardProps {
  title?: string;
  description: string;
}

export default function NoteCard({
  title = "Catatan",
  description,
}: NoteCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <i className="h-4 w-4 text-slate-500 ri-file-edit-line" />

        <h3 className="text-sm font-semibold text-slate-800">
          {title}
        </h3>
      </div>

      <p className="mt-4 text-xs leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}