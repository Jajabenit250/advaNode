const fs = require("fs");
const PDFDocument = require("pdfkit");

function createPDF(invoice, directory, path) {
  let doc = new PDFDocument({ size: "A4", layout: "landscape" });

  generateHeader(doc);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);
  doc.end();
  fs.mkdirSync(directory, { recursive: true });
  doc.pipe(fs.createWriteStream(directory + path));
}

function generateHeader(doc) {
  doc
    .image("logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("ACME Inc.", 110, 57)
    .fontSize(10)
    .text("ACME Inc.", 200, 50, { align: "right" })
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("New York, NY, 10025", 200, 80, { align: "right" })
    .moveDown();
}

// function generateCustomerInformation(doc, invoice) {
//   doc
//     .fillColor("#444444")
//     .fontSize(20)
//     .text("Invoice", 50, 160);

//   generateHr(doc, 185);

//   const customerInformationTop = 200;

//   doc
//     .fontSize(10)
//     .text("Invoice Number:", 50, customerInformationTop)
//     .font("Helvetica-Bold")
//     .text(invoice.invoice_nr, 150, customerInformationTop)
//     .font("Helvetica")
//     .text("Invoice Date:", 50, customerInformationTop + 15)
//     .text(formatDate(new Date()), 150, customerInformationTop + 15)
//     .text("Balance Due:", 50, customerInformationTop + 30)
//     .text(
//       formatCurrency(invoice.subtotal - invoice.paid),
//       150,
//       customerInformationTop + 30
//     )

//     .font("Helvetica-Bold")
//     .text(invoice.shipping.name, 300, customerInformationTop)
//     .font("Helvetica")
//     .text(invoice.shipping.address, 300, customerInformationTop + 15)
//     .text(
//       invoice.shipping.city +
//         ", " +
//         invoice.shipping.state +
//         ", " +
//         invoice.shipping.country,
//       300,
//       customerInformationTop + 30
//     )
//     .moveDown();

//   generateHr(doc, 252);
// }

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 120;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica-Bold");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(invoice.paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subtotal - invoice.paid)
  );
  doc.font("Helvetica-Bold");
}

function generateFooter(doc) {
  doc
    .fontSize(8).fillColor('black')
    .text(
      "This is a computer generated Email. Please address all enquiries to Guaranty Trust Bank (Rwanda) Ltd . 20, Boulevard de la Revolution,P.O Box 331, Rwanda. Phone +250 252 598600 | +250 788 316660 | +250 788 691568 Or the Customer Information Unit of your local branch.",
      80,
      doc.page.height - 30,
      { height: 25, width: 680, align: "center", borderTop: "2px #6c757d solid" }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("Trans. Date", 50, y)
    .text("Value. Date", 150, y)
    .text("Reference", 250, y)
    .text("Debits", 350, y)
    .text("Credits", 430, y)
    .text("Balance", 520, y)
    .text("Originating Branch", 610, y)
    .text("Remarks", 748, y);
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createPDF,
};
