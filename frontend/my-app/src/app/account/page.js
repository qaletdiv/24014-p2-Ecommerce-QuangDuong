'use client';

import { useEffect, useState } from 'react';
import './account.css';

export default function TaiKhoan() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const userJson = localStorage.getItem('user');
        if (!token || !userJson) {
            window.location.href = '/login?redirect=/account';
            return;
        }

        const userData = JSON.parse(userJson);
        setUser(userData);
        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/orders/my', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    console.error('Fetch orders failed', await res.text());
                    setOrders([]);
                    return;
                }

                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error('Fetch orders error', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (!user || loading) return <div className="acc-wrap">Đang tải...</div>;

    return (
        <div className="acc-wrap">
            <h1>Tài khoản của tôi</h1>
            <div className="acc-box">
                <h2>Thông tin cá nhân</h2>
                <p><b>Họ và tên:</b> {user.name}</p>
                <p><b>Email:</b> {user.email}</p>
            </div>

            {/* Lịch sử đơn hàng */}
            <div className="acc-box">
                <h2>Lịch sử đặt hàng</h2>

                {orders.length === 0 ? (
                    <p>Bạn chưa có đơn hàng nào.</p>
                ) : (
                    <table className="acc-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id}>
                                    <td>{o.id}</td>
                                    <td>
                                        {o.createdAt
                                            ? new Date(o.createdAt).toLocaleString('vi-VN')
                                            : ''}
                                    </td>
                                    <td>{o.totalPrice?.toLocaleString('vi-VN') || 0}₫</td>
                                    <td>
                                        <span className={`status ${o.status || 'pending'}`}>
                                            {o.status === 'done' ? 'Hoàn tất' : 'Đang xử lý'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
