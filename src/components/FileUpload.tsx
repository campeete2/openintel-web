"use client";

import { useRef, useState } from "react";

interface Props {
  name: string;
  accept?: string;
}

export function FileUpload({ name, accept = "image/*,video/*,.pdf,.csv,.json,.txt" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files ?? []));
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        multiple
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600"
      >
        + Add attachments
      </button>
      {files.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {files.map((f, i) => (
            <li key={i} className="text-xs text-gray-500">
              {f.name} ({(f.size / 1024).toFixed(1)} KB)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
