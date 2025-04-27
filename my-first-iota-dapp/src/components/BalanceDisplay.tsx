import { Flex, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { useNetworkVariable } from '../networkConfig';
import { useIotaClient } from '@iota/dapp-kit';

const BalanceDisplay = () => {
    const [iotaBalance, setIotaBalance] = useState("0");
    const [tipTokenBalance, setTipTokenBalance] = useState("0");
    const client = useIotaClient();
    const packageId = useNetworkVariable('packageId');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const iotaCoins = await client.getCoins('IOTA');
            const iotaTotal = iotaCoins.reduce((acc, coin) => acc + coin.value, 0);
            setIotaBalance(iotaTotal.toString());

            const tipTokenType = `${packageId}::tipping::TIP_TOKEN`;
            const tipTokenCoins = await client.getCoins(tipTokenType);
            const tipTokenTotal = tipTokenCoins.reduce((acc, coin) => acc + coin.value, 0);
            setTipTokenBalance(tipTokenTotal.toString());

            setLoading(false);
        })();
    }, [client, packageId]);

    return (
        <Flex direction="column" align="center">
            {!loading && (
                <>
                    <Text>IOTA Balance: {iotaBalance}</Text>
                    <Text>TIP Token Balance: {tipTokenBalance}</Text>
                </>
            )}
        </Flex>
    );
};

export default BalanceDisplay;