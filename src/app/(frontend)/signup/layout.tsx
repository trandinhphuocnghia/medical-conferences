export const metadata = {
  title: 'HIGCF - Sign Up',
  description: 'Create a new account for HIGCF',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
