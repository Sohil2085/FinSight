import React from 'react';

const InvoicePDFTemplate = React.forwardRef(({ invoice, company, ...props }, ref) => {
    if (!invoice) return null;

    const isModern = invoice.templateType === 'MODERN';

    // Style constants to ensure NO Tailwind computed colors (oklch) leak in
    const styles = {
        page: {
            width: '210mm',
            minHeight: '297mm',
            padding: '32px',
            backgroundColor: '#ffffff',
            margin: '0 auto',
            color: '#111827',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif'
        },
        headerModern: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '48px',
            borderBottom: '2px solid #2563EB',
            paddingBottom: '24px'
        },
        headerClassic: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '48px'
        },
        grid: {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '48px',
            marginBottom: '48px'
        },
        billToCol: {
            flex: 1
        },
        tableHeader: {
            backgroundColor: isModern ? '#2563EB' : '#F3F4F6',
            color: isModern ? '#ffffff' : '#374151',
            textTransform: 'uppercase',
            fontSize: '14px'
        },
        th: {
            padding: '12px 16px',
            textAlign: 'left'
        },
        thRight: {
            padding: '12px 16px',
            textAlign: 'right'
        },
        td: {
            padding: '16px',
            color: '#374151'
        },
        tdRight: {
            padding: '16px',
            textAlign: 'right',
            color: '#374151'
        }
    };

    return (
        <div ref={ref} style={styles.page} {...props}>
            {/* Header */}
            {isModern ? (
                <div style={styles.headerModern}>
                    <div>
                        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#000000' }}>INVOICE</h1>
                        <p style={{ fontWeight: '500', color: '#6B7280', margin: 0 }}>#{invoice.invoiceNumber || invoice.id.slice(0, 8)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>{company?.name || 'My Company'}</h2>
                        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Status: <span style={{ fontWeight: '600' }}>{invoice.status}</span></p>
                    </div>
                </div>
            ) : (
                <div style={styles.headerClassic}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', textTransform: 'uppercase', margin: 0 }}>{company?.name || 'My Company'}</h2>
                        <div style={{ marginTop: '16px', fontSize: '14px', color: '#6B7280' }}>
                            {company?.gstNumber && <p style={{ margin: 0 }}>GST: {company.gstNumber}</p>}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h1 style={{ fontSize: '30px', fontWeight: '300', color: '#9CA3AF', marginBottom: '8px', margin: '0 0 8px 0' }}>INVOICE</h1>
                        <p style={{ fontWeight: '500', color: '#374151', margin: 0 }}>#{invoice.invoiceNumber || invoice.id.slice(0, 8)}</p>
                        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            )}

            {/* Bill To & Dates */}
            <div style={{ ...styles.grid, ...(isModern ? { backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '8px' } : {}) }}>
                <div style={styles.billToCol}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Bill To</h3>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{invoice.customerName}</p>
                </div>
                <div style={{ ...styles.billToCol, textAlign: isModern ? 'right' : 'left' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: isModern ? 'flex-end' : 'space-between', gap: '32px' }}>
                            <span style={{ color: '#6B7280' }}>Invoice Date:</span>
                            <span style={{ fontWeight: '500' }}>{new Date(invoice.invoiceDate).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: isModern ? 'flex-end' : 'space-between', gap: '32px' }}>
                            <span style={{ color: '#6B7280' }}>Due Date:</span>
                            <span style={{ fontWeight: '500' }}>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div style={{ marginBottom: '48px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={{ ...styles.th, borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Description</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Qty</th>
                            <th style={styles.thRight}>Price</th>
                            <th style={{ ...styles.thRight, borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items?.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ ...styles.td, fontWeight: '500' }}>{item.description}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>{item.quantity}</td>
                                <td style={styles.tdRight}>₹ {item.unitPrice.toLocaleString()}</td>
                                <td style={{ ...styles.tdRight, fontWeight: '600' }}>₹ {(item.quantity * item.unitPrice).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '50%', ...(isModern ? {} : { borderTop: '1px solid #E5E7EB', paddingTop: '16px' }) }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                        <span style={{ color: '#6B7280' }}>Subtotal</span>
                        <span style={{ fontWeight: '500' }}>₹ {invoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', marginTop: '8px', borderTop: '1px solid #F3F4F6', color: isModern ? '#2563EB' : '#111827' }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Total</span>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>₹ {invoice.totalAmount.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '80px', paddingTop: '32px', borderTop: '1px solid #F3F4F6', textAlign: 'center', fontSize: '14px', color: '#9CA3AF' }}>
                <p style={{ margin: 0 }}>Thank you for your business!</p>
            </div>
        </div>
    );
});

export default InvoicePDFTemplate;
