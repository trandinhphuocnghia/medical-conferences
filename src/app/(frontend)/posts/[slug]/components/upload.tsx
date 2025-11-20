import { uploadFile } from '@/app/actions/files/upload'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { Trash, X } from 'lucide-react'
import { useRef, useState } from 'react'

export const FileUploader = ({
  onChange,
  files = [],
}: {
  files: { url: string }[]
  onChange: (files: { url: string }[]) => void
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: any) => {
    const newFiles: File[] = e.target.files
      ? Array.from(e.target.files)
      : Array.from(e.dataTransfer.files)

    if (newFiles.length > 0) {
      setSelectedFiles(newFiles)
    } else {
      setSelectedFiles([])
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (selectedFiles.length === 0) {
      return
    }

    const successfulUploads = []
    let hasFailed = false

    for (const file of selectedFiles) {
      try {
        const res = await uploadFile(file)

        if (res?.success && res?.res?.url) {
          successfulUploads.push({ url: res.res.url })
        } else {
          hasFailed = true
          console.error(`Failed to upload ${file.name}:`, res.error)
        }
      } catch (err) {
        hasFailed = true
        console.error(err)
      }
    }

    const updatedFiles = [...files, ...successfulUploads]
    onChange(updatedFiles)

    setSelectedFiles([])
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

  const dropzoneClasses = cn(
    'p-10 border-2 rounded-lg text-center cursor-pointer transition-colors duration-200',
    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50',
    'border-dashed',
  )

  const buttonClasses = cn(
    'py-3 px-5 text-white border-none rounded-lg w-full transition-colors',
    selectedFiles.length === 0
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700 cursor-pointer',
  )

  const filesListMsg =
    selectedFiles.length > 0
      ? `Selected ${selectedFiles.length} file(s)`
      : 'Drag & Drop File, or Click to Select'

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
        <p
          className={cn(
            'm-0 font-bold text-lg',
            isDragging ? 'text-blue-600' : 'text-gray-800',
          )}
        >
          {isDragging ? 'Drop file(s) here!' : filesListMsg}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Accepted formats: PDFs, .doc, and .docx (Multiple files and folder
          uploads supported)
        </p>

        {selectedFiles.length > 0 && (
          <p className="mt-2 text-green-600 font-bold text-sm">
            Ready to upload: {selectedFiles.length} file(s)
          </p>
        )}
      </div>

      <div className="mt-4">
        <Button
          disabled={selectedFiles.length === 0}
          className={buttonClasses}
          onClick={handleSubmit}
        ></Button>
      </div>

      {files && files.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex gap-4 items-center">
            <h4 className="text-md font-semibold">
              Successfully Uploaded Files:
            </h4>

            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                onChange([])
                setSelectedFiles([])
              }}
            >
              <Trash />
            </Button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {files.map((f, index) => (
              <li key={index} className="text-sm break-all text-gray-700">
                <div className="items-center flex gap-4">
                  <p>
                    {f.url.length > 50 ? `${f.url.substring(0, 50)}...` : f.url}
                  </p>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      onChange(files?.filter((_, i) => i !== index))
                      setSelectedFiles(
                        selectedFiles.filter((_, i) => i !== index),
                      )
                    }}
                  >
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
