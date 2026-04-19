import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = "http://localhost:8080/resume-backend/api"

function Projects() {
  const [projects, setProjects] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [techStack, setTechStack] = useState('')
  const [link, setLink] = useState('')
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    axios.get(`${BASE_URL}/projects?userId=${userId}`)
      .then(res => setProjects(res.data))
      .catch(err => console.log(err))
  }, [])

  const handleAdd = async () => {
    if (!title) return
    try {
      const res = await axios.post(`${BASE_URL}/projects`, {
        userId, title, description, techStack, link
      })
      if (res.data.success) {
        setProjects([...projects, { title, description, tech_stack: techStack, link }])
        setTitle('')
        setDescription('')
        setTechStack('')
        setLink('')
        setMessage('Project added!')
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
            <h2 style={styles.pageTitle}>My Projects</h2>
            <p style={styles.pageSub}>Showcase your best work</p>
          </div>
          <button style={styles.addNewBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Project'}
          </button>
        </div>

        {message && <div style={styles.successBox}>{message}</div>}

        {/* Add Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>New Project</h3>
            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>Project Title *</label>
                <input style={styles.input} type="text" placeholder="e.g. Resume Builder"
                  value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Tech Stack</label>
                <input style={styles.input} type="text" placeholder="e.g. React, Java, MySQL"
                  value={techStack} onChange={e => setTechStack(e.target.value)} />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea style={styles.textarea} placeholder="Brief description of the project..."
                value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Project Link (optional)</label>
              <input style={styles.input} type="text" placeholder="https://github.com/..."
                value={link} onChange={e => setLink(e.target.value)} />
            </div>
            <div style={styles.formBtns}>
              <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleAdd}>Save Project</button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 && !showForm ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>💼</div>
            <h3 style={styles.emptyTitle}>No projects yet</h3>
            <p style={styles.emptyText}>Click "Add Project" to showcase your work</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {projects.map((p, i) => (
              <div key={i} style={styles.projectCard}>
                <div style={{ ...styles.cardTop, background: colors[i % colors.length] }}>
                  <span style={styles.cardNum}>#{i + 1}</span>
                  <h3 style={styles.cardTitle}>{p.title}</h3>
                </div>
                <div style={styles.cardBody}>
                  <p style={styles.cardDesc}>{p.description}</p>
                  {p.tech_stack && (
                    <div style={styles.techTags}>
                      {p.tech_stack.split(',').map((t, j) => (
                        <span key={j} style={{ ...styles.techTag, borderColor: colors[i % colors.length], color: colors[i % colors.length] }}>
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.link && (
                    <a href={p.link} target="_blank" style={{ ...styles.viewLink, color: colors[i % colors.length] }}>
                      View Project →
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
  textarea: { width:'100%', padding:'11px 14px', borderRadius:'8px', border:'1.5px solid #e0e0e0', fontSize:'14px', boxSizing:'border-box', height:'80px', resize:'vertical' },
  formBtns: { display:'flex', gap:'12px', justifyContent:'flex-end' },
  cancelBtn: { padding:'10px 20px', background:'white', color:'#666', border:'1px solid #ddd', borderRadius:'8px', cursor:'pointer', fontSize:'14px' },
  saveBtn: { padding:'10px 24px', background:'linear-gradient(135deg, #1a73e8, #0d47a1)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:'bold' },
  empty: { textAlign:'center', padding:'80px 0' },
  emptyIcon: { fontSize:'48px', marginBottom:'16px' },
  emptyTitle: { fontSize:'20px', color:'#333', margin:'0 0 8px 0' },
  emptyText: { fontSize:'14px', color:'#888', margin:0 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'20px' },
  projectCard: { background:'white', borderRadius:'16px', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  cardTop: { padding:'20px', color:'white' },
  cardNum: { fontSize:'12px', opacity:0.8 },
  cardTitle: { fontSize:'18px', fontWeight:'bold', margin:'4px 0 0 0' },
  cardBody: { padding:'20px' },
  cardDesc: { fontSize:'14px', color:'#666', margin:'0 0 12px 0', lineHeight:'1.5' },
  techTags: { display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'12px' },
  techTag: { padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold', border:'1.5px solid', background:'white' },
  viewLink: { fontSize:'13px', fontWeight:'bold', textDecoration:'none' }
}

export default Projects