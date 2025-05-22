import React, { useState, useEffect, useRef } from 'react';
import styles from './BackgroundWaves.module.css';

const NUM_BARS = 40;

const BackgroundWaves = () => {
	const [bars, setBars] = useState(Array(NUM_BARS).fill(0));
	const targetHeightsRef = useRef(Array(NUM_BARS).fill(0));
	const animationFrameRef = useRef();

	
	const lerp = (start, end, amt) => start + (end - start) * amt;

	
	useEffect(() => {
		const maxHeight = window.innerHeight * 0.3;
		const minHeight = window.innerHeight * 0.15;

		const animate = () => {
		
			for (let i = 0; i < NUM_BARS; i++) 
				if (Math.random() < 0.02) 
					targetHeightsRef.current[i] = minHeight + Math.random() * (maxHeight - minHeight);		

			setBars((prevBars) =>
				prevBars.map((height, i) =>
				lerp(height, targetHeightsRef.current[i], 0.0) 
				)
			);

			animationFrameRef.current = requestAnimationFrame(animate);
		};
		animate();
		return () => cancelAnimationFrame(animationFrameRef.current);
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.visualizer}>
				{bars.map((totalHeight, i) => {
				const halfHeight = totalHeight / 2;
				return (
					<div key={i} className={styles.barWrapper}>
						<div className={styles.barTop} style={{ height: `${halfHeight}px` }} />
						<div className={styles.barBottom} style={{ height: `${halfHeight}px` }} />
					</div>
				);
				})}
			</div>
		</div>
	);
};

export default BackgroundWaves;
