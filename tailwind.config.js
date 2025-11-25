/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx", 
    "./index.tsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Varela Round"', '"Zen Maru Gothic"', 'sans-serif'],
        display: ['"Zen Maru Gothic"', 'sans-serif'],
      },
      colors: {
        ac: {
          green: '#78B159', // Grass green
          lightGreen: '#A8D688',
          blue: '#55C1DE', // Sky/Dodo blue
          yellow: '#F9F398', // Bells
          orange: '#F4A261', // Timmy/Tommy
          cream: '#FFFDF0', // Paper/Background
          brown: '#7C5C38', // Wood
          darkBrown: '#5D4037',
          dialog: '#3E4E88', // Dialog box blue
        }
      },
      backgroundImage: {
        'leaf-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2378B159' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 4s ease-in-out infinite',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'typewriter': 'typewriter 2s steps(20, end)',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [],
}

