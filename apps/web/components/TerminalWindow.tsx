type TerminalWindowProps = {
	children: React.ReactNode;
};

export function TerminalWindow({ children }: TerminalWindowProps) {
	return (
		<div className='relative mx-auto min-h-dvh w-full max-w-6xl p-2 sm:p-4 md:p-6 lg:p-8'>
			<div className='pointer-events-none crt-overlay' aria-hidden='true' />
			<div className='pointer-events-none crt-vignette' aria-hidden='true' />

			<div className='terminal-shell min-h-[calc(100dvh-1rem)] sm:min-h-[calc(100dvh-3rem)]'>
				<div className='scan-beam' aria-hidden='true' />
				{children}
			</div>
		</div>
	);
}
