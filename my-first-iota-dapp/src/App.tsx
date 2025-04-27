import { ConnectButton } from "@iota/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import Buttons from "./components/Buttons";
import { useState } from "react";
import BalanceDisplay from "./components/BalanceDisplay";
import BuyTokens from "./components/BuyTokens";
import TipCreator from "./components/TipCreator";
import RedeemTokens from "./components/RedeemTokens";

function App() {
  const [buyField, setBuyField] = useState(false);
  const [tipField, setTipField] = useState(false);
  const [redeemField, setRedeemField] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  return (
    <Box>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        align={"center"}
        style={{
          borderBottom: "1px solid var(--gray-a2)",
          background: "#1e2531"
        }}
      >
        <Box>
          <Heading>Tipping Platform</Heading>
        </Box>
        <Flex align={"center"}>
          <ConnectButton />
        </Flex>
      </Flex>
      <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "95vh", background: "#181d27" }} >
        <Container mt="5" py="2" px="4" mb={"4"}>
          <Buttons
            buyField={buyField}
            setBuyField={setBuyField}
            tipField={tipField}
            setTipField={setTipField}
            redeemField={redeemField}
            setRedeemField={setRedeemField}
            showBalance={showBalance}
            setShowBalance={setShowBalance}
          />
        </Container>
        {showBalance && <BalanceDisplay />}
        {buyField && <BuyTokens setBuyField={setBuyField} />}
        {tipField && <TipCreator setTipField={setTipField} />}
        {redeemField && <RedeemTokens setRedeemField={setRedeemField} />}
      </Container>
    </Box>
  );
}

export default App;