# Ember Grill Backend Documentation

## Overview
This backend is built using Supabase and provides a complete restaurant management system for Ember Grill. It includes database schema, authentication, storage, and serverless functions.

## Architecture

### Database Schema
- **PostgreSQL** database with 11+ tables
- **Row Level Security (RLS)** enabled on all tables
- **Custom functions** for business logic (order calculations, promotions)
- **Triggers** for automatic notifications and profile creation

### Tables
1. `profiles` - User profiles (extends auth.users)
2. `customers` - Customer information
3. `menu_items` - Restaurant menu items
4. `orders` - Customer orders
5. `order_items` - Individual items in orders
6. `reviews` - Customer reviews and ratings
7. `promotions` - Discount codes and promotions
8. `order_promotions` - Links orders to applied promotions
9. `delivery_zones` - Delivery area definitions
10. `notifications` - Customer notifications
11. `restaurant_settings` - Restaurant configuration

### Authentication
- **Supabase Auth** for user management
- Support for email/password and OAuth providers
- Automatic profile creation via triggers

### Storage
- **Supabase Storage** for file uploads
- Buckets for menu images, customer uploads, and restaurant assets

### Edge Functions
- `create-order` - Handles order creation with business logic
- `process-payment` - Processes payments (integrate with payment provider)
- `send-notifications` - Sends notifications to customers
- `api` - General API endpoint for various operations

## Setup Instructions

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Initialize Supabase Project
```bash
supabase init
supabase start
```

### 3. Run Database Migration
```bash
supabase db push
```

### 4. Deploy Edge Functions
```bash
supabase functions deploy create-order
supabase functions deploy process-payment
supabase functions deploy send-notifications
supabase functions deploy api
```

### 5. Set Environment Variables
Create a `.env.local` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## API Endpoints

### Orders
- `POST /functions/v1/create-order` - Create a new order
- `GET /functions/v1/api?action=get_orders&customerId={id}` - Get customer orders

### Menu
- `GET /functions/v1/api?action=get_menu_items` - Get all menu items

### Promotions
- `GET /functions/v1/api?action=get_promotions` - Get active promotions

### Settings
- `GET /functions/v1/api?action=get_restaurant_settings` - Get restaurant settings

## Security

### Row Level Security Policies
All tables have RLS enabled with policies for:
- Users can only access their own data
- Public read access for menu items and promotions
- Admin-only access for sensitive operations

### Authentication Requirements
- Most operations require authentication
- Guest orders supported for anonymous users
- Admin role for restaurant management

## Business Logic

### Order Processing
1. Validate cart items and customer data
2. Calculate totals with promotions and delivery fees
3. Create customer record if new
4. Create order and order items
5. Apply promotions if valid
6. Send confirmation notification

### Payment Processing
- Integrated payment processing (Stripe/PayPal recommended)
- Transaction tracking and status updates
- Automatic order status changes

### Notifications
- Order confirmations
- Status updates
- Promotion alerts
- Delivery notifications

## Development

### Local Development
```bash
# Start Supabase locally
supabase start

# Run migrations
supabase db reset

# Serve edge functions locally
supabase functions serve
```

### Testing
```bash
# Run database tests
supabase test db

# Test edge functions
supabase functions invoke create-order --data '{"test": "data"}'
```

## Deployment

### Production Deployment
1. Create Supabase project
2. Push database schema: `supabase db push`
3. Deploy functions: `supabase functions deploy`
4. Configure environment variables
5. Set up storage buckets
6. Configure authentication providers

### Environment Variables
```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY (for payments)
SENDGRID_API_KEY (for emails)
```

## Monitoring

### Database Monitoring
- Query performance
- Connection limits
- Storage usage

### Function Monitoring
- Execution times
- Error rates
- Cold start performance

### Business Metrics
- Order volume
- Revenue tracking
- Customer satisfaction

## Troubleshooting

### Common Issues
1. **Migration fails**: Check database connection and permissions
2. **Functions timeout**: Increase timeout limits or optimize code
3. **RLS blocking queries**: Review security policies
4. **Storage upload fails**: Check bucket permissions and file size limits

### Logs
```bash
# View function logs
supabase functions logs create-order

# View database logs
supabase db logs
```

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Use conventional commits

## License
This project is licensed under the MIT License.