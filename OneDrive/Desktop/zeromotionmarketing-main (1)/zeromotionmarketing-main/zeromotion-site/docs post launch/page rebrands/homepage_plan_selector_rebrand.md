# Homepage Plan Selector Section - Cursor Implementation

## TASK: Rebrand Homepage Plan Selector Section

### Cursor Implementation Block
```markdown
**TASK**: Update the homepage Plan Selector section to enhance existing plans with brand/AI integration messaging

**TARGET SECTION**: The "Plan Selector" section with the three current plan cards

**PRESERVE**: 
- All existing pricing: Starter ($200-$300 build + $75-$100/mo), Growth ($1,000-$1,500 setup + $150-$300/mo), Scale ($2,000-$5,000+/mo)
- All existing features and descriptions
- All existing design elements, colors, and layout
- All existing CTAs and links

**ENHANCE CONTENT**:

1. **Section Header Enhancement**
   - **Keep**: "Plan Selector" title
   - **Enhance Subtitle**: Change from "Choose the perfect solution for every stage of your business journey" to:
   "Choose the perfect solution for every stage of your business journey. Now with integrated branding and AI automation."

2. **Starter Website Card Enhancement**
   - **Enhanced Title**: "Starter Website + Brand Foundation"
   - **Keep Pricing**: "$200-$300 build + $75-$100/mo"
   - **Enhanced Tagline**: "Perfect for new businesses + professional brand consistency"
   - **Enhanced Description**: "Get online fast with a professional website and local SEO foundation that drives real results. Now includes brand consistency to ensure professional appearance across all touchpoints."
   
   **Keep All Current Features**:
   - 1-3 page launch site
   - Hosting/CDN + SSL
   - Basic analytics
   - GBP connection
   - Light monthly updates
   
   **Add Enhanced Features Section**:
   - "✓ Basic brand guidelines for consistency"
   - "✓ Professional logo refresh (if needed)"
   - "✓ Smart contact form automation"
   
   **Keep CTA**: "See details"

3. **Growth Marketing Card Enhancement**
   - **Enhanced Title**: "Growth Marketing + Brand Integration"
   - **Keep Pricing**: "$1,000-$1,500 setup + $150-$300/mo"
   - **Enhanced Tagline**: "Most popular for growing businesses + brand consistency"
   - **Enhanced Description**: "Complete marketing automation with funnels, GHL integration, and content management. Now includes brand-consistent marketing materials that convert better and build stronger customer relationships."
   
   **Keep All Current Features**:
   - Funnels + GHL automations
   - GBP optimization + posts
   - Review requests
   - Social posts
   - Reporting
   
   **Add Enhanced Features Section**:
   - "✓ Brand-consistent funnel design"
   - "✓ Branded email templates and sequences"
   - "✓ AI-powered lead qualification"
   
   **Keep CTA**: "See details"
   **Keep Badge**: "Most Popular" highlighting

4. **Scale & Dominate Card Enhancement**
   - **Enhanced Title**: "Scale & Dominate + AI Intelligence"
   - **Keep Pricing**: "$2,000-$5,000+/mo"
   - **Enhanced Tagline**: "For established businesses ready to dominate + AI advantage"
   - **Enhanced Description**: "Enterprise-level advertising, AI chatbots, and comprehensive marketing management. Now includes premium brand strategy and advanced AI analytics that give you unfair competitive advantages."
   
   **Keep All Current Features**:
   - Google/Meta/TikTok ads
   - AI chatbots
   - Advanced funnels
   - Weekly creative
   - Reputation mgmt
   - Bi-weekly strategy
   
   **Add Enhanced Features Section**:
   - "✓ Premium brand strategy & positioning"
   - "✓ AI-powered competitor monitoring"
   - "✓ Predictive analytics & optimization"
   
   **Keep CTA**: "See details"

5. **Add New Section After Plan Selector**
   **Section Title**: "Why ZeroMotion's Integrated Approach Delivers Better Results"
   **Subtitle**: "Website + Marketing + Branding + AI working together as one system"
   
   **Three Benefit Columns**:
   
   **Column 1**:
   - **Icon**: Workflow integration symbol
   - **Title**: "Everything Works Together"
   - **Description**: "Your website, marketing funnels, and brand messaging work as one cohesive system instead of separate pieces fighting each other."
   
   **Column 2**:
   - **Icon**: AI + Brand symbol
   - **Title**: "AI That Matches Your Brand"
   - **Description**: "Our AI automation speaks in your brand voice and maintains professional consistency across every customer interaction."
   
   **Column 3**:
   - **Icon**: Results/ROI symbol
   - **Title**: "Faster, Better Results"
   - **Description**: "Integrated systems deliver 30-50% better ROI because every component amplifies the others instead of working in isolation."

**VISUAL ENHANCEMENTS**:
- Add subtle purple accent borders to enhanced feature sections
- Use workflow image thumbnails as background elements for each plan card
- Maintain existing hover effects and animations
- Add "NEW" badges to enhanced features

**ANALYTICS TRACKING**:
- Enhanced plan view: `data-event="view_enhanced_plan" data-plan="starter|growth|scale"`
- Integration benefits: `data-event="view_integration_benefits"`
- Enhanced feature interaction: `data-event="enhanced_feature_view" data-feature="[feature-name]"`
```

## CSS Enhancements

```css
/* Enhanced Features Section Styling */
.enhanced-features {
  border-top: 2px solid rgba(139, 92, 246, 0.3);
  padding-top: 15px;
  margin-top: 20px;
}

.enhanced-features li {
  color: #8b5cf6;
  font-weight: 500;
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
}

.enhanced-features li::before {
  content: "NEW";
  position: absolute;
  left: 0;
  top: -2px;
  background: #8b5cf6;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: bold;
}

/* Integration Benefits Section */
.integration-benefits {
  margin-top: 60px;
  padding: 40px 0;
  background: rgba(139, 92, 246, 0.05);
  border-radius: 15px;
}

.integration-benefits h3 {
  color: #8b5cf6;
  font-size: 1.3rem;
  margin-bottom: 15px;
}

.integration-benefits p {
  color: #e2e8f0;
  line-height: 1.6;
}
```

## Implementation Notes

1. **Preserve Existing Structure**: This enhancement maintains your successful pricing and feature structure
2. **Clear Value Addition**: Enhanced features are clearly marked as additional value
3. **No Pricing Changes**: All existing pricing remains exactly the same
4. **Upgrade Path**: Clear progression from basic to advanced integration
5. **Competitive Differentiation**: Integration messaging sets ZeroMotion apart from single-service competitors

