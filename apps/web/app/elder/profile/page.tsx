import { ElderProfileForm } from './elder-profile-form';

export default function Page() {
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>老人建档</h1>
        <p style={{ color: '#667085', margin: 0 }}>
          这是当前 MVP 第一条主链路的前端入口。先用一个直接可联调的表单，把建档页面和 API 接口串起来。
        </p>
      </div>
      <ElderProfileForm />
    </main>
  );
}
