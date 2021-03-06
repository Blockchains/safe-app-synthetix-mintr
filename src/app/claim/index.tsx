import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Text } from '@gnosis.pm/safe-react-components';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Section from '../../components/Section';
import Icon from '../../components/Icon';
import { bigNumberFormatter, formatCurrency } from '../../helpers/formatters';
import { snxJSConnector } from '../../helpers/snxJSConnector';
import Balance from '../Balance';
import { addSeconds, formatDistanceToNow } from 'date-fns';
import { SafeContext } from '../SafeProvider';

const StyledPaper = styled(Paper)`
  &.MuiPaper-root {
    padding: 24px 16px;
  }
`;

const StyledGridBalance = styled(Grid)`
  padding: 0 24px 0 6px;
`;

const StyledGridSNX = styled(Grid)`
  padding-right: 6px;
`;

const SubmitButton = styled(Button)`
  &.MuiButton-root {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
    font-size: 1rem;
    padding: 16px 24px;
  }

  @media screen and (max-width: 900px) {
    width: 100%;
  }

  &.MuiButton-root:hover {
    background-color: #8c94ff;
  }
`;

const StyledGrid = styled(Grid)`
  margin-top: 5px !important;
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;

  button {
    margin: 0.5rem 0;
  }
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const FEE_PERIOD = 0;

const getFeePeriodCountdown = (
  recentFeePeriods: any,
  feePeriodDuration: any
) => {
  if (!recentFeePeriods) return;
  const currentPeriodStart =
    recentFeePeriods && recentFeePeriods.startTime
      ? new Date(parseInt(recentFeePeriods.startTime) * 1000)
      : null;
  const currentPeriodEnd =
    currentPeriodStart && feePeriodDuration
      ? addSeconds(currentPeriodStart, feePeriodDuration)
      : 0;
  return formatDistanceToNow(currentPeriodEnd);
};

type Data = {
  closeIn: string | undefined;
  feesAreClaimable: boolean;
  feesAvailable: any;
  dataIsLoading: boolean;
};

const useGetFeeData = (walletAddress: string): Data => {
  const [data, setData] = useState<Data>({
    closeIn: '',
    feesAreClaimable: false,
    feesAvailable: 0,
    dataIsLoading: false
  });

  const snxJS = snxJSConnector.snxJS;

  useEffect(() => {
    const getFeeData = async () => {
      try {
        setData({ ...data, dataIsLoading: true });
        const [
          feePeriodDuration,
          recentFeePeriods,
          feesAreClaimable,
          feesAvailable
        ] = await Promise.all([
          snxJS.FeePool.feePeriodDuration(),
          snxJS.FeePool.recentFeePeriods(FEE_PERIOD),
          snxJS.FeePool.isFeesClaimable(walletAddress),
          snxJS.FeePool.feesAvailable(walletAddress)
        ]);

        const closeIn = getFeePeriodCountdown(
          recentFeePeriods,
          feePeriodDuration
        );

        setData({
          closeIn,
          feesAreClaimable,
          feesAvailable: feesAvailable.map(bigNumberFormatter),
          dataIsLoading: false
        });
      } catch (e) {
        console.log(e);
      }
    };
    getFeeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);
  return data;
};

function Claim() {
  const { safeInfo, appsSdk } = useContext(SafeContext);
  const {
    closeIn,
    feesAreClaimable,
    feesAvailable,
    dataIsLoading
  } = useGetFeeData(safeInfo.safeAddress);

  const hasFeesAvailable =
    feesAvailable && (feesAvailable[0] || feesAvailable[1]);

  const handleClaim = async () => {
    const {
      snxJS: { FeePool }
    } = snxJSConnector;

    const tx = {
      to: snxJSConnector.utils.contractSettings.addressList.FeePool,
      value: 0,
      data: FeePool.contract.interface.functions.claimFees.encode([])
    };

    appsSdk.sendTransactions([tx]);
  };

  return (
    <>
      <Section
        icon={<Icon size="md" type="claim" />}
        name="Claim"
        description="If you have staked your SNX and minted sUSD, you are eligible to collect two kinds of rewards: SNX staking rewards, and Synth exchange rewards generated on Synthetix.Exchange."
      />
      <StyledPaper elevation={3}>
        <TextContainer>
          <div>
            <Text size="sm">Your available Synth exchange rewards:</Text>
            <Text size="xl" strong>
              {feesAvailable && feesAvailable[0]
                ? formatCurrency(feesAvailable[0])
                : 0}{' '}
              sUSD
            </Text>
          </div>
          <div>
            <Text size="sm">Your available SNX staking rewards:</Text>
            <Text size="xl" strong>
              {feesAvailable && feesAvailable[1]
                ? formatCurrency(feesAvailable[1])
                : 0}{' '}
              SNX
            </Text>
          </div>
        </TextContainer>

        <Text size="lg">TIME LEFT TO CLAIM</Text>
        <Text size="xl" strong>
          {closeIn}
        </Text>

        <ButtonContainer>
          <Text size="sm">
            Your fee claim status: {feesAreClaimable ? 'OPEN' : 'BLOCKED'}
          </Text>
          <SubmitButton
            variant="contained"
            onClick={handleClaim}
            disabled={!feesAreClaimable || !hasFeesAvailable || dataIsLoading}
          >
            CLAIM NOW
          </SubmitButton>
          <Text size="sm">
            Note: if not collected within 7 days, your rewards will be forfeited
            and rolled over into the fee pool.
          </Text>
        </ButtonContainer>
      </StyledPaper>
    </>
  );
}

function ClaimPage() {
  return (
    <StyledGrid container>
      <StyledGridBalance item xs={5}>
        <Balance />
      </StyledGridBalance>
      <StyledGridSNX item xs={7}>
        <Claim />
      </StyledGridSNX>
    </StyledGrid>
  );
}

export default ClaimPage;
