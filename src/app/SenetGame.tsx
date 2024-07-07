'use client';

import { Dispatch, SetStateAction, useState } from 'react';
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

type Stick = 0 | 1 | null;
type Turn = 'black' | 'white';

export default function SenetGame() {
	const [spaces, setSpaces] = useState<Item[]>(
		new Array(30)
			.fill(null)
			.map((_, i) => (i < 10 ? (i % 2 ? BLACK_PAWN : WHITE_PAWN) : null))
	);
	const [turnNum, setTurnNum] = useState(1);
	const [sticks, setSticks] = useState<Stick[]>([null, null, null, null]);

	const turn: Turn = turnNum % 2 ? 'black' : 'white';
	const didSticksRoll = !sticks.every((stick) => stick === null);
	const spacesToMove =
		sticks.reduce((total: number, stick) => total + stick!, 0) || 6;

	// fill sticks with random bits
	function rollSticks() {
		setSticks(sticks.map((_) => Math.round(Math.random()) as Stick));
	}

	return (
		<>
			<Board spaces={spaces} turn={turn} />
			<Sticks sticks={sticks} />

			<section className="mb-6">
				<h2 className="font-bold text-xl mb-2">Game status</h2>

				<p>turn number: {turnNum}</p>
				{/* TODO account for extra turns */}
				<p>
					{turn}'s turn:{' '}
					{didSticksRoll ? (
						<span className="inline-block rounded p-2 border-2 border-orange-900 border-dotted">
							{`move ${spacesToMove} space${spacesToMove > 1 ? 's' : ''}`}
						</span>
					) : (
						<button
							className="rounded p-2 border-2 border-teal-700 bg-teal-700 hover:bg-teal-600 text-teal-50 cursor-pointer"
							onClick={rollSticks}
						>
							Roll sticks
						</button>
					)}
				</p>
			</section>
		</>
	);
}

interface BoardProps {
	spaces: Item[];
	turn: Turn;
}

function Board({ spaces, turn }: BoardProps) {
	return (
		<section className="mb-6">
			<h2 className="font-bold text-xl mb-2">Game board</h2>

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
								<Space item={item} index={indexStart + i} turn={turn} key={i} />
							))}
						</div>
					);
				})}
			</div>
		</section>
	);
}

interface SpaceProps {
	item: Item;
	index: number;
	turn: Turn;
}

function Space({ item, index, turn }: SpaceProps) {
	const isSelectable =
		(turn === 'black' && item === BLACK_PAWN) ||
		(turn === 'white' && item === WHITE_PAWN);
	const notAllowed =
		(turn === 'black' && item === WHITE_PAWN) ||
		(turn === 'white' && item === BLACK_PAWN);

	return (
		<div
			className={clsx(
				'w-24 aspect-square relative grid place-items-center border-2 border-orange-900 text-5xl select-none',
				isSelectable && 'cursor-pointer',
				notAllowed && 'cursor-not-allowed'
			)}
		>
			<span className="absolute top-1 right-2 text-sm opacity-90">
				{index + 1}
			</span>
			<span
				className={clsx(
					'text-orange-900 opacity-30 row-start-1 row-span-1 col-start-1 col-span-1',
					index === SAFE_HOUSE_1 && 'translate-y-2',
					index === HOUSE_OF_WATER && '-translate-y-1',
					index === SAFE_HOUSE_2 && 'translate-y-1'
				)}
			>
				{index === HOUSE_OF_REBIRTH ? '☥' : null}
				{index === SAFE_HOUSE_1 ? '𓄤𓄤𓄤' : null}
				{index === HOUSE_OF_WATER ? '𓈗' : null}
				{index === SAFE_HOUSE_2 ? '𓅢' : null}
				{index === SAFE_HOUSE_3 ? '𐦝' : null}
			</span>
			<span className="row-start-1 row-span-1 col-start-1 col-span-1">
				{item}
			</span>
		</div>
	);
}

interface SticksProps {
	sticks: Stick[];
}

function Sticks({ sticks }: SticksProps) {
	return (
		<section className="mb-6">
			<h2 className="font-bold text-xl mb-2">Sticks</h2>

			<div className="my-3 flex gap-1">
				{/* TODO animate sticks rolling */}
				{sticks.map((stick, i) => (
					<div
						className={clsx(
							'w-3 h-16 border-2 border-orange-900',
							stick === null && 'bg-orange-900 opacity-30',
							stick === 0 && 'bg-orange-900'
						)}
						key={i}
					></div>
				))}
			</div>
		</section>
	);
}
