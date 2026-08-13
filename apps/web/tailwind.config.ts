import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				term: {
					bg: '#080612',
					panel: '#12081e',
					line: '#3d2466',
					phosphor: '#d4b3ff',
					dim: '#b49ad6',
					amber: '#f0abfc',
					mute: '#7a6498',
				},
			},
			fontFamily: {
				sans: ['var(--font-vazir)', 'Tahoma', 'system-ui', 'sans-serif'],
				mono: ['var(--font-vazir)', 'Tahoma', 'system-ui', 'sans-serif'],
			},
			boxShadow: {
				terminal: '0 0 0 1px rgba(196, 165, 255, 0.12), 0 24px 80px rgba(48, 0, 96, 0.5)',
				glow: '0 0 28px rgba(168, 85, 247, 0.32)',
			},
			keyframes: {
				rise: {
					from: { opacity: '0', transform: 'translateY(16px)' },
					to: { opacity: '1', transform: 'none' },
				},
				blink: {
					'0%, 45%': { opacity: '1' },
					'50%, 100%': { opacity: '0' },
				},
				caret: {
					'0%, 40%': { opacity: '1' },
					'50%, 100%': { opacity: '0' },
				},
				scan: {
					from: { transform: 'translateY(-120%)' },
					to: { transform: 'translateY(220%)' },
				},
				pulseGlow: {
					'0%, 100%': { opacity: '0.35' },
					'50%': { opacity: '0.7' },
				},
			},
			animation: {
				rise: 'rise 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
				blink: 'blink 1.1s steps(1, end) infinite',
				caret: 'caret 1.05s steps(1, end) infinite',
				scan: 'scan 7s linear infinite',
				pulseGlow: 'pulseGlow 3.5s ease-in-out infinite',
			},
		},
	},
	plugins: [],
};

export default config;
