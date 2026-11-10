import mongoose from 'mongoose';
import multer from 'multer';
import xlsx from 'xlsx';
import mammoth from 'mammoth';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import Content from '../models/Content.js';

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

export const uploadResourceFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) { const error = new Error('Supported formats: PDF, XLS, XLSX and DOCX (maximum 20 MB).'); error.status = 400; return callback(error); }
    callback(null, true);
  }
}).single('file');

function bucket() {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'ii_resources' });
}

export async function createResource(req, res, next) {
  let uploadedId;
  try {
    const { title, description = '', category, status = 'draft' } = req.body;
    if (!title?.trim() || !req.file) return res.status(400).json({ message: 'Title and file are required.' });
    if (!['Market Intelligence', 'Industrial Skills', 'Soft Skills', 'Others'].includes(category)) return res.status(400).json({ message: 'Select one of the four available categories.' });

    const fileId = new mongoose.Types.ObjectId();
    uploadedId = fileId;
    const upload = bucket().openUploadStreamWithId(fileId, req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { category, uploadedBy: String(req.admin._id) }
    });
    await new Promise((resolve, reject) => {
      upload.on('error', reject);
      upload.on('finish', resolve);
      upload.end(req.file.buffer);
    });

    const slug = `${slugify(title, { lower: true, strict: true }) || 'resource'}-${String(fileId).slice(-6)}`;
    const item = await Content.create({
      type: 'resource', title: title.trim(), slug, description, category,
      fileId, fileName: req.file.originalname, mimeType: req.file.mimetype,
      fileSize: req.file.size, status,
      publishedAt: status === 'published' ? new Date() : null,
      createdBy: req.admin._id, updatedBy: req.admin._id
    });
    res.status(201).json({ item });
  } catch (error) {
    if (uploadedId) bucket().delete(uploadedId).catch(() => {});
    next(error);
  }
}

export async function viewResource(req, res, next) {
  try {
    const item = await Content.findOne({ _id: req.params.id, type: 'resource', status: 'published' });
    if (!item?.fileId) return res.status(404).json({ message: 'Resource not found.' });
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Content-Security-Policy', "default-src 'none'; frame-ancestors *; style-src 'unsafe-inline'; img-src data:");
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.removeHeader('X-Frame-Options');
    res.set('Cache-Control', 'private, no-store');
    res.set('Content-Disposition', 'inline');

    if (item.mimeType === 'application/pdf') {
      res.type('application/pdf');
      res.set('Content-Disposition', 'inline');
      return bucket().openDownloadStream(item.fileId).pipe(res);
    }

    const chunks = [];
    await new Promise((resolve, reject) => {
      const stream = bucket().openDownloadStream(item.fileId);
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', resolve);
    });
    const buffer = Buffer.concat(chunks);
    let html = '';
    if (item.mimeType.includes('spreadsheet') || item.mimeType === 'application/vnd.ms-excel') {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheets = workbook.SheetNames.map(name => `<section><h2>${escapeHtml(name)}</h2>${xlsx.utils.sheet_to_html(workbook.Sheets[name])}</section>`).join('');
      html = `<main><h1>${escapeHtml(item.title)}</h1>${sanitizeHtml(sheets)}</main>`;
    } else if (item.mimeType.includes('wordprocessingml')) {
      const converted = await mammoth.convertToHtml({ buffer });
      html = `<main><h1>${escapeHtml(item.title)}</h1>${sanitizeHtml(converted.value)}</main>`;
    }
    res.type('html').send(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:;"><title>${escapeHtml(item.title)}</title><style>body{font:16px system-ui;margin:24px;color:#182033}main{max-width:1100px;margin:auto}table{border-collapse:collapse;max-width:100%;overflow:auto}td,th{border:1px solid #bbb;padding:7px;text-align:left}section{overflow:auto;margin:28px 0}</style></head><body>${html}</body></html>`);
  } catch (error) { next(error); }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

export async function deleteResourceFile(item) {
  if (item?.fileId) await bucket().delete(item.fileId).catch(() => {});
}
