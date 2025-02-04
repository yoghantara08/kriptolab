import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CallBackProps, Step } from "react-joyride";

import { TabPanel } from "@headlessui/react";

import GuideTour from "@/components/GuideTour/GuideTour";
import Layout from "@/components/Layout/Layout";
import TabCustom from "@/components/Tab/TabCustom";
import CryptoNews from "@/features/market/components/CryptoNews/CryptoNews";
import Marketplace from "@/features/market/components/Marketplace/Marketplace";
import TopCrypto from "@/features/market/components/TopCrypto/TopCrypto";
import useTokenData from "@/features/market/hooks/useTokenData";
import useInteractiveGuide from "@/hooks/useInteractiveGuide";
import useWindowSize from "@/hooks/useWindowSize";

const MarketPage = () => {
  const { trendingCrypto, topGainers } = useTokenData();
  const { isMobile, isTablet, width } = useWindowSize();
  const { t } = useTranslation("interactiveguide");
  const { firstLoad, marketGuide, completeGuide } = useInteractiveGuide();

  const [tabIndex, setTabIndex] = useState(0);

  const tabs = [
    { title: "Trending", id: "tab-trending" },
    { title: "Gainers", id: "tab-gainers" },
    { title: "News", id: "tab-news" },
  ];

  // DESKTOP STEPS
  const desktopSteps: Step[] = [
    {
      target: "body",
      title: t("Welcome to Market Page!"),
      content: t("marketGuide.welcome"),
      disableBeacon: true,
      placement: "center",
    },
    {
      target: "#trending",
      title: t("Highest Trading Volume"),
      content: t("marketGuide.trending"),
      disableScrolling: true,
      placement: "top",
    },
    {
      target: "#gainers",
      title: t("Highest Price Increase"),
      content: t("marketGuide.gainers"),
      disableScrolling: true,
      placement: "top",
    },
    {
      target: "#news",
      title: t("Latest News"),
      content: t("marketGuide.news"),
      disableScrolling: true,
      placement: "top",
    },
    {
      target: "#marketplace",
      title: t("List of All Tokens"),
      content: t("marketGuide.marketplace"),
      placement: "top",
      disableScrolling: true,
    },
    {
      target: "#token-star",
      title: t("Add to Watchlist"),
      content: t("marketGuide.tokenStar"),
      placement: "top",
      disableScrolling: true,
    },
    {
      target: "#search-crypto",
      title: t("Search for Specific Token"),
      content: t("marketGuide.searchCrypto"),
      disableScrolling: true,
      placement: "bottom",
    },
    {
      target: "#filter-crypto",
      title: t("Filter Tokens"),
      content: t("marketGuide.filterCrypto"),
      disableScrolling: true,
      placement: "bottom",
    },
  ];

  // MOBILE STEPS
  const mobileSteps: Step[] = [
    {
      target: "body",
      title: t("Welcome to Market Page!"),
      content: t("marketGuide.welcome"),
      disableBeacon: true,
      placement: "center",
    },
    {
      target: "#marketplace",
      title: t("List of All Tokens"),
      content: t("marketGuide.marketplace"),
      placement: "auto",
    },
    {
      target: "#Trending",
      title: t("Highest Trading Volume"),
      content: t("marketGuide.filterTrending"),
      disableScrolling: true,
      placement: "auto",
    },
    {
      target: "#Gainers",
      title: t("Highest Price Increase"),
      content: t("marketGuide.filterGainers"),
      disableScrolling: true,
      placement: "auto",
    },
    {
      target: "#Losers",
      title: t("Highest Price Decrease"),
      content: t("marketGuide.filterLosers"),
      disableScrolling: true,
      placement: "auto",
    },
    {
      target: "#token-star",
      title: t("Add to Watchlist"),
      content: t("marketGuide.tokenStar"),
      placement: "auto",
      disableScrolling: true,
    },
    {
      target: "#Watchlist",
      title: t("Watchlisted Tokens"),
      content: t("marketGuide.watchlist"),
      placement: "auto",
      disableScrolling: true,
    },
    {
      target: "#token-search",
      title: t("Search for Specific Token"),
      content: t("marketGuide.tokenSearch"),
      placement: "auto",
      disableScrolling: true,
    },
  ];

  const callback = (data: CallBackProps) => {
    if (width > 1024 && width < 1280) {
      if (data.index === 1) {
        setTabIndex(0);
      } else if (data.index === 2) {
        setTabIndex(1);
      } else if (data.index === 3) {
        setTabIndex(2);
      }
    }

    if (data.action === "skip" || data.status === "finished") {
      completeGuide("marketGuide", isMobile ? "mobile" : "desktop");
    }
  };

  return (
    <>
      <GuideTour
        run={
          isMobile
            ? marketGuide.mobile && !firstLoad
            : !firstLoad && marketGuide.desktop
        }
        steps={isMobile ? mobileSteps : desktopSteps}
        callback={callback}
      />

      <Layout title="Market">
        <h2 className="mb-4 ml-0.5 w-full text-2xl font-medium sm:text-3xl lg:hidden">
          {t("Explore Market")}
        </h2>
        {!isTablet ? (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <TopCrypto
              id="trending"
              title={t("Trending Coins", { ns: "general" })}
              tokens={trendingCrypto.slice(0, 5)}
            />
            <TopCrypto
              id="gainers"
              title={t("Top Gainers", { ns: "general" })}
              tokens={topGainers.slice(0, 5)}
            />
            <CryptoNews id="news" />
          </div>
        ) : (
          <div className="hidden lg:block">
            <TabCustom
              className="overflow-hidden rounded-t-xl border border-b-0 border-borderColor"
              tabs={tabs.map((v) => v.title.toLowerCase())}
              onChange={(i) => setTabIndex(i)}
              currentIndex={tabIndex}
            >
              <TabPanel>
                <TopCrypto
                  title="Trending Coins"
                  tokens={trendingCrypto.slice(0, 5)}
                />
              </TabPanel>
              <TabPanel>
                <TopCrypto
                  title="Top Gainers"
                  tokens={topGainers.slice(0, 5)}
                />
              </TabPanel>
              <TabPanel>
                <CryptoNews />
              </TabPanel>
            </TabCustom>
          </div>
        )}
        <Marketplace />
      </Layout>
    </>
  );
};

export default MarketPage;
