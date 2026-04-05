/**
 * Utility to calculate exact invoice totals, including GST splits, rounding, and preventing
 * JavaScript floating point accuracy errors by converting logic to integers (cents) entirely.
 * 
 * @param {Array} items - The invoice line items { unitPrice, quantity, discount, gstRate }
 * @param {String} gstType - 'INTRA' (CGST+SGST) or 'INTER' (IGST)
 * @param {Number} invoiceDiscount - Flat post-tax discount
 * @returns {Object} Computed totals and augmented items
 */
export const calculateInvoice = (items = [], gstType = 'INTRA', invoiceDiscount = 0) => {
    let subtotalCent = 0;
    let totalGSTCent = 0;
    let cgstCent = 0;
    let sgstCent = 0;
    let igstCent = 0;

    const processedItems = items.map(item => {
        const qty = Number(item.quantity) || 0;
        const priceCent = Math.round((Number(item.unitPrice) || 0) * 100);
        const itemDiscountCent = Math.round((Number(item.discount) || 0) * 100);
        const gstRate = Number(item.gstRate) || 0;

        // Base total for this line BEFORE tax, AFTER item discount
        const baseTotalCent = (qty * priceCent) - itemDiscountCent;
        const safeBaseTotalCent = Math.max(0, baseTotalCent); // Clamp to zero if discount is huge

        // GST calculation
        const gstAmountCent = Math.round(safeBaseTotalCent * (gstRate / 100));
        const finalTotalCent = safeBaseTotalCent + gstAmountCent;

        subtotalCent += safeBaseTotalCent;
        totalGSTCent += gstAmountCent;

        return {
            ...item,
            total: finalTotalCent / 100,
            gstAmount: gstAmountCent / 100,
            discount: itemDiscountCent / 100,
            gstRate // maintain the rate
        };
    });

    // Splitting the tax
    if (gstType === 'INTER') {
        igstCent = totalGSTCent;
    } else {
        // Floor or divide and fix remainder to prevent total GST mismatch
        cgstCent = Math.round(totalGSTCent / 2);
        sgstCent = totalGSTCent - cgstCent; 
    }

    const safeInvoiceDiscountCent = Math.round((Number(invoiceDiscount) || 0) * 100);
    const preRoundTotalCent = Math.max(0, subtotalCent + totalGSTCent - safeInvoiceDiscountCent);
    
    // Rounding off to nearest whole number
    const roundedGrandTotalRupee = Math.round(preRoundTotalCent / 100);
    const roundedGrandTotalCent = roundedGrandTotalRupee * 100;
    
    const roundOffCent = roundedGrandTotalCent - preRoundTotalCent;

    return {
        processedItems,
        subTotal: subtotalCent / 100,
        totalGST: totalGSTCent / 100,
        cgstTotal: cgstCent / 100,
        sgstTotal: sgstCent / 100,
        igstTotal: igstCent / 100,
        discount: safeInvoiceDiscountCent / 100,
        roundOff: roundOffCent / 100,
        grandTotal: roundedGrandTotalRupee
    };
};
