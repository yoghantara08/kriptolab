import React from "react";
import { useTranslation } from "react-i18next";

import classNames from "classnames";

import CustomTable from "@/components/Table/TableCustom";
import { ColumnType } from "@/components/Table/types";
import useWindowSize from "@/hooks/useWindowSize";
import { formatDate } from "@/lib/helpers";
import { formatCurrencyValue } from "@/lib/helpers/formatCurrencyValue";
import { ITransaction } from "@/types";

const MyTradesPanel = ({
  trades,
  symbol,
  isLoading,
}: {
  trades: ITransaction[];
  symbol: string;
  isLoading: boolean;
}) => {
  const { i18n, t } = useTranslation();
  const { isMobile } = useWindowSize();

  const THEAD: string[] = ["Date", "Type", "Price", "Amount"];

  const marketColumns: ColumnType<ITransaction>[] = [
    {
      key: "date",
      label: t("Date"),
      width: isMobile ? 200 : "25%",
      className: "border-r border-borderColor px-3",
      customRender(value, rowData) {
        return (
          <span
            className={rowData.type === "BUY" ? "text-success" : "text-error"}
          >
            {formatDate(
              Math.floor(new Date(value).getTime() / 1000).toString() || "",
              i18n.language === "id" ? "id-ID" : "en-GB",
              true,
            )}
          </span>
        );
      },
    },
    {
      key: "type",
      label: t("Type"),
      width: isMobile ? 200 : "25%",
      className: "border-r border-borderColor px-3",
      customRender(value, rowData) {
        return (
          <span
            className={classNames(
              "capitalize",
              rowData.type === "BUY" ? "text-success" : "text-error",
            )}
          >
            {t(value.toLowerCase())}
          </span>
        );
      },
    },
    {
      key: "price",
      label: t("Price"),
      width: isMobile ? 200 : "25%",
      className: "border-r border-borderColor px-3",
      customRender(value, rowData) {
        return (
          <span
            className={rowData.type === "BUY" ? "text-success" : "text-error"}
          >
            {formatCurrencyValue(parseFloat(value || "0"), "IDR", true) ?? 1}
          </span>
        );
      },
    },
    {
      key: "traded_amount",
      label: t("Amount"),
      width: isMobile ? 200 : "25%",
      className: "px-3 border-r border-transparent",
      customRender(value, rowData) {
        return (
          <span
            className={rowData.type === "BUY" ? "text-success" : "text-error"}
          >
            {rowData.type === "BUY"
              ? parseFloat(rowData.traded_amount).toFixed(9)
              : parseFloat(rowData.base_amount).toFixed(9)}{" "}
            {symbol}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {!isMobile && (
        <div className="sticky top-0 z-10 flex h-11 w-full items-center border-b border-borderColor bg-background">
          {THEAD.map((item, index) => (
            <div
              key={index}
              className="mb-[1px] flex h-full w-1/4 items-center border-r border-borderColor px-3 text-textSecondary last:border-transparent"
            >
              {t(item)}
            </div>
          ))}
        </div>
      )}
      {trades.length > 0 ? (
        <CustomTable
          rowKey="_id"
          columns={marketColumns}
          data={trades ?? []}
          rowHeight={46}
          headerHeight={46}
          className="w-full"
          bodyClassName="border-b border-borderColor"
          wrapperClassName="border-none !rounded-none max-w-[calc(100vw-2rem)] md:max-w-none"
          includeThead={isMobile}
        />
      ) : (
        <div className="flex h-80 items-center justify-center text-lg text-textSecondary">
          {isLoading ? t("Loading...") : t("No data")}
        </div>
      )}
    </div>
  );
};

export default MyTradesPanel;
