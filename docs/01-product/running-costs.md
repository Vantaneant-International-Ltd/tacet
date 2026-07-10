# What Tacet costs to run

Tacet's whole model is that **you are not the product** — nobody's attention or data is being
sold. Publishing what the product actually costs to run is part of proving that: if the money
comes from the service rather than from you, we can show you the service's bill. The figures
below are **estimates** until real invoices replace them, and every one is dated.

*Figures as of July 2026.*

## What Tacet costs to run

Monthly, in USD.

| Component | Beta (now) | 1k daily users | 10k | 100k |
|---|---|---|---|---|
| Workers base plan | $5 | $5 | $5 | $5 |
| Traffic overage (requests + CPU) | $0 | $2 | $15 | $90 |
| Database (D1 now, managed Postgres from ~10k) | $0 | $1 | $29 | $120 |
| Media storage (R2, zero egress fees) | $0 | $1 | $5 | $40 |
| Background jobs / queues | $0 | $0 | $10 | $94 |
| Domain + email | $1 | $1 | $1 | $1 |
| **TOTAL** | **~$6** | **~$10** | **~$65** | **~$350** |

Notes:

- Figures are estimates against Cloudflare and hosted-Postgres **list pricing as of July 2026**.
- The **Beta** and **1k** columns are close to actuals; **10k** and **100k** are projections.
- The database row reflects a **planned migration from D1 to managed Postgres via Hyperdrive**
  around the 10k mark — before then, D1 carries it.

## What this means

The hosted service is **cheap to run by design**: an edge platform with zero egress fees means
serving the open web back to people doesn't carry the bandwidth bills that sink most social
products. That's why a genuinely generous free tier is sustainable, and why paid tiers exist to
fund **development and hosting** — not to put out an infrastructure fire. This is the same
commitment stated as a rule in the [business model](business-model.md): we price the service,
never the software.

## Update policy

We will update this document as real invoices replace estimates and whenever the architecture
changes.
