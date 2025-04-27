import { useState } from 'react';
import { useNetworkVariable } from '../networkConfig';
import { useIotaClient, useSignAndExecuteTransaction } from '@iota/dapp-kit';
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

const BuyTokens = ({ setBuyField }) => {
    const [amount, setAmount] = useState("");
    const packageId = useNetworkVariable('packageId');
    const tippingPlatformId = useNetworkVariable('tippingPlatformId');
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const client = useIotaClient();

    const handleBuy = async () => {
        const transaction = new TransactionBlock();
        const [payment] = transaction.splitCoins(transaction.gas, [parseInt(amount)]);
        transaction.moveCall({
            target: `${packageId}::tipping::buy_tokens`,
            arguments: [transaction.object(tippingPlatformId), payment],
        });
        await signAndExecuteTransaction(transaction);
        setAmount("");
        setBuyField(false);
    };

    return (
        <Dialog.Root defaultOpen={true}>
            <Dialog.Portal>
                <Dialog.Overlay style={styles.dialogOverlay} />
                <Dialog.Content style={styles.dialogContent}>
                    <Dialog.Title style={styles.dialogTitle}>Buy TIP Tokens</Dialog.Title>
                    <Dialog.Description style={styles.dialogDescription}>
                        Enter the amount of IOTA to spend.
                    </Dialog.Description>
                    <div style={styles.descriptionBox}>
                        <input
                            placeholder="Amount of IOTA"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={styles.input}
                        />
                        <button style={styles.button} onClick={handleBuy}>
                            Buy Tokens
                        </button>
                    </div>
                    <Dialog.Close asChild>
                        <button style={styles.cancelButton} onClick={() => setBuyField(false)}>✕</button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default BuyTokens;