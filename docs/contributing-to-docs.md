# 📝 Contributing to Documentation

This guide explains how to add, update, and maintain the Echopad documentation. Following these conventions keeps the docs consistent and easy to navigate.

---

## File Organization

```
docs/
├── README.md                    # Root index — update when adding new sections
├── getting-started.md           # Onboarding guide
├── contributing-to-docs.md      # This file
├── backend/                     # All backend-related docs
│   ├── README.md                # Backend TOC — update when adding pages
│   └── <topic>.md
└── frontend/                    # All frontend-related docs
    ├── README.md                # Frontend TOC — update when adding pages
    └── <topic>.md
```

### Rules

1. **One topic per file** — Don't cram multiple unrelated topics into one page.
2. **Backend docs go in `docs/backend/`**, frontend docs in `docs/frontend/`.
3. **Cross-cutting concerns** (e.g., CI/CD, env vars for both) go in the appropriate subsection or the root `docs/` folder.
4. **Update the TOC** — When adding a new page, add a link in the relevant `README.md`.

---

## Naming Conventions

| Convention | Example |
|------------|---------|
| Lowercase, kebab-case filenames | `api-reference.md`, `state-management.md` |
| Descriptive names | `authentication.md` not `auth.md` |
| `README.md` for section indexes | `docs/backend/README.md` |

---

## Page Template

Use this template when creating a new documentation page:

```markdown
# 📄 Page Title

Brief description of what this page covers and who it's for.

---

## Section 1

Content here.

---

## Section 2

Content here.

---

## Related Pages

- [Link to related doc](./related-doc.md)
```

### Formatting Guidelines

- **Use headings** (`##`, `###`) to structure content — avoid walls of text.
- **Use tables** for reference data (env vars, API endpoints, config options).
- **Use code blocks** with language hints for commands and code snippets.
- **Use callout blocks** for tips, warnings, and important notes:
  ```
  > **💡 Tip:** Helpful suggestion here.
  > **⚠️ Warning:** Something to watch out for.
  ```
- **Use relative links** to reference other docs: `[Page](./page.md)` not absolute URLs.
- Keep lines concise — prefer short bullet points over long paragraphs.

---

## When to Update Docs

| Change | Action |
|--------|--------|
| New API endpoint added | Update `backend/api-reference.md` |
| New env variable | Update the relevant `environment-variables.md` |
| New React component group | Update `frontend/components.md` |
| New page/route added | Update `frontend/routing.md` |
| New auth strategy | Update both `authentication.md` files |
| New service created | Update `backend/services.md` |
| Architecture change | Update the relevant `architecture.md` |

---

## Review Checklist

Before merging doc changes, verify:

- [ ] All internal links (`[text](./path.md)`) resolve to existing files
- [ ] Code examples are syntactically correct
- [ ] The relevant `README.md` TOC has been updated
- [ ] No sensitive values (API keys, secrets) are included
- [ ] Content renders correctly in GitHub markdown preview
