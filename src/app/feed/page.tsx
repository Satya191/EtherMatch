// app/feed/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { ProfileCard } from '@/components/ProfileCard';
import { useProfile } from '@lens-protocol/react-web';

export default function Feed() {
  const [handles, setHandles] = useState([]);
  const [currentHandleIndex, setCurrentHandleIndex] = useState(0);

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

  return (
    <div className='p-20'>
      {profile && (
        <>
        <ProfileCard profile={profile} />
        <div>
          <button onClick={handleLike}>NEXT</button>
        </div>
        </>
      )}
    </div>
  );
}
