import { Router } from "express";
import db from "../db.js";

const router = Router();

// Get all hero pages with their slides
router.get("/", async (req, res) => {
  const pages = await db.query("SELECT * FROM hero_pages ORDER BY id");
  const slides = await db.query("SELECT * FROM hero_slides ORDER BY hero_page_id, sort_order");

  const grouped = pages.rows.map((page) => ({
    ...page,
    carousel: { enabled: page.carousel_enabled, interval: page.carousel_interval },
    slides: slides.rows
      .filter((s) => s.hero_page_id === page.id)
      .map((s) => ({
        id: s.id,
        layout: s.layout,
        gradientOrigin: s.gradient_origin,
        eyebrow: s.eyebrow,
        title: s.title,
        subtitle: s.subtitle,
        imageUrl: s.image_url,
        stats: [
          s.stat_1_num ? { num: s.stat_1_num, label: s.stat_1_label } : null,
          s.stat_2_num ? { num: s.stat_2_num, label: s.stat_2_label } : null,
          s.stat_3_num ? { num: s.stat_3_num, label: s.stat_3_label } : null,
        ].filter(Boolean),
        ctaPrimary: s.cta_primary_text ? { text: s.cta_primary_text, href: s.cta_primary_href } : null,
        ctaSecondary: s.cta_secondary_text ? { text: s.cta_secondary_text, href: s.cta_secondary_href } : null,
        quote: s.quote_text ? { text: s.quote_text, author: s.quote_author, role: s.quote_role } : null,
      })),
  }));

  res.json(grouped);
});

// Update hero page carousel settings
router.put("/:id", async (req, res) => {
  const { carousel } = req.body;
  const { rows } = await db.query(
    "UPDATE hero_pages SET carousel_enabled = $1, carousel_interval = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
    [carousel?.enabled ?? false, carousel?.interval ?? 5, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Hero page not found" });
  res.json(rows[0]);
});

// Upsert a slide
router.put("/:pageId/slides/:slideId", async (req, res) => {
  const { layout, gradientOrigin, eyebrow, title, subtitle, imageUrl, stats, ctaPrimary, ctaSecondary, quote } = req.body;
  const { rows } = await db.query(
    `UPDATE hero_slides SET layout=$1, gradient_origin=$2, eyebrow=$3, title=$4, subtitle=$5, image_url=$6,
     stat_1_num=$7, stat_1_label=$8, stat_2_num=$9, stat_2_label=$10, stat_3_num=$11, stat_3_label=$12,
     cta_primary_text=$13, cta_primary_href=$14, cta_secondary_text=$15, cta_secondary_href=$16,
     quote_text=$17, quote_author=$18, quote_role=$19, updated_at=NOW() WHERE id=$20 RETURNING *`,
    [
      layout, gradientOrigin, eyebrow, title, subtitle, imageUrl,
      stats?.[0]?.num, stats?.[0]?.label, stats?.[1]?.num, stats?.[1]?.label, stats?.[2]?.num, stats?.[2]?.label,
      ctaPrimary?.text, ctaPrimary?.href, ctaSecondary?.text, ctaSecondary?.href,
      quote?.text, quote?.author, quote?.role,
      req.params.slideId,
    ]
  );
  if (!rows.length) return res.status(404).json({ error: "Slide not found" });
  res.json(rows[0]);
});

// Add a new slide
router.post("/:pageId/slides", async (req, res) => {
  const { layout, gradientOrigin, eyebrow, title, subtitle, imageUrl, stats, ctaPrimary, ctaSecondary, quote } = req.body;
  const maxOrder = await db.query("SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM hero_slides WHERE hero_page_id = $1", [req.params.pageId]);
  const sortOrder = maxOrder.rows[0].next;

  const { rows } = await db.query(
    `INSERT INTO hero_slides (hero_page_id, sort_order, layout, gradient_origin, eyebrow, title, subtitle, image_url,
     stat_1_num, stat_1_label, stat_2_num, stat_2_label, stat_3_num, stat_3_label,
     cta_primary_text, cta_primary_href, cta_secondary_text, cta_secondary_href,
     quote_text, quote_author, quote_role)
     VALUES ($1,$2,$3,COALESCE($4,'50% 50%'),$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) RETURNING *`,
    [
      req.params.pageId, sortOrder, layout || 'standard', gradientOrigin, eyebrow, title, subtitle, imageUrl,
      stats?.[0]?.num, stats?.[0]?.label, stats?.[1]?.num, stats?.[1]?.label, stats?.[2]?.num, stats?.[2]?.label,
      ctaPrimary?.text, ctaPrimary?.href, ctaSecondary?.text, ctaSecondary?.href,
      quote?.text, quote?.author, quote?.role,
    ]
  );
  res.status(201).json(rows[0]);
});

// Delete a slide
router.delete("/:pageId/slides/:slideId", async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM hero_slides WHERE id = $1", [req.params.slideId]);
  if (!rowCount) return res.status(404).json({ error: "Slide not found" });
  res.json({ deleted: true });
});

export default router;
