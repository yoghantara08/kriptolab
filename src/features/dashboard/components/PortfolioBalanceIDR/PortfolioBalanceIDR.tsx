import React from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button/Button";
import Shimmer from "@/components/Loader/Shimmer";
import useModal from "@/hooks/useModal";
import usePortfolio from "@/hooks/usePortfolio";

const PortfolioBalanceIDR = () => {
  const { formattedBalance, isLoading } = usePortfolio();
  const { openDepositModal, openWithdrawModal } = useModal();
  const { t } = useTranslation();

  return (
    <div className="max-w-xl rounded-lg border-2 border-borderColor bg-cardBackground p-4 md:p-5">
      <h3 className="text-lg md:text-xl">{t("Balance")}</h3>
      <p
        id="idr-balance"
        className="mb-4 mt-2 flex w-fit items-center gap-2 text-2xl font-semibold md:text-3xl"
      >
        <span>Rp </span>
        {isLoading ? (
          <Shimmer className="mt-[2px] h-7 w-48 rounded-[4px]" />
        ) : (
          formattedBalance
        )}
      </p>
      <div className="flex gap-5">
        <Button
          id="deposit-button"
          className="w-[130px]"
          onClick={openDepositModal}
        >
          Deposit
        </Button>
        <Button
          id="withdraw-button"
          variant="secondary"
          className="w-[130px]"
          onClick={openWithdrawModal}
        >
          {t("Withdrawal")}
        </Button>
      </div>
    </div>
  );
};

export default PortfolioBalanceIDR;
