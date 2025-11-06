import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import * as printer from 'pdf-to-printer';

@Injectable()
export class PrintersService {
  async generateReceipt(data: {
    transactionId: string;
    customerName: string;
    amount: number;
    items: { name: string; price: number; qty: number }[];
  }): Promise<string> {
    // ✅ Define folder and file path
    const receiptsDir = path.join(__dirname, '../../../receipts');
    const filePath = path.join(
      receiptsDir,
      `receipt_${data.transactionId}.pdf`,
    );

    // ✅ Ensure directory exists
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
    }

    // ✅ Initialize PDF document
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // 🧾 Header
    doc.fontSize(16).text('COMPANY NAME', { align: 'center' });
    doc
      .fontSize(10)
      .text('123 Logistics Street, Lagos, Nigeria', { align: 'center' });
    doc.moveDown();
    doc.text(`Transaction ID: ${data.transactionId}`);
    doc.text(`Customer: ${data.customerName}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // 🛒 Items
    doc.text('Items:', { underline: true });
    data.items.forEach((item) => {
      doc.text(`${item.qty} x ${item.name} - ₦${item.price.toLocaleString()}`);
    });

    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Total: ₦${data.amount.toLocaleString()}`, { align: 'right' });
    doc.moveDown();

    // ✅ Footer
    doc.fontSize(9).text('Thank you for your purchase!', { align: 'center' });
    doc.end();

    // ✅ Wait until file is done writing
    await new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    // 🖨️ Auto-print the PDF once generated
    try {
      await printer.print(filePath);
      console.log(`🖨️ Receipt sent to printer: ${filePath}`);
    } catch (err) {
      console.error('❌ Printing failed:', err);
    }

    return filePath;
  }
}
