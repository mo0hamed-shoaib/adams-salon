# Adam's Barbershop Website

A modern, responsive barbershop website built with Next.js 15, Tailwind v4, and shadcn/ui components. Features a real-time status dashboard, mobile-first design, and admin panel for managing shop data.

## Features

### 🎨 **Modern Design**
- Mobile-first responsive design
- Dark/Light mode support
- Professional barbershop aesthetic
- shadcn/ui components throughout

### 📱 **Hero Section**
- Full-screen hero with background image
- Logo overlay with Adam's barbershop branding
- Real-time status card showing:
  - Shop open/closed status
  - Current time
  - Number of clients in shop
  - Number of clients coming
  - Current waiting time

### 📞 **Contact Section**
- WhatsApp integration with pre-filled message
- Direct phone call functionality
- Professional contact cards

### ✂️ **Services Section**
- Dynamic service cards with images
- Pricing information
- Service descriptions
- Grid layout with hover effects

### 📍 **Location Section**
- Google Maps integration
- Address information
- Working hours display
- Directions functionality
- Parking and accessibility info

### ⭐ **Testimonials Section**
- Customer reviews with ratings
- Star rating display
- Customer avatars
- Call-to-action buttons

### 🔧 **Admin Dashboard**
- Password-protected admin access
- Real-time shop status management
- Working hours configuration
- Services management (add/edit/remove)
- Testimonials management
- Location information updates

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd adams-salon-shop
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Update the `.env.local` file with your configuration:
```env
# Dashboard password for admin access
DASHBOARD_PASSWORD=your_secure_password

# WhatsApp number (include country code, no + sign)
NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890

# Phone number (include country code, no + sign)
NEXT_PUBLIC_PHONE_NUMBER=1234567890

# Google Maps embed URL
GOOGLE_MAPS_URL=https://www.google.com/maps/embed?pb=...
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Admin Dashboard

Access the admin dashboard at `/dashboard` with the password set in your environment variables.

**Default password**: `admin123`

### Customization

1. **Logo**: Replace `/public/adams-logo.png` with your barbershop logo
2. **Hero Background**: Update the hero background image URL in `src/components/hero-section.tsx`
3. **Services**: Modify services in the admin dashboard or update `src/lib/data.ts`
4. **Contact Info**: Update phone numbers and WhatsApp number in `.env.local`
5. **Location**: Update address and Google Maps URL in the admin dashboard

### Google Maps Setup

1. Go to [Google Maps](https://maps.google.com)
2. Search for your barbershop location
3. Click "Share" → "Embed a map"
4. Copy the embed URL and paste it in your environment variables

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   ├── dashboard/           # Admin dashboard
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── contact-section.tsx  # Contact buttons
│   ├── hero-section.tsx     # Hero with status
│   ├── location-section.tsx # Location & maps
│   ├── services-section.tsx # Services grid
│   ├── testimonials-section.tsx # Customer reviews
│   └── main-navigation.tsx  # Navigation bar
└── lib/
    ├── data.ts              # Shop data management
    └── types.ts             # TypeScript types
```

## API Endpoints

- `GET /api/shop-data` - Fetch current shop data
- `POST /api/shop-data/update` - Update shop data (requires password)
- `POST /api/auth` - Authenticate admin access

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Features in Detail

### Real-time Status Management

The admin can update:
- Shop open/closed status
- Number of clients currently in shop
- Number of clients coming
- Current waiting time

### Mobile-First Design

- Responsive hero section (16:9 on desktop, 9:16 on mobile)
- Touch-friendly buttons and interactions
- Optimized for mobile performance

### Professional UI/UX

- Consistent spacing and typography
- Smooth animations and transitions
- Accessible design patterns
- Professional color scheme

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ using Next.js, Tailwind CSS, and shadcn/ui