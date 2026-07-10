import { getMedications } from '../../../lib/app-data';
import { BackHeader, ErrorState } from '../../ui/app-components';
import { MedicationManager } from './medication-manager';

export default async function MedicationsPage() {
  try {
    const items = await getMedications();
    return <main className="app-shell app-shell--narrow"><BackHeader href="/health" title="用药提醒" /><MedicationManager initialItems={items} /></main>;
  } catch (error) {
    return <main className="app-shell app-shell--narrow"><BackHeader href="/health" title="用药提醒" /><ErrorState message={error instanceof Error ? error.message : undefined} /></main>;
  }
}
