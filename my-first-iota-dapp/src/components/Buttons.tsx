import { Button, Container, Flex } from "@radix-ui/themes";

export default ({ buyField, setBuyField, tipField, setTipField, redeemField, setRedeemField, showBalance, setShowBalance }) => {
  return (
    <Container>
      <Flex style={{ marginLeft: "459px" }} direction={"column"} width={"200px"} gap={"25px"}>
        <Button style={{ cursor: "pointer", borderRadius: "50px", padding: "10px 20px" }} onClick={() => {
          setBuyField(!buyField);
          setTipField(false);
          setRedeemField(false);
          setShowBalance(false);
        }}>Buy TIP Tokens</Button>
        <Button style={{ cursor: "pointer", borderRadius: "50px", padding: "10px 20px" }} onClick={() => {
          setTipField(!tipField);
          setBuyField(false);
          setRedeemField(false);
          setShowBalance(false);
        }}>Tip Creator</Button>
        <Button style={{ cursor: "pointer", borderRadius: "50px", padding: "10px 20px" }} onClick={() => {
          setRedeemField(!redeemField);
          setBuyField(false);
          setTipField(false);
          setShowBalance(false);
        }}>Redeem Tokens</Button>
        <Button style={{ cursor: "pointer", borderRadius: "50px", padding: "10px 20px" }} onClick={() => {
          setShowBalance(!showBalance);
          setBuyField(false);
          setTipField(false);
          setRedeemField(false);
        }}>Check Balance</Button>
      </Flex>
    </Container>
  );
}
