"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { analytics, type AnalyticsEventName } from "@/lib/analytics/analytics";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const active = process.env.NODE_ENV === "production" && Boolean(measurementId);

function eventForPath(pathname: string): AnalyticsEventName | null {
  if (/\/(?:tr|en)\/dashboard$/.test(pathname)) return "dashboard_viewed";
  if (/\/(?:tr|en)\/timeline$/.test(pathname)) return "timeline_viewed";
  if (/\/(?:tr|en)\/(?:pricing|subscription)$/.test(pathname))
    return "premium_page_viewed";
  if (/\/(?:tr|en)\/guides\/[^/]+$/.test(pathname)) return "guide_viewed";
  return null;
}

export function AnalyticsRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    function report() {
      if (lastPath.current === path) return;
      if (!analytics.pageView(path)) return;
      lastPath.current = path;
      const eventName = eventForPath(pathname);
      if (eventName)
        analytics.track(eventName, { locale: pathname.split("/")[1] });
    }
    report();
    window.addEventListener("kidmemoir:analytics-ready", report);
    return () =>
      window.removeEventListener("kidmemoir:analytics-ready", report);
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-analytics-event]")
          : null;
      const eventName = target?.dataset.analyticsEvent;
      if (!eventName) return;
      analytics.track(eventName as AnalyticsEventName, {
        destination_type: target.dataset.analyticsDestination,
      });
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

export function GoogleAnalytics() {
  if (!active || !measurementId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="lazyOnload"
      />
      <Script id="kidmemoir-ga4" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId.replaceAll("'", "")}',{send_page_view:false,anonymize_ip:true});window.dispatchEvent(new Event('kidmemoir:analytics-ready'));`}
      </Script>
    </>
  );
}
