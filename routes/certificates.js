const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const PDFDocument = require('pdfkit');

// Generate unique certificate ID
const generateCertificateId = () => {
  return 'CERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// Create new certificate
router.post('/generate', async (req, res) => {
  try {
    const { recipientName, courseName, templateName } = req.body;
    console.log("generating");
    const certificate = new Certificate({
      recipientName,
      courseName,
      certificateId: generateCertificateId(),
      templateName
    });

    await certificate.save();
    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download certificate
router.get('/download/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Create PDF
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4'
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificate.certificateId}.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to PDF
    doc.font('Helvetica-Bold')
       .fontSize(30)
       .text('CERTIFICATE OF COMPLETION', { align: 'center' });

    doc.moveDown();
    doc.fontSize(20)
       .text('This is to certify that', { align: 'center' });

    doc.moveDown();
    doc.fontSize(25)
       .text(certificate.recipientName, { align: 'center' });

    doc.moveDown();
    doc.fontSize(20)
       .text(`has successfully completed the course`, { align: 'center' });

    doc.moveDown();
    doc.fontSize(25)
       .text(certificate.courseName, { align: 'center' });

    doc.moveDown();
    doc.fontSize(15)
       .text(`Certificate ID: ${certificate.certificateId}`, { align: 'center' });

    doc.moveDown();
    doc.fontSize(15)
       .text(`Issue Date: ${certificate.issueDate.toLocaleDateString()}`, { align: 'center' });

    // Finalize PDF
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
