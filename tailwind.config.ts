import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        black: 'var(--black)',
        white: 'var(--white)',
        silver: 'var(--silver)',
        emeraldGreenDark: 'var(--emerald-green-dark)',
        emeraldGreenLight: 'var(--emerald-green-light)',
        deepGray: 'var(--deep-gray)',
      },
      borderColor: {
        default: 'var(--black)',
        dark: 'var(--white)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      addCommonColors: true,
      themes: {
        light: {
          colors: {
            background: {
              DEFAULT: '#ffffff',
            },
            foreground: {
              DEFAULT: '#000000',
            },
            focus: {
              DEFAULT: '#309975',
            },
            primary: {
              DEFAULT: '#00a89c',
            },
            secondary: {
              DEFAULT: '#ffffff',
            },
            success: {
              DEFAULT: '#58b368',
            },
            warning: {
              DEFAULT: '#dad873',
            },
            danger: {
              DEFAULT: '#f87979',
            },
          },
        },
        dark: {
          colors: {
            background: {
              DEFAULT: '#0c0c0c',
            },
            foreground: {
              DEFAULT: '#ffffff',
            },
            focus: {
              DEFAULT: '#309975',
            },
            primary: {
              DEFAULT: '#00a89c',
            },
            secondary: {
              DEFAULT: '#ffffff',
            },
            success: {
              DEFAULT: '#58b368',
            },
            warning: {
              DEFAULT: '#dad873',
            },
            danger: {
              DEFAULT: '#f87979',
            },
          },
        },
      },
    }),
    require('@tailwindcss/typography'),
  ],
};
export default config;
