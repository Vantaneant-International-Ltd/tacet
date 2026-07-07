# Security Policy

Tacet is early software and not yet ready for production use. We still take security
seriously and appreciate responsible disclosure.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Instead, report privately:

- Use GitHub's **[Report a vulnerability](https://github.com/Vantaneant-International-Ltd/tacet/security/advisories/new)**
  (Security → Advisories) on this repository, or
- email **security@vnta.xyz** with the details.

Please include:

- a description of the issue and its impact,
- steps to reproduce (a proof of concept if possible),
- affected versions/commit, and any suggested remediation.

We aim to acknowledge reports within a few days. Because Tacet is pre-release, there
are no formal SLAs yet, but we will keep you updated and credit you (if you wish) once
a fix ships.

## Scope

In scope: this repository's code (the Worker/API, the client, the ActivityPub
adapter once it exists) and its documentation.

Out of scope: third-party services Tacet talks to (e.g. other servers on the open
social web), and any deployment you run yourself — you are responsible for securing
your own instance, secrets, and infrastructure.

## Secrets

Never commit secrets. Local secrets belong in a git-ignored `.dev.vars` (see
[`.dev.vars.example`](.dev.vars.example)); deployment secrets are set with
`wrangler secret put`. If you believe a secret was committed, report it privately as
above so it can be rotated.
