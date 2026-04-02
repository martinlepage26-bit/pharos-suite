# Regulatory Boundaries And Localization

## Purpose

Keep compliance-support claims bounded and force jurisdiction-aware configuration before production use.

## Hard rule

CompassAI and Aurora support compliance review. They do not, by themselves, certify legal compliance.

## Jurisdictions in current scope

- EU / France
- Canada / Quebec
- United States
- United Kingdom
- cross-jurisdiction deployments

## Minimum cross-jurisdiction configuration

- legal basis recorded before personal-data ingestion
- purpose of processing recorded
- retention profile recorded
- jurisdiction context carried in evidence and governance records
- transfer mechanism confirmed where cross-border storage or review applies

## Quebec and French localization rule

For Quebec deployments:

- French disclosure templates are required
- explanation-ready fields are required
- English-only defaults are a known gap, not a tolerable default

For France public-authority contexts:

- algorithmic transparency obligations must be checked separately from baseline GDPR handling

## EU rule

T2/T3 classification is a governance signal that legal Annex III and GDPR/DPIA review may be required. It is not the legal conclusion itself.

## US rule

Sector and state law checks are use-case specific. Colorado, California, HIPAA, NYC bias-audit, and other obligations do not arise automatically from generic AI language alone.

## UK rule

UK GDPR, transfer rules, FCA/MHRA context, and forthcoming UK AI/ICO guidance must be checked independently of EU obligations.

## Freshness rule

Regulatory annex content older than its review checkpoint becomes stale for promotion-level compliance language.

## Acceptance criteria

- jurisdiction-sensitive deployments carry explicit configuration fields
- locale-sensitive deployments do not rely on English-only defaults
- regulatory monitoring has a named owner

## Source anchors

- `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md`

