# Zero Motion Documentation

Welcome to the Zero Motion Marketing documentation! This directory contains all project documentation organized by purpose and lifecycle.

## Directory Structure

### Active Documentation (`active/`)
Current operational documentation for running and maintaining the Zero Motion Marketing website.

#### `active/business/`
Business strategy, pricing, and compliance documentation:
- Compliance reports and test results
- Pricing strategies and audits
- Data handling and privacy policies
- GDPR and international compliance
- Business workflows and implementation guides

#### `active/technical/`
Technical implementation and system documentation:
- Analytics setup and configuration
- Security implementation and policies
- Performance optimization guides
- Caching strategies
- SEO implementation
- GHL (GoHighLevel) integration
- API documentation

#### `active/deployment/`
Build and deployment procedures:
- Deployment guides and checklists
- Deployment status tracking
- Build scripts and automation

#### `active/testing/`
Quality assurance and testing:
- Comprehensive test results
- Lighthouse performance reports
- Security audit reports
- Test scripts and utilities

---

### Legacy Documentation (`legacy/`)
Archived documentation for completed work - kept for reference and historical context.

#### `legacy/fixes/`
Bug fixes and patches that have been completed:
- Mobile optimization fixes
- Form fixes and improvements
- Header and hero section fixes
- UI/UX enhancements

#### `legacy/optimization/`
Completed optimization projects:
- Agent optimization briefs
- Performance improvement tasks
- Component cleanup summaries
- Spacing and layout refinements

#### `legacy/workbook/`
Development workbooks and project snapshots:
- Design iterations
- Development screenshots
- Implementation progress

#### `legacy/deployments/`
Historical deployment records:
- Past deployment guides
- Ad campaign deployments
- Vercel configuration history
- Launch runbooks

---

### Design Documentation (`design/`)
Design system and visual standards:
- Typography system documentation
- Component design specs
- Brand guidelines
- UI/UX patterns

---

## Quick Navigation

### For New Developers
Start here:
1. `active/deployment/DEPLOYMENT_GUIDE.md` - How to deploy
2. `active/technical/ANALYTICS_SETUP.md` - Analytics overview
3. `active/technical/SECURITY_IMPLEMENTATION_SUMMARY.md` - Security practices
4. `design/typography-system.md` - Design system reference

### For Business Stakeholders
Key documents:
1. `active/business/compliance-test-report.md` - Compliance status
2. `active/business/custom-website-pricing-strategy.md` - Pricing model
3. `active/testing/COMPREHENSIVE_TEST_RESULTS.md` - Quality metrics

### For Deployment
Essential guides:
1. `active/deployment/DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
2. `active/deployment/DEPLOYMENT_GUIDE.md` - Deployment procedures
3. `active/deployment/deploy.sh` - Deployment script

---

## Documentation Standards

### Creating New Documentation

1. **Determine the category:**
   - Is it operational and current? → `active/`
   - Is it completed work? → `legacy/`
   - Is it design-related? → `design/`

2. **Use clear naming:**
   - Use UPPERCASE for important guides (e.g., `DEPLOYMENT_GUIDE.md`)
   - Use lowercase for specific reports (e.g., `compliance-test-report.md`)
   - Include dates for time-sensitive docs (e.g., `2025-01-15_launch-report.md`)

3. **Include standard sections:**
   - **Purpose**: What this document covers
   - **Status**: Current, Legacy, or Archived
   - **Last Updated**: Date of last modification
   - **Related Docs**: Links to related documentation

### Moving Documentation to Legacy

When a project is complete or documentation becomes outdated:
1. Move from `active/` to appropriate `legacy/` subdirectory
2. Add a "Status: Legacy" header to the document
3. Include completion date
4. Update any references in active documentation

---

## Maintenance

### Quarterly Review
- Review `active/` docs for accuracy
- Move completed work to `legacy/`
- Archive truly obsolete documentation
- Update cross-references

### Annual Cleanup
- Review `legacy/` for archival candidates
- Consolidate related documentation
- Update this README with new patterns

---

## Contributing

When adding or updating documentation:
1. Place in the correct category
2. Follow naming conventions
3. Include clear headings and table of contents
4. Link related documents
5. Update this README if adding new categories

---

**Last Updated**: November 13, 2025
**Maintained By**: Zero Motion Development Team
