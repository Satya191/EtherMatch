import { SessionType, useSession as useLensSession } from "@lens-protocol/react-web";
import { useAccount as useWagmiAccount } from "wagmi";

import { ConnectWalletButton } from "./ConnectWalletButton";
import { LoginForm } from "./LoginForm";
import { LogoutButton } from "./LogoutButton";
import { truncateEthAddress } from "@/utils/truncateEthAddress";
import { DisconnectWalletButton } from "./DisconnectWalletButton";
import { AvatarPicture } from "./AvatarPicture";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
//import { UserProfileForm } from "./UserProfileForm";
import { UseSetProfileMetadata } from "./UseUpdateProfileMetadata"
import { useProfile } from '@lens-protocol/react-web';



import { useState, useEffect } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"



export function WelcomeToLens() {
  const { isConnected, address } = useWagmiAccount();
  const { data: session } = useLensSession();
  const { data: theProfile } = useProfile({forHandle: 'lens/satyap'})
  // const [isDialogOpen, setDialogOpen] = useState(false);
  // const [isDialogOpen2, setDialogOpen2] = useState(false);
  // const [registered, setRegistered] = useState(false);

  // Automatically open dialog when wallet is connected but Lens session is not authenticated
  // useEffect(() => {
  //   if (isConnected && !session?.authenticated) {
  //     setDialogOpen(true);
  //   } else {
  //     setDialogOpen(false);
  //     if(isConnected && session?.authenticated) {
  //     if (!registered) {
  //       setDialogOpen2(true);
  //     } else {
  //       setDialogOpen2(false);
  //     }
  //     }
  //   }
  // }, [isConnected, session, registered]);

  // step 1. connect wallet
  if (!isConnected) {
    return (
      <>
        <ConnectWalletButton />
      </>
    );
  }

  // step 2. connect Lens Profile
  if (!session?.authenticated && address) {
    return (
      <>
{/* <Dialog open={isDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><p className="mb-4 text-gray-500">Connected wallet: {truncateEthAddress(address)}</p></DialogTitle>
          </DialogHeader> */}
          {console.log("CONNECTED LENS PROFILE")}
          <LoginForm owner={address} />
          <div className="mt-2">
          <DisconnectWalletButton />
        </div>
        {/* </DialogContent>
      </Dialog> */}
        
        

        
      </>
    );
  }

  //step 3. register user to app
  if (session && session.authenticated && session.type === SessionType.WithProfile && !(Boolean(session.profile.metadata?.attributes?.some(a => a.key === 'SkillXChange')))) {
    // console.log("skillxchange attr? ", Boolean(session.profile.metadata?.attributes?.some(a => a.key == 'SkillXChange')));
    // console.log("attr: ", session.profile.metadata?.attributes?.find(a => a.key === 'SkillXChange')?.value);
    return (
      <>
      {/* {console.log("USER APPID IS: ", session.profile)}
      {console.log("profile appid is: ", theProfile)} */}
    {/* <Dialog open={isDialogOpen2}>
          <DialogContent style={{ overflowY: 'auto', padding: '20px' }}>
            <DialogHeader>
    <DialogTitle> */}
              <p className="mb-4 text-gray-500">Connected lens handle: {session.type === SessionType.WithProfile && session.profile.handle?.fullHandle}</p>
              {/* </DialogTitle>
            </DialogHeader> */}
            <UseSetProfileMetadata session={session} firstTime={true} cardProfile={session.profile}/>
          {/* </DialogContent>
        </Dialog> */}
        
        </>
    );
  }
  // step 4. show Profile details
  if (session && session.type === SessionType.WithProfile && Boolean(session.profile.metadata?.attributes?.some(a => a.key === 'SkillXChange'))) {
    // console.log("appid is set! - ", session.profile.metadata?.appId);
    // console.log("appid is set! - bio: ", session.profile.metadata?.bio);
    return (
      <>
        <DropdownMenu>
        <DropdownMenuTrigger>
        {session.profile.metadata?.picture?.__typename == 'ImageSet' && <AvatarPicture picture={session.profile.metadata?.picture}/>}
        {session.profile.metadata?.picture?.__typename == 'NftImage' && <AvatarPicture picture={session.profile.metadata?.picture}/>}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuLabel>
          {session.profile.handle?.fullHandle ?? session.profile.id}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={`/profile/${session.profile.handle?.fullHandle}`}>My Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
        <LogoutButton />
        </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }

  // you can handle other session types here
  return null;
}
