'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Payload Admin Error:', error)
  }, [error])

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: '#c00', fontSize: '1.4rem' }}>Admin Error</h1>
      <p style={{ fontWeight: 'bold' }}>{error.message}</p>
      <pre style={{ background: '#f5f5f5', padding: '16px', overflowX: 'auto', fontSize: '0.8rem' }}>
        {error.stack}
      </pre>
      {error.digest && <p>Digest: {error.digest}</p>}
      <button onClick={reset} style={{ marginTop: '16px', padding: '8px 16px' }}>
        Try Again
      </button>
    </div>
  )
}
