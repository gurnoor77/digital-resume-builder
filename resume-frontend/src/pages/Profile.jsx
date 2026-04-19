import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = "http://localhost:8080/resume-backend/api"

function Profile() {
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    axios.get(`${BASE_URL}/profile?userId=${userId}`)
      .then(res => {
        setName(res.data.name || '')
        setEmail(res.data.email || '')
        setPhone(res.data.phone || '')
        setAddress(res.data.address || '')
        setLinkedin(res.data.linkedin || '')
        setGithub(res.data.github || '')
      })
      .catch(err => console.log(err))
  }, [])

  const handleSave = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/profile`, {
        userId, phone, address, linkedin, github
      })
      if (res.data.success) {
        setMessage('Profile saved successfully!')
        setError('')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setError('Failed to save profile.')
      }
    } catch (err) {
      setError('Error saving profile.')
    }
  }

  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={styles.navTitle}>Resume Builder</span>
        </div>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>

      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <h2 style={styles.pageTitle}>My Profile</h2>
          <p style={styles.pageSub}>Manage your personal information</p>
        </div>

        <div style={styles.grid}>
          {/* Avatar Card */}
          <div style={styles.avatarCard}>
            <h3 style={styles.avatarName}>{name || 'Your Name'}</h3>
            <p style={styles.avatarEmail}>{email}</p>
            <div style={styles.avatarDivider}></div>
            <div style={styles.avatarInfo}>
              <div style={styles.infoRow}>
                <span style={styles.infoIcon}>📱</span>
                <span style={styles.infoText}>{phone || 'No phone added'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoIcon}>📍</span>
                <span style={styles.infoText}>{address || 'No address added'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoIcon}>💼</span>
                <span style={styles.infoText}>{linkedin ? 'LinkedIn added' : 'No LinkedIn'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoIcon}>🐙</span>
                <span style={styles.infoText}>{github ? 'GitHub added' : 'No GitHub'}</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Contact Information</h3>
            {message && <div style={styles.successBox}>{message}</div>}
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.formRow}>
              <div style={styles.formField}>
                <label style={styles.label}>Full Name</label>
                <input style={{ ...styles.input, background:'#f8f9fa', color:'#999' }}
                  type="text" value={name} disabled />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Email Address</label>
                <input style={{ ...styles.input, background:'#f8f9fa', color:'#999' }}
                  type="text" value={email} disabled />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formField}>
                <label style={styles.label}>Phone Number</label>
                <input style={styles.input} type="text" placeholder="+91 9999999999"
                  value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Address</label>
                <input style={styles.input} type="text" placeholder="City, State, Country"
                  value={address} onChange={e => setAddress(e.target.value)} />
              </div>
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>LinkedIn URL</label>
              <input style={styles.input} type="text" placeholder="https://linkedin.com/in/yourname"
                value={linkedin} onChange={e => setLinkedin(e.target.value)} />
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>GitHub URL</label>
              <input style={styles.input} type="text" placeholder="https://github.com/yourusername"
                value={github} onChange={e => setGithub(e.target.value)} />
            </div>

            <button style={styles.saveBtn} onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight:'100vh', background:'#f8f9fa', fontFamily:'Arial, sans-serif' },
  navbar: { background:'white', padding:'0 32px', height:'64px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.1)' },
  navLeft: { display:'flex', alignItems:'center', gap:'12px' },
  navLogo: { width:'36px', height:'36px', background:'#1a73e8', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', fontSize:'14px' },
  navTitle: { fontSize:'18px', fontWeight:'bold', color:'#333' },
  backBtn: { background:'transparent', color:'#1a73e8', border:'1px solid #1a73e8', padding:'6px 16px', borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontWeight:'bold' },
  content: { maxWidth:'1000px', margin:'0 auto', padding:'32px' },
  pageHeader: { marginBottom:'24px' },
  pageTitle: { fontSize:'24px', fontWeight:'bold', color:'#333', margin:'0 0 4px 0' },
  pageSub: { fontSize:'14px', color:'#888', margin:0 },
  grid: { display:'grid', gridTemplateColumns:'300px 1fr', gap:'24px' },
  avatarCard: { background:'white', borderRadius:'16px', padding:'32px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', textAlign:'center' },
  avatar: { width:'80px', height:'80px', background:'linear-gradient(135deg, #1a73e8, #0d47a1)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'28px', fontWeight:'bold', margin:'0 auto 16px' },
  avatarName: { fontSize:'18px', fontWeight:'bold', color:'#333', margin:'0 0 4px 0' },
  avatarEmail: { fontSize:'13px', color:'#888', margin:0 },
  avatarDivider: { height:'1px', background:'#f0f0f0', margin:'20px 0' },
  avatarInfo: { textAlign:'left', display:'flex', flexDirection:'column', gap:'12px' },
  infoRow: { display:'flex', alignItems:'center', gap:'10px' },
  infoIcon: { fontSize:'16px' },
  infoText: { fontSize:'13px', color:'#666' },
  formCard: { background:'white', borderRadius:'16px', padding:'32px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  formTitle: { fontSize:'18px', fontWeight:'bold', color:'#333', margin:'0 0 20px 0' },
  successBox: { background:'#e8f5e9', color:'#2e7d32', padding:'10px 14px', borderRadius:'8px', fontSize:'13px', marginBottom:'16px' },
  errorBox: { background:'#fdecea', color:'#c62828', padding:'10px 14px', borderRadius:'8px', fontSize:'13px', marginBottom:'16px' },
  formRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' },
  formField: { marginBottom:'16px' },
  label: { display:'block', fontSize:'13px', fontWeight:'bold', color:'#555', marginBottom:'6px' },
  input: { width:'100%', padding:'11px 14px', borderRadius:'8px', border:'1.5px solid #e0e0e0', fontSize:'14px', boxSizing:'border-box' },
  saveBtn: { background:'linear-gradient(135deg, #1a73e8, #0d47a1)', color:'white', border:'none', padding:'12px 32px', borderRadius:'8px', fontSize:'15px', fontWeight:'bold', cursor:'pointer', marginTop:'8px' }
}

export default Profile