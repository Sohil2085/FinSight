import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const formatCurrency = (amount) => {
    return `INR ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
};

export const generateInvoicePDF = (invoice, company) => {
    const doc = new jsPDF();
    const isModern = invoice.templateType === 'MODERN';

    // Colors
    const primaryColor = isModern ? [37, 99, 235] : [0, 0, 0]; // Blue-600 or Black
    const secondaryColor = [107, 114, 128]; // Gray-500
    const textColor = [17, 24, 39]; // Gray-900

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");

    // Company Name
    const companyName = company?.name || "My Company";
    doc.text(companyName.toUpperCase(), 14, 20);

    // Invoice Title
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.setFont("helvetica", "normal");
    doc.text("INVOICE", 196, 20, { align: "right" });

    // --- Meta Data (Right Side) ---
    doc.setFontSize(10);
    doc.setTextColor(...textColor);

    let yPos = 30;
    const rightX = 196;

    // Status
    doc.text(`Status: ${invoice.status}`, rightX, yPos, { align: "right" });
    yPos += 5;

    // Invoice Number
    doc.text(`#${invoice.invoiceNumber || invoice.id.slice(0, 8)}`, rightX, yPos, { align: "right" });
    yPos += 5;

    // Date
    doc.text(`Date: ${formatDate(invoice.invoiceDate)}`, rightX, yPos, { align: "right" });
    yPos += 5;

    // Due Date
    doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, rightX, yPos, { align: "right" });

    // --- Company Meta (Left Side) ---
    yPos = 30;
    if (company?.gstNumber) {
        doc.setFontSize(10);
        doc.setTextColor(...secondaryColor);
        doc.text(`GST: ${company.gstNumber}`, 14, yPos);
        yPos += 5;
    }

    // --- Bill To Section ---
    yPos = 55;

    // Box for Modern, Line for Classic
    if (isModern) {
        doc.setFillColor(249, 250, 251); // Gray-50
        doc.rect(14, yPos - 5, 182, 25, 'F');
    } else {
        doc.setDrawColor(229, 231, 235); // Gray-200
        doc.line(14, yPos - 5, 196, yPos - 5);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text("BILL TO", 18, yPos + 5);

    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text(invoice.customerName, 18, yPos + 12);

    // --- Items Table ---
    yPos = 85;

    const tableHeaders = [["Description", "Qty", "Unit Price", "Total"]];
    const tableData = invoice.items.map(item => [
        item.description,
        item.quantity,
        formatCurrency(item.unitPrice),
        formatCurrency(item.total)
    ]);

    autoTable(doc, {
        startY: yPos,
        head: tableHeaders,
        body: tableData,
        theme: isModern ? 'grid' : 'plain',
        headStyles: {
            fillColor: isModern ? primaryColor : [243, 244, 246],
            textColor: isModern ? [255, 255, 255] : [17, 24, 39],
            fontStyle: 'bold',
            halign: 'left'
        },
        columnStyles: {
            0: { cellWidth: 'auto', halign: 'left' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 40, halign: 'right' },
            3: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
        },
        styles: {
            fontSize: 10,
            cellPadding: 4,
            textColor: textColor
        },
        margin: { left: 14, right: 14 }
    });

    // --- Totals ---
    let finalY = doc.lastAutoTable.finalY + 10;

    // Subtotal
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", 140, finalY);
    doc.text(formatCurrency(invoice.subtotal), 196, finalY, { align: "right" });

    finalY += 8;

    // Total Line
    doc.setDrawColor(...secondaryColor);
    doc.line(140, finalY - 2, 196, finalY - 2);

    // Grand Total
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    if (isModern) doc.setTextColor(...primaryColor);
    doc.text("Total:", 140, finalY + 5);
    doc.text(formatCurrency(invoice.totalAmount), 196, finalY + 5, { align: "right" });

    // --- Footer ---
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for your business!", 105, pageHeight - 15, { align: "center" });

    // Save
    doc.save(`Invoice_${invoice.invoiceNumber || invoice.id.slice(0, 8)}.pdf`);
};
