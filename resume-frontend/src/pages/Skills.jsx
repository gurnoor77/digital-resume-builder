import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = "http://localhost:8080/resume-backend/api"

function Skills() {
  const [skills, setSkills] = useState([])
  const [skillName, setSkillName] = useState('')
  const [level, setLevel] = useState('Beginner')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    axios.get(`${BASE_URL}/skills?userId=${userId}`)
      .then(res => setSkills(res.data))
      .catch(err => console.log(err))
  }, [])

  const handleAdd = async () => {
    if (!skillName) return
    try {
      const res = await axios.post(`${BASE_URL}/skills`, { userId, skillName, level })
      if (res.data.success) {
        setSkills([...skills, { skill_name: skillName, level }])
        setSkillName('')
        setLevel('Beginner')
        setMessage('Skill added!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) { console.log(err) }
  }

  const levelConfig = {
    'Advanced': { color:'#1a73e8', bg:'#e8f0fe', bar: 100 },
    'Intermediate': { color:'#34a853', bg:'#e6f4ea', bar: 65 },
    'Beginner': { color:'#f9ab00', bg:'#fef9e7', bar: 33 }
  }

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
          <h2 style={styles.pageTitle}>My Skills</h2>
          <p style={styles.pageSub}>Showcase your technical expertise</p>
        </div>

        <div style={styles.grid}>
          {/* Add Skill Form */}
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Add New Skill</h3>
            {message && <div style={styles.successBox}>{message}</div>}
            <div style={styles.field}>
              <label style={styles.label}>Skill Name</label>
              <input style={styles.input} type="text" placeholder="e.g. Java, React, MySQL"
                value={skillName} onChange={e => setSkillName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAdd()} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Proficiency Level</label>
              <div style={styles.levelBtns}>
                {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                  <button key={l} style={{
                    ...styles.levelBtn,
                    background: level === l ? levelConfig[l].bg : 'white',
                    color: level === l ? levelConfig[l].color : '#888',
                    border: `2px solid ${level === l ? levelConfig[l].color : '#e0e0e0'}`
                  }} onClick={() => setLevel(l)}>{l}</button>
                ))}
              </div>
            </div>
            <button style={styles.addBtn} onClick={handleAdd}>+ Add Skill</button>

            <div style={styles.statsBox}>
              <div style={styles.stat}>
                <span style={styles.statNum}>{skills.length}</span>
                <span style={styles.statLabel}>Total Skills</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNum}>{skills.filter(s => s.level === 'Advanced').length}</span>
                <span style={styles.statLabel}>Advanced</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNum}>{skills.filter(s => s.level === 'Intermediate').length}</span>
                <span style={styles.statLabel}>Intermediate</span>
              </div>
            </div>
          </div>

          {/* Skills List */}
          <div style={styles.listCard}>
            <h3 style={styles.formTitle}>Your Skills ({skills.length})</h3>
            {skills.length === 0 && (
              <div style={styles.empty}>
                <p style={styles.emptyText}>No skills added yet.</p>
                <p style={styles.emptyHint}>Add your first skill to get started!</p>
              </div>
            )}
            <div style={styles.skillsList}>
              {skills.map((s, i) => {
                const cfg = levelConfig[s.level] || levelConfig['Beginner']
                return (
                  <div key={i} style={styles.skillItem}>
                    <div style={styles.skillTop}>
                      <span style={styles.skillName}>{s.skill_name}</span>
                      <span style={{ ...styles.skillBadge, background: cfg.bg, color: cfg.color }}>{s.level}</span>
                    </div>
                    <div style={styles.barBg}>
                      <div style={{ ...styles.barFill, width: `${cfg.bar}%`, background: cfg.color }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
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
  grid: { display:'grid', gridTemplateColumns:'340px 1fr', gap:'24px' },
  formCard: { background:'white', borderRadius:'16px', padding:'28px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  listCard: { background:'white', borderRadius:'16px', padding:'28px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  formTitle: { fontSize:'16px', fontWeight:'bold', color:'#333', margin:'0 0 20px 0' },
  successBox: { background:'#e8f5e9', color:'#2e7d32', padding:'8px 12px', borderRadius:'8px', fontSize:'13px', marginBottom:'16px' },
  field: { marginBottom:'16px' },
  label: { display:'block', fontSize:'13px', fontWeight:'bold', color:'#555', marginBottom:'8px' },
  input: { width:'100%', padding:'11px 14px', borderRadius:'8px', border:'1.5px solid #e0e0e0', fontSize:'14px', boxSizing:'border-box' },
  levelBtns: { display:'flex', gap:'8px' },
  levelBtn: { flex:1, padding:'8px', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'bold', transition:'all 0.2s' },
  addBtn: { width:'100%', padding:'12px', background:'linear-gradient(135deg, #1a73e8, #0d47a1)', color:'white', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:'bold', cursor:'pointer', marginTop:'8px' },
  statsBox: { display:'flex', gap:'12px', marginTop:'20px', padding:'16px', background:'#f8f9fa', borderRadius:'12px' },
  stat: { flex:1, textAlign:'center' },
  statNum: { display:'block', fontSize:'20px', fontWeight:'bold', color:'#1a73e8' },
  statLabel: { display:'block', fontSize:'11px', color:'#888', marginTop:'2px' },
  empty: { textAlign:'center', padding:'40px 0' },
  emptyText: { fontSize:'16px', color:'#888', margin:'0 0 8px 0' },
  emptyHint: { fontSize:'13px', color:'#bbb', margin:0 },
  skillsList: { display:'flex', flexDirection:'column', gap:'16px' },
  skillItem: { padding:'16px', background:'#f8f9fa', borderRadius:'12px' },
  skillTop: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' },
  skillName: { fontSize:'15px', fontWeight:'bold', color:'#333' },
  skillBadge: { padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold' },
  barBg: { height:'6px', background:'#e0e0e0', borderRadius:'3px' },
  barFill: { height:'6px', borderRadius:'3px', transition:'width 0.3s' }
}

export default Skills