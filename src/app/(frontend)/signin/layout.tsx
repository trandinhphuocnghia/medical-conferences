export const metadata = {
  title: 'MedConf - Sign In',
  description: 'Sign in to your account',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
