import { Link, usePage } from '@inertiajs/react';
import { useRef } from 'react';

export default function KiteLinkLanding() {
    const seasonRefs = useRef([]);
    const { auth } = usePage<any>().props;
    const isAuthenticated = !!auth?.user;

    const handleMouseMove = (e, index) => {
        const card = seasonRefs.current[index];
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${y * -4}deg) translateY(-4px)`;
    };

    const handleMouseLeave = (index) => {
        const card = seasonRefs.current[index];
        if (!card) return;
        card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)';
    };

    return (
        <>
            <img
                className="bg-image"
                src="https://media.istockphoto.com/id/588369448/photo/kite-surfing-man-in-the-caribbean.jpg?s=1024x1024&w=is&k=20&c=jFqNdOMzlvtr-0QOAspQHODed554keOuClit63vzl2M="
                alt="kitesurfing background"
            />
            <div className="overlay" />

            <div className="app">
                {/* NAV */}
                <nav className="navbar">
                    <Link href={route('home')} className="logo" style={{ textDecoration: 'none' }}>
                        <i className="fas fa-wind" /> KiteLink
                    </Link>
                    <div className="nav-links">
                        {isAuthenticated ? (
                            <Link
                                href={route('dashboard')}
                                className="btn-primary"
                                style={{
                                    padding: '0.45rem 1.4rem',
                                    borderRadius: '60px',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                }}
                            >
                                <i className="fas fa-chart-pie" /> Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="signin-btn" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                    Sign In
                                </Link>
                                <Link
                                    href="/join"
                                    className="btn-primary"
                                    style={{
                                        padding: '0.45rem 1.4rem',
                                        borderRadius: '60px',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <i className="fas fa-user-plus" /> Join KiteLink
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* HERO */}
                <section className="hero">
                    <div className="hero-badge">
                        <i className="fas fa-globe" style={{ marginRight: '4px' }} /> Sri Lanka · year-round
                    </div>
                    <h1>
                        Find the Best <br />
                        <span>Kitesurf Instructors</span>
                    </h1>
                    <p>KiteLink helps you discover certified instructors and kite centers around the world — book directly, no middleman.</p>
                    <div className="cta-group">
                        <a href={route('instructors.index')} className="btn-primary">
                            <i className="fas fa-compass" /> Find Instructors
                        </a>
                        <div className="btn-outline">
                            <i className="fas fa-map-pin" /> Explore Kite Centers
                        </div>
                    </div>

                    <div className="features-mini">
                        <div className="feature-mini">
                            <i className="fas fa-user-graduate" /> <strong>Certified pros</strong> IKO &amp; VDWS
                        </div>
                        <div className="feature-mini">
                            <i className="fas fa-handshake" /> <strong>Direct booking</strong> no middleman
                        </div>
                        <div className="feature-mini">
                            <i className="fas fa-map-marked-alt" /> <strong>Worldwide spots</strong> 40+ countries
                        </div>
                    </div>
                </section>

                {/* SERVICES */}
                <div className="services-section">
                    <h2>
                        <i className="fas fa-concierge-bell" /> Services
                    </h2>
                    <div className="services-grid">
                        <div className="services-affiliated">
                            <div className="label">
                                <i className="fas fa-flag" /> AFFILIATED CENTER
                            </div>
                            <div className="badge-grid">
                                <span className="badge-item">
                                    <i className="fas fa-kite" /> Kite
                                </span>
                                <span className="badge-item">
                                    <i className="fas fa-wing" /> Wing
                                </span>
                                <span className="badge-item">
                                    <i className="fas fa-route" /> Trips &amp; Everyday
                                </span>
                                <span className="badge-item">
                                    <i className="fas fa-school" /> School
                                </span>
                                <span className="badge-item">
                                    <i className="fas fa-school" /> School
                                </span>
                                <span className="badge-item">
                                    <i className="fas fa-map-pin" /> Spots
                                </span>
                            </div>
                        </div>

                        <div className="services-list">
                            <div className="label">
                                <i className="fas fa-list" /> Services
                            </div>
                            <ul>
                                <li>
                                    <i className="fas fa-umbrella-beach" /> Gear Rental
                                </li>
                                <li>
                                    <i className="fas fa-tools" /> Kite Shop &amp; Repair
                                </li>
                                <li>
                                    <i className="fas fa-chalkboard-teacher" /> Kite Coaching
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* REVIEWS */}
                <div className="reviews-section">
                    <div className="reviews-header">
                        <h2>
                            <i className="fas fa-star" style={{ color: '#ffc107', WebkitTextFillColor: '#ffc107', marginRight: '6px' }} /> Excellent
                        </h2>
                        <div className="rating-badge">
                            <i className="fas fa-star" /> 4.9 · 381 reviews
                        </div>
                        <span className="google-badge">
                            <i className="fab fa-google" /> Google
                        </span>
                    </div>

                    <div className="reviews-grid">
                        {reviews.map((r) => (
                            <div className="review-card" key={r.name}>
                                <div className="reviewer">
                                    <i className="fas fa-user-circle" /> {r.name} <span className="review-date">{r.date}</span>
                                </div>
                                <div className="stars">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <i className="fas fa-star" key={i} />
                                    ))}
                                </div>
                                <div className="review-text">{r.text}</div>
                                <span className="read-more">Read more →</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WINDY SEASONS INTRO */}
                <div className="windy-intro">
                    <h2>
                        <i className="fas fa-wind" /> Two distinct windy seasons
                    </h2>
                    <span className="live-wind">
                        <i className="fas fa-circle" style={{ color: '#4ade80', fontSize: '0.5rem', marginRight: '4px' }} /> Live Wind
                    </span>
                    <p>Kalpitiya offers two reliable kite seasons, making it a world-class destination throughout most of the year.</p>
                    <ul>
                        <li>
                            <strong>Summer Season (mid-May – mid-October):</strong> Expect strong, consistent cross-shore wind averaging 18–25 knots,
                            with peaks up to 30 knots. It's the peak time for non-stop action from dawn till dusk.
                        </li>
                        <li>
                            <strong>Winter Season (mid-December – mid-March):</strong> Offers lighter, steady afternoon winds ranging from 15–25
                            knots. Mornings are perfect for yoga, diving, or dolphin and whale watching.
                        </li>
                    </ul>
                    <p style={{ marginTop: '0.8rem', fontSize: '0.9rem' }}>
                        Both seasons are warm and dry with water temperatures around <span className="highlight-text">27°C</span>, meaning you can
                        kite without a wetsuit all year. While the wind direction shifts between seasons, the adventure remains the same: reliable
                        wind, warm water, and a variety of spots to explore for every beginner or advanced kitesurfer.
                    </p>
                </div>

                {/* WEATHER / SEASONS */}
                <div className="weather-section">
                    {seasonData.map((season, index) => (
                        <div
                            className="season-card"
                            key={season.title}
                            ref={(el) => (seasonRefs.current[index] = el)}
                            onMouseMove={(e) => handleMouseMove(e, index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                        >
                            <h3>
                                <i className={season.icon} /> {season.title}
                            </h3>
                            <div className="date-range">{season.dateRange}</div>
                            <div className="season-grid">
                                {season.items.map((item, i) => (
                                    <div className="season-item" key={i} style={item.span ? { gridColumn: 'span 2' } : undefined}>
                                        <i className={item.icon} /> {item.content}
                                    </div>
                                ))}
                            </div>
                            <span className="season-badge">
                                <i className="far fa-calendar-alt" /> {season.badge}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ABOUT */}
                <div className="about-section">
                    <h2>
                        <i className="fas fa-info-circle" style={{ color: '#5bb4ff', WebkitTextFillColor: '#5bb4ff', marginRight: '8px' }} />
                        About Us
                    </h2>
                    <p>
                        KiteLink is the leading platform for kitesurfing enthusiasts. We connect you with certified instructors and world-class kite
                        centers across the globe. Whether you're a beginner or a pro, we make booking simple and transparent — no middleman, just pure
                        kitesurfing.
                    </p>
                    <div className="about-grid">
                        <div className="about-item">
                            <i className="fas fa-shield-alt" /> Certified IKO &amp; VDWS
                        </div>
                        <div className="about-item">
                            <i className="fas fa-globe-americas" /> 40+ countries
                        </div>
                        <div className="about-item">
                            <i className="fas fa-clock" /> Book in 2 minutes
                        </div>
                        <div className="about-item">
                            <i className="fas fa-star" /> 4.9 average rating
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="footer-note">
                    <span>
                        <i className="fas fa-kite" /> KiteLink — the kitesurfing platform
                    </span>
                    <div className="footer-social">
                        <a href="#">
                            <i className="fab fa-instagram" />
                        </a>
                        <a href="#">
                            <i className="fab fa-youtube" />
                        </a>
                        <a href="#">
                            <i className="fab fa-twitter" />
                        </a>
                        <a href="#" style={{ marginLeft: '0.4rem' }}>
                            Privacy
                        </a>
                        <a href="#">Terms</a>
                    </div>
                </div>
            </div>
        </>
    );
}

const reviews = [
    {
        name: 'Curious548',
        date: '5mo',
        text: 'Very nice people and place. Amazing! Best kitesport in Sri Lanka!',
    },
    {
        name: 'Robert Funke',
        date: '5mo',
        text: 'Very special place. Great atmosphere, food was delicious. Will come back!',
    },
    {
        name: 'Ernestin L.',
        date: '6mo',
        text: 'Lovely place to stay for kitesurfing. Instructors are amazing.',
    },
    {
        name: 'Martin Lurand',
        date: '6mo',
        text: 'Spent 2 weeks in this beautiful camp! Spot is superb, staff great.',
    },
    {
        name: 'Rafal D',
        date: '6mo',
        text: 'Great vibes! Great people, perfect spot, amazing food. Just feels right.',
    },
];

const seasonData = [
    {
        title: 'Winter Season',
        icon: 'fas fa-snowflake',
        dateRange: 'Mid‑December – Mid‑March',
        badge: 'peak season',
        items: [
            { icon: 'fas fa-water', content: 'Butter flat lagoon' },
            { icon: 'fas fa-water', content: 'Waves in ocean' },
            { icon: 'fas fa-wind', content: <span className="highlight">15‑20 knots</span> },
            {
                icon: 'fas fa-thermometer-half',
                content: (
                    <>
                        <span className="temp">25°C</span> / <span className="temp">27°C</span>
                    </>
                ),
            },
            { icon: 'fas fa-tshirt', content: 'Kite without wetsuit', span: true },
        ],
    },
    {
        title: 'Summer Season',
        icon: 'fas fa-sun',
        dateRange: 'Mid‑May – Mid‑October',
        badge: 'windy season',
        items: [
            { icon: 'fas fa-water', content: 'Flat water lagoon' },
            { icon: 'fas fa-water', content: 'Waves in ocean' },
            { icon: 'fas fa-wind', content: <span className="highlight">18‑30 knots</span> },
            {
                icon: 'fas fa-thermometer-half',
                content: (
                    <>
                        <span className="temp">27°C</span> / <span className="temp">32°C</span>
                    </>
                ),
            },
            { icon: 'fas fa-tshirt', content: 'Kite without wetsuit', span: true },
        ],
    },
];
