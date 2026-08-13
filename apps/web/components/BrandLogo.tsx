import Image from 'next/image';
import { SITE_NAME } from '../lib/site';

type BrandLogoProps = {
	size?: 'sm' | 'md' | 'lg';
	priority?: boolean;
};

const SIZES = {
	sm: 28,
	md: 48,
	lg: 72,
} as const;

export function BrandLogo({ size = 'lg', priority = false }: BrandLogoProps) {
	const px = SIZES[size];

	return (
		<div className='flex items-center gap-3 sm:gap-4'>
			<Image
				src='/logo.svg'
				alt=''
				width={px}
				height={px}
				priority={priority}
				className='shrink-0 drop-shadow-[0_0_18px_rgba(115,55,210,0.45)]'
				aria-hidden
			/>
			<h1
				className={`font-semibold tracking-tight text-term-phosphor ${
					size === 'lg' ? 'text-2xl sm:text-4xl md:text-5xl' : size === 'md' ? 'text-xl sm:text-2xl' : 'text-base'
				}`}
			>
				{SITE_NAME}
			</h1>
		</div>
	);
}
