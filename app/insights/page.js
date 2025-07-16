'use client';
import styles from './styles.module.css';

export default function InsightsPage() {
  // Placeholder data - will replace with Firebase data later
  const sessions = [
    { id: 1, date: '2023-11-15', focusTime: '25:00', awayTime: '02:30', breaks: 3 },
    { id: 2, date: '2023-11-14', focusTime: '50:00', awayTime: '05:12', breaks: 5 },
    { id: 3, date: '2023-11-13', focusTime: '75:00', awayTime: '08:45', breaks: 7 }
  ];

  return (
    <div className={styles.container}>
      <h1>Your Focus Insights</h1>
      
      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <h3>Total Sessions</h3>
          <p>{sessions.length}</p>
        </div>
        
        <div className={styles.card}>
          <h3>Average Away Time</h3>
          <p>03:42</p>
        </div>
        
        <div className={styles.card}>
          <h3>Total Breaks</h3>
          <p>15</p>
        </div>
      </div>

      <div className={styles.sessionList}>
        <h2>Session History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Focus Time</th>
              <th>Away Time</th>
              <th>Breaks</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <tr key={session.id}>
                <td>{session.date}</td>
                <td>{session.focusTime}</td>
                <td>{session.awayTime}</td>
                <td>{session.breaks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}