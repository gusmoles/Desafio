export default function ParabensPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      animation: 'flash 0.5s alternate infinite',
    }}>
      <h1 style={{
        color: '#fff',
        fontSize: '3rem',
        fontWeight: 'bold',
        textAlign: 'center',
        textShadow: '0 0 20px #fff, 0 0 40px #0ff',
        animation: 'flashText 0.5s alternate infinite',
      }}>
        PARABÉNS VOCÊ ACESSOU
      </h1>
      <style>{`
        @keyframes flash {
          from { background: #000; }
          to { background: #0ff; }
        }
        @keyframes flashText {
          from { color: #fff; text-shadow: 0 0 20px #fff, 0 0 40px #0ff; }
          to { color: #0ff; text-shadow: 0 0 40px #fff, 0 0 80px #fff; }
        }
      `}</style>
    </div>
  );
} 