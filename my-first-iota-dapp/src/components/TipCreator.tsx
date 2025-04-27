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

const TipCreator = ({ setTipField }) => {
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const packageId = useNetworkVariable('packageId');
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const client = useIotaClient();

    const handleTip = async () => {
        const token = (await client.getCoins(`${packageId}::tipping::TIP_TOKEN`)).find(c => c.value >= parseInt(amount));
        if (!token) {
            alert('Insufficient TIP_TOKEN balance');
            return;
        }
        const transaction = new TransactionBlock();
        transaction.moveCall({
            target: `${packageId}::tipping::tip`,
            arguments: [transaction.object(token.id), transaction.pure.u64(parseInt(amount)), transaction.object(address)],
        });
        await signAndExecuteTransaction(transaction);
        setAddress("");
        setAmount("");
        setTipField(false);
    };

    return (
        <Dialog.Root defaultOpen={true}>
            <Dialog.Portal>
                <Dialog.Overlay style={styles.dialogOverlay} />
                <Dialog.Content style={styles.dialogContent}>
                    <Dialog.Title style={styles.dialogTitle}>Tip Creator</Dialog.Title>
                    <Dialog.Description style={styles.dialogDescription}>
                        Enter the creator's address and amount to tip.
                    </Dialog.Description>
                    <div style={styles.descriptionBox}>
                        <input
                            placeholder="Creator Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            placeholder="Amount of TIP Tokens"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={styles.input}
                        />
                        <button style={styles.button} onClick={handleTip}>
                            Tip Creator
                        </button>
                    </div>
                    <Dialog.Close asChild>
                        <button style={styles.cancelButton} onClick={() => setTipField(false)}>✕</button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default TipCreator;