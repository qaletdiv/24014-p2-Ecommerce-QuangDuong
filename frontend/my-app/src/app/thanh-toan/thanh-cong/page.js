'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import "./thanh-cong.css";

export default function ThanhCong() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const json = localStorage.getItem("last_order");
        if (json) {
            try {
                const data = JSON.parse(json);
                setOrder(data);
            } catch (e) {
                console.error("Parse last_order failed", e);
            }
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="succ-wrap">
                <h2>Đang tải thông tin đơn hàng...</h2>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="succ-wrap">
                <h2>Không tìm thấy thông tin đơn hàng.</h2>
                <Link className="succ-btn" href="/san-pham">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    const createdAtText = order.createdAt
        ? new Date(order.createdAt).toLocaleString("vi-VN")
        : "";

    return (
        <div className="succ-wrap">
            <h1>Đặt hàng thành công</h1>
            <p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>

            <div className="succ-box">
                <h3>Thông tin đơn hàng</h3>

                <div className="succ-meta">
                    <p><b>Mã đơn hàng:</b> {order.id}</p>
                    <p><b>Ngày đặt:</b> {createdAtText}</p>
                    {order.address && (
                        <p><b>Địa chỉ giao hàng:</b> {order.address}</p>
                    )}
                    {order.note && (
                        <p><b>Ghi chú:</b> {order.note}</p>
                    )}
                    <p>
                        <b>Trạng thái:</b>{" "}
                        {order.status === "done" ? "Hoàn tất" : "Đang xử lý"}
                    </p>
                </div>

                <h4 style={{ marginTop: "18px" }}>Sản phẩm</h4>

                {order.items?.map((item, idx) => (
                    <div key={idx} className="succ-item">
                        <span>
                            {item.name} ({item.size}) × {item.qty}
                        </span>
                        <span>
                            {(item.price * item.qty).toLocaleString("vi-VN")}₫
                        </span>
                    </div>
                ))}

                <div className="succ-total">
                    Tổng tiền:{" "}
                    <b>
                        {order.totalPrice?.toLocaleString("vi-VN") || 0}₫
                    </b>
                </div>
            </div>

            <div className="succ-actions">
                <Link className="succ-btn" href="/san-pham">
                    Tiếp tục mua sắm
                </Link>
                <Link className="succ-btn sec" href="/account">
                    Xem lịch sử đơn hàng
                </Link>
            </div>
        </div>
    );
}
