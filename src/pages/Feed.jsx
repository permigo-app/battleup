import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

function timeAgo(dt) {
  const diff = Math.floor((Date.now() - new Date(dt)) / 1000)
  if (diff < 60) return 'À l\'instant'
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`
  return `il y a ${Math.floor(diff / 86400)}j`
}

export default function Feed({ user }) {
  if (!user) return null
  const [photos, setPhotos] = useState([])
  const [likes, setLikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState('')
  const fileRef = useRef()

  useEffect(() => { loadAll() }, [user.group_id])

  async function loadAll() {
    try {
      const { data: photosData, error: photoErr } = await supabase
        .from('photos')
        .select('*, users(pseudo)')
        .eq('group_id', user.group_id)
        .order('created_at', { ascending: false })

      if (photoErr) { console.warn('photos table:', photoErr.message); setLoading(false); return }

      const ids = (photosData || []).map(p => p.id)
      let likesData = []
      if (ids.length > 0) {
        const { data } = await supabase.from('photo_likes').select('*').in('photo_id', ids)
        likesData = data || []
      }

      setPhotos(photosData || [])
      setLikes(likesData)
    } catch (e) {
      console.error('loadAll error:', e)
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function cancelUpload() {
    setFile(null)
    setPreview(null)
    setCaption('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)

    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${user.group_id}/${user.id}-${Date.now()}.${ext}`

    const { error: uploadErr } = await supabase.storage.from('photos').upload(path, file, { cacheControl: '3600', upsert: false })
    if (uploadErr) { setUploading(false); alert('Erreur upload: ' + uploadErr.message); return }

    const { data: urlData } = supabase.storage.from('photos').getPublicUrl(path)

    await supabase.from('photos').insert({
      user_id: user.id,
      group_id: user.group_id,
      url: urlData.publicUrl,
      caption: caption.trim() || null,
    })

    cancelUpload()
    setUploading(false)
    loadAll()
  }

  async function toggleLike(photoId) {
    const myLike = likes.find(l => l.photo_id === photoId && l.user_id === user.id)
    if (myLike) {
      await supabase.from('photo_likes').delete().eq('id', myLike.id)
      setLikes(prev => prev.filter(l => l.id !== myLike.id))
    } else {
      const { data } = await supabase.from('photo_likes').insert({ photo_id: photoId, user_id: user.id }).select().single()
      if (data) setLikes(prev => [...prev, data])
    }
  }

  const likeCount = (photoId) => likes.filter(l => l.photo_id === photoId).length
  const hasLiked = (photoId) => likes.some(l => l.photo_id === photoId && l.user_id === user.id)

  return (
    <div style={{ padding: '1.25rem' }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', marginBottom: '1.25rem' }}>
        📸 Feed
      </h2>

      {/* Upload zone */}
      {preview ? (
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 16, overflow: 'hidden', marginBottom: '1.25rem' }}>
          <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover', display: 'block' }} />
          <div style={{ padding: '12px' }}>
            <input
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Ajoute une légende... (optionnel)"
              maxLength={120}
              style={{ width: '100%', background: '#222', border: '1px solid #2f2f2f', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 10 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={cancelUpload} style={{ flex: 1, background: '#222', color: '#888', border: 'none', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Annuler
              </button>
              <button onClick={handleUpload} disabled={uploading} style={{ flex: 2, background: '#E8192C', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: uploading ? 0.6 : 1, fontFamily: 'inherit' }}>
                {uploading ? 'Envoi...' : '📤 Partager'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#1a1a1a', border: '1.5px dashed #2a2a2a', borderRadius: 14, padding: '16px', cursor: 'pointer', marginBottom: '1.25rem' }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          <span style={{ fontSize: 20 }}>📸</span>
          <span style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>Partager une photo</span>
        </label>
      )}

      {/* Feed */}
      {loading ? (
        <p style={{ color: '#444', textAlign: 'center', paddingTop: '2rem', fontSize: 13 }}>Chargement...</p>
      ) : photos.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <p style={{ fontSize: 36, marginBottom: 10 }}>📷</p>
          <p style={{ color: '#555', fontSize: 14 }}>Aucune photo pour l'instant.</p>
          <p style={{ color: '#444', fontSize: 12, marginTop: 4 }}>Sois le premier à partager !</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {photos.map(photo => (
            <div key={photo.id} style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 16, overflow: 'hidden' }}>
              <img src={photo.url} alt="" loading="lazy" style={{ width: '100%', display: 'block', maxHeight: 360, objectFit: 'cover' }} />
              <div style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: photo.caption ? 6 : 0 }}>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{photo.users?.pseudo || 'Inconnu'}</span>
                    <span style={{ color: '#555', fontSize: 11, marginLeft: 8 }}>{timeAgo(photo.created_at)}</span>
                  </div>
                  <button
                    onClick={() => toggleLike(photo.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, background: hasLiked(photo.id) ? 'rgba(232,25,44,0.15)' : '#222', border: hasLiked(photo.id) ? '1px solid rgba(232,25,44,0.4)' : '1px solid #2a2a2a', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <span style={{ fontSize: 14 }}>🔥</span>
                    <span style={{ color: hasLiked(photo.id) ? '#E8192C' : '#888', fontSize: 12, fontWeight: 700 }}>{likeCount(photo.id)}</span>
                  </button>
                </div>
                {photo.caption && <p style={{ color: '#888', fontSize: 12, lineHeight: 1.4 }}>{photo.caption}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
