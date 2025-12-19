/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        primary: '#2563eb',
        secondary: '#475569',
        dark: '#020617',
        light: '#f8fafc',
      },
      animation: {
        blob: "blob 7s infinite",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        slideUp: "slideUp 0.5s ease-out forwards",
        slideDown: "slideDown 0.3s ease-out forwards",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
                        fontFamily: 'var(--font-outfit), sans-serif',
            color: '#0f172a',
            maxWidth: 'none',
            fontSize: '1.125rem',
            lineHeight: '1.8',
            a: {
              color: theme('colors.primary'),
              textDecoration: 'none',
              fontWeight: '600',
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.2s',
              '&:hover': {
                color: theme('colors.blue.700'),
                borderBottomColor: theme('colors.blue.700'),
              },
            },
            'h1, h2, h3, h4': {
              color: '#020617',
              fontWeight: '800',
              marginTop: '1.5em',
              marginBottom: '0.8em',
              letterSpacing: '-0.025em',
            },
            code: {
                          fontFamily: 'var(--font-jetbrains-mono), monospace',
              color: theme('colors.pink.600'),
              backgroundColor: '#f1f5f9',
              padding: '0.2em 0.4em',
              borderRadius: '0.375rem',
              fontWeight: '600',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'transparent',
              borderRadius: '0',
              padding: '0',
              boxShadow: 'none',
              margin: '0',
            },
            blockquote: {
              borderLeftColor: theme('colors.primary'),
              backgroundColor: '#f8fafc',
              padding: '1rem 1.5rem',
              borderRadius: '0.5rem',
              fontStyle: 'normal',
            }
          },
        },
        invert: {
          css: {
            color: '#e2e8f0',
            a: {
              color: '#60a5fa',
              '&:hover': {
                color: '#93c5fd',
                borderBottomColor: '#93c5fd',
              },
            },
            'h1, h2, h3, h4': {
              color: '#ffffff',
            },
            strong: { color: '#ffffff' },
            code: {
              color: theme('colors.pink.400'),
              backgroundColor: '#1e293b',
            },
            blockquote: {
              backgroundColor: '#0f172a',
              color: '#e2e8f0',
            }
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

