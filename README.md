# QuillQuiver - Note Taking Application

A modern, full-stack note-taking application built with React, TypeScript, and Supabase. Features secure authentication, real-time data persistence, and a responsive design that works seamlessly across all devices.

## Features

### 🔐 Authentication
- **Email/Password Authentication**: Traditional signup and login
- **Google OAuth**: Quick sign-in with Google account  
- **OTP Authentication**: Email-based one-time password login
- **Secure JWT Authorization**: Protected routes and API calls
- **Input Validation**: Comprehensive form validation with error handling

### 📝 Note Management
- **Create Notes**: Rich text note creation with auto-save
- **Edit Notes**: Real-time editing with change detection
- **Delete Notes**: Secure note deletion with confirmation
- **Search Notes**: Find notes by title or content
- **Auto-Save**: Notes automatically save after 2 seconds of inactivity

### 🎨 User Experience
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Dark/Light Mode**: Automatic theme switching support
- **Real-time Updates**: Instant sync across devices
- **User Dashboard**: Welcome screen with usage statistics
- **Intuitive Interface**: Clean, modern design following Material Design principles

### 🔒 Security Features
- **Row Level Security (RLS)**: Database-level access control
- **Authenticated Routes**: Protected pages requiring login
- **Input Sanitization**: XSS protection and data validation
- **Secure Storage**: Encrypted data storage with Supabase

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **React Query** for state management

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** database with Row Level Security
- **JWT** tokens for secure authentication
- **Real-time subscriptions** for live updates

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd quillquiver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - The Supabase project is already configured
   - Database schema is automatically set up
   - Authentication providers are ready to use

4. **Configure Authentication Providers**
   - Go to Supabase Dashboard > Authentication > Providers
   - Enable Email provider (already enabled)
   - For Google OAuth:
     - Enable Google provider
     - Add your Google OAuth credentials
     - Set authorized domains

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Create an account or sign in

### Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the production build**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   │   ├── AuthPage.tsx   # Main auth page
│   │   ├── SignInForm.tsx # Sign in form
│   │   ├── SignUpForm.tsx # Sign up form
│   │   └── OtpForm.tsx    # OTP verification form
│   ├── notes/             # Note management components
│   │   ├── NotesApp.tsx   # Main notes application
│   │   ├── NoteSidebar.tsx # Sidebar with notes list
│   │   ├── NoteEditor.tsx # Note editing interface
│   │   └── WelcomeView.tsx # Welcome/dashboard view
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   ├── useNotes.ts        # Notes management hook
│   └── use-toast.ts       # Toast notifications hook
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication functions
│   └── utils.ts           # General utilities
├── integrations/
│   └── supabase/          # Supabase integration
└── pages/                 # Route pages
```

## Database Schema

The application uses the following Supabase tables:

### `profiles`
- User profile information
- Automatically created when user signs up
- Linked to Supabase auth.users

### `notes`
- User notes with title and content
- Row Level Security ensures users only see their own notes
- Auto-timestamps for created/updated dates

## Deployment

### Using Lovable (Recommended)
1. Open [Lovable Project](https://lovable.dev/projects/b9b589fb-416e-4af5-8cb8-61ece97ec64b)
2. Click on Share -> Publish
3. Your app will be deployed automatically

### Other Deployment Platforms
This application can also be deployed to:
- **Vercel**
- **Netlify** 
- **AWS Amplify**
- **Heroku**
- Any static hosting service

## Security Considerations

1. **Row Level Security**: All database operations are protected by RLS policies
2. **Authentication Required**: All note operations require valid authentication
3. **Input Validation**: Client and server-side validation prevents malicious input
4. **CORS Configuration**: Proper CORS settings in Supabase
5. **JWT Security**: Secure token handling and refresh

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React hooks best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Write descriptive commit messages

### Testing
- Test authentication flows
- Verify note CRUD operations
- Check responsive design
- Test error scenarios

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Open an issue on GitHub

## License

This project is licensed under the MIT License.

## Acknowledgments

- **Supabase** for backend infrastructure
- **Radix UI** for accessible components
- **Tailwind CSS** for styling system
- **React** team for the amazing framework
