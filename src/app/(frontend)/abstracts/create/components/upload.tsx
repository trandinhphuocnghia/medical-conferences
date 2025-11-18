import { useState } from 'react'
// Assume you have an AuthProvider that provides the current user/token
// import { useAuth } from '@/context/AuthContext';

export const FileUploader = ({
  onChange,
  files = [],
}: {
  files: { url: string }[]
  onChange: (files: { url: string }[]) => void
}) => {
  console.log({ files })
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setStatus('Please select a file.')
      return
    }

    setStatus('Uploading...')

    const formData = new FormData()

    formData.append('file', file)

    try {
      const response = await fetch('/api/files', {
        method: 'POST',

        body: formData,
      })

      if (response.ok) {
        const result = await response.json()

        files?.push({ url: result.doc.url })
        onChange(files)

        setStatus(`Success! File ID: ${result.doc.id}, URL: ${result.doc.url}`)
      } else {
        const error = await response.json()
        setStatus(
          `Upload Failed: ${error.errors?.[0]?.message || 'Server error'}`,
        )
      }
    } catch (error) {
      setStatus(`Network Error: ${error.message}`)
    }
  }

  return (
    <div
      style={{ padding: '20px', border: '1px solid #ccc', maxWidth: '400px' }}
    >
      <h3>Upload New File (Frontend)</h3>

      <input
        type="file"
        accept="image/*, application/pdf" // Matches your mimeTypes
        onChange={handleFileChange}
        required
        style={{ marginBottom: '10px' }}
      />

      <button
        type="button"
        disabled={!file}
        style={{
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
        }}
        onClick={handleSubmit}
      >
        {status.includes('Uploading') ? 'Processing...' : 'Upload'}
      </button>

      <p
        style={{
          marginTop: '10px',
          color: status.includes('Failed') ? 'red' : 'green',
        }}
      >
        {status}
      </p>
    </div>
  )
}

// export default FrontendFileUploader;
