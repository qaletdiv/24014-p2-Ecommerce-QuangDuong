'use client';

import { useEffect, useState } from 'react';
import './account.css';

export default function TaiKhoan() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // ✅ Kiểm tra đăng nhập
        const token = localStorage.getItem('auth_token');
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!token || !userData) {
            window.location.href = '/login?redirect=/account';
            return;
        }

        setUser(userData);

        // ✅ Lấy danh sách đơn hàng từ localStorage
        const allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const userOrders = allOrders.filter(o => o.email === userData.email);
        setOrders(userOrders);
    }, []);

    if (!user) return <div className="acc-wrap">Đang tải...</div>;

    return (
        <div className="acc-wrap">
            <h1>Tài khoản của tôi</h1>

            {/* Thông tin cá nhân */}
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
                                    <td>{o.date}</td>
                                    <td>{o.total.toLocaleString()}₫</td>
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
