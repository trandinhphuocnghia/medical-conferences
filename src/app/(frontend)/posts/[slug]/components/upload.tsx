import { cn } from '@/utilities/ui'
import { X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

export const FileUploader = ({
  onChange,
  files = [],
}: {
  files: File[]
  onChange: (files: File[]) => void
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: any) => {
    const newFiles: File[] = e.target.files
      ? Array.from(e.target.files)
      : Array.from(e.dataTransfer.files)

    if (newFiles.length > 0) {
      // Append new files to existing ones
      onChange([...files, ...newFiles])
    }
  }

  const handleDragOver = (e: any) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: any) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: any) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileChange(e)
  }

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  const dropzoneClasses = cn(
    'p-10 border-2 rounded-lg text-center cursor-pointer transition-colors duration-200',
    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50',
    'border-dashed',
  )

  const filesListMsg =
    files.length > 0 ? `${files.length} file(s) selected` : 'Drag & Drop File, or Click to Select'

  return (
    <div className="">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className={dropzoneClasses}
        onClick={() => fileInputRef?.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className={cn('m-0 font-bold text-lg', isDragging ? 'text-blue-600' : 'text-gray-800')}>
          {isDragging ? 'Drop file(s) here!' : filesListMsg}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Accepted formats: PDFs, .doc, and .docx (Multiple files and folder uploads supported)
        </p>

        {files.length > 0 && (
          <p className="mt-2 text-green-600 font-bold text-sm">
            Ready to upload: {files.length} file(s)
          </p>
        )}
      </div>

      {files && files.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-md font-semibold mb-2">Selected Files:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="text-sm text-gray-700">
                <div className="items-center flex gap-4 justify-between">
                  <p className="flex-1 truncate">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                  <Button size="icon" variant="outline" onClick={() => removeFile(index)}>
                    <X />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
