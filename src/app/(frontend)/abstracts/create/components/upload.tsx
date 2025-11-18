import { uploadFile } from '@/app/actions/files/upload'
import { cn } from '@/utilities/ui'
import { useRef, useState } from 'react'

export const FileUploader = ({
  onChange,
  files = [],
}: {
  files: { url: string }[]
  onChange: (files: { url: string }[]) => void
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files
      ? e.target.files[0]
      : e.dataTransfer.files[0]

    if (selectedFile) {
      setFile(selectedFile)
      setStatus(`File selected: ${selectedFile.name}. Click Upload to proceed.`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setStatus('Please select a file.')
      return
    }

    setStatus('Uploading...')

    try {
      const res = await uploadFile(file)

      if (res?.success && res?.res?.url) {
        const updatedFiles = [...files, { url: res.res.url }]
        onChange(updatedFiles)
        setStatus(`Success! Uploaded: ${file.name}`)
      } else {
        setStatus(`Upload Failed: ${res.error || 'Unknown error occurred.'}`)
      }
    } catch (err) {
      console.error(err)
      setStatus(`Upload Failed: Network or server error.`)
    } finally {
      setFile(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileChange(e)
  }

  const dropzoneClasses = cn(
    'p-10 border-2 rounded-lg text-center cursor-pointer transition-colors duration-200',
    'font-sans',
    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50',
    { 'border-dashed': true },
  )

  const buttonClasses = cn(
    'py-3 px-5 text-white font-bold border-none rounded-lg w-full transition-colors',
    !file || status.includes('Uploading')
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700 cursor-pointer',
  )

  const statusClasses = cn(
    'mt-4 pt-4 border-t border-dashed',
    status.includes('Success')
      ? 'text-green-600'
      : status.includes('Failed')
        ? 'text-red-600'
        : 'text-gray-600',
  )

  const statusMessageColor = cn(
    'font-bold mb-1',
    status.includes('Success')
      ? 'text-green-600'
      : status.includes('Failed')
        ? 'text-red-600'
        : 'text-gray-900',
  )

  return (
    <div className=" mx-auto my-5 font-sans p-4  shadow-lg">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        accept="image/*, application/pdf"
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
          {isDragging
            ? 'Drop file here!'
            : 'Drag & Drop File, or Click to Select'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Accepted formats: Images and PDFs
        </p>

        {file && (
          <p className="mt-2 text-green-600 font-bold text-sm">
            Selected: {file.name} ({Math.round(file.size / 1024)} KB)
          </p>
        )}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!file || status.includes('Uploading')}
          className={buttonClasses}
        >
          {status.includes('Uploading')
            ? 'Processing Upload...'
            : 'Upload File to Payload'}
        </button>
      </div>

      <div className={statusClasses}>
        <p className={statusMessageColor}>Status:</p>
        <p className="text-sm">{status || 'Awaiting action...'}</p>
      </div>

      {files && files.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-md font-semibold mb-2">
            Successfully Uploaded Files:
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            {files.map((f, index) => (
              <li key={index} className="text-sm break-all text-gray-700">
                {f.url.length > 50 ? `${f.url.substring(0, 50)}...` : f.url}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
