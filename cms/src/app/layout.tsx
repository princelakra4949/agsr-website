import React from 'react'

export const metadata = {
  title: 'AGSR Sonipat — Admin',
  description: 'AGSR Shooting Academy CMS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
