export const metadata = {
  title: 'LocalPulse AI',
  description: 'Turn Website Visitors Into Instant Local Clients',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0f172a' }}>
        {children}
      </body>
    </html>
  )
}
