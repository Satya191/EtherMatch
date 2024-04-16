// app/page.tsx
'use client'
import {useExploreProfiles, ExploreProfilesOrderByType } from '@lens-protocol/react-web'
import Link from 'next/link'
import { ProfileCard } from '@/components/ProfileCard'

export default function Feed() {
  const { data } = useExploreProfiles({ 
    orderBy: ExploreProfilesOrderByType.LatestCreated,
  })
  
  return (
    <div className='p-20'>
      <h1 className='text-5xl'>Feed</h1>
      {
        data?.map((profile, index) => (
          <Link href={`/profile/${profile.handle?.fullHandle}`} key={index}>
            <ProfileCard profile={profile} />
          </Link>
        ))
      }
    </div>
  )
}
