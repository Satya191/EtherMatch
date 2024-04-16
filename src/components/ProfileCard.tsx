import { Profile, ProfileStats } from '@lens-protocol/react-web';
import { ReactNode } from 'react';
import { useFollow, useSession, useUnfollow, SessionType, TriStateValue } from '@lens-protocol/react-web';
import { useAccount } from 'wagmi';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
  

import { ProfilePicture } from './ProfilePicture';

type ProfileCardProps = {
  profile: Profile;
  children?: ReactNode;
};

function ProfileTickers({ stats }: { stats: ProfileStats }) {
  return (
    <p
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}
    >
      <span>
        Followers:&nbsp;<strong>{stats.followers}</strong>
      </span>
      <span>
        Following:&nbsp;<strong>{stats.following}</strong>
      </span>
      <span>
        Collects:&nbsp;<strong>{stats.collects}</strong>
      </span>
    </p>
  );
}

export function ProfileCard({ profile, children }: ProfileCardProps) {
    const { isConnected } = useAccount();
    const { data: session } = useSession();
    const { execute: follow, error: followError, loading: followLoading } = useFollow(); //getting function execute, destructuring
    const { execute: unfollow, error: unfollowError, loading: unfollowLoading } = useUnfollow(); //getting function execute, destructuring

  const { metadata } = profile;

  const handleFollowOrUnfollow = async () => {
    if (profile.operations.canFollow == TriStateValue.Yes) {
      const result = await follow({ profile });
      if (result.isSuccess()) {
        console.log('Follow executed successfully');
      } else {
        console.error('Failed to follow', result.error.message);
      }
    } 
    else if (profile.operations.canUnfollow){
      const result = await unfollow({ profile });
      if (result.isSuccess()) {
        console.log('Unfollow executed successfully');
      } else {
        console.error('Failed to unfollow', result.error.message);
      }
    }
    else {
      console.error('not sure what happened, cant follow nor can unfollow.');
    }
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
        <CardHeader>
            {metadata && (
            <div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '60%', alignContent: 'flex-start', marginBottom: '10px'}}>
            <ProfilePicture picture={metadata.picture} />
            </div>
            <div>
            {metadata && <CardTitle><p>{metadata.displayName}</p></CardTitle>}
            <p>@{profile.handle?.fullHandle}</p>
            </div>
            </div>
            )}
            {!metadata && <p>@{profile.handle?.fullHandle}</p>}
            <p>{metadata && metadata.bio}</p>
        </CardHeader>
        <CardContent>
        
        

      <hr />
      <ProfileTickers stats={profile.stats} />
      {(!isConnected || !session || !(session.type === SessionType.WithProfile) || !session.authenticated) ? <p>Please sign in to follow</p> :
      <Button style={{ marginTop: '5%'}}
                onClick={handleFollowOrUnfollow} 
                disabled={followLoading || unfollowLoading || !(profile.operations.canUnfollow || profile.operations.canFollow == TriStateValue.Yes)}
              >
                {profile.operations.canFollow == TriStateValue.Yes ? 'Follow' : 'Unfollow'}
              </Button>
              }
              {followError && <p>Error following user: {followError.message}</p>}
              {unfollowError && <p>Error unfollowing user: {unfollowError.message}</p>}
        </CardContent>

        <CardFooter>
      {children}
      </CardFooter>
    </Card>
  );
}