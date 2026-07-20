const NAV_GLASS_MAP =
  "data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20897%2058%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22red%22%20x1%3D%22100%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%220%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230000%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22red%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%22blue%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230000%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22blue%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22897%22%20height%3D%2258%22%20fill%3D%22black%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22897%22%20height%3D%2258%22%20rx%3D%2229%22%20fill%3D%22url(%23red)%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22897%22%20height%3D%2258%22%20rx%3D%2229%22%20fill%3D%22url(%23blue)%22%20style%3D%22mix-blend-mode%3Adifference%22%2F%3E%3Crect%20x%3D%222.03%22%20y%3D%222.03%22%20width%3D%22892.94%22%20height%3D%2253.94%22%20rx%3D%2229%22%20fill%3D%22hsl(0%200%25%2050%25%20%2F%200.93)%22%20style%3D%22filter%3Ablur(11px)%22%2F%3E%3C%2Fsvg%3E";

export default function NavLiquidGlassFilter() {
  return (
    <svg
      className="pointer-events-none absolute h-0 w-0"
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
    >
      <defs>
        <filter id="nav-liquid-glass" colorInterpolationFilters="sRGB">
          <feImage
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            result="map"
            href={NAV_GLASS_MAP}
            xlinkHref={NAV_GLASS_MAP}
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            xChannelSelector="R"
            yChannelSelector="B"
            scale="-180"
            result="dispRed"
          />
          <feColorMatrix
            in="dispRed"
            type="matrix"
            values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
            result="red"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            xChannelSelector="R"
            yChannelSelector="B"
            scale="-170"
            result="dispGreen"
          />
          <feColorMatrix
            in="dispGreen"
            type="matrix"
            values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"
            result="green"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            xChannelSelector="R"
            yChannelSelector="B"
            scale="-160"
            result="dispBlue"
          />
          <feColorMatrix
            in="dispBlue"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"
            result="blue"
          />
          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="output" />
          <feGaussianBlur in="output" stdDeviation="0.7" />
        </filter>
      </defs>
    </svg>
  );
}
