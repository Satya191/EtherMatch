// app/feed/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { ProfileCard } from '@/components/ProfileCard';
import { Profile, SessionType, useProfile, useSession } from '@lens-protocol/react-web';
import UseUpdateIRLVal from '@/components/UseUpdateIRLVal';

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
          const data = await res.json();
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

  function isMatched(profile: Profile): boolean {
    if(!session || !session.authenticated || session.type !== SessionType.WithProfile || session.profile.handle?.fullHandle==profile.handle?.fullHandle) return false;

    // console.log("profile handle: ", profile.handle?.fullHandle)
    // console.log("session handle: ", session.profile.handle?.fullHandle)

    //Checking if other person likes the current session person
    let likes;
    const likedAttribute = profile.metadata?.attributes?.find(a => a.key === 'liked');
    if (likedAttribute && likedAttribute.value) {
        try {
            // Parse it directly if it exists
            likes = JSON.parse(likedAttribute.value);
            if (!Array.isArray(likes)) { // Ensure it's an array
                likes = [];
            }
        } catch (e) {
            console.error('Error parsing liked attribute:', e);
            likes = []; // Default to an empty array if there's a parsing error
        }
    } else {
        likes = []; // Initialize as an empty array if the attribute does not exist
    }
    const handleToSearch = session.profile.handle?.fullHandle || 'placeholder';
    // console.log("--------------------------")
    console.log("profile likes: ", likes)
    const isHandleLiked = likes.includes(handleToSearch);
    // console.log("session handletosearch: ", handleToSearch)
    // console.log("--------------------------")

    //Checking if current session person likes other person
    let lik;
    const likAttr = session.profile.metadata?.attributes?.find(a => a.key === 'liked');
    if (likAttr && likAttr.value) {
        try {
            // Parse it directly if it exists
            // console.log("likAttr: ", JSON.parse(likAttr.value))
            lik = JSON.parse(likAttr.value);
            if (!Array.isArray(lik)) { // Ensure it's an array
                lik = [];
            }
        } catch (e) {
            console.error('Error parsing liked attribute:', e);
            lik = []; // Default to an empty array if there's a parsing error
        }
    } else {
        lik = []; // Initialize as an empty array if the attribute does not exist
    }
    const hts = profile.handle?.fullHandle || 'placeholder';
    // console.log("--------------------------")
    console.log("session likes: ", lik)
    const isCurrSessionLiked = lik.includes(hts);
    // console.log("profile handletosearch: ", hts)
    // console.log("--------------------------")

    console.log("ishandleliked: ", isHandleLiked);
    console.log("iscurrliked: ", isCurrSessionLiked);

    return (isHandleLiked && isCurrSessionLiked);
  }

  if (profileLoading) return <p>Loading...</p>;
  if (!profile) return <p>No profile found</p>;

  if(!session || !session.authenticated || session.type!==SessionType.WithProfile || !Boolean(session.profile.metadata?.attributes?.some(a => a.key === 'SkillXChange'))) {return(<h1>Please connect, sign in, and register to continue and find true love!</h1>);}

  return (
    <div className='p-20'>
      {profile && session && (
        <>
          {isMatched(profile) ? <div><ProfileCard profile={profile} /> <UseUpdateIRLVal session={ session } activeProfile={profile}/></div> : <h1>Not a match with {profile.handle?.fullHandle}, click next</h1>}
          <div>
          <p>-----------------</p>
            <button onClick={handleLike}>NEXT</button>
          </div>
          <div>
          {/* <button onClick={handleLike}>MESSAGE</button> */}
          </div>
        </>
      )}
    </div>
  );
}
