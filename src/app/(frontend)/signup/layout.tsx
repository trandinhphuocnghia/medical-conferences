export const metadata = {
  title: 'HIGF - Sign Up',
  description: 'Create a new account for HIGF',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
