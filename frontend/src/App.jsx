import React from 'react'
import Live from './components/Live'

export default function App(){
  return (
    <div style={{fontFamily: 'system-ui, sans-serif', padding: 20}}>
      <h1>Mtm — React Frontend (Agora Live)</h1>
      <p>Welcome. Click the button below to start/join a small demo live session.</p>
      <Live />
    </div>
  )
}
