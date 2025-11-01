# PortfoliX Institutional v1.0 - AI SaaS Infrastructure Layer

## Overview
Modular, scalable infrastructure for institutional portfolio management, white-label partner APIs, and future PortfoliX Research Terminal.

## Architecture Components

### 1. Database Schema
**Tables Created:**
- `institutional_subscriptions` - Subscription management with multi-currency support
- `institutional_portfolios` - AI Portfolio Library storage
- `white_label_partners` - Partner management for API licensing
- `institutional_api_keys` - API key management and rate limiting
- `portfolio_performance_history` - Performance tracking for analytics

**Supported Currencies:** USD, NGN, EUR, GBP

### 2. Business Logic Services

#### PortfolioService (`portfolioService.ts`)
- Portfolio generation with AI-inspired allocation
- Portfolio CRUD operations
- Plan limit validation
- Expected return calculations

#### SubscriptionService (`subscriptionService.ts`)
- Subscription creation with 7-day trials
- Multi-currency pricing
- Subscription lifecycle management
- Payment integration ready

#### CurrencyUtils (`currencyUtils.ts`)
- Multi-currency conversion
- Currency formatting
- Global expansion support

#### PDFExportService (`pdfExportService.ts`)
- Standardized PDF generation
- Compliance disclaimer embedding
- White-label ready structure

### 3. API Infrastructure

#### Edge Function: `institutional-api`
- RESTful API for white-label partners
- API key authentication
- Rate limiting
- Actions supported:
  - `generate_portfolio`
  - `list_portfolios`
  - `get_portfolio`
  - `delete_portfolio`

**Endpoint:** `https://oglduptdtrlxqglapjaj.supabase.co/functions/v1/institutional-api`

**Authentication:** API key via `x-api-key` header

### 4. Type System
Comprehensive TypeScript types in `types.ts`:
- `InstitutionalPlanTier`
- `CurrencyType`
- `InstitutionalSubscription`
- `InstitutionalPortfolio`
- `WhiteLabelPartner`
- `InstitutionalApiKey`

## Plan Tiers

### Corporate Starter ($499/mo)
- 3 institutional models
- Dashboard access
- Basic analytics

### Corporate Growth ($1,499/mo)
- 6 institutional models
- API access
- Risk dashboards
- Performance simulation

### Corporate Enterprise ($2,999+/mo)
- Unlimited models
- White-label reports
- Custom AI optimization
- Dedicated account manager

## Usage Examples

### Creating a Subscription
```typescript
import { SubscriptionService } from '@/lib/institutional';

const subscription = await SubscriptionService.createSubscription({
  organizationName: 'Acme Corp',
  planTier: 'corporate-growth',
  currency: 'USD',
}, userId);
```

### Generating a Portfolio
```typescript
import { PortfolioService } from '@/lib/institutional';

const portfolio = await PortfolioService.createPortfolio({
  subscriptionId: 'sub-123',
  portfolioName: 'Strategic Growth Fund',
  portfolioType: 'custom',
  riskTolerance: 'moderate',
  investmentHorizon: '5-years',
  liquidityNeeds: 'moderate',
  capitalSize: 5000000,
}, userId);
```

### Exporting Portfolio PDF
```typescript
import { PDFExportService } from '@/lib/institutional';

PDFExportService.exportPortfolio(portfolio);
```

### Currency Conversion
```typescript
import { CurrencyUtils } from '@/lib/institutional';

const priceInNGN = CurrencyUtils.convert(499, 'USD', 'NGN');
const formatted = CurrencyUtils.format(priceInNGN, 'NGN'); // ₦240,000
```

## API Usage (White-label Partners)

### Generate Portfolio via API
```bash
curl -X POST \
  https://oglduptdtrlxqglapjaj.supabase.co/functions/v1/institutional-api \
  -H 'x-api-key: pfx_YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "generate_portfolio",
    "params": {
      "portfolio_name": "Conservative Growth",
      "risk_tolerance": "conservative",
      "investment_horizon": "10-years",
      "liquidity_needs": "low",
      "capital_size": 10000000
    }
  }'
```

### List Portfolios
```bash
curl -X POST \
  https://oglduptdtrlxqglapjaj.supabase.co/functions/v1/institutional-api \
  -H 'x-api-key: pfx_YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "list_portfolios",
    "params": {
      "limit": 20
    }
  }'
```

## Security & Compliance

### Row Level Security (RLS)
All tables have RLS policies ensuring:
- Users can only access their own data
- Admin-only access for partner management
- API key validation for programmatic access

### Compliance
All portfolios include educational disclaimers:
> "PortfoliX Institutional Models are AI-generated frameworks inspired by historical corporate investment literature. They are provided for educational use by licensed financial institutions and do not constitute investment advice or portfolio management."

Full compliance documentation: `/legal/institutional-disclaimer`

## Future Expansion Plans

### Phase 2 - White-label Partner Portal
- Partner dashboard for API key management
- Usage analytics and billing
- Custom branding configuration
- Webhook support for portfolio events

### Phase 3 - Research Terminal
- Real-time market data integration
- Advanced portfolio analytics
- Custom research reports
- AI-powered market insights

### Phase 4 - Brokerage Integration
- Direct trading execution
- Brokerage partner APIs
- Automated rebalancing
- Tax-loss harvesting

## Database Functions

### `can_generate_institutional_portfolio(sub_id UUID)`
Checks if subscription has reached portfolio generation limit based on plan tier.

### `generate_api_key()`
Generates secure API keys with `pfx_` prefix for white-label partners.

### `update_institutional_updated_at()`
Trigger function to automatically update `updated_at` timestamps.

## Deployment

The infrastructure is automatically deployed with your Lovable project:
- Database migrations are applied automatically
- Edge functions are deployed to Supabase
- Type definitions are generated from schema

## Support

For institutional inquiries:
- Email: compliance@portfolix.com
- Documentation: https://portfolix.com/legal/institutional-disclaimer

---

**Version:** 1.0  
**Label:** PortfoliX Institutional v1.0 - AI SaaS Infrastructure Layer  
**Last Updated:** November 1, 2025
