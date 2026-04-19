import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = "http://localhost:8080/resume-backend/api"

function Education() {
  const [educations, setEducations] = useState([])
  const [degree, setDegree] = useState('')
  const [institution, setInstitution] = useState('')
  const [yearStart, setYearStart] = useState('')
  const [yearEnd, setYearEnd] = useState('')
  const [percentage, setPercentage] = useState('')
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    axios.get(`${BASE_URL}/education?userId=${userId}`)
      .then(res => setEducations(res.data))
      .catch(err => console.log(err))
  }, [])

  const handleAdd = async () => {
    if (!degree || !institution) return
    try {
      const res = await axios.post(`${BASE_URL}/education`, {
        userId, degree, institution, yearStart, yearEnd, percentage
      })
      if (res.data.success) {
        setEducations([...educations, { degree, institution, year_start: yearStart, year_end: yearEnd, percentage }])
        setDegree('')
        setInstitution('')
        setYearStart('')
        setYearEnd('')
        setPercentage('')
        setMessage('Education added!')
        setShowForm(false)
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) { console.log(err) }
  }

  const colors = ['#1a73e8', '#34a853', '#9b59b6', '#e67e22']

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
            <h2 style={styles.pageTitle}>My Education</h2>
            <p style={styles.pageSub}>Add your academic qualifications</p>
          </div>
          <button style={styles.addNewBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Education'}
          </button>
        </div>

        {message && <div style={styles.successBox}>{message}</div>}

        {/* Add Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>New Education</h3>
            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>Degree / Course *</label>
                <input style={styles.input} type="text" placeholder="e.g. B.E. Computer Science"
                  value={degree} onChange={e => setDegree(e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Institution *</label>
                <input style={styles.input} type="text" placeholder="e.g. Chandigarh University"
                  value={institution} onChange={e => setInstitution(e.target.value)} />
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>Start Year</label>
                <input style={styles.input} type="number" placeholder="2023"
                  value={yearStart} onChange={e => setYearStart(e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>End Year</label>
                <input style={styles.input} type="number" placeholder="2027"
                  value={yearEnd} onChange={e => setYearEnd(e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Percentage / CGPA</label>
                <input style={styles.input} type="text" placeholder="e.g. 8.5"
                  value={percentage} onChange={e => setPercentage(e.target.value)} />
              </div>
            </div>
            <div style={styles.formBtns}>
              <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleAdd}>Save Education</button>
            </div>
          </div>
        )}

        {/* Timeline */}
        {educations.length === 0 && !showForm ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🎓</div>
            <h3 style={styles.emptyTitle}>No education added yet</h3>
            <p style={styles.emptyText}>Click "Add Education" to get started</p>
          </div>
        ) : (
          <div style={styles.timeline}>
            {educations.map((e, i) => (
              <div key={i} style={styles.timelineItem}>
                <div style={styles.timelineLine}>
                  <div style={{ ...styles.timelineDot, background: colors[i % colors.length] }}></div>
                  {i < educations.length - 1 && <div style={styles.timelineBar}></div>}
                </div>
                <div style={styles.timelineCard}>
                  <div style={{ ...styles.cardAccent, background: colors[i % colors.length] }}></div>
                  <div style={styles.cardContent}>
                    <div style={styles.cardHeader}>
                      <div>
                        <h3 style={styles.cardDegree}>{e.degree}</h3>
                        <p style={styles.cardInstitution}>{e.institution}</p>
                      </div>
                      <div style={styles.cardRight}>
                        <span style={{ ...styles.yearBadge, background: colors[i % colors.length] + '15', color: colors[i % colors.length] }}>
                          {e.year_start} — {e.year_end}
                        </span>
                        {e.percentage && (
                          <span style={styles.cgpaBadge}>CGPA: {e.percentage}</span>
                        )}
                      </div>
                    </div>
                  </div>
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
  content: { maxWidth:'800px', margin:'0 auto', padding:'32px' },
  pageHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' },
  pageTitle: { fontSize:'24px', fontWeight:'bold', color:'#333', margin:'0 0 4px 0' },
  pageSub: { fontSize:'14px', color:'#888', margin:0 },
  addNewBtn: { background:'linear-gradient(135deg, #1a73e8, #0d47a1)', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:'bold' },
  successBox: { background:'#e8f5e9', color:'#2e7d32', padding:'10px 14px', borderRadius:'8px', fontSize:'13px', marginBottom:'16px' },
  formCard: { background:'white', borderRadius:'16px', padding:'28px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', marginBottom:'24px' },
  formTitle: { fontSize:'16px', fontWeight:'bold', color:'#333', margin:'0 0 20px 0' },
  formRow: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'16px' },
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
  timeline: { display:'flex', flexDirection:'column', gap:'0' },
  timelineItem: { display:'flex', gap:'20px' },
  timelineLine: { display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'20px' },
  timelineDot: { width:'16px', height:'16px', borderRadius:'50%', flexShrink:0 },
  timelineBar: { width:'2px', background:'#e0e0e0', flex:1, margin:'8px 0' },
  timelineCard: { flex:1, background:'white', borderRadius:'16px', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', overflow:'hidden', display:'flex' },
  cardAccent: { width:'4px', flexShrink:0 },
  cardContent: { padding:'20px', flex:1 },
  cardHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start' },
  cardDegree: { fontSize:'17px', fontWeight:'bold', color:'#333', margin:'0 0 4px 0' },
  cardInstitution: { fontSize:'14px', color:'#666', margin:0 },
  cardRight: { display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px' },
  yearBadge: { padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold' },
  cgpaBadge: { background:'#f8f9fa', color:'#555', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold' }
}

export default Education