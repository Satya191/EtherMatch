import Head from "next/head";
import { useState } from "react";
import { ethers } from "ethers";

import React from 'react';
import { MetadataAttributeType, profile } from '@lens-protocol/metadata';
import { Profile, Session, SessionType, useSetProfileMetadata } from '@lens-protocol/react-web';

import { useIrysUploadHandler } from '@/utils/useIrysUploader';
import { ProfileCard } from './ProfileCard';
import FileUploader from './FileUploader';
import { Button } from "./Button";

const contractAddress = "0x3850151BdC524E0df921e33159d41c9FB4D365bC";
import contractABI from '../mycontractabi.json'; // Ensure the ABI file is correctly imported


export default function UseUpdateIRLVal({ session, activeProfile }: { session: Session, activeProfile: Profile }) {
    const uploadMetadata = useIrysUploadHandler();
    const { execute: update, error, loading } = useSetProfileMetadata();
    const [message, setMessage] = useState('');
    if(!session || !session.authenticated || session.type != SessionType.WithProfile) return;


    async function updateIrl() {
        // Update or initialize the 'liked' attribute.
        if(!session || !session.authenticated || session.type != SessionType.WithProfile) return;
        let likes;
        const likedAttribute = session.profile.metadata?.attributes?.find(a => a.key === 'liked');
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
    
        let picture = '';
    
        if(session.profile.metadata?.picture?.__typename=='ImageSet'){
          picture = session.profile.metadata?.picture.raw.uri;
        }
    
        // Use the existing profile details but update the attributes array.
        const metadata = profile({
            appId: "SkillXChange",
            name: session.profile.metadata?.displayName || 'name',
            bio: session.profile.metadata?.bio || 'bio',
            picture: picture,
            attributes: [
              {
                key: 'location',
                value: session.profile.metadata?.attributes?.find(a => a.key === 'location')?.value || '',
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
                value: 'true',
                type: MetadataAttributeType.BOOLEAN,
              },
            ],
        });
    
        const metadataURI = await uploadMetadata(metadata);
    
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
    
        console.log('Profile updated');
      }

    // Function to get a signer from MetaMask
    async function getSigner() {
        const provider = new ethers.BrowserProvider(window.ethereum)
        // console.log("got the provider")
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        return signer;
    }

    // Function to claim met IRL
    async function claimMetIRL() {
        const signer = await getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        try {
            console.log("activeProfile addr: ", activeProfile.ownedBy.address);
            const tx = await contract.claimMetIRL(activeProfile.ownedBy.address);
            await tx.wait();
            setMessage('Claim sent successfully!');
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error sending claim.');
        }
    }

    // Function to confirm met IRL
    async function confirmMetIRL() {
        const signer = await getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        try {
            console.log("activeProfile addr: ", activeProfile.ownedBy.address);
            const tx = await contract.confirmMetIRL(activeProfile.ownedBy.address, ethers.toUtf8Bytes(''));
            const receipt = await tx.wait();
            const attestationId = receipt.events?.filter(x => x.event === 'DidMeetIRL')[0].args?.attestationId;
            setMessage('confirm success');
            updateIrl();
            
        } catch (error) {
            console.error('Error:', error);
            setMessage('Confirmation failed.');
        }
    }

    return (
        <>
        <div>
            <Head>
                <title>Actually Met IRL</title>
            </Head>
            <div>
                
                <button onClick={claimMetIRL}>Claim Met IRL</button>
                <p>-----------------</p>
                <button onClick={confirmMetIRL}>Confirm Met IRL</button>
                <p>-----------------</p>
                <p>{message}</p>
            </div>
            </div>
        </>
    );
}
