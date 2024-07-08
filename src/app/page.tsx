'use client';

import { useRef } from 'react';
import clsx from 'clsx';
import SenetGame from './SenetGame';
import { RULES } from './rules';

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

			<dialog
				ref={dialogRef}
				className="w-96 p-3 rounded bg-orange-200 text-orange-900"
			>
				<h2>Rules</h2>

				{/* TODO un-strikethrough rules for If You Cannot Move and Safe Squares once they're implemented */}
				{RULES.map(({ title, description }, i) => (
					<details
						className={clsx((i === 5 || i === 7) && 'line-through')}
						key={i}
					>
						<summary className="cursor-pointer">
							<h3 className="inline">
								{i + 1}. {title}
							</h3>
						</summary>
						<p className="ml-4 mb-3">{description}</p>
					</details>
				))}

				<form method="dialog" className="mt-4 flex justify-end">
					<button>OK</button>
				</form>
			</dialog>
		</>
	);
}
