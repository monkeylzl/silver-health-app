const links = [
  { href: '/elder/profile', label: '老人档案' },
  { href: '/elder/home', label: '老人首页' },
  { href: '/elder/metrics', label: '健康指标' },
  { href: '/elder/medication', label: '用药提醒' },
  { href: '/family/bind', label: '家属绑定' },
  { href: '/family/dashboard', label: '家属看板' },
  { href: '/family/report', label: '家属周报' },
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '40px 24px' }}>
      <h1>Silver Health App</h1>
      <p>当前为 MVP 路由骨架，用于承接老年端与家属端主链路页面。</p>
      <ul>
        {links.map((link) => (
          <li key={link.href} style={{ marginBottom: 12 }}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
