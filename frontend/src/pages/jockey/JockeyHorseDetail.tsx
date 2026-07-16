import React from 'react';
import { useParams } from 'react-router-dom';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import { Footer } from '../../components/common/Footer.tsx';
import './JockeyHorseLeaderboard.css';

export default function JockeyHorseDetail() { const { name = '' } = useParams(); return <div className="jockey-horse-board"><JockeyHeader /><main><section className="jockey-horse-board__hero"><span>Horse Registry</span><h1>{decodeURIComponent(name)}</h1><p>Horse profile and performance data will be loaded from the API.</p></section><section className="jockey-horse-board__content"><div className="jockey-horse-board__empty">Horse details are not available.</div></section></main><Footer /></div>; }
