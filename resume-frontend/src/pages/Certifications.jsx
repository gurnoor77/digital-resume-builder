import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = "http://localhost:8080/resume-backend/api"

function Certifications() {
  const [certs, setCerts] = useState([])
  const [title, setTitle] = useState('')
  const [issuer, setIssuer] = useState('')
  const [year, setYear] = useState('')
  const [link, setLink] = useState('')
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    axios.get(`${BASE_URL}/certifications?userId=${userId}`)
      .then(res => setCerts(res.data))
      .catch(err => console.log(err))
  }, [])

  const handleAdd = async () => {
    if (!title || !issuer) return
    try {
      const res = await axios.post(`${BASE_URL}/certifications`, {
        userId, title, issuer, year, link
      })
      if (res.data.success) {
        setCerts([...certs, { title, issuer, year, link }])
        setTitle('')
        setIssuer('')
        setYear('')
        setLink('')
        setMessage('Certification added!')
        setShowForm(false)
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) { console.log(err) }
  }

  const colors = ['#1a73e8', '#34a853', '#9b59b6', '#e67e22', '#e53935', '#00acc1']

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
          <div>
            <h2 style={styles.pageTitle}>My Certifications</h2>
            <p style={styles.pageSub}>Showcase your achievements and certificates</p>
          </div>
          <button style={styles.addNewBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Certification'}
          </button>
        </div>

        {message && <div style={styles.successBox}>{message}</div>}

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>New Certification</h3>
            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>Certificate Title *</label>
                <input style={styles.input} type="text" placeholder="e.g. AWS Cloud Practitioner"
                  value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Issued By *</label>
                <input style={styles.input} type="text" placeholder="e.g. Amazon, Google, Coursera"
                  value={issuer} onChange={e => setIssuer(e.target.value)} />
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>Year</label>
                <input style={styles.input} type="number" placeholder="2024"
                  value={year} onChange={e => setYear(e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Certificate Link (optional)</label>
                <input style={styles.input} type="text" placeholder="https://..."
                  value={link} onChange={e => setLink(e.target.value)} />
              </div>
            </div>
            <div style={styles.formBtns}>
              <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleAdd}>Save Certification</button>
            </div>
          </div>
        )}

        {certs.length === 0 && !showForm ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🏆</div>
            <h3 style={styles.emptyTitle}>No certifications added yet</h3>
            <p style={styles.emptyText}>Add your certificates and achievements</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {certs.map((c, i) => (
              <div key={i} style={styles.certCard}>
                <div style={{ ...styles.certTop, background: colors[i % colors.length] }}>
                  <span style={styles.certIcon}>🏆</span>
                  <span style={styles.certYear}>{c.year}</span>
                </div>
                <div style={styles.certBody}>
                  <h3 style={styles.certTitle}>{c.title}</h3>
                  <p style={styles.certIssuer}>Issued by: {c.issuer}</p>
                  {c.link && (
                    <a href={c.link} target="_blank"
                      style={{ ...styles.certLink, color: colors[i % colors.length] }}>
                      View Certificate →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
  pageHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' },
  pageTitle: { fontSize:'24px', fontWeight:'bold', color:'#333', margin:'0 0 4px 0' },
  pageSub: { fontSize:'14px', color:'#888', margin:0 },
  addNewBtn: { background:'linear-gradient(135deg, #1a73e8, #0d47a1)', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:'bold' },
  successBox: { background:'#e8f5e9', color:'#2e7d32', padding:'10px 14px', borderRadius:'8px', fontSize:'13px', marginBottom:'16px' },
  formCard: { background:'white', borderRadius:'16px', padding:'28px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', marginBottom:'24px' },
  formTitle: { fontSize:'16px', fontWeight:'bold', color:'#333', margin:'0 0 20px 0' },
  formRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' },
  field: { marginBottom:'16px' },
  label: { display:'block', fontSize:'13px', fontWeight:'bold', color:'#555', marginBottom:'6px' },
  input: { width:'100%', padding:'11px 14px', borderRadius:'8px', border:'1.5px solid #e0e0e0', fontSize:'14px', boxSizing:'border-box' },
  formBtns: { display:'flex', gap:'12px', justifyContent:'flex-end' },
  cancelBtn: { padding:'10px 20px', background:'white', color:'#666', border:'1px solid #ddd', borderRadius:'8px', cursor:'pointer', fontSize:'14px' },
  saveBtn: { padding:'10px 24px', background:'linear-gradient(135deg, #1a73e8, #0d47a1)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:'bold' },
  empty: { textAlign:'center', padding:'80px 0' },
  emptyIcon: { fontSize:'48px', marginBottom:'16px' },
  emptyTitle: { fontSize:'20px', color:'#333', margin:'0 0 8px 0' },
  emptyText: { fontSize:'14px', color:'#888', margin:0 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px' },
  certCard: { background:'white', borderRadius:'16px', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  certTop: { padding:'20px', display:'flex', justifyContent:'space-between', alignItems:'center' },
  certIcon: { fontSize:'24px' },
  certYear: { color:'rgba(255,255,255,0.9)', fontSize:'14px', fontWeight:'bold' },
  certBody: { padding:'20px' },
  certTitle: { fontSize:'16px', fontWeight:'bold', color:'#333', margin:'0 0 8px 0' },
  certIssuer: { fontSize:'13px', color:'#666', margin:'0 0 12px 0' },
  certLink: { fontSize:'13px', fontWeight:'bold', textDecoration:'none' }
}

export default Certifications