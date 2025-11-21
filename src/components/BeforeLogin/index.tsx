import Link from 'next/link'
import React from 'react'

const BeforeLogin: React.FC = () => {
  return (
    <div style={{ marginBottom: 20 }}>
      <p>
        <b>Singin to access your dashboard!</b> <br />
        <Link href="/signup">Sign up</Link> {`If you don't have an account`}
      </p>
    </div>
  )
}

export default BeforeLogin
