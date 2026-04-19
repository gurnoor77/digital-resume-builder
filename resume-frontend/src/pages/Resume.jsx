import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const BASE_URL = "http://localhost:8080/resume-backend/api"

function Resume() {
  const [profile, setProfile] = useState({})
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [educations, setEducations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, s, pr, e] = await Promise.all([
          axios.get(`${BASE_URL}/profile?userId=${userId}`),
          axios.get(`${BASE_URL}/skills?userId=${userId}`),
          axios.get(`${BASE_URL}/projects?userId=${userId}`),
          axios.get(`${BASE_URL}/education?userId=${userId}`)
        ])
        setProfile(p.data)
        setSkills(s.data)
        setProjects(pr.data)
        setEducations(e.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const downloadPDF = async () => {
    const element = document.getElementById('resume-preview')
    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`${profile.name || 'resume'}_resume.pdf`)
  }

  if (loading) return <div style={styles.loading}>Loading resume...</div>

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>Resume Builder</h2>
        <div style={styles.navBtns}>
          <button style={styles.downloadBtn} onClick={downloadPDF}>⬇ Download PDF</button>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        </div>
      </div>

      <div style={styles.previewWrapper}>
        <div id="resume-preview" style={styles.resume}>

          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.name}>{profile.name || 'Your Name'}</h1>
            <p style={styles.contact}>
              {profile.email} {profile.phone && `| ${profile.phone}`} {profile.address && `| ${profile.address}`}
            </p>
            <p style={styles.links}>
              {profile.linkedin && <a href={profile.linkedin} style={styles.link}>LinkedIn</a>}
              {profile.github && <a href={profile.github} style={styles.link}> | GitHub</a>}
            </p>
          </div>

          {/* Education */}
          {educations.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>EDUCATION</h2>
              <div style={styles.divider}></div>
              {educations.map((e, i) => (
                <div key={i} style={styles.item}>
                  <div style={styles.itemHeader}>
                    <strong>{e.degree}</strong>
                    <span>{e.year_start} - {e.year_end}</span>
                  </div>
                  <p style={styles.itemSub}>{e.institution} {e.percentage && `| ${e.percentage}`}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>SKILLS</h2>
              <div style={styles.divider}></div>
              <div style={styles.skillsGrid}>
                {skills.map((s, i) => (
                  <span key={i} style={styles.skillTag}>{s.skill_name} ({s.level})</span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>PROJECTS</h2>
              <div style={styles.divider}></div>
              {projects.map((p, i) => (
                <div key={i} style={styles.item}>
                  <div style={styles.itemHeader}>
                    <strong>{p.title}</strong>
                    {p.link && <a href={p.link} style={styles.link}>Link</a>}
                  </div>
                  <p style={styles.itemSub}>{p.description}</p>
                  {p.tech_stack && <p style={styles.techText}>Tech: {p.tech_stack}</p>}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight:'100vh', background:'#f0f2f5' },
  navbar: { background:'#1a73e8', padding:'16px 32px', display:'flex', justifyContent:'space-between', alignItems:'center' },
  logo: { color:'white', margin:0 },
  navBtns: { display:'flex', gap:'12px' },
  downloadBtn: { background:'#34a853', color:'white', border:'none', padding:'8px 16px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' },
  backBtn: { background:'white', color:'#1a73e8', border:'none', padding:'8px 16px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' },
  previewWrapper: { padding:'40px', display:'flex', justifyContent:'center' },
  resume: { background:'white', width:'210mm', minHeight:'297mm', padding:'20mm', boxShadow:'0 4px 20px rgba(0,0,0,0.15)', fontFamily:'Arial, sans-serif' },
  header: { textAlign:'center', marginBottom:'20px', borderBottom:'2px solid #1a73e8', paddingBottom:'16px' },
  name: { fontSize:'28px', color:'#1a73e8', margin:'0 0 8px 0' },
  contact: { fontSize:'13px', color:'#555', margin:'4px 0' },
  links: { fontSize:'13px', margin:'4px 0' },
  link: { color:'#1a73e8', textDecoration:'none' },
  section: { marginBottom:'20px' },
  sectionTitle: { fontSize:'14px', fontWeight:'bold', color:'#1a73e8', margin:'0 0 4px 0', letterSpacing:'1px' },
  divider: { height:'2px', background:'#1a73e8', marginBottom:'10px' },
  item: { marginBottom:'12px' },
  itemHeader: { display:'flex', justifyContent:'space-between', fontSize:'14px' },
  itemSub: { fontSize:'13px', color:'#555', margin:'2px 0' },
  techText: { fontSize:'12px', color:'#888', margin:'2px 0' },
  skillsGrid: { display:'flex', flexWrap:'wrap', gap:'8px' },
  skillTag: { background:'#e8f0fe', color:'#1a73e8', padding:'4px 10px', borderRadius:'20px', fontSize:'12px' },
  loading: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', fontSize:'18px' }
}

export default Resume