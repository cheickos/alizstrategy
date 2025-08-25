/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Backgrounds
    'bg-white', 'bg-gray-50', 'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-yellow-50', 'bg-indigo-50',
    'bg-blue-100', 'bg-teal-100', 'bg-indigo-100', 'bg-teal-50', 'bg-green-100', 'bg-purple-100',
    'bg-green-200', 'bg-blue-200', 'bg-purple-200',
    // Text colors
    'text-blue-600', 'text-teal-600', 'text-indigo-600', 'text-green-500', 'text-gray-600',
    'text-green-600', 'text-purple-600',
    // Borders
    'border-blue-300', 'border-green-300', 'border-purple-300',
    // Gradients
    'from-blue-400', 'via-blue-500', 'to-blue-600',
    'from-green-400', 'via-green-500', 'to-green-600',
    'from-purple-400', 'via-purple-500', 'to-purple-600',
    'from-gray-400', 'via-gray-500', 'to-gray-600',
    'from-blue-100', 'to-blue-200', 'from-green-100', 'to-green-200',
    'from-purple-100', 'to-purple-200'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',
        secondary: '#2563eb',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}