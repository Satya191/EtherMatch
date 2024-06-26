// app/feed/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { ProfileCard } from '@/components/ProfileCard';
import { SessionType, useProfile, useSession } from '@lens-protocol/react-web';

export default function Feed() {
  const [handles, setHandles] = useState([]);
  const [currentHandleIndex, setCurrentHandleIndex] = useState(0);
  const { data: session } = useSession();

  const { data: profile, loading: profileLoading } = useProfile({ forHandle: handles[currentHandleIndex] });

  useEffect(() => {
    const fetchProfiles = async () => {
      console.log("Calling fetch for profiles");
      try {
          const res = await fetch('/api');
          // console.log("Response received:", res);
          const data = await res.json();
          // console.log("Data received:", data);
          if (res.ok) {
            console.log("data profiles: ", data.profiles);
              setHandles(data.profiles);
          } else {
              throw new Error(data.message || "Failed to fetch profiles");
          }
      } catch (error) {
          console.error("Error fetching profiles:", error);
      }
    };  

    fetchProfiles();
  }, []);

  const handleLike = () => {
    // Move to next profile
    if (currentHandleIndex < handles.length - 1) {
      setCurrentHandleIndex(currentHandleIndex + 1);
    }
  };

  if (profileLoading) return <p>Loading...</p>;
  if (!profile) return <p>No profile found</p>;

  if(!session || !session.authenticated || session.type!==SessionType.WithProfile || !Boolean(session.profile.metadata?.attributes?.some(a => a.key === 'SkillXChange'))) {return(<h1>Please connect, sign in, and register to continue and find true love!</h1>);}

  return (
    <div className='p-20'>
      {profile && (
        <>
        <ProfileCard profile={profile} />
        <div>
        <p>-----------------</p>
          <button onClick={handleLike}>NEXT</button>
        </div>
        </>
      )}
    </div>
  );
}
