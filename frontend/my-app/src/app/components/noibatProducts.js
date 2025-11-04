'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './noibatProducts.css';

export default function FeaturedProducts() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const run = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/products?featured=1');
                const data = await res.json();
                setItems(data);
            } catch (e) {
                console.error('Load products failed', e);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    const addToCart = (p) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (!token) {
            router.push('/login?redirect=/');
            return;
        }
        alert(`Đã thêm "${p.name}" vào giỏ (mock)`);
    };

    if (loading) return <div className="fp-wrap">Đang tải sản phẩm nổi bật...</div>;

    return (
        <div className="fp-wrap">
            <h2 className="fp-title">Sản phẩm nổi bật</h2>
            <div className="fp-grid">
                {items.map(p => (
                    <div key={p.id} className="fp-card">
                        <div className="fp-imgbox">
                            <img src={p.image} alt={p.name} />
                        </div>
                        <div className="fp-info">
                            <div className="fp-name">{p.name}</div>
                            <div className="fp-price">
                                {p.price.toLocaleString('vi-VN')}₫
                            </div>
                        </div>
                        <button className="fp-btn" onClick={() => addToCart(p)}>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
