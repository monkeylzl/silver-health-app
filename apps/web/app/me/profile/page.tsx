import { getProfile } from '../../../lib/app-data';
import { BackHeader, ErrorState } from '../../ui/app-components';
import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  try {
    const profile = await getProfile();
    return <main className="app-shell app-shell--form"><BackHeader href="/me" title="健康档案" /><ProfileForm profile={profile} /></main>;
  } catch (error) {
    return <main className="app-shell app-shell--form"><BackHeader href="/me" title="健康档案" /><ErrorState message={error instanceof Error ? error.message : undefined} /></main>;
  }
}
