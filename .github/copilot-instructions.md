<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a React TypeScript project with Tailwind CSS configured for GitHub Pages deployment.

## Project Guidelines

- Use TypeScript for all React components
- Follow React functional component patterns with hooks
- Use Tailwind CSS classes for styling (avoid inline styles)
- Maintain responsive design principles (mobile-first)
- Keep components modular and reusable
- Use proper TypeScript types and interfaces
- Follow React best practices for state management
- Ensure all components are accessible (a11y)

## Styling Guidelines

- Use Tailwind utility classes
- Prefer semantic color names (e.g., `bg-blue-500` over specific hex codes)
- Use consistent spacing scale (4, 8, 12, 16, etc.)
- Implement responsive breakpoints (sm:, md:, lg:, xl:)
- Use CSS custom properties for theme consistency

## File Organization

- Components in `src/components/`
- Utilities in `src/utils/`
- Types in `src/types/`
- Assets in `public/`
- Keep related files together

## GitHub Pages Deployment

- The project is configured with base path `/chatBotAI/`
- Automatic deployment via GitHub Actions
- Build output goes to `dist/` directory
