'use client';

import { useState } from 'react';

const BLACK_PAWN = '♟';
const WHITE_PAWN = '♙';
type Space = typeof BLACK_PAWN | typeof WHITE_PAWN | null;

const HOUSE_OF_REBIRTH = 14;
const SAFE_HOUSE_1 = 25;
const HOUSE_OF_WATER = 26;
const SAFE_HOUSE_2 = 27;
const SAFE_HOUSE_3 = 28;

export default function SenetBoard() {
	const [spaces, setSpaces] = useState<Space[]>(
		new Array(30)
			.fill(null)
			.map((_, i) => (i < 10 ? (i % 2 ? BLACK_PAWN : WHITE_PAWN) : null))
	);

	return (
		// TODO reverse second row's column order
		<div className="grid grid-cols-10 grid-rows-3 gap-2">
			{spaces.map((space, i) => (
				<div
					className="aspect-square grid place-items-center border-2 text-5xl cursor-pointer select-none"
					key={i}
				>
					{i === HOUSE_OF_REBIRTH ? '☥' : null}
					{i === SAFE_HOUSE_1 ? '𓆾' : null}
					{i === HOUSE_OF_WATER ? '𓈗' : null}
					{i === SAFE_HOUSE_2 ? '𓅢' : null}
					{i === SAFE_HOUSE_3 ? '𐦝' : null}
					{space}
				</div>
			))}
		</div>
	);
}
