
'use client'
// pages/profile/[...handle].tsx
import { useProfile } from '@lens-protocol/react-web';
import { ProfileCard } from '@/components/ProfileCard';

const ProfilePage = ({ params }: { params: { handle: string } }) => {
  const fullHandle = Array.isArray(params.handle) ? params.handle.join('/') : params.handle; //handle like lens/stani
  

  
  const { data: profile, loading: profileLoading } = useProfile({ forHandle: fullHandle }); //get profile of person to follow

  if (!profile) return <p>No profile found</p>;

  if (profileLoading) return <p>Loading...</p>;

  return (
      <ProfileCard profile={profile} />
  );
};

export default ProfilePage;

