'use client';

import { useEffect, useState } from "react";
import "./cart.css";

export default function GioHang() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Kiểm tra login
        const token = localStorage.getItem("auth_token");
        if (!token) {
            window.location.href = "/login?redirect=/gio-hang";
            return;
        }

        // Load giỏ hàng từ localStorage
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
        setLoading(false);
    }, []);

    const updateQty = (id, qty) => {
        const newCart = cart.map(item =>
            item.id === id ? { ...item, qty: Math.max(1, qty) } : item
        );
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const removeItem = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (loading) return <div className="cart-container">Đang tải...</div>;

    if (cart.length === 0)
        return (
            <div className="cart-container">
                <h2>Giỏ hàng trống 😢</h2>
                <a className="cart-btn" href="/san-pham">Mua sắm ngay</a>
            </div>
        );

    return (
        <div className="cart-container">
            <h1>Giỏ hàng của bạn</h1>

            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Màu sắc</th>
                        <th>Size</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {cart.map(item => (
                        <tr key={`${item.id}-${item.color}-${item.size}`}>
                            <td className="cart-prod">
                                <img src={item.image} alt={item.name} />
                                {item.name}
                            </td>

                            {/* Màu sắc */}
                            <td>
                                <span
                                    className="color-dot"
                                    title={item.color}
                                    style={{ backgroundColor: item.color }}
                                ></span>
                            </td>

                            {/* Size */}
                            <td>{item.size || "—"}</td>

                            <td>{item.price.toLocaleString()}₫</td>

                            <td>
                                <div className="qty-box">
                                    <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                                    <input
                                        type="number"
                                        value={item.qty}
                                        min="1"
                                        onChange={e => updateQty(item.id, Number(e.target.value))}
                                    />
                                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                                </div>
                            </td>

                            <td>{(item.price * item.qty).toLocaleString()}₫</td>

                            <td>
                                <button
                                    className="remove"
                                    onClick={() => removeItem(item.id)}
                                >✕</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="cart-total">
                Tổng thanh toán: <b>{total.toLocaleString()}₫</b>
            </div>

            <button
                className="cart-checkout"
                onClick={() => window.location.href = "/thanh-toan"}
            >
                Thanh toán
            </button>

        </div>
    );
}
