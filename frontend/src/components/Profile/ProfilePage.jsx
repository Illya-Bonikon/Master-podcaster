import React from 'react';
import styles from './ProfilePage.module.css';

const ProfilePage = ({ user }) => {

  if (!user){
		user = {
			name: 'Ілля',
			email: 'example@email.com',
			podcasts: 2,
		};
	}

  return (
    <div className={styles.profile}>
      <h2>Профіль</h2>
      
	  <div className={styles.info}><b>Ім'я:</b> {user.name}</div>
      <div className={styles.info}><b>Email:</b> {user.email}</div>
      <div className={styles.info}><b>Кількість подкастів:</b> {user.podcasts}</div>
      
	  <button className={styles.editBtn}>Редагувати</button>
    </div>
  );
};

export default ProfilePage; 