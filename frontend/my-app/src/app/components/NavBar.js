'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingBag, FiUser, FiUserCheck, FiSearch, FiLogOut } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import './NavBar.css';

export default function NavBar() {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [q, setQ] = useState('');
    const [user, setUser] = useState(null);


    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);


    const goCart = (e) => {
        e.preventDefault();
        if (!user) {
            router.push('/login?redirect=/cart');
        } else {
            router.push('/cart');
        }
    };

    // seacrh
    const onSearch = (e) => {
        e.preventDefault();
        const keyword = q.trim();
        if (!keyword) return;
        router.push(`/products?search=${encodeURIComponent(keyword)}`);
        setShowMenu(false);
    };

    //  Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');

        setUser(null);
        setShowMenu(false);
        router.push('/login');
    };

    return (
        <nav className="nav">
            <div className="nav-left">
                <Link href="/">Trang chủ</Link>
                <Link href="/san-pham">Sản phẩm</Link>
                <Link href="/contact">Liên hệ</Link>
            </div>

            <form className="search" onSubmit={onSearch}>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Tìm sản phẩm..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    aria-label="Tìm kiếm"
                />
                <button className="search-btn" type="submit" aria-label="Tìm kiếm">
                    <FiSearch size={18} />
                </button>
            </form>

            <div className="nav-right">
                <button className="nav-cart-btn" onClick={goCart} aria-label="Giỏ hàng">
                    <FiShoppingBag className="cart-icon" size={20} />
                </button>

                <div className="user-wrapper">
                    <button
                        className="user-btn"
                        onClick={() => setShowMenu(!showMenu)}
                        aria-haspopup="menu"
                        aria-expanded={showMenu}
                        aria-label="Tài khoản"
                    >

                        {user ? <FiUserCheck size={18} /> : <FiUser size={18} />}
                    </button>

                    {showMenu && (
                        <div className="taikhoan" role="menu">
                            {user ? (
                                <>
                                    <span className="username">Xin chào, {user.name || 'User'}</span>
                                    <button
                                        className="logout-btn"
                                        onClick={handleLogout}
                                        aria-label="Đăng xuất"
                                    >
                                        <FiLogOut size={16} /> Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">Đăng nhập</Link>
                                    <Link href="/register">Đăng ký</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
