'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setErr('');
        setSuccess('');

        if (!email || !pw) {
            setErr('Vui lòng nhập email và mật khẩu.');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pw }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setErr(data?.message || 'Đăng nhập thất bại');
                setLoading(false);
                return;
            }

            localStorage.setItem('auth_token', data.token);


            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            } else {

                localStorage.setItem('user', JSON.stringify({ name: email.split('@')[0], email }));
            }

            setSuccess('Đăng nhập thành công! Đang chuyển về trang chủ...');
            setLoading(false);

            setTimeout(() => {

                const params = new URLSearchParams(window.location.search);
                const redirect = params.get('redirect') || '/';

                // router.push(redirect);
                window.location.href = redirect;
            }, 1500);


        } catch {
            setErr('Không thể kết nối server.');
            setLoading(false);
        }
    };

    return (
        <div className="login-wrap">
            <h1 className="login-title">Đăng nhập</h1>

            <form className="login-form" onSubmit={submit}>
                <label>
                    Email
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label>
                    Mật khẩu
                    <input
                        type="password"
                        placeholder="••••••"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                    />
                </label>

                {err && <div className="login-error">{err}</div>}
                {success && <div className="login-success">{success}</div>}

                <button className="login-btn" type="submit" disabled={loading}>
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>
        </div>
    );
}
