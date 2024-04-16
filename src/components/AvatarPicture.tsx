import { NftImage, ProfilePictureSet } from '@lens-protocol/react-web';

import { useBuildResourceSrc } from '@/utils/useBuildResourceSrc';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const PROFILE_PICTURE_SIZE = '4rem';

function FallbackProfilePicture() {
  return (
    <Avatar>
        <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  );
}

type RemoteProfilePictureProps = {
  picture: ProfilePictureSet;
};

function RemoteProfilePicture({ picture }: RemoteProfilePictureProps) {
  const url = picture.optimized?.uri || picture.raw.uri;
  const src = useBuildResourceSrc(url);
  if (!src) return null;
  return (
    <Avatar>
        <AvatarImage src={src} />
        <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  );
}

type ProfilePictureProps = {
  picture: ProfilePictureSet | NftImage | null;
};

export function AvatarPicture({ picture }: ProfilePictureProps) {
  if (!picture) return <FallbackProfilePicture />;

  switch (picture.__typename) {
    case 'ImageSet':
      return <RemoteProfilePicture picture={picture} />;
    default:
      return <FallbackProfilePicture />;
  }
}