# GOAL: Tacet as canonical record, Instagram as syndication window
Logged 5 Jul 2026. Standing architecture decision, VNTA-wide.

## The model
- Tacet is the canonical home of all VNTA-brand social content
  (Vendr, Eirvox, VNTA, and future houses/clients that opt in).
- Instagram (and any other external platform) is a syndication
  surface: a window. Content is born on the record, copied to the
  window, never the reverse.
- If an external platform disappears, the complete public record of
  every brand survives, addressable, on owned infrastructure.

## Content model
- A canonical entry = structured data + rendered asset.
  Example: Vendr DOCUMENT 3.0 is a data file (site, footprint,
  power, noise, footfall, cost to host, status) plus its rendered
  1080x1350 tile. The document/stock/record ID is the permanent
  address.
- Entry types that ARE canonical: documents (standards/placement/
  protocol), stock entries, records/logs.
- Entry types that are NOT canonical: pure atmosphere/filler tiles.
  Those are window dressing and live only on the window.

## Interim convention (active NOW, before Tacet ships)
- Every canonical post is authored as a structured data file in the
  brand's repo BEFORE it is rendered as a tile, e.g.
  posts/vendr/document-3.0.json + posts/vendr/document-3.0.png.
- Renderers (Pillow pipeline / Claude Design) consume the data file;
  they do not own the data.
- This means Tacet's launch import is a read of existing files, not
  a migration project, and Tacet launches with complete real history
  for its first tenants.

## Rules
- Instagram grids never advertise Tacet or ask the audience to
  leave; the window stays a window. The bio link may point to the
  brand's Tacet archive once it is real and populated.
- Instagram launch schedules never block on Tacet. If Tacet slips,
  the window operates standalone indefinitely.
- Commercial routes are unchanged: placement enquiries -> email,
  product/commercial traffic -> the brand site.

## Definition of done (v1)
- Per-brand archive at a stable address (e.g. tacet/vendr).
- Importer that reads posts/<brand>/*.json + assets from brand repos.
- Each entry addressable at a permanent URL keyed by its document/
  stock/record ID.
