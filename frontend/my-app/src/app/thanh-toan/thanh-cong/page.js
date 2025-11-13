'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import "./thanh-cong.css";

export default function ThanhCong() {
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem("orders")) || [];
        const lastOrder = list[list.length - 1];
        setOrder(lastOrder);
    }, []);

    if (!order) {
        return (
            <div className="succ-wrap">
                <h2>Không tìm thấy thông tin đơn hàng.</h2>
                <Link className="succ-btn" href="/san-pham">Tiếp tục mua sắm</Link>
            </div>
        );
    }

    return (
        <div className="succ-wrap">
            <h1>Đặt hàng thành công!</h1>
            <p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>

            <div className="succ-box">
                <h3>Thông tin đơn hàng</h3>

                <div className="succ-meta">
                    <p><b>Mã đơn hàng:</b> {order.id}</p>
                    <p><b>Ngày đặt:</b> {order.date}</p>
                    <p><b>Người nhận:</b> {order.name}</p>
                    <p><b>Điện thoại:</b> {order.phone}</p>
                    <p><b>Địa chỉ:</b> {order.address}</p>
                </div>

                <h4 style={{ marginTop: "18px" }}>Sản phẩm</h4>

                {order.items.map((item, idx) => (
                    <div key={idx} className="succ-item">
                        <span>{item.name} ({item.size}) × {item.qty}</span>
                        <span>{(item.price * item.qty).toLocaleString()}₫</span>
                    </div>
                ))}

                <div className="succ-total">
                    Tổng tiền: <b>{order.total.toLocaleString()}₫</b>
                </div>
            </div>

            <div className="succ-actions">
                <Link className="succ-btn" href="/san-pham">Tiếp tục mua sắm</Link>
                <Link className="succ-btn sec" href="/account">Xem lịch sử đơn hàng</Link>
            </div>
        </div>
    );
}
