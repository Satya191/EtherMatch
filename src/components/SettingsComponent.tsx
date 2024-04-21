import React, { useState } from 'react'; // Import useState
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

export default function SettingsComponent() {
  const { isConnected, address } = useWagmiAccount();
  const { data: session } = useLensSession();
  const [isDialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility

  if(!session || !session.authenticated || session.type!==SessionType.WithProfile || !Boolean(session.profile.metadata?.attributes?.some(a => a.key === 'SkillXChange'))) {
    return(<h1>Please connect, sign in, and register to continue and find true love!</h1>);
  }

  const handleOpenDialog = () => {
    setDialogOpen(true); // Open dialog when button is clicked
  };

  return (
    <>
      <button onClick={handleOpenDialog}>PROFILE SETTINGS</button> {/* Button to open dialog */}
      <Dialog open={isDialogOpen}> {/* Use onClose to close dialog */}
        <DialogContent style={{ overflowY: 'auto', padding: '20px' }}>
          <p className="mb-4 text-gray-500">Connected lens handle: {session.type === SessionType.WithProfile && session.profile.handle?.fullHandle}</p>
          <UseSetProfileMetadata session={session} firstTime={true} cardProfile={session.profile}/>
        </DialogContent>
      </Dialog>
    </>
  );
}
