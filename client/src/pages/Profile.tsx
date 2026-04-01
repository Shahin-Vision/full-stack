import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { RootState, AppDispatch } from '../store'
import { updateProfile, logout } from '../store/slices/authSlice'

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>()
  const nav = useNavigate()
  const { user } = useSelector((s: RootState) => s.auth)
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name:  user?.last_name  || '',
    phone:      user?.phone      || '',
    address:    user?.address    || '',
  })

  const up = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [k]: e.target.value })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(updateProfile(form))
    toast.success('Profile updated!')
  }

  const signOut = () => { dispatch(logout()); nav('/') }

  return (
    <div className="profile-page">
      <h1 className="profile-title">MY PROFILE</h1>

      <div className="profile-card">
        {/* Avatar row */}
        <div style={{ display:'flex', alignItems:'center', gap:16,
                      marginBottom:28, paddingBottom:24,
                      borderBottom:'1px solid var(--gray-200)' }}>
          <div style={{ width:64, height:64, borderRadius:'50%',
                        background:'var(--black)', display:'flex',
                        alignItems:'center', justifyContent:'center',
                        color:'var(--white)', fontSize:24, fontWeight:700,
                        flexShrink:0 }}>
            {(user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:18 }}>
              {user?.first_name} {user?.last_name}
            </div>
            <div style={{ color:'var(--gray-600)', fontSize:14 }}>
              {user?.email}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={save}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div className="profile-field">
              <label>First Name</label>
              <input value={form.first_name} onChange={up('first_name')} />
            </div>
            <div className="profile-field">
              <label>Last Name</label>
              <input value={form.last_name} onChange={up('last_name')} />
            </div>
          </div>

          <div className="profile-field">
            <label>Phone</label>
            <input value={form.phone} onChange={up('phone')}
                   placeholder="+91 000 000 0000" />
          </div>

          <div className="profile-field">
            <label>Address</label>
            <input value={form.address} onChange={up('address')}
                   placeholder="Your delivery address" />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:8 }}>
            <button className="profile-save" type="submit">Save Changes</button>
            <Link to="/orders"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center',
                           padding:'15px', border:'1px solid var(--gray-200)',
                           borderRadius:62, fontSize:15, fontWeight:600,
                           color:'var(--black)', transition:'all .2s' }}>
              My Orders
            </Link>
          </div>
        </form>

        <button className="profile-signout" onClick={signOut}>Sign Out</button>
      </div>
    </div>
  )
}