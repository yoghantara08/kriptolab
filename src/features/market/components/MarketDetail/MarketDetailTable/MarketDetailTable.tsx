import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa6";
import { IoChevronDown } from "react-icons/io5";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TabPanel,
} from "@headlessui/react";
import classNames from "classnames";

import TabCustom from "@/components/Tab/TabCustom";
import { INDODAX_URL } from "@/constants";
import useTxUser from "@/features/market/hooks/useTxUser";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import useWindowSize from "@/hooks/useWindowSize";
import { ITokenDetails, ITradeHistory, MarketDetailTableType } from "@/types";

import MyTradesPanel from "./MyTradesPanel";
import NewsPanel from "./NewsPanel";
import TransactionsPanel from "./TransactionsPanel";

interface Props {
  token?: ITokenDetails;
}

const MARKET_TABS: { label: string; value: MarketDetailTableType }[] = [
  { label: "My Trades", value: "my-trades" },
  { label: "Transactions", value: "transactions" },
  { label: "News", value: "news" },
];

const MarketDetailTable = ({ token }: Props) => {
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();
  const { myTrades, isLoading } = useTxUser(token);

  const [marketTabs, setMarketTabs] = useState(MARKET_TABS[0].value);

  const currentIndex = MARKET_TABS.findIndex((v) => v.value === marketTabs);

  const tokenSymbol = token?.pairDetails.traded_currency_unit;

  // INDODAX TRADES HISTORY
  const { data: trades } = useCustomSWR<ITradeHistory[]>(
    `${INDODAX_URL}/api/trades/${token?.pairDetails.id}`,
    "unauthenticated",
    {
      refreshInterval: 1000 * 15,
      revalidateOnFocus: true,
      revalidateIfStale: true,
    },
  );

  return (
    <div id="market-table">
      {isMobile && (
        <>
          <Menu>
            <MenuButton
              className={classNames(
                "mb-3 flex h-10 items-center gap-1.5 rounded-lg border text-sm",
                "border-borderColor bg-cardBackground px-4 lg:border-2 lg:px-5",
              )}
            >
              {t(MARKET_TABS[currentIndex].label)}
              <IoChevronDown />
            </MenuButton>
            <MenuItems
              anchor="bottom start"
              transition
              className={classNames(
                "mt-2 flex min-w-[150px] flex-col gap-3 rounded-lg p-4",
                "border border-borderColor bg-cardBackground text-sm",
                "origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0",
              )}
            >
              {MARKET_TABS.map((menu) => (
                <MenuItem
                  key={menu.value}
                  onClick={() => setMarketTabs(menu.value)}
                  as={"div"}
                  className={"flex items-center justify-between gap-1"}
                >
                  {t(menu.label)}
                  {marketTabs === menu.value && <FaCheck />}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
          <div className="relative h-[300px] max-h-[300px] overflow-hidden overflow-y-auto rounded-xl border border-borderColor">
            {currentIndex === 0 && (
              <MyTradesPanel
                trades={myTrades ?? []}
                symbol={tokenSymbol || ""}
                isLoading={isLoading}
              />
            )}
            {currentIndex === 1 && (
              <TransactionsPanel
                trades={trades ?? []}
                symbol={tokenSymbol || ""}
              />
            )}
            {currentIndex === 2 && <NewsPanel />}
          </div>
        </>
      )}
      {!isMobile && (
        <div className="overflow-hidden rounded-xl border border-borderColor">
          <TabCustom
            tabs={MARKET_TABS.map((v) => t(v.label))}
            onChange={(i) => {
              setMarketTabs(MARKET_TABS[i].value);
            }}
            currentIndex={currentIndex}
            className="!h-14"
            tabItemClassName="!h-14"
          >
            <div className="relative h-[400px] max-h-[400px] overflow-y-auto">
              <TabPanel>
                <MyTradesPanel
                  trades={myTrades ?? []}
                  symbol={tokenSymbol || ""}
                  isLoading={isLoading}
                />
              </TabPanel>
              <TabPanel>
                <TransactionsPanel
                  trades={trades ?? []}
                  symbol={tokenSymbol || ""}
                />
              </TabPanel>
              <TabPanel>
                <NewsPanel />
              </TabPanel>
            </div>
          </TabCustom>
        </div>
      )}
    </div>
  );
};

export default MarketDetailTable;
