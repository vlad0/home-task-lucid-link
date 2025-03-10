import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { NumericFormat } from 'react-number-format';

type TradeInfoResponse = {
  buyTime: string,
  buyPrice: string,
  sellTime: string,
  sellPrice: string
}

const DataFetcher = () => {
  const [tradeInfo, setTradeInfo] = useState<TradeInfoResponse>()

  const [start, setStart] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cash, setCash] = useState<BigNumber>()
  const [shares, setShares] = useState<BigNumber>()
  const [profit, setProfit] = useState<BigNumber>()
  const [end, setEnd] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!end || !start) return;

    if ((end.getTime() - start.getTime()) < 0) {
      setError('End date should be after start date')
    } else {
      setError(null)
    }

    setTradeInfo(undefined)
  }, [start, end])

  useEffect(() => {
    if (!tradeInfo) return;
    const { sellPrice, buyPrice } = tradeInfo

    if (!sellPrice || !buyPrice) {
      setError(`No sell price(${sellPrice}) or buy price (${buyPrice})`)
      return;
    }

    const sPrice = new BigNumber(sellPrice)
    const bPrice = new BigNumber(buyPrice)

    const profitPerShare = sPrice.minus(bPrice)

    const shares = cash?.dividedBy(bPrice)
    const profits = shares?.multipliedBy(profitPerShare)
    setShares(shares)
    setProfit(profits)
  }, [cash, tradeInfo])

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = new URL('/api/trade', window.location.origin);
      url.searchParams.append('start', start?.toISOString() ?? '')
      url.searchParams.append('end', end?.toISOString() ?? '')

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {

        throw new Error(`Network response was not ok ${result.message}`);

      }
      setTradeInfo(result);
    } catch (ex: unknown) {
      console.error('Exception: ', ex)
      if (ex instanceof Error) {
        setError(ex.message);
      } else {
        setError('Ooops something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box>
        <Typography variant="h4" gutterBottom>
          BTC prices @ MAY-2018
        </Typography>
        <Typography>
          App version: {import.meta.env.VITE_VERSION}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker sx={{ m: 1 }}
            value={start}
            onChange={(newValue) => setStart(newValue)}
            minDateTime={new Date("2018-05-01T00:00:00.249Z")}
            maxDateTime={new Date('2018-05-30T23:59:57.821Z')} />
          <DateTimePicker sx={{ m: 1 }} value={end} onChange={(newValue) => setEnd(newValue)}
            minDateTime={new Date("2018-05-01T00:00:00.249Z")}
            maxDateTime={new Date('2018-05-30T23:59:57.821Z')}

          />
          {error && <Alert severity="error" sx={{ m: 1 }}>
            {error}
          </Alert>
          }
          <Button sx={{ m: 1 }} variant="contained" color="primary" disabled={!!error || loading || !start || !end} onClick={fetchData}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}>
            GET PRICE
          </Button>
          <br></br>
          <NumericFormat
            sx={{ m: 1 }}
            value={cash?.toString()}
            onValueChange={(values) => setCash(new BigNumber(values.value))}
            customInput={TextField}
            thousandSeparator
            valueIsNumericString
            prefix="$"
            variant="standard"
            label="Initial investment"
          />
        </LocalizationProvider>
        {!!tradeInfo && <Box sx={{ mt: 2 }}>
          <Typography color="primary">
            Buy price: {tradeInfo?.buyPrice}
          </Typography>
          <Typography color="green">
            Sell price: {tradeInfo?.sellPrice}
          </Typography>
          {(cash?.isGreaterThan(0)) && <>
            <Typography color="primary">
              Shares: {shares?.toFixed(2)}
            </Typography>
            <Typography color="primary">
              Profit: {profit?.toFixed(2)}
            </Typography>
          </>
          }
        </Box>}
      </Box>
    </Container >
  );
};

export default DataFetcher;

// 01/01/2025 02:00 AM
// 01/03/2025 04:00 AM
