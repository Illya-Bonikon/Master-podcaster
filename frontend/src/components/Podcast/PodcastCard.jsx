import React, { useState, useEffect } from 'react';
import common from '../common.module.css';
import { FaPlus, FaPodcast, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getEpisodes, getImageUrl } from '../../api';

const PodcastCard = ({ podcast, showAdd = true, showDelete = true, onDelete, isModerator }) => {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [episodeCount, setEpisodeCount] = useState(podcast.episodes?.length || 0); // початкове значення
	const token = localStorage.getItem('token');
	const [imageUrl, setImageUrl] = useState("https://4479-91-235-225-85.ngrok-free.app/media/image/ac3235e21f894f6cbd75af4d5a9a9d3a.png");

	useEffect(() => {
		if (!podcast.episodes) {
			getEpisodes(podcast.id, token)
				.then(res => {
					setEpisodeCount(res.data.length);
				})
				.catch(err => {
					console.error('Помилка при завантаженні епізодів:', err);
				});
		}
	}, [podcast, token]);

	useEffect(() => {
		if (podcast?.imagePath) {
			getImageUrl(podcast.imagePath, token)
				.then(url => setImageUrl(url))
				.catch(() => setImageUrl(null));
		} else {
			setImageUrl(null);
		}
	}, [podcast?.imagePath, token]);

	const handleCancel = () => {
		setShowModal(false);
	};

	const handleDelete = () => {
		setShowModal(false);
		if (onDelete) onDelete(podcast.id);
	};

	return (
		<div
			className={common.card}
			style={{ display: 'flex', alignItems: 'center', cursor: isModerator ? 'default' : 'pointer' }}
			onClick={() => {
				if (!showModal && !isModerator) navigate(`/podcast/${podcast.id}`);
			}}
		>
			{podcast?.imagePath && imageUrl ? (
				<img
					src={imageUrl}
					alt={podcast.title}
					style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 10, marginRight: '1rem', boxShadow: '0 2px 8px #0002' }}
				/>
			) : (
				<img
					src={"https://4479-91-235-225-85.ngrok-free.app/media/image/ac3235e21f894f6cbd75af4d5a9a9d3a.png"}
					alt={podcast.title}
					style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 10, marginRight: '1rem', boxShadow: '0 2px 8px #0002' }}
				/>
			)}
			<div style={{ flex: 1 }}>
				<div className={common.title}>{podcast.title}</div>
				<div className={common.desc} style={{ fontSize: '0.95em', color: 'var(--text-color-lite)' }}>
					{podcast.prompt || 'Опис подкасту відсутній.'}
				</div>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
					{showAdd && !isModerator && (
						<button
							className={common.button}
							style={{ marginLeft: '8px', borderRadius: '50%' }}
							title="Додати епізод"
							onClick={e => {
								e.stopPropagation();
								navigate(`/podcast/${podcast.id}/episode/create`);
							}}
						>
							<FaPlus />
						</button>
					)}
					{showDelete && (
						<button
							className={`${common.button} ${common.deleteBtn}`}
							style={{ marginLeft: '8px', borderRadius: '50%' }}
							title="Видалити подкаст"
							onClick={e => {
								e.stopPropagation();
								setShowModal(true);
							}}
						>
							<FaTrash />
						</button>
					)}
				</div>
				<div style={{ fontSize: '0.85em', color: '#888' }}>
					Кількість епізодів: {episodeCount}
				</div>
			</div>

			{showModal && (
				<div className={common.modalOverlay} style={{ zIndex: 99999 }}>
					<div className={common.modalWindow}>
						<div>Ви дійсно хочете видалити подкаст?</div>
						<div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
							<button className={common.button} onClick={handleCancel}>
								Скасувати
							</button>
							<button className={common.button} style={{ background: '#d32f2f' }} onClick={handleDelete}>
								Видалити
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PodcastCard;
