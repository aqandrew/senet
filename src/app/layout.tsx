import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Senet',
	description: 'An ancient Egyptian board game of passing',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="max-w-5xl mx-auto my-6 bg-orange-200 text-orange-900">
				{children}
			</body>
		</html>
	);
}
