"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { analytics, type AnalyticsEventName } from "@/lib/analytics/analytics";
import {
  getConsentServerSnapshot,
  getConsentSnapshot,
  subscribeConsent,
} from "@/lib/analytics/consent";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const active = process.env.NODE_ENV === "production" && Boolean(measurementId);

function eventForPath(pathname: string): AnalyticsEventName | null {
  if (/\/(?:tr|en)\/dashboard$/.test(pathname)) return "dashboard_viewed";
  if (/\/(?:tr|en)\/timeline$/.test(pathname)) return "timeline_viewed";
  if (/\/(?:tr|en)\/events$/.test(pathname)) return "events_viewed";
  if (/\/(?:tr|en)\/reminders$/.test(pathname)) return "reminders_viewed";
  if (/\/(?:tr|en)\/ai$/.test(pathname)) return "ai_page_viewed";
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
    function reportAuthEvent() {
      if (!window.gtag) return;
      const match = document.cookie.match(/(?:^|; )km_auth_event=([^;]+)/);
      const eventName = match?.[1] as AnalyticsEventName | undefined;
      if (!eventName) return;
      analytics.track(eventName);
      document.cookie = "km_auth_event=; Max-Age=0; Path=/; SameSite=Lax";
    }
    reportAuthEvent();
    window.addEventListener("kidmemoir:analytics-ready", reportAuthEvent);
    return () =>
      window.removeEventListener("kidmemoir:analytics-ready", reportAuthEvent);
  }, []);

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
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );
  if (!active || !measurementId || consent !== "granted") return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="lazyOnload"
      />
      <Script id="kidmemoir-ga4" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config','${measurementId.replaceAll("'", "")}',{send_page_view:false,anonymize_ip:true,allow_google_signals:false});window.dispatchEvent(new Event('kidmemoir:analytics-ready'));`}
      </Script>
    </>
  );
}
