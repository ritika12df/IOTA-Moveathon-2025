import { getFullnodeUrl } from "@iota/iota-sdk/client";
import { createNetworkConfig } from "@iota/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        packageId: 'YOUR_PACKAGE_ID',  // Replace with actual package ID
        tippingPlatformId: 'YOUR_TIPPING_PLATFORM_OBJECT_ID',  // Replace with actual object ID
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };