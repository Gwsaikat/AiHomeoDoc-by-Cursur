# AI Homeopathy

An innovative platform combining artificial intelligence with traditional homeopathic medicine to provide personalized healthcare solutions.

## Vision

AI Homeopathy aims to bridge the gap between modern technology and traditional homeopathic practices. By leveraging AI algorithms, we provide personalized remedy recommendations, symptom analysis, and treatment tracking to improve patient outcomes.

## Key Features

- **Intelligent Remedy Recommendation**: AI-powered system that matches symptoms with appropriate homeopathic remedies
- **Patient Management System**: Comprehensive dashboard for tracking patient history, treatments, and progress
- **Symptom Analysis**: Advanced pattern recognition to identify underlying health conditions
- **Knowledge Base**: Extensive database of homeopathic remedies, their applications, and effectiveness
- **Secure Consultations**: Virtual consultation platform with homeopathic practitioners
- **Treatment Tracking**: Monitor patient progress and treatment efficacy over time
- **Research Integration**: Incorporate latest research findings in homeopathic medicine

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma
- **Database**: PostgreSQL
- **AI Components**: TensorFlow.js, OpenAI API integration
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the application in action.

## Contributing

This project is in active development. Contributions are welcome!

## License

MIT

## Authentication Features

The application includes a comprehensive authentication system with multiple sign-in methods:

### Authentication Methods

1. **Email/Password Authentication**
   - Traditional sign-up and sign-in with email and password
   - Email verification support
   - Password reset functionality

2. **Social Authentication**
   - Google Sign-In
   - Apple Sign-In
   - Proper OAuth flow with redirect handling

3. **Phone Authentication**
   - SMS OTP (One-Time Password) verification
   - Phone number validation
   - Resend code functionality

### User Roles

The authentication system supports multiple user roles:
- **Patient**: Regular users seeking medical consultation
- **Doctor**: Medical professionals providing consultations
- **Clinic**: Medical facilities managing multiple doctors

### Authentication Flow

1. **Sign-Up Process**:
   - User selects their role (Patient, Doctor, or Clinic)
   - User chooses authentication method (Email, Phone, Google, or Apple)
   - For social logins, OAuth redirects are handled through the callback route
   - For new social login users, a profile completion page collects additional information

2. **Sign-In Process**:
   - User enters credentials or uses social login
   - Successful authentication redirects to the appropriate dashboard based on role

### Technical Implementation

- Built with Next.js, Supabase Auth, and Tailwind CSS
- OAuth providers configured via Supabase project settings
- Server-side authentication with cookie-based sessions
- Secure callback handling with proper error management
- Client-side state management for authentication stages

### Environment Setup

To use the authentication features, ensure the following environment variables are set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Additionally, configure OAuth providers (Google, Apple) in the Supabase dashboard with the correct redirect URLs:
- Redirect URL: `https://your-domain.com/auth/callback`
