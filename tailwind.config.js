module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          25: '#f2f7fa',
          50: '#e4e1dc',
          150: '#f8f8f8',
          350: '#858585',
          450: '#695e4a'
        },
        emerald: {
          450: '#5ab44b'
        },
        blue: {
          450: '#006595',
          150: '#25aae1'
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
