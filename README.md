# Wedding Invitation

credit: [@mrofisr](https://github.com/mrofisr).

![Preview](public/preview.png)

A modern, interactive wedding invitation website built with Vite (React), Tailwind CSS, and Framer Motion. Features a **database-driven multi-tenant system** with backend API for managing multiple weddings.

## Features
- 🎨 Modern design & smooth animations
- 📱 Fully responsive & mobile-first layout
- 🎵 Background music with autoplay controls
- 💬 **Interactive wishes system with attendance tracking (PostgreSQL-backed)**
- 🎉 Fun confetti effects and countdown timer
- 🗺️ Google Maps integration
- 💝 Digital envelope/gift feature with bank account details
- 📅 Multiple event agenda support
- 🔗 **Personalized invitation links** with guest names
- 🌐 **Multi-tenant system**: Host multiple weddings on one deployment
- ⚡ **REST API backend** (Hono + PostgreSQL)
- 🕐 **Asia/Jakarta timezone support** for all timestamps

## Tech Stack

### Frontend
- [Vite (React)](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [React Confetti](https://www.npmjs.com/package/react-confetti)
- [React Router](https://reactrouter.com/)

### Backend
- [Hono](https://hono.dev/) - Lightweight web framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Bun](https://bun.sh/) - JavaScript runtime & package manager

## Quick Start

### Prerequisites
- [Bun](https://bun.sh/) installed
- PostgreSQL database running

### Installation
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/mrofisr/islamic-wedding-invitation
   cd islamic-wedding-invitation
   bun install
   ```

2. Set up the database:
   ```bash
   # Create PostgreSQL database
   createdb sakeenah

   # Run the schema (create tables)
   psql -d sakeenah -f src/server/db/schema.sql.example
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file:
   ```env
   # Frontend
   VITE_API_URL=http://localhost:3000
   VITE_INVITATION_UID=your-unique-invitation-id

   # Backend
   DATABASE_URL=postgresql://username:password@localhost:5432/sakeenah
   PORT=3000
   ```

4. Add your wedding data:
   ```bash
   # Use the example SQL template
   cp src/server/db/add-wedding.sql.example src/server/db/my-wedding.sql

   # Edit my-wedding.sql with your details, then run:
   psql -d sakeenah -f src/server/db/my-wedding.sql
   ```

5. Start the development servers:
   ```bash
   # Run both client and server concurrently
   bun run dev
   ```

   Or run them separately:
   ```bash
   # Terminal 1: Frontend (Vite)
   bun run dev:client

   # Terminal 2: Backend API
   bun run dev:server
   ```

6. Open your browser:
   - **With path routing**: [http://localhost:5173/your-uid](http://localhost:5173/your-uid)
   - **Legacy query params**: [http://localhost:5173/?uid=your-uid](http://localhost:5173/?uid=your-uid)

## Architecture

This project uses a **client-server architecture**:

- **Frontend (Port 5173)**: React SPA built with Vite
- **Backend API (Port 3000)**: Hono REST API server
- **Database**: PostgreSQL with multi-tenant design

### Database-Driven System

All wedding data is stored in PostgreSQL, **not in code**. Each wedding has a unique UID that's used in URLs:

- URLs: `https://your-site.com/couple-name-2025`
- API fetches wedding details based on UID
- Multiple weddings can share the same deployment

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.

## Personalized Invitation Links

Generate personalized invitation links with pre-filled guest names:

```bash
# Generate links for your guest list
bun run generate-links
```

This creates URLs like:
```
http://localhost:5173/rifqi-dina-2025?guest=QWhtYWQgQWJkdWxsYWg=
```

When guests open their link:
- Their name appears in the hero section
- Wishes form is pre-filled with their name
- They can still edit their name if needed

See [PERSONALIZED-INVITATIONS.md](./PERSONALIZED-INVITATIONS.md) for complete guide.

## Customization

### Database Method (Recommended)

Add wedding data via SQL (supports multiple weddings):

1. Copy the template:
   ```bash
   cp src/server/db/add-wedding.sql.example my-wedding.sql
   ```

2. Edit `my-wedding.sql` with your details

3. Insert into database:
   ```bash
   psql -d sakeenah -f my-wedding.sql
   ```

### Static Config (Fallback)

For development/testing, you can also edit `src/config/config.js` (deprecated):

#### Wedding Information
```javascript
const config = {
  data: {
    // Main invitation title that appears on the page
    title: "Pernikahan Fulan & Fulana",
    
    // Opening message/description of the invitation
    description: "Kami akan menikah dan mengundang Anda untuk turut merayakan momen istimewa ini.",
    
    // Groom's and bride's names
    groomName: "Fulan",
    brideName: "Fulana",
    
    // Parents' names
    parentGroom: "Bapak Groom & Ibu Groom",
    parentBride: "Bapak Bride & Ibu Bride",
```

#### Date, Time & Location
```javascript
    // Wedding date (format: YYYY-MM-DD)
    date: "2024-12-24",
    
    // Event time (free format, example: "10:00 - 12:00 WIB")
    time: "16:16 - 17:30 WIB",
    
    // Venue/building name
    location: "Grand Ballroom, Hotel Majesty",
    
    // Full address of the wedding venue
    address: "Jl. Jend. Sudirman No.1, Jakarta",
```

#### Google Maps Integration
```javascript
    // Google Maps link for location (short clickable link)
    maps_url: "https://goo.gl/maps/abcdef",
    
    // Google Maps embed code to display map on website
    // How to get: open Google Maps → select location → Share → Embed → copy link
    maps_embed: "https://www.google.com/maps/embed?pb=...",
```

#### Event Agenda
```javascript
    // List of event agenda/schedule
    agenda: [
      {
        // Event name
        title: "Akad Nikah",
        // Event date (format: YYYY-MM-DD)
        date: "2024-12-24",
        // Start time (format: HH:MM)
        startTime: "16:16",
        // End time (format: HH:MM)
        endTime: "17:30",
        // Event venue
        location: "Grand Ballroom, Hotel Majesty",
        // Full address
        address: "Jl. Jend. Sudirman No.1, Jakarta",
      },
      // You can add more agenda items with the same format
    ],
```

#### Background Music
```javascript
    // Background music settings
    audio: {
      // Music file (choose one or replace with your own file)
      src: "/audio/fulfilling-humming.mp3", // or /audio/nature-sound.mp3
      // Music title to display
      title: "Fulfilling Humming",
      // Whether music plays automatically when website opens
      autoplay: true,
      // Whether music repeats continuously
      loop: true
    },
```

#### Digital Envelope/Gift
```javascript
    // List of bank accounts for digital envelope/gifts
    banks: [
      {
        // Bank name
        bank: "Bank Central Asia",
        // Account number
        accountNumber: "1234567890",
        // Account holder name (all uppercase)
        accountName: "FULAN",
      },
      // You can add more banks with the same format
    ]
```

#### SEO & Branding
```javascript
    // Image that appears when link is shared on social media
    ogImage: "/images/og-image.jpg",
    
    // Icon that appears in browser tab
    favicon: "/images/favicon.ico",
```

### Complete Configuration Example
```javascript
const config = {
  data: {
    title: "Pernikahan Fulan & Fulana",
    description: "Kami akan menikah dan mengundang Anda untuk turut merayakan momen istimewa ini.",
    groomName: "Fulan",
    brideName: "Fulana",
    parentGroom: "Bapak Groom & Ibu Groom",
    parentBride: "Bapak Bride & Ibu Bride",
    date: "2024-12-24",
    maps_url: "https://goo.gl/maps/abcdef",
    maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0000000000005!2d106.8270733147699!3d-6.175392995514422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4f1b6d7b1e7%3A0x2e69f4f1b6d7b1e7!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1633666820004!5m2!1sid!2sid",
    time: "16:16 - 17:30 WIB",
    location: "Grand Ballroom, Hotel Majesty",
    address: "Jl. Jend. Sudirman No.1, Jakarta",
    ogImage: "/images/og-image.jpg",
    favicon: "/images/favicon.ico",
    agenda: [
      {
        title: "Akad Nikah",
        date: "2024-12-24",
        startTime: "16:16",
        endTime: "17:30",
        location: "Grand Ballroom, Hotel Majesty",
        address: "Jl. Jend. Sudirman No.1, Jakarta",
      },
      {
        title: "Resepsi Nikah",
        date: "2024-12-24",
        startTime: "16:16",
        endTime: "17:30",
        location: "Grand Ballroom, Hotel Majesty",
        address: "Jl. Jend. Sudirman No.1, Jakarta",
      }
    ],
    audio: {
      src: "/audio/fulfilling-humming.mp3",
      title: "Fulfilling Humming",
      autoplay: true,
      loop: true
    },
    banks: [
      {
        bank: "Bank Central Asia",
        accountNumber: "1234567890",
        accountName: "FULAN",
      },
      {
        bank: "Bank Mandiri",
        accountNumber: "0987654321",
        accountName: "FULANA",
      }
    ]
  }
};

export default config;
```

## API Endpoints

The backend provides these REST endpoints:

### Invitations
- `GET /api/invitation/:uid` - Get wedding details, agenda, and bank accounts

### Wishes
- `GET /api/:uid/wishes` - Get all wishes (supports pagination)
- `POST /api/:uid/wishes` - Create new wish
- `DELETE /api/:uid/wishes/:id` - Delete wish (admin)
- `GET /api/:uid/stats` - Get attendance statistics

Example API call:
```bash
curl http://localhost:3000/api/invitation/rifqi-dina-2025
```

## Deployment

### Build for Production

```bash
# Build frontend
bun run build

# Preview production build
bun run preview
```

### Environment Variables (Production)

```env
# Frontend
VITE_API_URL=https://your-api-domain.com
VITE_INVITATION_UID=default-wedding-uid

# Backend
DATABASE_URL=postgresql://user:pass@your-db-host:5432/sakeenah
PORT=3000
```

### Hosting Options

**Option 1: Cloudflare Workers (Recommended)**
- Full-stack deployment on Cloudflare's edge network
- Serves both frontend and backend from a single worker
- Uses Hyperdrive for PostgreSQL connection pooling
- See [Cloudflare Workers Deployment](#cloudflare-workers-deployment) section below

**Option 2: Separate Hosting**
- **Frontend**: Vercel, Netlify, or any static hosting (build output: `dist/` folder)
- **Backend**: VPS with Bun runtime, Docker container, or cloud platforms (Railway, Render, Fly.io)
- **Database**: Supabase (PostgreSQL), Railway PostgreSQL, or self-hosted PostgreSQL

## Cloudflare Workers Deployment

Deploy the entire application (frontend + backend) to Cloudflare Workers with database connection via Hyperdrive.

### Prerequisites

1. Cloudflare account with Workers enabled
2. Wrangler CLI: `npm install -g wrangler`
3. PostgreSQL database (cloud-hosted recommended: Supabase, Neon, Railway, etc.)

### Setup Steps

#### 1. Authenticate with Cloudflare

```bash
wrangler login
```

#### 2. Create Hyperdrive Database Connection

```bash
# Replace with your actual PostgreSQL connection string
wrangler hyperdrive create sakeenah-db \
  --connection-string="postgresql://username:password@host:port/database"
```

Copy the Hyperdrive ID from the output.

#### 3. Configure wrangler.jsonc

Edit `wrangler.jsonc` and update:

```jsonc
{
  "bindings": [
    {
      "name": "DB",
      "type": "hyperdrive",
      "id": "YOUR_HYPERDRIVE_ID_HERE"  // Paste your Hyperdrive ID
    }
  ],
  "routes": [
    {
      "pattern": "yourdomain.com/*",      // Your custom domain
      "zone_name": "yourdomain.com"       // Your domain zone
    }
  ]
}
```

#### 4. Update CORS Configuration

In `src/server/index.js`, add your production domain:

```javascript
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],  // Add your domain
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
```

#### 5. Deploy

```bash
# Build and deploy in one command
bun run deploy
```

Or separately:
```bash
# Build frontend first
bun run build

# Then deploy to Cloudflare
bun run cf:deploy
```

### Cloudflare Workers Scripts

```bash
bun run deploy       # Build + deploy to Cloudflare Workers
bun run cf:dev       # Test locally with Workers runtime
bun run cf:deploy    # Deploy to Cloudflare Workers
bun run cf:tail      # View live logs from deployed worker
```

### How It Works

The application automatically detects its runtime environment:
- **Local Development**: Uses Node.js with `@hono/node-server` and PostgreSQL connection from `.env`
- **Cloudflare Workers**: Uses Hyperdrive binding (`c.env.DB`) for database access

No code changes needed between environments!

### Custom Domain Setup

1. Add your domain to Cloudflare (DNS management)
2. Update `routes` in `wrangler.jsonc` with your domain
3. Deploy with `bun run cf:deploy`
4. Your worker automatically binds to the domain

### Monitoring & Debugging

```bash
# View real-time logs
wrangler tail

# Check Hyperdrive connection
wrangler hyperdrive get sakeenah-db

# Test deployment status
wrangler deployments list
```

### Cloudflare Workers Free Tier

- 100,000 requests/day
- 10ms CPU time per request
- Sufficient for most wedding invitation sites
- Upgrade to Workers Paid ($5/month) for higher traffic

## Scripts

```bash
# Development
bun run dev              # Run both client & server
bun run dev:client       # Run frontend only
bun run dev:server       # Run backend only

# Production
bun run build            # Build frontend
bun run preview          # Preview production build
bun run server           # Run backend server

# Cloudflare Workers Deployment
bun run deploy           # Build + deploy to Cloudflare Workers
bun run cf:dev           # Test locally with Workers runtime
bun run cf:deploy        # Deploy to Cloudflare Workers
bun run cf:tail          # View live logs from deployed worker

# Utilities
bun run generate-links   # Generate personalized invitation links
bun run lint             # Lint code
```

## Custom Wedding Invitation Service

### 💝 Want This Invitation Made for You?

If you're interested in having a custom wedding invitation created using this template, please note our terms:

**Requirements:**
- You must agree with the concept and design philosophy provided
- Willing to donate a portion of the service fee to mosques or charitable institutions in need
- Respect the Islamic values and aesthetic principles embedded in the design

This approach ensures that every wedding invitation created not only celebrates your special day but also contributes to the community and upholds the values of giving back.


*"And whoever does good - whether male or female - and is a believer, they will enter Paradise and will not be wronged even as much as the speck on a date seed."* - Quran 4:124

## License
This project is licensed under the [Apache License 2.0](https://opensource.org/licenses/Apache-2.0). You can use, modify, and distribute it as long as you include the original copyright notice and license.

## Contact
- GitHub: [@rothiii](https://github.com/Rothiii)
- Instagram: [@rafidal._](https://instagram.com/rafidal._)

May Allah guide us all.