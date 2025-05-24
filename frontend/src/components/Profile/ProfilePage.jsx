import React, { useState, useContext } from 'react';
import styles from './ProfilePage.module.css';
import common from '../common.module.css';
import { UserContext } from '../UserContext.jsx';

const ProfilePage = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: user?.name || 'Ілля', email: user?.email || 'example@email.com', password: '' });
  const [loading, setLoading] = useState(false);

  if (!user){
		user = {
			name: 'Ілля',
			email: 'example@email.com',
			podcasts: 2,
		};
	}

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    if (!form.name.trim()) {
      alert('Введіть нікнейм'); setLoading(false); return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      alert('Введіть коректний email'); setLoading(false); return;
    }
    if (form.password && form.password.length < 6) {
      alert('Пароль має містити мінімум 6 символів'); setLoading(false); return;
    }
    setEditMode(false);
    setLoading(false);
    alert('Профіль оновлено (мок)');
  };

  if (editMode) {
    return (
      <div className={common.profile}>
        <h2>Профіль</h2>
        <div className={styles.info}><b>Нікнейм:</b> <input name="name"  onChange={handleChange} placeholder={user.name} /></div>
        <div className={styles.info}><b>Email:</b> <input name="email"  onChange={handleChange} placeholder={user.email} /></div>
        <div className={styles.info}><b>Пароль:</b> <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Новий пароль" /></div>
        <div className={styles.editBtns}>
          <button className={common.button} onClick={() => setEditMode(false)} disabled={loading}>Скасувати</button>
          <button className={common.button} onClick={handleSave} disabled={loading}>Підтвердити</button>
        </div>
      </div>
    );
  }

  return (
    <div className={common.profile}>
      <h2>Профіль</h2>
      
	  <div className={styles.info}><b>Нікнейм:</b> {user.name}</div>
      <div className={styles.info}><b>Email:</b> {user.email}</div>
      <div className={styles.info}><b>Кількість подкастів:</b> {user.podcasts}</div>
      
	  <button className={common.editBtn} onClick={() => setEditMode(true)}>Редагувати</button>
    </div>
  );
};

export default ProfilePage; 