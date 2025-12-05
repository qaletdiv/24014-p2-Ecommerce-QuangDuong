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
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            router.push("/login?redirect=/thanh-toan");
            return;
        }

        const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cartData.length === 0) {
            router.push("/gio-hang");
            return;
        }

        setCart(cartData);
        setLoading(false);
    }, [router]);

    const total = cart.reduce(
        (sum, item) => sum + item.price * (item.qty || 1),
        0
    );

    const handleConfirm = async () => {
        if (!name || !phone || !address) {
            setError("Vui lòng nhập đầy đủ thông tin giao hàng.");
            return;
        }

        const token = localStorage.getItem("auth_token");
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (!token || !user) {
            router.push("/login?redirect=/thanh-toan");
            return;
        }

        setError("");
        setSubmitting(true);
        const payload = {
            items: cart,
            totalPrice: total,
            address,
            note: `Tên: ${name} - SĐT: ${phone}`,
        };

        try {
            const res = await fetch("http://localhost:4000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const txt = await res.text();
                console.error("Create order failed:", txt);
                setError("Đặt hàng thất bại, vui lòng thử lại.");
                setSubmitting(false);
                return;
            }

            const newOrder = await res.json();

            // xoá và cập nhật NavBar
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("cart-updated"));
            localStorage.setItem("last_order", JSON.stringify(newOrder));

            router.push("/thanh-toan/thanh-cong");
        } catch (err) {
            console.error(err);
            setError("Có lỗi xảy ra, hãy thử lại sau.");
            setSubmitting(false);
        }
    };

    if (loading) return <div className="checkout-wrap">Đang tải...</div>;

    return (
        <div className="checkout-wrap">
            <h1>Thanh toán</h1>

            <div className="checkout-grid">
                {/* Form thông tin */}
                <div className="checkout-form">
                    <h2>Thông tin giao hàng</h2>

                    <input
                        placeholder="Họ tên"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                    <textarea
                        placeholder="Địa chỉ"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    />

                    {error && <div className="checkout-error">{error}</div>}

                    <button
                        onClick={handleConfirm}
                        className="checkout-btn"
                        disabled={submitting}
                    >
                        {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                    </button>
                </div>

                {/* Tóm tắt đơn hàng */}
                <div className="checkout-summary">
                    <h2>Đơn hàng của bạn</h2>

                    {cart.map((item, i) => (
                        <div key={i} className="checkout-item">
                            <span>
                                {item.name} ({item.size} - SL: {item.qty})
                            </span>
                            <b>{(item.price * item.qty).toLocaleString("vi-VN")}₫</b>
                        </div>
                    ))}

                    <div className="checkout-total">
                        Tổng thanh toán: <b>{total.toLocaleString("vi-VN")}₫</b>
                    </div>
                </div>
            </div>
        </div>
    );
}
