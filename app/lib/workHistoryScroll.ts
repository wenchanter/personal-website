const WORK_POSITION_PREFIX = "work-position-";

export function getWorkPositionScrollTop(
  target: HTMLElement,
): number | null {
  if (!target.id.startsWith(WORK_POSITION_PREFIX)) {
    return null;
  }

  const positionId = target.id.slice(WORK_POSITION_PREFIX.length);
  const cardStack = target.closest<HTMLElement>(
    "[data-work-history-card-stack]",
  );
  const companyNav = document.querySelector<HTMLElement>(
    "[data-work-history-company-nav]",
  );
  const cardAnchor = Array.from(
    cardStack?.querySelectorAll<HTMLElement>("[data-work-position-anchor]") ??
      [],
  ).find((anchor) => anchor.dataset.workPositionAnchor === positionId);

  if (!cardStack || !companyNav || !cardAnchor) {
    return null;
  }

  const stackTop = window.scrollY + cardStack.getBoundingClientRect().top;
  const stickyTop = Number.parseFloat(window.getComputedStyle(target).top) || 0;
  const navStickyTop =
    Number.parseFloat(window.getComputedStyle(companyNav).top) || stickyTop;
  const alignmentTop = window.matchMedia("(min-width: 64rem)").matches
    ? navStickyTop
    : stickyTop;
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const targetTop = stackTop + cardAnchor.offsetTop - alignmentTop;

  return Math.min(maxScroll, Math.max(0, targetTop));
}
