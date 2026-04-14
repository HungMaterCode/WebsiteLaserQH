export function smoothScrollTo(elementId: string, duration: number = 1000, offset: number = -80) {
  const targetElement = document.getElementById(elementId);
  if (!targetElement) return;

  // Calculate target position with an optional offset (e.g. for fixed headers)
  // Or handle 'center' alignment if offset is specific.
  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset + offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  function easeInOutQuart(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t * t + b;
    t -= 2;
    return -c / 2 * (t * t * t * t - 2) + b;
  }

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
    
    window.scrollTo(0, run);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition);
    }
  }

  requestAnimationFrame(animation);
}
