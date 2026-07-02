import type { Metadata } from 'next';
import InstallView from '@/components/InstallView';

export const metadata: Metadata = {
  title: 'Install in Claude · Armory',
  description:
    'Step-by-step guide to install your Armory setup in Claude Projects. Five short steps, about two minutes.',
};

export default function InstallPage() {
  return <InstallView />;
}
