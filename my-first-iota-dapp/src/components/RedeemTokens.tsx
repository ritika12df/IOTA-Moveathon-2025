import { useState } from 'react';
import { useNetworkVariable } from '../networkConfig';
import { useIotaClient, useSignAndExecuteTransaction } from '@iota/dapp-kit';
import { useIotaWallet } from '../wallet';
import * as Dialog from "@radix-ui/react-dialog";

const styles = {
    dialogOverlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', inset: 0 },
    dialogContent: { backgroundColor: '#fff', borderRadius: '8px', padding: '20px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px' },
    dialogTitle: { margin: '0 0 10px', fontSize: '20px' },
    dialogDescription: { marginBottom: '20px', color: '#666' },
    descriptionBox: { display: 'flex', flexDirection: 'column', gap: '10px' },
    input: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' },
    button: { padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    cancelButton: { position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }
};

const RedeemTokens = ({ setRedeemField }) => {
    const [amount, setAmount] = useState("");
    const packageId = useNetworkVariable('packageId');
    const tippingPlatformId = useNetworkVariable('tippingPlatformId');
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransaction();
    const { getCoinObjects } = useIotaWallet();

    const handleRedeem = async () => {
        try {
            const tokenType = `${packageId}::tipping::TIPPING`;
            const coins = await getCoinObjects(tokenType);
            const coin = coins.find(c => c.balance >= parseInt(amount));
            if (!coin) {
                alert('Insufficient TIP_TOKEN balance');
                return;
            }
            const transaction = {
                kind: 'ProgrammableTransaction',
                transactions: [
                    {
                        MoveCall: {
                            package: packageId,
                            module: 'tipping',
                            function: 'redeem_tokens',
                            type_arguments: [],
                            arguments: [
                                tippingPlatformId,
                                coin.coinObjectId,
                            ],
                        },
                    },
                ],
            };
            await signAndExecuteTransactionBlock(transaction);
            setAmount("");
            setRedeemField(false);
            alert('Tokens Redeemed Successfully');
        } catch (error) {
            console.error('Transaction failed:', error);
            alert('Transaction failed. Please check your balance or try again.');
        }
    };

    return (
        <Dialog.Root defaultOpen={true}>
            <Dialog.Portal>
                <Dialog.Overlay style={styles.dialogOverlay} />
                <Dialog.Content style={styles.dialogContent}>
                    <Dialog.Title style={styles.dialogTitle}>Redeem TIP Tokens</Dialog.Title>
                    <Dialog.Description style={styles.dialogDescription}>
                        Enter the amount of TIP Tokens to redeem.
                    </Dialog.Description>
                    <div style={styles.descriptionBox}>
                        <input
                            placeholder="Amount of TIP Tokens"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={styles.input}
                        />
                        <button style={styles.button} onClick={handleRedeem}>
                            Redeem Tokens
                        </button>
                    </div>
                    <Dialog.Close asChild>
                        <button style={styles.cancelButton} onClick={() => setRedeemField(false)}>✕</button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default RedeemTokens;
