import { NftImage, ProfilePictureSet } from '@lens-protocol/react-web';

import { useBuildResourceSrc } from '@/utils/useBuildResourceSrc';

import Image from "next/image"

import { AspectRatio } from "@/components/ui/aspect-ratio"

const PROFILE_PICTURE_SIZE = '4rem';

function FallbackProfilePicture() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <img
        src=""
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
      />
    </AspectRatio>
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
    // <img
    //   src={src}
    //   style={{
    //     height: PROFILE_PICTURE_SIZE,
    //     width: PROFILE_PICTURE_SIZE,
    //     borderRadius: '50%',
    //   }}
    // />
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <img
        src={src}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}}
      />
    </AspectRatio>
  );
}

type ProfilePictureProps = {
  picture: ProfilePictureSet | NftImage | null;
};

export function ProfilePicture({ picture }: ProfilePictureProps) {
  if (!picture) return <FallbackProfilePicture />;

  switch (picture.__typename) {
    case 'ImageSet' || 'NftImage':
      return <RemoteProfilePicture picture={picture} />;
    default:
      return <FallbackProfilePicture />;
  }
}