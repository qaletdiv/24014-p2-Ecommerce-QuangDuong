'use client';
import Link from 'next/link';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="ft">
            <div className="ft-inner">
                {/* Col 1: About / bỏ logo */}
                <div className="ft-col">
                    <h4 className="ft-h4">ABOUT SITE</h4>
                    <p className="ft-text">
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece
                        of classical Latin literature from 45 BC, making it over 2000 years old.
                    </p>
                </div>

                {/* Col 2: Company */}
                <div className="ft-col">
                    <h4 className="ft-h4">COMPANY</h4>
                    <ul className="ft-list">
                        <li><Link href="/about">About</Link></li>
                        <li><Link href="/profile">Profile</Link></li>
                        <li><Link href="/blog">Blog</Link></li>
                        <li><Link href="/faq">FAQ</Link></li>
                        <li><Link href="/contact">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Col 3: Online Shopping */}
                <div className="ft-col">
                    <h4 className="ft-h4">ONLINE SHOPPING</h4>
                    <ul className="ft-list">
                        <li><Link href="/men">Men</Link></li>
                        <li><Link href="/women">Women</Link></li>
                        <li><Link href="/kids">Kids</Link></li>
                        <li><Link href="/home-living">Home &amp; Living</Link></li>
                        <li><Link href="/beauty">Beauty</Link></li>
                        <li><Link href="/gift-cards">Gift Cards</Link></li>
                    </ul>
                </div>

                {/* Col 4: Account */}
                <div className="ft-col">
                    <h4 className="ft-h4">ACCOUNT</h4>
                    <ul className="ft-list">
                        <li><Link href="/account">Account</Link></li>
                        <li><Link href="/account/edit-profile">Edit Profile</Link></li>
                        <li><Link href="/account/address">Edit Address</Link></li>
                        <li><Link href="/orders">Orders</Link></li>
                        <li><Link href="/settings">Settings</Link></li>
                    </ul>
                </div>

                {/* Col 5: App + Office */}
                <div className="ft-col">
                    <h4 className="ft-h4">APP ON MOBILE</h4>
                    <p className="ft-text">Refer and get free product.</p>
                    <div className="ft-badges">
                        <a href="#" aria-label="Get it on Google Play">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
                        </a>
                        <a href="#" aria-label="Download on the App Store">
                            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" />
                        </a>
                    </div>

                    <h4 className="ft-h4 mt24">CORPORATE OFFICE</h4>
                    <address className="ft-address">
                        4832 Hannah Street, Asheville, North Carolina – 28801
                    </address>
                    <a className="ft-map" href="#" aria-label="Locate us on Google Maps">
                        <span className="ft-dot" /> Locate us on Google Maps
                    </a>
                </div>
            </div>

            <div className="ft-bottom">
                <div className="ft-inner">
                    <p>© {new Date().getFullYear()} YourShop. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
