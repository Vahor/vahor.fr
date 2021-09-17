const { fontFamily, colors } = require('tailwindcss/defaultTheme')

module.exports = {
  mode: "jit",
  purge: {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './app/components/**/*.{js,ts,jsx,tsx}'],
    options: {
      variables: true,
    }
  },
  darkMode: 'class',
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true
  },
  theme: {

    colors: {
      ...colors
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem'
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px"
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans]
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
          }
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            'h1,h2,h3,h4': {
              color: theme('colors.gray.100')
            },
          }
        }
      })
    },
  },
  variants: {
    extend: {},
    typography: ['dark']
  },
  plugins: [
    require("@tailwindcss/typography")],
}
