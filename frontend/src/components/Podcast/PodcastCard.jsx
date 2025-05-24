import React, { useState } from 'react';
import common from '../common.module.css';
import { FaPlus, FaPodcast, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PodcastCard = ({ podcast, showAdd = true, showDelete = true, onDelete, isModerator }) => {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);

	const lastEpisode = podcast.episodes && podcast.episodes.length > 0
		? podcast.episodes[podcast.episodes.length - 1].title
		: 'Немає епізодів';

	const handleCancel = () => {
		setShowModal(false);
	};

	const handleDelete = () => {
		setShowModal(false);
		if (onDelete)
			onDelete(podcast.id);
	};

	return (
		<div
			className={common.card}
			style={{ display: 'flex', alignItems: 'center', cursor: isModerator ? 'default' : 'pointer' }}
			onClick={() => {if (!showModal && !isModerator)  navigate(`/podcast/${podcast.id}`);}} >
			<FaPodcast style={{ fontSize: '2rem', marginRight: '1rem', flexShrink: 0 }} />
			<div style={{ flex: 1 }}>
				<div className={common.title}>{podcast.title}</div>
				<div className={common.desc} style={{ fontSize: '0.95em', color: '#888' }}>
					Останній епізод: {lastEpisode}
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
					Кількість епізодів: {podcast.episodes ? podcast.episodes.length : 0}
				</div>
			</div>

			{showModal && (
				<div className={common.modalOverlay} style={{zIndex: 99999}}>
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


