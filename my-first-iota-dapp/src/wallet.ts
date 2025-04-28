import { Wallet, Client } from '@iota/iota-sdk';
import { getFullnodeUrl } from '@iota/iota-sdk/client';
import { useWallet } from '@iota/dapp-kit';

export const useIotaWallet = () => {
  const { wallet } = useWallet();
  const client = new Client({
    primaryNode: getFullnodeUrl('testnet'),
  });

  const initWallet = async () => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }
    const walletInstance = new Wallet({
      client,
      accountIndex: 0, // Use the first account; adjust if needed
      mnemonic: wallet.mnemonic, // Assumes wallet provides mnemonic or private key
    });
    await walletInstance.sync();
    return walletInstance;
  };

  const getCoinObjects = async (coinType: string) => {
    const walletInstance = await initWallet();
    const account = await walletInstance.getAccount();
    const outputs = await account.getOutputs();
    return outputs
      .filter(output => output.metadata.coinType === coinType)
      .map(output => ({
        coinObjectId: output.outputId,
        balance: output.amount,
      }));
  };

  const getBalance = async (coinType: string) => {
    const coins = await getCoinObjects(coinType);
    return coins.reduce((acc, coin) => acc + coin.balance, 0);
  };

  return { getCoinObjects, getBalance };
};