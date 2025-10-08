import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PDFGenerator = () => {
  const generateInventoryPDF = async (inventoryData, reportType = 'comprehensive') => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Modern color scheme - Updated colors
    const primaryColor = '#d87706'; // Orange
    const accentColor = '#b5530a'; // Brown
    const successColor = '#059669'; // Green
    const warningColor = '#d97706'; // Orange
    const dangerColor = '#dc2626'; // Red
    const textColor = '#374151'; // Dark gray
    
    // Load logo image
    const loadLogo = () => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = '/logo_trans2.png';
      });
    };

    // Add clean header
    const addHeader = async () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
      // Company header background
      doc.setFillColor(primaryColor);
      doc.rect(0, 0, pageWidth, 25, 'F');
      
      // Add logo image
      try {
        const logoImg = await loadLogo();
        // Add logo to PDF (resize to fit header)
        doc.addImage(logoImg, 'PNG', 10, 5, 15, 15);
      } catch (error) {
        console.log('Logo loading failed, using text fallback');
        // Fallback text logo
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('LOGO', 17.5, 12, { align: 'center' });
      }
      
      // Company name
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CINNEX PLANTATION MANAGEMENT', 35, 12);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(dateStr, pageWidth - 20, 12, { align: 'right' });
      
      // Report title
      doc.setTextColor(primaryColor);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      const title = reportType === 'comprehensive' ? 'Inventory Report' : 'Inventory Summary';
      doc.text(title, 20, 40);
      
      // Subtle separator
      doc.setDrawColor(primaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, 43, pageWidth - 20, 43);
    };

    // Add clean footer
    const addFooter = (pageNum, totalPages) => {
      const y = doc.internal.pageSize.getHeight() - 10;
      
      doc.setTextColor(accentColor);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      // Page number
      doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, y, { align: 'center' });
      
      // Confidential notice
      doc.text('Confidential Business Document', 20, y);
    };

    // Add key metrics
    const addKeyMetrics = (data) => {
      let yPos = 55;

      // Calculate metrics
      const totalItems = data.length;
      const totalValue = data.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
      const lowStockItems = data.filter(item => (item.quantity || 0) <= (item.reorderLevel || 0)).length;
      const outOfStockItems = data.filter(item => (item.quantity || 0) === 0).length;

      // Metrics in a clean row
      const metrics = [
        { label: 'Total Items', value: totalItems, color: primaryColor },
        { label: 'Total Value', value: `$${totalValue.toLocaleString()}`, color: successColor },
        { label: 'Need Reorder', value: lowStockItems, color: warningColor },
        { label: 'Out of Stock', value: outOfStockItems, color: dangerColor }
      ];

      const metricWidth = 40;
      let xPos = 20;

      metrics.forEach(metric => {
        // Value
        doc.setTextColor(metric.color);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(metric.value.toString(), xPos + metricWidth/2, yPos, { align: 'center' });
        
        // Label
        doc.setTextColor(accentColor);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(metric.label, xPos + metricWidth/2, yPos + 5, { align: 'center' });
        
        xPos += metricWidth;
      });

      return yPos + 15;
    };

    // Add inventory table
    const addInventoryTable = (data, startY) => {
      // Prepare table data
      const tableData = data.map(item => {
        const quantity = item.quantity || 0;
        const reorderLevel = item.reorderLevel || 0;
        const price = item.price || 0;
        const totalValue = quantity * price;

        // Simple status
        let status = 'In Stock';
        let statusColor = successColor;
        
        if (quantity === 0) {
          status = 'No Stock';
          statusColor = dangerColor;
        } else if (quantity <= reorderLevel) {
          status = 'Low Stock';
          statusColor = warningColor;
        }

        return [
          item.name || 'N/A',
          item.category || 'N/A',
          quantity,
          `$${price.toFixed(2)}`,
          `$${totalValue.toFixed(2)}`,
          status
        ];
      });

      autoTable(doc, {
        head: [['Product Name', 'Category', 'Qty', 'Unit Price', 'Total Value', 'Status']],
        body: tableData,
        startY: startY,
        margin: { left: 20, right: 20 },
        styles: {
          fontSize: 8,
          cellPadding: 4,
          textColor: [30, 41, 59],
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [216, 119, 6], // Updated to match new orange theme
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
          cellPadding: 6,
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 45, halign: 'left' }, // Product Name
          1: { cellWidth: 30, halign: 'left' }, // Category
          2: { cellWidth: 20, halign: 'center' }, // Quantity
          3: { cellWidth: 25, halign: 'right' }, // Unit Price
          4: { cellWidth: 30, halign: 'right' }, // Total Value
          5: { cellWidth: 25, halign: 'center' }, // Status
        },
        didParseCell: function(data) {
          // Color code status column
          if (data.column.index === 5) {
            const status = data.cell.text[0];
            if (status === 'No Stock') {
              data.cell.styles.textColor = [220, 38, 38];
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'Low Stock') {
              data.cell.styles.textColor = [217, 119, 6];
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'In Stock') {
              data.cell.styles.textColor = [5, 150, 105];
            }
          }
          
          // Bold currency values
          if (data.column.index === 3 || data.column.index === 4) {
            data.cell.styles.fontStyle = 'bold';
          }
        }
      });

      return doc.lastAutoTable.finalY + 10;
    };

    // Add signature section
    const addSignature = (startY) => {
      let yPos = startY;

      // Section title
      doc.setTextColor(primaryColor);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Authorization', 20, yPos);
      
      doc.setDrawColor(primaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, yPos + 1, 50, yPos + 1);

      yPos += 15;

      // Signature line
      doc.setDrawColor(textColor);
      doc.setLineWidth(0.5);
      doc.line(20, yPos, 80, yPos);

      // Signature text
      doc.setTextColor(textColor);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Authorized Signature', 20, yPos + 8);

      // Date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Date: ${currentDate}`, 20, yPos + 15);

      // Title
      doc.setFont('helvetica', 'bold');
      doc.text('Inventory Manager', 20, yPos + 22);

      // Company seal (matching header logo)
      doc.setFillColor(primaryColor);
      doc.setDrawColor(primaryColor);
      doc.circle(120, yPos + 10, 8, 'FD');
      
      // Add C in the seal
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('C', 120, yPos + 12, { align: 'center' });
      
      // Small leaf accent in seal
      doc.setFillColor(255, 255, 255);
      doc.triangle(125, yPos + 8, 127, yPos + 6, 129, yPos + 8, 'FD');

      return yPos + 35;
    };

    // Main PDF generation flow
    await addHeader();
    let currentY = addKeyMetrics(inventoryData);
    currentY = addInventoryTable(inventoryData, currentY);
    
    // Add signature section
    if (currentY > doc.internal.pageSize.getHeight() - 50) {
      doc.addPage();
      currentY = 20;
    }
    
    addSignature(currentY);

    // Add footer to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(i, totalPages);
    }

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `Inventory_Report_${timestamp}.pdf`;
    
    // Save the PDF
    doc.save(filename);
  };

  return { generateInventoryPDF };
};

export default PDFGenerator;