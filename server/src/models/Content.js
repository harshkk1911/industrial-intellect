import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  type: { type: String, enum: ['video', 'course', 'category', 'article', 'resource'], required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, default: '', maxlength: 5000 },
  body: { type: String, default: '' },
  category: { type: String, default: '', index: true },
  tags: [{ type: String, trim: true }],
  youtubeUrl: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  mediaUrl: { type: String, default: '' },
  fileId: { type: mongoose.Schema.Types.ObjectId, default: null },
  fileName: { type: String, default: '' },
  mimeType: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  courseTitle: { type: String, default: '' },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
  featured: { type: Boolean, default: false, index: true },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
  publishedAt: { type: Date, default: null },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

contentSchema.index({ title: 'text', description: 'text', body: 'text', tags: 'text' });

export default mongoose.model('Content', contentSchema);
