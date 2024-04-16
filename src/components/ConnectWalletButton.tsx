import { ConnectKitButton } from "connectkit";
import { Button } from "./Button";

export function ConnectWalletButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress }) => {
        return <Button onClick={show}>{isConnected ? truncatedAddress : "connect wallet"}</Button>;
      }}
    </ConnectKitButton.Custom>
  );
}
