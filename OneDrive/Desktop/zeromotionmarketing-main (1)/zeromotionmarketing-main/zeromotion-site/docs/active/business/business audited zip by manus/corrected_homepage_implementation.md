# Corrected Homepage Implementation - Based on Actual Pricing Structure

## Cursor Implementation Block

```markdown
**TASK**: Enhance homepage Plan Selector section to show integrated brand/AI value without changing existing pricing structure

**PRESERVE**: All existing design elements, pricing, plan names, and overall structure

**ENHANCE EXISTING CONTENT**:

1. **Hero Section** (Keep existing, add integration messaging)
   - **Keep**: Current headline and design
   - **Enhance Subhead**: Add after existing content: "Now with integrated branding and AI automation to maximize every dollar you invest."
   - **Keep**: All existing CTAs and links

2. **Plan Selector Section** (Enhance descriptions, keep all pricing)

   **Starter Website** (Keep: $200-$300 build + $75-$100/mo):
   - **Enhanced Title**: "Starter Website + Brand Foundation"
   - **Enhanced Description**: "Get online fast with a professional website and local SEO foundation that drives real results. Now includes brand consistency to ensure professional appearance across all touchpoints."
   - **Keep Current Features**: 1-3 page launch site, Hosting/CDN + SSL, Basic analytics, GBP connection, Light monthly updates
   - **Add New Features**: 
     - "✓ Basic brand guidelines for consistency"
     - "✓ Professional logo refresh (if needed)"
     - "✓ Smart contact form automation"
   - **Keep CTA**: "See details"

   **Growth Marketing** (Keep: $1,000-$1,500 setup + $150-$300/mo):
   - **Enhanced Title**: "Growth Marketing + Brand Integration" 
   - **Enhanced Description**: "Complete marketing automation with funnels, GHL integration, and content management. Now includes brand-consistent marketing materials that convert better and build stronger customer relationships."
   - **Keep Current Features**: Funnels + GHL automations, GBP optimization + posts, Review requests, Social posts, Reporting
   - **Add New Features**:
     - "✓ Brand-consistent funnel design"
     - "✓ Branded email templates and sequences"
     - "✓ AI-powered lead qualification"
   - **Keep CTA**: "See details"

   **Scale & Dominate** (Keep: $2,000-$5,000+/mo):
   - **Enhanced Title**: "Scale & Dominate + AI Intelligence"
   - **Enhanced Description**: "Enterprise-level advertising, AI chatbots, and comprehensive marketing management. Now includes premium brand strategy and advanced AI analytics that give you unfair competitive advantages."
   - **Keep Current Features**: Google/Meta/TikTok ads, AI chatbots, Advanced funnels, Weekly creative, Reputation mgmt, Bi-weekly strategy
   - **Add New Features**:
     - "✓ Premium brand strategy & positioning"
     - "✓ AI-powered competitor monitoring"
     - "✓ Predictive analytics & optimization"
   - **Keep CTA**: "See details"

3. **Add New Section After Plan Selector**:
   - **Section Title**: "Why ZeroMotion's Integrated Approach Delivers Better Results"
   - **Subtitle**: "Website + Marketing + Branding + AI working together as one system"
   
   **Three Benefits**:
   - **Benefit 1**: 
     - **Icon**: Use workflow image thumbnail
     - **Title**: "Everything Works Together"
     - **Description**: "Your website, marketing funnels, and brand messaging work as one cohesive system instead of separate pieces fighting each other."
   
   - **Benefit 2**:
     - **Icon**: Use workflow image thumbnail  
     - **Title**: "AI That Matches Your Brand"
     - **Description**: "Our AI automation speaks in your brand voice and maintains professional consistency across every customer interaction."
   
   - **Benefit 3**:
     - **Icon**: Use workflow image thumbnail
     - **Title**: "Faster, Better Results"
     - **Description**: "Integrated systems deliver 30-50% better ROI because every component amplifies the others instead of working in isolation."

4. **Social Proof Enhancement** (Add after integration benefits)
   - **Headline**: "Trusted by 50+ Houma & Thibodaux Businesses"
   - **Testimonial**: "ZeroMotion's integrated approach increased our revenue by 340% in 6 months. Having everything work together just makes sense." - [Client Name], [Business Type]
   - **Logo Row**: [Space for 4-6 local business logos]

5. **Final CTA Section** (Keep existing, enhance messaging)
   - **Keep**: Existing CTA structure
   - **Add**: "Ready to see how website + marketing + branding + AI work together for your business?"

**WORKFLOW IMAGE INTEGRATION**:
- **Starter Website**: Use `zeromotion_workflow_1_lead_capture.png` (cropped to show website/lead capture portion)
- **Growth Marketing**: Use `zeromotion_workflow_2_automation.png` (shows marketing automation)
- **Scale & Dominate**: Use `zeromotion_workflow_4_results.png` (shows enterprise analytics)
- **Integration Benefits Background**: Use `zeromotion_process_flow_complete.png` (subtle overlay)

**ANALYTICS TRACKING**:
- Enhanced plan view: `data-event="view_enhanced_plan" data-plan="starter|growth|scale"`
- Integration benefits: `data-event="view_integration_benefits"`
- Workflow image interaction: `data-event="workflow_image_view" data-workflow="[workflow-type]"`
```

## Technical Implementation Notes

### **CSS for Enhanced Plan Cards**
```css
.plan-card {
  position: relative;
  overflow: hidden;
}

.plan-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.plan-card:hover::before {
  opacity: 1;
}

.enhanced-features {
  border-top: 1px solid rgba(139, 92, 246, 0.3);
  padding-top: 15px;
  margin-top: 15px;
}

.enhanced-features li {
  color: #8b5cf6;
  font-weight: 500;
}
```

### **Mobile Responsiveness**
```css
@media (max-width: 768px) {
  .plan-selector {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .integration-benefits {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .workflow-image {
    height: 150px;
    object-fit: cover;
  }
}
```

This implementation enhances your existing successful structure while adding the integrated brand/AI messaging that positions ZeroMotion as a complete solution provider.

