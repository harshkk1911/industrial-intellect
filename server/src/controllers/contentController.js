import Content from '../models/Content.js';
import slugify from 'slugify';

export async function listPublicContent(req, res, next) {
  try {
    const { type, category, course, search, sort = 'newest' } = req.query;
    const page = Math.max(1, Number.parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit || '12', 10)));
    const filter = { status: 'published' };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (course) filter.courseTitle = course;
    if (search) filter.$text = { $search: search };

    const sortOrder = sort === 'oldest' ? { publishedAt: 1 } : { publishedAt: -1 };
    const [items, total] = await Promise.all([
      Content.find(filter).sort(sortOrder).skip((page - 1) * limit).limit(limit).select('-body'),
      Content.countDocuments(filter)
    ]);
    res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
}

export async function getPublicContent(req, res, next) {
  try {
    const item = await Content.findOne({ slug: req.params.slug, status: 'published' });
    if (!item) return res.status(404).json({ message: 'Content not found' });
    res.json({ item });
  } catch (error) { next(error); }
}

function makeSlug(title) {
  return slugify(title, { lower: true, strict: true, trim: true }) || `content-${Date.now()}`;
}

export async function createContent(req, res, next) {
  try {
    const { title, type } = req.body;
    if (!title || !type) return res.status(400).json({ message: 'Title and type are required' });
    const slug = req.body.slug ? makeSlug(req.body.slug) : makeSlug(title);
    const existing = await Content.findOne({ slug });
    if (existing) return res.status(409).json({ message: 'A content item with this slug already exists' });

    const status = req.body.status || 'draft';
    const item = await Content.create({
      ...req.body,
      slug,
      status,
      publishedAt: status === 'published' ? new Date() : null,
      createdBy: req.admin._id,
      updatedBy: req.admin._id
    });
    res.status(201).json({ item });
  } catch (error) { next(error); }
}

export async function updateContent(req, res, next) {
  try {
    const updates = { ...req.body, updatedBy: req.admin._id };
    delete updates.createdBy;
    if (updates.title && !updates.slug) updates.slug = makeSlug(updates.title);
    if (updates.status === 'published') updates.publishedAt = new Date();
    const item = await Content.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Content not found' });
    res.json({ item });
  } catch (error) { next(error); }
}

export async function deleteContent(req, res, next) {
  try {
    const item = await Content.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Content not found' });
    res.json({ message: 'Content deleted' });
  } catch (error) { next(error); }
}

export async function dashboard(req, res, next) {
  try {
    const [videos, courses, articles, resources, drafts] = await Promise.all([
      Content.countDocuments({ type: 'video', status: 'published' }),
      Content.countDocuments({ type: 'course', status: 'published' }),
      Content.countDocuments({ type: 'article', status: 'published' }),
      Content.countDocuments({ type: 'resource', status: 'published' }),
      Content.countDocuments({ status: 'draft' })
    ]);
    res.json({ counts: { videos, courses, articles, resources, drafts } });
  } catch (error) { next(error); }
}
