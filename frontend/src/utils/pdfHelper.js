/**
 * Prepares an element for PDF generation by html2canvas/html2pdf.
 * Fixes "unsupported color function" errors by:
 * 1. Resolving all computed colors to RGB/Hex.
 * 2. stripping classNames to avoid Tailwind/CSS style leakage.
 */
export const sanitizeForPdf = (originalElement) => {
    if (!originalElement) return null;

    // 1. Deep clone the element so we don't affect the UI
    const clone = originalElement.cloneNode(true);

    // We need to attach the clone to the DOM to get computed styles, 
    // but keep it hidden from the user while accessible to html2canvas.
    // Placing it at 0,0 with z-index -9999 ensures it's "in the viewport" logic wise
    // but behind everything.
    clone.style.position = 'fixed';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.zIndex = '-9999';
    clone.style.pointerEvents = 'none'; // Ensure no interaction
    // Ensure it has a white background so it's not transparent if overlaying
    clone.style.backgroundColor = '#ffffff';
    document.body.appendChild(clone);

    // Helper to Convert to RGB
    // Since we are reading from the *original* element (which is in the DOM),
    // getComputedStyle will return 'rgb(...)' or 'rgba(...)' for most browsers 
    // even if the CSS source is oklch, UNLESS the browser preserves it.
    // If the browser preserves oklch, we might need a canvas hack or just force a fallback.
    // However, most current Chromiums return rgb(). 
    // The issue usually arises when html2canvas tries to parse CSS rules directly.

    // Strategy: 
    // Iterate original elements and apply their computed values as inline styles to the clone.
    // Then strip classes from the clone.

    const originalWalker = document.createTreeWalker(originalElement, NodeFilter.SHOW_ELEMENT);
    const cloneWalker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT);

    let currentNode = originalWalker.nextNode();
    let currentClone = cloneWalker.nextNode();

    while (currentNode && currentClone) {
        const computed = window.getComputedStyle(currentNode);

        // Explicitly transfer critical visual styles as RGB/Absolute values
        currentClone.style.color = computed.color;
        currentClone.style.backgroundColor = computed.backgroundColor;
        currentClone.style.borderColor = computed.borderColor;
        currentClone.style.display = computed.display;
        currentClone.style.fontSize = computed.fontSize;
        currentClone.style.fontWeight = computed.fontWeight;
        currentClone.style.padding = computed.padding;
        currentClone.style.margin = computed.margin;

        // Remove class to detatch from oklch-containing stylesheets
        currentClone.removeAttribute('class');

        currentNode = originalWalker.nextNode();
        currentClone = cloneWalker.nextNode();
    }

    return clone;
};
