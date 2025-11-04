'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './register.css';

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [err, setErr] = useState('');
    const [ok, setOk] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setErr('');
        setOk('');
        if (!name || !email || !pw) {
            setErr('Vui lòng nhập đủ Họ tên, Email, Mật khẩu.');
            return;
        }
        try {
            setLoading(true);
            const res = await fetch('http://localhost:4000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password: pw })
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setErr(data?.message || 'Đăng ký thất bại');
                setLoading(false);
                return;
            }

            setOk('Đăng ký thành công! Đang chuyển tới trang đăng nhập...');
            setLoading(false);
            setName(''); setEmail(''); setPw('');

            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch {
            setErr('Không thể kết nối server.');
            setLoading(false);
        }
    };

    return (
        <div className="reg-wrap">
            <h1 className="reg-title">Đăng ký</h1>
            <form className="reg-form" onSubmit={submit}>
                <label>
                    Họ tên
                    <input value={name} onChange={(e) => setName(e.target.value)} />
                </label>

                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>

                <label>
                    Mật khẩu
                    <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
                </label>

                {err && <div className="reg-error">{err}</div>}
                {ok && (
                    <div className="reg-success">
                        {ok} <button type="button" className="reg-success-link" onClick={() => router.push('/login')}>Vào đăng nhập</button>
                    </div>
                )}

                <button className="reg-btn" type="submit" disabled={loading}>
                    {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
                </button>
            </form>
        </div>
    );
}
