'use client';

import { useEffect, useRef, useState } from 'react';
import './slideshow.css';

const slides = [
    { id: 1, img: '/banners/slider1.png' },
    { id: 2, img: '/banners/slider2.png' }
];

export default function HeroSlider() {
    const [i, setI] = useState(0);
    const timer = useRef(null);

    const next = () => setI((p) => (p + 1) % slides.length);
    const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);
    const go = (idx) => setI(idx);

    useEffect(() => {
        timer.current = setInterval(next, 2000); // auto 4s
        return () => clearInterval(timer.current);
    }, []);

    const pause = () => clearInterval(timer.current);
    const resume = () => {
        clearInterval(timer.current);
        timer.current = setInterval(next, 4000);
    };

    return (
        <div className="hero" onMouseEnter={pause} onMouseLeave={resume}>
            {slides.map((s, idx) => (
                <div
                    key={s.id}
                    className={`hero-slide ${idx === i ? 'is-active' : ''}`}
                    style={{ backgroundImage: `url(${s.img})` }}
                    aria-hidden={idx !== i}
                />
            ))}

            {/* arrows */}
            <button className="hero-arrow left" onClick={prev} aria-label="Prev">‹</button>
            <button className="hero-arrow right" onClick={next} aria-label="Next">›</button>
            <div className="hero-dots">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        className={`hero-dot ${idx === i ? 'on' : ''}`}
                        onClick={() => go(idx)}
                        aria-label={`Slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
