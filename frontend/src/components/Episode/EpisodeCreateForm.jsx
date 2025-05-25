import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './EpisodeCreateForm.module.css';
import { createEpisode } from '../../api';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingOverlay from '../LoadingOverlay';

const EpisodeCreateForm = ({ podcastId: propPodcastId }) => {
  const { podcastId: paramPodcastId } = useParams();
  const podcastId = propPodcastId || paramPodcastId;
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = React.useState(false);

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const payload = { prompt: data.description };
      const res = await createEpisode(podcastId, payload, token);
      alert('Епізод створено!');
      navigate(`/podcast/${podcastId}`);
    } catch (e) {
      alert('Помилка створення епізоду: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay message="Генеруємо епізод. Це може зайняти до хвилини..." />}
      <form className={styles.form} onSubmit={handleSubmit(handleCreate)}>
			<h2 className={styles.title}>Створити епізод</h2>
			
			<div className={styles.field}>
				<label>Опис</label>
				<textarea {...register('description', { required: 'Введіть опис' })} />
				{errors.description && <span className={styles.error}>{errors.description.message}</span>}
			</div>


			<button className={styles.button} type="submit">Створити</button>
		</form>
    </>
  );	
};

export default EpisodeCreateForm; 