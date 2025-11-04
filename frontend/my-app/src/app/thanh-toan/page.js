'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./thanh-toan.css";

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            router.push("/login?redirect=/thanh-toan");
            return;
        }

        const cartData = JSON.parse(localStorage.getItem("cart")) || [];
        if (cartData.length === 0) {
            router.push("/gio-hang");
            return;
        }

        setCart(cartData);
        setLoading(false);
    }, []);

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handleConfirm = () => {
        if (!name || !phone || !address) {
            setError("Vui lòng nhập đầy đủ thông tin giao hàng.");
            return;
        }

        // Lấy đơn hàng cũ
        const orders = JSON.parse(localStorage.getItem("orders")) || [];

        // Tạo đơn hàng mới
        const newOrder = {
            id: Date.now(),
            items: cart,
            name,
            phone,
            address,
            total,
            createdAt: new Date().toISOString(),
            status: "Đang xử lý"
        };

        // Lưu
        localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));

        // Xoá giỏ hàng
        localStorage.removeItem("cart");

        // Điều hướng sang trang thành công
        router.push("/thanh-toan/thanh-cong");
    };

    if (loading) return <div className="checkout-wrap">Đang tải...</div>;

    return (
        <div className="checkout-wrap">
            <h1>Thanh toán</h1>

            <div className="checkout-grid">

                {/* Form thông tin */}
                <div className="checkout-form">
                    <h2>Thông tin giao hàng</h2>

                    <input placeholder="Họ tên" value={name} onChange={e => setName(e.target.value)} />
                    <input placeholder="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} />
                    <textarea placeholder="Địa chỉ" value={address} onChange={e => setAddress(e.target.value)} />

                    {error && <div className="checkout-error">{error}</div>}

                    <button onClick={handleConfirm} className="checkout-btn">
                        Xác nhận đặt hàng
                    </button>
                </div>

                {/* Tóm tắt đơn hàng */}
                <div className="checkout-summary">
                    <h2>Đơn hàng của bạn</h2>

                    {cart.map((item, i) => (
                        <div key={i} className="checkout-item">
                            <span>{item.name} ({item.size} - SL: {item.qty})</span>
                            <b>{(item.price * item.qty).toLocaleString()}₫</b>
                        </div>
                    ))}

                    <div className="checkout-total">
                        Tổng thanh toán: <b>{total.toLocaleString()}₫</b>
                    </div>
                </div>
            </div>
        </div>
    );
}
