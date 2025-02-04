import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Link from "next/link";

import classNames from "classnames";

import Button from "@/components/Button/Button";
import CustomNumberInput from "@/components/Form/CustomNumberInput";
import { showToast } from "@/components/Toast/CustomToast";
import useAuth from "@/features/auth/hooks/useAuth";
import useTxUser from "@/features/market/hooks/useTxUser";
import useModal from "@/hooks/useModal";
import useNumberInput from "@/hooks/useNumberInput";
import usePortfolio from "@/hooks/usePortfolio";
import { buyService } from "@/lib/services";
import { ITokenDetails, quickAddPercentage } from "@/types";

import ConfirmationModal from "./ConfirmationModal";

const BuyPanel = ({ token }: { token: ITokenDetails }) => {
  const { t } = useTranslation();
  const { idrBalance, refreshBalance } = usePortfolio();
  const { openDepositModal } = useModal();
  const { isLoggedIn } = useAuth();
  const { refreshTxUser } = useTxUser(token);

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

  const [loading, setLoading] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const feePercentage = token.pairDetails.trade_fee_percent;

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
      const price = parseFloat(token.priceDetails.last);
      const idrAmount = parseFloat(value);
      const tokenAmount = idrAmount / price;

      handleTokenChange(tokenAmount.toFixed(9).toString());
    }
  };

  // QUICK ADD OPTIONS
  const handleQuickAdd = (percentage: number) => {
    if (token.priceDetails) {
      const price = parseFloat(token.priceDetails.last);

      if (percentage === 100) {
        const maxPossibleAmount = calculateMaxAmount(
          idrBalance,
          price,
          feePercentage,
        );

        const roundedMaxAmount = Math.floor(maxPossibleAmount * 1e8) / 1e8;
        const totalIdr = roundedMaxAmount * price;

        const roundedTotalIdr = Math.floor(totalIdr * 100) / 100;

        handleIdrInput(roundedTotalIdr.toString());
        return;
      }

      const requestedPercentage = percentage / 100;
      const totalIdr = Math.floor(idrBalance * requestedPercentage * 100) / 100;

      handleIdrInput(totalIdr.toString());
    }
  };

  const calculateMaxAmount = (
    balance: number,
    price: number,
    feePercentage: number,
  ) => {
    const feeMultiplier = 1 + feePercentage / 100;
    const rawAmount = balance / (price * feeMultiplier);
    return Math.floor(rawAmount * 1e8) / 1e8;
  };

  // HANDLE BUY CRYPTO
  const handleBuy = async () => {
    if (token.priceDetails?.last === undefined) return;
    try {
      setLoading(true);

      const tokenprice = parseFloat(token.priceDetails.last);
      const tokenSymbol = token.pairDetails.traded_currency_unit;

      const response = await buyService({
        amount: tokenValue || 0,
        price: tokenprice || 0,
        symbol: tokenSymbol || "",
        fee: feePercentage,
      });

      if (response) {
        await refreshBalance();
        handleTokenChange("");
        handleIDRChange("");
        refreshTxUser();
        showToast.success(`Buy ${tokenValue} ${tokenSymbol} success!`);
      }
    } catch (error) {
      console.error(error);
      showToast.error(
        `Buy ${tokenValue} ${token.pairDetails.traded_currency_unit} failed!`,
      );
    } finally {
      setLoading(false);
      setOpenConfirmation(false);
    }
  };

  // BUTTON STATES
  const getBuyButtonState = () => {
    // Processing state
    if (loading)
      return {
        text: t("Processing..."),
        disabled: true,
      };

    // No input
    if (tokenValue <= 0 || idrValue <= 0)
      return {
        text: `Enter ${token.pairDetails.traded_currency_unit} Amount`,
        disabled: true,
      };

    // Insufficient balance
    const totalWithFee =
      idrValue * (1 + token.pairDetails.trade_fee_percent / 100);
    if (totalWithFee > idrBalance)
      return {
        text: t("Insufficient IDR Balance"),
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
      text: `${t("BUY")} ${token.pairDetails.traded_currency_unit}`,
      disabled: false,
    };
  };

  const buttonState = getBuyButtonState();

  if (!token) return <>Loading..</>;

  return (
    <div className="grid w-full gap-y-4 px-4 py-5">
      <CustomNumberInput
        id="input-token"
        value={tokenDisplay}
        onChange={(v) => handleTokenInput(v)}
        onBlur={handleTokenBlur}
        placeholder={`${token.pairDetails.traded_currency_unit} Amount`}
        className="p-3"
        suffix={token.pairDetails.traded_currency_unit}
      />
      <div id="quick-add" className="mb-1 flex w-full gap-3">
        {quickAddPercentage.map((v) => (
          <button
            key={v}
            onClick={() => handleQuickAdd(v)}
            className={classNames(
              "flex flex-1 items-center justify-center rounded-lg border",
              "border-primaryAccent bg-primaryAccent/20 py-2 text-sm text-gray-50",
              "hover:bg-primaryAccent/30 md:text-base",
            )}
          >
            {v}%
          </button>
        ))}
      </div>

      <CustomNumberInput
        id="input-idr"
        value={idrDisplay}
        onChange={(v) => handleIdrInput(v)}
        onBlur={handleIDRBlur}
        placeholder={"Total IDR"}
        className="p-3"
        suffix="IDR"
      />

      <p id="balance" className="w-fit text-start text-sm text-textSecondary">
        {t("Balance")}: Rp.{idrBalance.toLocaleString()}
      </p>

      {idrBalance < 10000 && isLoggedIn && (
        <Button
          className="w-full lg:h-12"
          onClick={() => {
            if (idrBalance < 10000) {
              openDepositModal();
            }
          }}
        >
          Deposit
        </Button>
      )}

      {!isLoggedIn && (
        <Link href="/auth/login">
          <Button className="w-full lg:h-12">Deposit</Button>
        </Link>
      )}

      {idrBalance >= 10000 && isLoggedIn && (
        <Button
          disabled={buttonState.disabled}
          className="w-full lg:h-12"
          onClick={() => setOpenConfirmation(true)}
        >
          {buttonState.text}
        </Button>
      )}

      <ConfirmationModal
        isOpen={openConfirmation}
        token={token}
        totalIdr={idrValue}
        totalCrypto={tokenValue}
        loading={loading}
        type="Buy"
        onClose={() => setOpenConfirmation(false)}
        onConfirm={handleBuy}
      />
    </div>
  );
};

export default BuyPanel;
