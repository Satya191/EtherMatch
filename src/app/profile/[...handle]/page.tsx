
'use client'
// pages/profile/[...handle].tsx
import { useProfile } from '@lens-protocol/react-web';
import { ProfileCard } from '@/components/ProfileCard';
import { useSession, SessionType } from '@lens-protocol/react-web';
import SettingsComponent from '@/components/SettingsComponent';

const ProfilePage = ({ params }: { params: { handle: string } }) => {
  const fullHandle = Array.isArray(params.handle) ? params.handle.join('/') : params.handle; //handle like lens/stani
  const { data: session } = useSession();

  
  const { data: profile, loading: profileLoading } = useProfile({ forHandle: fullHandle }); //get profile of person to follow

  if (!profile) return <p>No profile found</p>;

  if (profileLoading) return <p>Loading...</p>;

  if(!session || !session.authenticated || session.type!==SessionType.WithProfile || !Boolean(session.profile.metadata?.attributes?.some(a => a.key === 'SkillXChange'))) {return(<h1>Please connect, sign in, and register to continue and find true love!</h1>);}

  return (
    <>
      <ProfileCard profile={profile} />
      <hr />
      <SettingsComponent />
    </>
  );
};

export default ProfilePage;

