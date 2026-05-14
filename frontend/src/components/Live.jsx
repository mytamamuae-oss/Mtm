import React, { useEffect, useRef, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'

const APP_ID = import.meta.env.VITE_AGORA_APP_ID || ''
// For production you should NOT put a permanent token in the client. Use a token server.
const TOKEN = import.meta.env.VITE_AGORA_TOKEN || null
const CHANNEL = 'mtm-demo'

export default function Live(){
  const localRef = useRef(null)
  const [client] = useState(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }))
  const [joined, setJoined] = useState(false)
  const [remoteUsers, setRemoteUsers] = useState([])
  const localTracksRef = useRef({ audioTrack: null, videoTrack: null })

  useEffect(() => {
    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType)
      if (mediaType === 'video') {
        const id = `remote-player-${user.uid}`
        addRemote(user, id)
        user.videoTrack.play(id)
      }
      if (mediaType === 'audio') {
        user.audioTrack.play()
      }
    })

    client.on('user-unpublished', (user) => {
      removeRemote(user)
    })

    return () => {
      client.removeAllListeners()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addRemote(user, id){
    setRemoteUsers(prev => {
      if (prev.find(u => u.uid === user.uid)) return prev
      return [...prev, { uid: user.uid, id }]
    })
  }

  function removeRemote(user){
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
  }

  async function joinChannel(){
    if (!APP_ID) {
      alert('Set VITE_AGORA_APP_ID in .env or as env var')
      return
    }
    try{
      const uid = await client.join(APP_ID, CHANNEL, TOKEN || null)
      const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
      localTracksRef.current.audioTrack = microphoneTrack
      localTracksRef.current.videoTrack = cameraTrack
      cameraTrack.play(localRef.current)
      await client.publish([microphoneTrack, cameraTrack])
      setJoined(true)
    }catch(err){
      console.error('join error', err)
      alert('Failed to join: ' + (err.message || err))
    }
  }

  async function leaveChannel(){
    try{
      const { audioTrack, videoTrack } = localTracksRef.current
      if (audioTrack) {
        audioTrack.stop()
        audioTrack.close()
      }
      if (videoTrack) {
        videoTrack.stop()
        videoTrack.close()
      }
      await client.leave()
      setRemoteUsers([])
      setJoined(false)
    }catch(err){
      console.error('leave error', err)
    }
  }

  return (
    <div>
      <div style={{display: 'flex', gap: 12}}>
        <div>
          <h3>Local</h3>
          <div ref={localRef} id="local-player" style={{width: 320, height: 568, background: '#000'}}></div>
        </div>
        <div>
          <h3>Remote</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
            {remoteUsers.map(u => (
              <div key={u.uid} style={{width: 160, height: 284, background: '#111'}}>
                <div id={u.id} style={{width: '100%', height: '100%'}} />
                <div style={{color: '#fff', fontSize: 12}}>uid: {u.uid}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{marginTop: 12}}>
        {!joined ? (
          <button onClick={joinChannel}>Start / Join Live (Agora)</button>
        ) : (
          <button onClick={leaveChannel}>Leave</button>
        )}
      </div>

      <p style={{marginTop: 8, color: '#555', maxWidth: 700}}>
        Note: This demo uses Agora Web SDK and requires a valid APP ID. For production you must generate temporary tokens on the server side and enforce auth + channel access control.
      </p>
    </div>
  )
}
