export const metadata = {
  title: 'MedConf - Sign Up',
  description: 'Create a new account for MedConf',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
