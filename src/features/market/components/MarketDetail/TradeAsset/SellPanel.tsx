import React, { useState } from "react";

import Button from "@/components/Button/Button";
import CustomNumberInput from "@/components/Form/CustomNumberInput";
import { showToast } from "@/components/Toast/CustomToast";
import useNumberInput from "@/hooks/useNumberInput";
import usePortfolio from "@/hooks/usePortfolio";
import { sellService } from "@/lib/services";
import { ITokenDetails, quickAddPercentage } from "@/types";

const SellPanel = ({ token }: { token: ITokenDetails }) => {
  // TOKEN INPUT
  const {
    value: tokenValue,
    displayValue: tokenDisplay,
    handleInputChange: handleTokenChange,
    handleInputBlur: handleTokenBlur,
  } = useNumberInput();
  // IDR INPUT
  const {
    value: idrValue,
    displayValue: idrDisplay,
    handleInputChange: handleIDRChange,
    handleInputBlur: handleIDRBlur,
  } = useNumberInput();
  const { getAssetBalance, refreshBalance } = usePortfolio();

  const tokenSymbol = token.pairDetails.traded_currency_unit;
  const assetBalance = getAssetBalance(tokenSymbol);

  const [loading, setLoading] = useState(false);

  // HANDLE TOKEN INPUT
  const handleTokenInput = (value: string) => {
    handleTokenChange(value);
    if (token.priceDetails) {
      const totalIdr = parseFloat(value) * parseFloat(token.priceDetails.last);
      handleIDRChange(totalIdr.toString());
    }
  };

  // HANDLE IDR INPUT
  const handleIdrInput = (value: string) => {
    handleIDRChange(value);
    if (token.priceDetails) {
      const tokenAmount =
        parseFloat(value) / parseFloat(token.priceDetails.last);
      handleTokenChange(tokenAmount.toFixed(9).toString());
    }
  };

  // QUICK ADD OPTIONS
  const handleQuickAdd = (percentage: number) => {
    if (token.priceDetails) {
      const tokenAmount = (assetBalance * percentage) / 100;
      const totalIdr = tokenAmount * parseFloat(token.priceDetails.last) || 0;

      handleTokenChange(tokenAmount.toString());
      handleIDRChange(totalIdr.toString());
    }
  };

  // HANDLE BUY CRYPTO
  const handleSell = async () => {
    if (token.priceDetails?.last === undefined) return;
    try {
      setLoading(true);

      const tokenprice = parseFloat(token.priceDetails.last);

      const response = await sellService({
        amount: tokenValue || 0,
        price: tokenprice || 0,
        symbol: tokenSymbol || "",
      });

      if (response) {
        handleTokenChange("");
        handleIDRChange("");

        showToast.success(`Sell ${tokenValue} ${tokenSymbol} success!`);
      }
    } catch (error) {
      console.error(error);
      showToast.error(`Sell ${tokenValue} ${tokenSymbol} failed!`);
    } finally {
      setLoading(false);
      await refreshBalance();
    }
  };

  // BUTTON STATES
  const getSellButtonState = () => {
    // Processing state
    if (loading)
      return {
        text: "Processing...",
        disabled: true,
      };

    // No input
    if (tokenValue <= 0 || idrValue <= 0)
      return {
        text: `Enter ${tokenSymbol} Amount`,
        disabled: true,
      };

    // Insufficient balance
    if (tokenValue > assetBalance)
      return {
        text: `"Insufficient ${tokenSymbol} Balance`,
        disabled: true,
      };

    // Minimum transaction check
    const minimumTransactionAmount = 10000;
    if (idrValue < minimumTransactionAmount)
      return {
        text: `Minimum ${minimumTransactionAmount.toLocaleString()} IDR`,
        disabled: true,
      };

    return {
      text: `SELL ${tokenSymbol}`,
      disabled: false,
    };
  };

  const buttonState = getSellButtonState();

  if (!token) return <>Loading..</>;

  return (
    <div className="grid gap-y-4 px-4 py-5">
      <CustomNumberInput
        value={tokenDisplay}
        onChange={(v) => handleTokenInput(v)}
        onBlur={handleTokenBlur}
        placeholder={`${tokenSymbol} Amount`}
        className="p-3"
        suffix={tokenSymbol}
      />
      <div className="mb-1 flex gap-3">
        {quickAddPercentage.map((v) => (
          <Button
            key={v}
            onClick={() => handleQuickAdd(v)}
            variant="secondary"
            className="w-full bg-transparent px-0"
          >
            {v}%
          </Button>
        ))}
      </div>

      <CustomNumberInput
        value={idrDisplay}
        onChange={(v) => handleIdrInput(v)}
        onBlur={handleIDRBlur}
        placeholder={"Total IDR"}
        className="p-3"
        suffix="IDR"
      />

      <p className="text-start text-sm text-textSecondary">
        Balance: {assetBalance.toLocaleString()} {tokenSymbol}
      </p>

      <Button
        disabled={buttonState.disabled}
        className="w-full lg:h-12"
        onClick={handleSell}
      >
        {buttonState.text}
      </Button>
    </div>
  );
};

export default SellPanel;
