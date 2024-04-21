import React from 'react';
import { MetadataAttributeType, profile } from '@lens-protocol/metadata';
import { Profile, Session, SessionType, useSetProfileMetadata } from '@lens-protocol/react-web';

import { useIrysUploadHandler } from '@/utils/useIrysUploader';
import { ProfileCard } from './ProfileCard';
import FileUploader from './FileUploader';
import { Button } from "./Button";

type UpdateProfileFormProps = {
  activeProfile: Profile;
  firstTime: boolean;
  cardProfile: Profile;
};

function UpdateProfileForm({ activeProfile, firstTime, cardProfile }: UpdateProfileFormProps) {
  const uploadMetadata = useIrysUploadHandler();
  const { execute: update, error, loading } = useSetProfileMetadata();

  // Retrieve the 'liked' attribute, assuming it exists and is JSON encoded
  let likes;
  const likedAttribute = activeProfile.metadata?.attributes?.find(a => a.key === 'liked');
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


  // Example handle to search for
  const handleToSearch = cardProfile.handle?.fullHandle || 'placeholder';
  console.log("likes: ", likes)
  const isHandleLiked = likes.includes(handleToSearch);
  console.log("handletosearch: ", handleToSearch)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const file = formData.get('image') as File;

    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const location = formData.get('location') as string;
    let likes;
    const likedAttribute = activeProfile.metadata?.attributes?.find(a => a.key === 'liked');
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


    let pictureURI = '';
    if (file && file.size > 0) {
      const uploadResult = await uploadMetadata(file);
      console.log("picture uploadresult: ", uploadResult);
      if (uploadResult) {
        pictureURI = uploadResult;
      }
    }
    let metIrlVal: 'true' | 'false' = 'false'; // Default to 'false'
    if (activeProfile.metadata?.attributes?.find(a => a.key === 'metirl')?.value === "true") {
        metIrlVal = 'true';
    }
    const metadata = profile({
      appId: "SkillXChange",
      name,
      bio,
      picture: pictureURI,
      attributes: [
        {
          key: 'location',
          value: location,
          type: MetadataAttributeType.STRING,
        },
        {
          key: 'liked',
          value: JSON.stringify(likes),
          type: MetadataAttributeType.JSON,
        },
        {
          key: "SkillXChange",
          value: 'SkillXChange',
          type: MetadataAttributeType.STRING,
        },
        {
          key: "metirl",
        value: metIrlVal,
        type: MetadataAttributeType.BOOLEAN,
      },
      ],
    });

    console.log("metIrlVal: ", metIrlVal);
    const metadataURI = await uploadMetadata(metadata);
    console.log("metadataURI: ", metadataURI);

    const result = await update({
      metadataURI,
      sponsored: formData.get('sponsored') === 'on',
    });

    if (result.isFailure()) {
      console.error(result.error.message);
      return;
    }

    const completion = await result.value.waitForCompletion();

    if (completion.isFailure()) {
      console.error(completion.error.message);
      return;
    }

    console.log('Profile updated');
      // console.log("ADDING PROFILE TO LIGHTHOUSE FILE.");
    if(!(Boolean(activeProfile.metadata?.attributes?.some(a => a.key === 'SkillXChange')))){
      const key = process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY || '';
      const fhandle = activeProfile.handle?.fullHandle || '';
      FileUploader({apiKey: key, appendContent: fhandle});
    }
  }

  async function likeProfile() {
    // Copy existing attributes while filtering out the 'liked' attribute to replace it.
    const existingAttributes = activeProfile.metadata?.attributes?.filter(attr => attr.key !== 'liked') || [];
    
    // Update or initialize the 'liked' attribute.
    let likes;
    const likedAttribute = activeProfile.metadata?.attributes?.find(a => a.key === 'liked');
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
    console.log("likes before push: ", likes)
    if (!likes.includes(cardProfile.handle?.fullHandle)) {
        likes.push(cardProfile.handle?.fullHandle);
    }
    console.log("likes after push: ", likes)
    console.log("likes stringified: ", JSON.stringify(likes))

    // // Recreate the 'liked' attribute with the updated list.
    // const likedMetadataAttribute = {
    //     key: 'liked',
    //     value: JSON.stringify(likes),
    //     type: MetadataAttributeType.JSON
    // };

    // // Include the updated 'liked' in the new attributes list.
    // const updatedAttributes = [...existingAttributes, likedMetadataAttribute];

    let picture = '';

    if(activeProfile.metadata?.picture?.__typename=='ImageSet'){
      picture = activeProfile.metadata?.picture.raw.uri;
    }

    let metIrlVal: 'true' | 'false' = 'false'; // Default to 'false'
    if (activeProfile.metadata?.attributes?.find(a => a.key === 'metirl')?.value === "true") {
        metIrlVal = 'true';
    }

    // Use the existing profile details but update the attributes array.
    const metadata = profile({
        appId: "SkillXChange",
        name: activeProfile.metadata?.displayName || 'name',
        bio: activeProfile.metadata?.bio || 'bio',
        picture: picture,
        attributes: [
          {
            key: 'location',
            value: activeProfile.metadata?.attributes?.find(a => a.key === 'location')?.value || '',
            type: MetadataAttributeType.STRING,
          },
          {
            key: 'liked',
            value: JSON.stringify(likes),
            type: MetadataAttributeType.JSON,
          },
          {
            key: "SkillXChange",
            value: 'SkillXChange',
            type: MetadataAttributeType.STRING,
          },
          {
            key: "metirl",
          value: metIrlVal,
          type: MetadataAttributeType.BOOLEAN,
        },
        ],
    });

    const metadataURI = await uploadMetadata(metadata);

    console.log("metirlval: ", metIrlVal);

    const result = await update({
        metadataURI,
        sponsored: true,
    });

    if (result.isFailure()) {
        console.error(result.error.message);
        return;
    }

    const completion = await result.value.waitForCompletion();

    if (completion.isFailure()) {
        console.error(completion.error.message);
        return;
    }

    console.log('Profile liked');
    console.log('active profile is: ', activeProfile);
    
    // Retrieve the 'liked' attribute, assuming it exists and is JSON encoded
    let lik;
    const likAttr = cardProfile.metadata?.attributes?.find(a => a.key === 'liked');
    if (likAttr && likAttr.value) {
        try {
            // Parse it directly if it exists
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


    // Example handle to search for
    const handleToSearch = activeProfile.handle?.fullHandle || 'placeholder';
    console.log("handle to search at end of like function: ", handleToSearch);
    const isHandleLiked = lik.includes(handleToSearch);

    if(isHandleLiked) {
      //ALERT USER THEY MATCHED
      window.confirm(
        `You matched with ${cardProfile.handle?.fullHandle}! Go to your matches page to start the conversation!`,
      );
    }
  }

  async function dislikeProfile() {
    //Don't have to do anything then, would just switch to next page.
  }

  return (
    <>
    {firstTime &&
    <form onSubmit={onSubmit} style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>

      <label style={{ display: 'block', marginBottom: '10px' }}>
        Name:
        <input type="text" placeholder="Your name" required disabled={loading} name="name" defaultValue={activeProfile.metadata?.displayName ?? ''} style={{ width: '100%', padding: '8px', margin: '6px 0' }} />
      </label>

      <label style={{ display: 'block', marginBottom: '10px' }}>
        Bio:
        <textarea rows={3} placeholder="Write a line about you" required style={{ resize: 'none', width: '100%', padding: '8px', margin: '6px 0' }} disabled={loading} name="bio" defaultValue={activeProfile.metadata?.bio ?? ''} />
      </label>

      <label style={{ display: 'block', marginBottom: '10px' }}>
        Location:
        <input type="text" placeholder="Where are you?" required style={{ width: '100%', padding: '8px', margin: '6px 0' }} disabled={loading} name="location" defaultValue={activeProfile.metadata?.attributes?.find(a => a.key === 'location')?.value ?? ''} />
      </label>

      <label style={{ display: 'block', marginBottom: '10px' }}>
        Image:
        <input type="file" name="image" disabled={loading} style={{ display: 'block', marginTop: '6px' }} />
      </label>

      <label style={{ display: 'block', marginBottom: '15px' }}>
        <input type="checkbox" name="sponsored" disabled={loading} defaultChecked style={{ marginRight: '6px' }} />
        Sponsored
      </label>

      <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        {loading ? 'Updating...' : 'Update'}
      </button>

      {error && <p>{error.message}</p>}
    </form>}
    {!firstTime && 
    <>
    {/* <p>{activeProfile.metadata?.attributes?.find(a => a.key === 'liked')?.value}</p> */}
    <Button onClick={likeProfile} disabled={activeProfile.handle?.fullHandle==cardProfile.handle?.fullHandle || isHandleLiked}>LIKE</Button> 
    </>
    }
    </>
  );
}

export function UseSetProfileMetadata({ session, firstTime, cardProfile }: { session: Session, firstTime: boolean, cardProfile: Profile }) {
  if(!session.authenticated || !(session.type === SessionType.WithProfile)) {return null;}
  return (
    <div>
      <UpdateProfileForm activeProfile={session.profile} firstTime={firstTime} cardProfile={cardProfile}/>
    </div>
  );
}
