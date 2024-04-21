
# EtherMatch

## Web3 social dating, tinder meets evm ;)


https://ethglobal.com/showcase/ethermatch-wr60s

Project Description: <br>

This project combines a nextjs front-end with a lens-protocol sdk backend. Dating apps are social networks which is why I decided to use the lens protocol. User onboarding, profile displaying, following, a lot of the things that are done on this project use the lens-protocol sdk. This project also uses lighthouse.storage and Irys for storage. Irys is used to store profile metadata before uploading to lens-protocol and lighthouse.storage is used to maintain a list of profiles that have registered to the app. Irys stores the data/files on arweave whereas lighthouse.storage stores the data on ipfs. I wanted to use both decentralized storage providers since this can potentially increase fault tolerance. This project also uses sign protocol to validate if users have met in person/online and then sets a lens profile attribute to persist this validation.

How it's Made: <br>

I initially started off this project trying to use scaffold-eth but then quickly realized it had too many features and was a bit distracting. I experimented with the lens-docs-quickstart nextjs starter kit template and found that to be the easiest to get started with. I also found the lens-protocol react-hook sdk to be easier to use then the client sdk, which is why I decided to use it. Then I used Irys and Lighthouse.storage for uploading files. Finally, I wanted a way to verify if users met each other either online or in person so I decided to use sign protocol. I store this validation in the user's lens profile and use it to filter by those who have at least met another person. This implementation with sign protocol was very smooth and, through this validation, allows an additional layer of security for users.






This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run ```npm install```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

