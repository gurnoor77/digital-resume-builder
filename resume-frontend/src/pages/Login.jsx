import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = "http://localhost:8080/resume-backend/api"

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password })
      if (res.data.success) {
        localStorage.setItem('userId', res.data.userId)
        localStorage.setItem('role', res.data.role)
        navigate('/dashboard')
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.logo}></div>
          <h1 style={styles.brand}>Resume Builder</h1>
          <p style={styles.tagline}>Create professional resumes in minutes</p>
          <div style={styles.features}>
            <div style={styles.feature}>✅ Free forever</div>
            <div style={styles.feature}>✅ PDF download</div>
            <div style={styles.feature}>✅ Shareable link</div>
            <div style={styles.feature}>✅ Always updated</div>
          </div>
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>
          {error && <div style={styles.errorBox}>{error}</div>}
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input style={styles.input} type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <button style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p style={styles.switchText}>
            Don't have an account? <Link to="/register" style={styles.link}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { display:'flex', minHeight:'100vh', fontFamily:'Arial, sans-serif' },
  left: { flex:1, background:'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px' },
  leftContent: { maxWidth:'360px' },
  logo: { width:'56px', height:'56px', background:'rgba(255,255,255,0.2)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', fontSize:'20px', marginBottom:'20px' },
  brand: { color:'white', fontSize:'32px', margin:'0 0 8px 0' },
  tagline: { color:'rgba(255,255,255,0.8)', fontSize:'16px', margin:'0 0 32px 0' },
  features: { display:'flex', flexDirection:'column', gap:'12px' },
  feature: { color:'rgba(255,255,255,0.9)', fontSize:'15px' },
  right: { flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'#f8f9fa', padding:'40px' },
  card: { background:'white', padding:'40px', borderRadius:'16px', boxShadow:'0 4px 24px rgba(0,0,0,0.08)', width:'100%', maxWidth:'400px' },
  title: { fontSize:'24px', fontWeight:'bold', color:'#333', margin:'0 0 8px 0' },
  subtitle: { fontSize:'14px', color:'#888', margin:'0 0 24px 0' },
  errorBox: { background:'#fdecea', color:'#c62828', padding:'10px 14px', borderRadius:'8px', fontSize:'13px', marginBottom:'16px' },
  field: { marginBottom:'16px' },
  label: { display:'block', fontSize:'13px', fontWeight:'bold', color:'#555', marginBottom:'6px' },
  input: { width:'100%', padding:'11px 14px', borderRadius:'8px', border:'1.5px solid #e0e0e0', fontSize:'14px', boxSizing:'border-box', outline:'none' },
  button: { width:'100%', padding:'13px', background:'linear-gradient(135deg, #1a73e8, #0d47a1)', color:'white', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:'bold', cursor:'pointer', marginTop:'8px' },
  switchText: { textAlign:'center', marginTop:'20px', fontSize:'13px', color:'#888' },
  link: { color:'#1a73e8', fontWeight:'bold', textDecoration:'none' }
}

export default Login