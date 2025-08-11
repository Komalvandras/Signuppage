# Login App

A modern, responsive login page built with:
- **Astro** - Fast, content-focused web framework
- **SolidJS** - Reactive UI components
- **TailwindCSS** - Utility-first CSS framework

## Features

- 📱 Responsive design that works on all devices
- ✨ Modern gradient background and glass-morphism effects
- 🔒 Form validation with real-time feedback
- 👁️ Password visibility toggle
- ⚡ Loading states and smooth animations
- 🎨 Beautiful UI with Tailwind CSS

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:4321](http://localhost:4321) in your browser

## Project Structure

```
login-app/
├── src/
│   ├── components/
│   │   └── LoginForm.tsx      # SolidJS login component
│   ├── pages/
│   │   └── index.astro        # Main login page
│   └── styles/
│       └── global.css         # Global styles with Tailwind
├── public/
│   └── favicon.svg           # App icon
├── astro.config.mjs          # Astro configuration
├── tailwind.config.mjs       # Tailwind configuration
└── package.json              # Dependencies
```

## Form Validation

The login form includes:
- Email format validation
- Password minimum length (6 characters)
- Real-time error clearing when user starts typing
- Visual feedback for validation states

## Demo Credentials

This is a demo application. You can use any email and password (minimum 6 characters) to test the form. The form will simulate a login process with a loading state.

## Build for Production

```bash
npm run build
```

## Technologies Used

- [Astro](https://astro.build/) - Web framework
- [SolidJS](https://www.solidjs.com/) - Reactive UI library
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
