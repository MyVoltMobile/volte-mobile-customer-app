import { ShellScreen } from '@/components/shell/shell-screen';
import { AppIdentity } from '@/config/app';

export default function WelcomeScreen() {
  return (
    <ShellScreen
      title={AppIdentity.name}
      description={AppIdentity.tagline}
    />
  );
}
