'use client';

import { useState } from 'react';
import clsx from 'clsx';

const NUM_COLUMNS = 10;
const NUM_ROWS = 3;

const BLACK_PAWN = '♟';
const WHITE_PAWN = '♙';
type Item = typeof BLACK_PAWN | typeof WHITE_PAWN | null;

const HOUSE_OF_REBIRTH = 14;
const SAFE_HOUSE_1 = 25;
const HOUSE_OF_WATER = 26;
const SAFE_HOUSE_2 = 27;
const SAFE_HOUSE_3 = 28;

export default function SenetBoard() {
	const [spaces, setSpaces] = useState<Item[]>(
		new Array(30)
			.fill(null)
			.map((_, i) => (i < 10 ? (i % 2 ? BLACK_PAWN : WHITE_PAWN) : null))
	);

	return (
		<div className="flex flex-col gap-2">
			{Array.from({ length: NUM_ROWS }).map((_, rowNum) => {
				const indexStart = rowNum * NUM_COLUMNS;
				const indexEnd = (rowNum + 1) * NUM_COLUMNS;

				return (
					<div
						className={clsx('flex gap-2', rowNum === 1 && 'flex-row-reverse')}
						key={rowNum}
					>
						{spaces.slice(indexStart, indexEnd).map((item, i) => (
							<Space item={item} index={indexStart + i} key={i} />
						))}
					</div>
				);
			})}
		</div>
	);
}

interface SpaceProps {
	item: Item;
	index: number;
}

function Space({ item, index }: SpaceProps) {
	return (
		<div className="w-24 aspect-square grid place-items-center border-2 text-5xl cursor-pointer select-none">
			{index === HOUSE_OF_REBIRTH ? '☥' : null}
			{index === SAFE_HOUSE_1 ? '𓄤𓄤𓄤' : null}
			{index === HOUSE_OF_WATER ? '𓈗' : null}
			{index === SAFE_HOUSE_2 ? '𓅢' : null}
			{index === SAFE_HOUSE_3 ? '𐦝' : null}
			{item}
		</div>
	);
}
