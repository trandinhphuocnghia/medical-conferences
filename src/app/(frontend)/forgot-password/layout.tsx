export const metadata = {
  title: 'HIGF - Forgot Password',
  description: 'Forgot Password',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
