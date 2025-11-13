'use client';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import './product-detail.css';

export default function ChiTietSanPham() {
    const { slug } = useParams();

    const [sp, setSp] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeIdx, setActiveIdx] = useState(0);
    const [color, setColor] = useState('');
    const [size, setSize] = useState('M');
    const [soLuong, setSoLuong] = useState(1);

    const [danhSach, setDanhSach] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:4000/api/products');
            const data = await res.json();
            setDanhSach(data);

            const found = data.find(item => {
                const s = item.name
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase().replace(/ /g, '-');
                return s === slug;
            });
            setSp(found ?? null);
            setColor('#1b1b3a');
            setSize('M');
            setLoading(false);
        };
        fetchData();
    }, [slug]);

    const gallery = useMemo(() => {
        if (!sp) return [];
        return sp.images?.length ? sp.images : [sp.image];
    }, [sp]);

    const sanPhamLienQuan = useMemo(() => {
        return danhSach
            .filter(item => item.category === sp?.category && item.id !== sp?.id)
            .slice(0, 4);
    }, [danhSach, sp]);

    const addToCart = () => {
        const token = typeof window !== 'undefined'
            ? localStorage.getItem('auth_token')
            : null;

        if (!token) {
            window.location.href = `/login?redirect=/san-pham/${slug}`;
            return;
        }

        if (!size || !color) {
            alert('Vui lòng chọn màu và kích cỡ.');
            return;
        }

        // Lấy giỏ hàng cũ
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Xem sản phẩm này đã có trong giỏ chưa
        const existingIndex = cart.findIndex(
            item => item.id === sp.id && item.size === size && item.color === color
        );

        if (existingIndex !== -1) {
            cart[existingIndex].qty += soLuong;
        } else {
            cart.push({
                id: sp.id,
                name: sp.name,
                price: sp.price,
                image: sp.image || (sp.images?.[0] ?? ''),
                size,
                color,
                qty: soLuong
            });
        }

        // Lưu vào localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        alert(` Đã thêm vào giỏ: ${sp.name}`);
    };


    if (loading) return <div className="pd-wrap">Đang tải...</div>;
    if (!sp) return <div className="pd-wrap">Không tìm thấy sản phẩm.</div>;

    return (
        <>
            <div className="pd-wrap">
                <div className="pd-hero">
                    <Image src={gallery[activeIdx]} alt={sp.name} width={800} height={800} />
                </div>
                <div className="pd-thumbs">
                    {gallery.map((src, i) => (
                        <button key={i}
                            className={`pd-thumb ${activeIdx === i ? 'on' : ''}`}
                            onClick={() => setActiveIdx(i)}
                        >
                            <img src={src} alt={sp.name + ' ' + (i + 1)} />
                        </button>
                    ))}
                </div>

                {/* Thông tin sản phẩm */}
                <div className="pd-info">
                    <h1 className="pd-name">{sp.name}</h1>
                    <div className="pd-meta">Mã SP: <b>{sp.sku}</b></div>
                    <div className="pd-price">{sp.price.toLocaleString('vi-VN')}₫</div>

                    <div className="pd-section">
                        <div className="pd-label">Màu sắc:</div>
                        <div className="pd-swatches">
                            {['#1b1b3a', '#000000', '#8a1538', '#0b6e4f'].map(c => (
                                <button key={c}
                                    className={`pd-swatch ${color === c ? 'active' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pd-section">
                        <div className="pd-label">
                            Kích cỡ:
                            <a href="#" className="pd-size-guide" onClick={e => e.preventDefault()}>
                                Hướng dẫn chọn size
                            </a>
                        </div>
                        <div className="pd-sizes">
                            {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                                <button key={s}
                                    className={`pd-size ${size === s ? 'active' : ''}`}
                                    onClick={() => setSize(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pd-section">
                        <div className="pd-label">Số lượng:</div>
                        <div className="pd-qty">
                            <button className="pd-qty-btn" onClick={() => setSoLuong(p => Math.max(1, p - 1))}>-</button>
                            <input type="number" min="1" value={soLuong}
                                onChange={e => setSoLuong(Math.max(1, Number(e.target.value)))} />
                            <button className="pd-qty-btn" onClick={() => setSoLuong(p => p + 1)}>+</button>
                        </div>
                    </div>

                    <button className="pd-add" onClick={addToCart}>Thêm vào giỏ hàng</button>

                    <div className="pd-desc-block">
                        <div className="pd-desc-title">MÔ TẢ</div>
                        <p>{sp.description}</p>
                    </div>
                </div>
            </div>

            {/* ============ SẢN PHẨM LIÊN QUAN ============ */}
            <div className="pd-related">
                <h2 className="pd-related-title">CÓ THỂ BẠN THÍCH</h2>
                <div className="pd-related-grid">
                    {sanPhamLienQuan.map(item => {
                        const itemSlug = item.name
                            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                            .toLowerCase().replace(/ /g, '-');
                        return (
                            <a key={item.id} href={`/san-pham/${itemSlug}`} className="pd-related-card">
                                <div className="pd-related-imgbox">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="pd-related-info">
                                    <div className="name">{item.name}</div>
                                    <div className="price">{item.price.toLocaleString('vi-VN')}₫</div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
