'use client';

import { useRef } from 'react';
import SenetGame from './SenetGame';

export default function Home() {
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	function openDialog() {
		if (dialogRef.current) {
			dialogRef.current.showModal();
		}
	}

	return (
		<>
			<header className="flex justify-between items-start">
				<h1 className="font-bold text-2xl mb-4">Senet</h1>

				<button onClick={openDialog}>Rules</button>
			</header>

			<main>
				<SenetGame />
			</main>

			<dialog ref={dialogRef} className="rounded p-2">
				<p>TODO show rules</p>

				<form method="dialog">
					<button>OK</button>
				</form>
			</dialog>
		</>
	);
}
