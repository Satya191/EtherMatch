// import { useSetProfileMetadata } from "@lens-protocol/react-web";
// import { profile, MetadataAttributeType } from "@lens-protocol/metadata";
// import { ThirdwebStorage,  } from "@thirdweb-dev/storage";

// // Define the interface for the metadata parameters
// interface MetadataParams {
//     name: string;
//     bio: string;
//     jsonContent: string; // Make sure this type suits your data structure
// }

// export function useUpdateProfileMetadata() {

//     const { execute, data, loading, error } = useSetProfileMetadata();


//     const uploader = new StorageUploader();

//     const storage = new ThirdwebStorage({
//         secretKey: process.env.THIRDWEB_CLIENT_KEY, 
//         uploader
//     });

//     const updateMetadata = async ({ name, bio, jsonContent }: MetadataParams): Promise<any> => {
//         const metadata = profile({
//             name,
//             bio,
//             attributes: [ {
//                 key: "appStuff",
//                 type: MetadataAttributeType.JSON,
//                 value: jsonContent, // Spread the JSON content directly into the metadata object
//             }
//             ],
//         });

//         // Simulated function for uploading to IPFS
//         const uri = await uploadToIpfs(metadata); // Ensure you replace with actual IPFS upload logic

//         try {
//             const result = await execute({ metadataURI: uri });
//             return result; // Simplifying return, handle as needed
//         } catch (err) {
//             console.error("Error updating metadata:", err);
//             return err; // Returning error for handling in the component
//         }
//     };

//     return { updateMetadata, data, loading, error };
// }

// // Mock function for uploading to IPFS
// async function uploadToIpfs(metadata: any): Promise<string> {
//     // Implement your IPFS upload logic here
//     console.log("Uploading metadata:", metadata);
//     return "https://fakeipfsurl.com/metadata.json"; // Example URL
// }