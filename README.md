# Evasense Hesabdari

Modern accounting and invoicing application built with Next.js.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **State Management**: [Jotai](https://jotai.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **API Client**: [Axios](https://axios-http.com/)
- **Authentication**: [Iron Session](https://github.com/vvo/iron-session)
- **UI Elements**: 
  - [Framer Motion](https://www.framer.com/motion/) for animations
  - [Lucide React](https://lucide.dev/) and [React Icons](https://react-icons.github.io/react-icons/) for icons
  - [Sonner](https://sonner.emilkowal.ski/) for toast notifications

## Development

To run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/         # Next.js App Router pages and layouts
├── components/  # Reusable UI components
│   ├── forms/   # Form components
│   ├── layout/  # Layout components
│   └── ui/      # UI components (shadcn/ui)
├── data/        # Data fetching and management
├── hooks/       # Custom React hooks
├── lib/         # Utility functions and configurations
│   └── api/     # API client and services
└── types/       # TypeScript type definitions
```

## Code Standards

- **Code Formatting**: Prettier with tailwindcss and organize-imports plugins
- **Component Structure**: Small, reusable components (<200 lines)
- **Package Manager**: pnpm

## Building for Production

```bash
pnpm build
```

## Deployment

```bash
pnpm start
```

Or use the provided Docker configuration for containerized deployment.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

