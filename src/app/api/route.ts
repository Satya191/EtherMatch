// app/api/upload/route.js

import { NextResponse } from "next/server";
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import lighthouse from '@lighthouse-web3/sdk';
import { NextApiRequest, NextApiResponse } from "next";

// To handle a POST request to /api/upload
export async function POST(request) {
    // console.log("REQUEST TO API POST!!");
    const { apiKey, appendContent } = await request.json();
    // console.log("api key is ", apiKey);
    // console.log("appendContent is ", appendContent);

    try {
        const uploadsResponse = await lighthouse.getUploads(apiKey);
        const fileList = uploadsResponse.data.fileList;
        const profileFiles = fileList.filter(file => file.fileName.startsWith('skillxchangeprofiles') && file.fileName.endsWith('.txt'));
        const highestFile = profileFiles.reduce((prev, current) => {
            const prevNumber = parseInt(prev.fileName.match(/(\d+)(?=\.txt$)/)?.[0] ?? "0", 10);
            const currentNumber = parseInt(current.fileName.match(/(\d+)(?=\.txt$)/)?.[0] ?? "0", 10);
            return (prevNumber > currentNumber) ? prev : current;
        });
        // console.log("before fetch from ipfs");

        // Fetch the latest file content
        const fileResponse = await fetch(`http://gateway.lighthouse.storage/ipfs/${highestFile.cid}`);
        // console.log("file response: ", fileResponse);
        // console.log("file response ok? ", fileResponse.ok);
        if (!fileResponse.ok) throw new Error('Failed to fetch the file.');

        const fileData = await fileResponse.arrayBuffer();
        // Convert ArrayBuffer to Buffer
        const fileBuffer = Buffer.from(fileData);
        const appendedContent = Buffer.from("\n" + appendContent);
        const finalData = Buffer.concat([fileBuffer, appendedContent]);

        // Determine new file name
        const numberPart = parseInt(highestFile.fileName.match(/(\d+)(?=\.txt$)/)?.[0] ?? "0", 10);
        const newFileName = `skillxchangeprofiles${numberPart + 1}.txt`;

        // Write the file temporarily to the filesystem
        const filePath = path.join('/tmp', newFileName);
        fs.writeFileSync(filePath, finalData);

        // Upload the file using Lighthouse SDK
        const deployResponse = await lighthouse.upload(
            filePath, 
            apiKey, 
            false, 
            undefined, 
            () => {}
        );

        // Clean up the local file
        fs.unlinkSync(filePath);

        return NextResponse.json({ message: "Upload successful", hash: deployResponse.data.Hash, newFileName }, { status: 200 });
    } catch (error) {
        console.error("Error during file operation:", error);
        return NextResponse.json({ message: "Error processing the file", error: error.message }, { status: 500 });
    }
}

// GET handler to fetch the content of the latest profiles file
export async function GET(request) {
    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY || '';  // Ensure your API key is stored securely
    console.log("apikey in get: ", apiKey);
    // return NextResponse.json({ message: "successful get request" }, { status: 200 });
    try {
        // console.log("INSIDE GET HANDLER");
        const uploadsResponse = await lighthouse.getUploads(apiKey);
        const fileList = uploadsResponse.data.fileList;
        const profileFiles = fileList.filter(file => file.fileName.startsWith('skillxchangeprofiles') && file.fileName.endsWith('.txt'));
        const highestFile = profileFiles.reduce((prev, current) => {
            const prevNumber = parseInt(prev.fileName.match(/(\d+)(?=\.txt$)/)?.[0] ?? "0", 10);
            const currentNumber = parseInt(current.fileName.match(/(\d+)(?=\.txt$)/)?.[0] ?? "0", 10);
            return (prevNumber > currentNumber) ? prev : current;
        });
        // console.log("highestFile name: ", highestFile.fileName);
        // console.log("highestfile cid: ", highestFile.cid);

        // Fetch the content of the latest file
        const fileResponse = await fetch(`http://gateway.lighthouse.storage/ipfs/${highestFile.cid}`);
        // console.log("fileResponse: ", fileResponse);
        if (!fileResponse.ok) throw new Error('Failed to fetch the file.');

        const fileData = await fileResponse.text();
        console.log("fileData: ", fileData);
        const profiles = fileData.split('\n').filter(line => line.trim() !== ''); // Assuming each line is a handle
        return NextResponse.json({ message: "successful get request", profiles }, { status: 200 });
    } catch (error) {
        console.error("Error during file operation:", error);
        return NextResponse.json({ message: "Error processing the file", error: error.message }, { status: 500 });
    }
}