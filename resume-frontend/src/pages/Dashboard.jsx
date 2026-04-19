import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const cards = [
  { icon: '👤', title: 'My Profile', desc: 'Update personal information', path: '/profile', color: '#4F81BD' },
  { icon: '📄', title: 'My Resume', desc: 'View and download resume', path: '/resume', color: '#34a853' },
  { icon: '🛠️', title: 'Skills', desc: 'Add technical skills', path: '/skills', color: '#9b59b6' },
  { icon: '💼', title: 'Projects', desc: 'Showcase your projects', path: '/projects', color: '#e67e22' },
  { icon: '🎓', title: 'Education', desc: 'Add education details', path: '/education', color: '#1a73e8' },
  { icon: '🏢', title: 'Experience', desc: 'Add work experience', path: '/experience', color: '#00acc1' },
  { icon: '🏆', title: 'Certifications', desc: 'Add certificates', path: '/certifications', color: '#e53935' },
  { icon: '🔗', title: 'Share Profile', desc: 'Copy your profile link', path: null, color: '#795548' },
]

  const handleCard = (card) => {
    if (card.path) {
      navigate(card.path)
    } else {
      const link = `${window.location.origin}/resume`
      navigator.clipboard.writeText(link)
      alert('Profile link copied to clipboard!')
    }
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={styles.navTitle}>Resume Builder</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navUser}> Welcome back!</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Build Your Professional Resume</h1>
          <p style={styles.heroSub}>Create, manage and share your resume with recruiters in minutes</p>
          <button style={styles.heroBtn} onClick={() => navigate('/resume')}>
            View My Resume →
          </button>
        </div>
        <div style={styles.heroStats}>
          <div style={styles.statCard}>
            <span style={styles.statNum}>5+</span>
            <span style={styles.statLabel}>Sections</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNum}>1-Click</span>
            <span style={styles.statLabel}>PDF Export</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNum}>Free</span>
            <span style={styles.statLabel}>Forever</span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.grid}>
          {cards.map((card, i) => (
            <div key={i} style={styles.card} onClick={() => handleCard(card)}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ ...styles.cardIcon, background: card.color }}>
                {card.icon}
              </div>
              <div style={styles.cardText}>
                <h3 style={styles.cardTitle}>{card.title}</h3>
                <p style={styles.cardDesc}>{card.desc}</p>
              </div>
              <span style={styles.cardArrow}>›</span>
            </div>
          ))}
        </div>
      </div>

      {role === 'admin' && (
        <div style={styles.section}>
          <button style={styles.adminBtn} onClick={() => navigate('/admin')}>
            🔧 Admin Panel
          </button>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <p>Digital Resume Builder — Chandigarh University | CSE Batch 2023-2027</p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight:'100vh', background:'#f8f9fa', fontFamily:'Arial, sans-serif' },
  navbar: { background:'white', padding:'0 32px', height:'64px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.1)', position:'sticky', top:0, zIndex:100 },
  navLeft: { display:'flex', alignItems:'center', gap:'12px' },
  navLogo: { width:'36px', height:'36px', background:'#1a73e8', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', fontSize:'14px' },
  navTitle: { fontSize:'18px', fontWeight:'bold', color:'#333' },
  navRight: { display:'flex', alignItems:'center', gap:'16px' },
  navUser: { fontSize:'14px', color:'#666' },
  logoutBtn: { background:'transparent', color:'#e53935', border:'1px solid #e53935', padding:'6px 16px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', fontSize:'13px' },
  hero: { background:'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)', padding:'48px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'24px' },
  heroContent: { flex:1, minWidth:'280px' },
  heroTitle: { color:'white', fontSize:'28px', fontWeight:'bold', margin:'0 0 12px 0' },
  heroSub: { color:'rgba(255,255,255,0.85)', fontSize:'16px', margin:'0 0 24px 0' },
  heroBtn: { background:'white', color:'#1a73e8', border:'none', padding:'12px 24px', borderRadius:'8px', fontSize:'15px', fontWeight:'bold', cursor:'pointer' },
  heroStats: { display:'flex', gap:'16px', flexWrap:'wrap' },
  statCard: { background:'rgba(255,255,255,0.15)', padding:'16px 24px', borderRadius:'12px', textAlign:'center', minWidth:'80px' },
  statNum: { display:'block', color:'white', fontSize:'20px', fontWeight:'bold' },
  statLabel: { display:'block', color:'rgba(255,255,255,0.8)', fontSize:'12px', marginTop:'4px' },
  section: { padding:'32px', maxWidth:'1100px', margin:'0 auto' },
  sectionTitle: { fontSize:'18px', fontWeight:'bold', color:'#333', marginBottom:'20px' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px' },
  card: { background:'white', borderRadius:'12px', padding:'20px', display:'flex', alignItems:'center', gap:'16px', cursor:'pointer', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', transition:'transform 0.2s, box-shadow 0.2s', border:'1px solid #f0f0f0' },
  cardIcon: { width:'48px', height:'48px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 },
  cardText: { flex:1 },
  cardTitle: { fontSize:'15px', fontWeight:'bold', color:'#333', margin:'0 0 4px 0' },
  cardDesc: { fontSize:'13px', color:'#888', margin:0 },
  cardArrow: { fontSize:'20px', color:'#ccc', fontWeight:'bold' },
  adminBtn: { background:'#e53935', color:'white', border:'none', padding:'12px 24px', borderRadius:'8px', cursor:'pointer', fontSize:'15px', fontWeight:'bold' },
  footer: { textAlign:'center', padding:'24px', color:'#999', fontSize:'13px', borderTop:'1px solid #eee', marginTop:'32px' }
}

export default Dashboard