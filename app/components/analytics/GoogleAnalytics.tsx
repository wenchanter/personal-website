import Script from "next/script";

type GoogleAnalyticsProps = {
  measurementId?: string;
};

const measurementIdPattern = /^G-[A-Z0-9]+$/i;

export default function GoogleAnalytics({
  measurementId,
}: GoogleAnalyticsProps) {
  const id = measurementId?.trim();

  if (!id || !measurementIdPattern.test(id)) {
    return null;
  }

  const idLiteral = JSON.stringify(id);

  return (
    <>
      <Script id="google-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
          };
          window.gtag("consent", "default", {
            analytics_storage: "granted",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
            functionality_storage: "granted",
            security_storage: "granted"
          });
        `}
      </Script>
      <Script
        id="google-analytics-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
          };
          window.gtag("js", new Date());
          window.gtag("config", ${idLiteral}, {
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  );
}
