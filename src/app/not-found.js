export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '6rem', margin: '0', fontWeight: 'bold' }}>404</h1>
      <h2 style={{ fontSize: '2rem', margin: '20px 0' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        style={{
          background: 'white',
          color: '#667eea',
          padding: '12px 32px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '1.1rem',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        Go Home
      </a>
    </div>
  )
}
