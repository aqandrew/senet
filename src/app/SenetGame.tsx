import { Dispatch, SetStateAction, useState } from 'react';
import clsx from 'clsx';

const NUM_COLUMNS = 10;
const NUM_ROWS = 3;

const BLACK_PIECE = '♟';
const WHITE_PIECE = '♙';
type Item = typeof BLACK_PIECE | typeof WHITE_PIECE | null;

const HOUSE_OF_REBIRTH = 14;
const SAFE_HOUSE_1 = 25;
const HOUSE_OF_WATER = 26;
const SAFE_HOUSE_2 = 27;
const SAFE_HOUSE_3 = 28;

type Stick = 0 | 1 | null;
const INITIAL_STICKS = [null, null, null, null];
type Turn = 'black' | 'white';
type SpaceIndex = number | null;

export default function SenetGame() {
	const [spaces, setSpaces] = useState<Item[]>(
		new Array(30)
			.fill(null)
			.map((_, i) => (i < 10 ? (i % 2 ? BLACK_PIECE : WHITE_PIECE) : null))
	);
	const [selectedSpaceIndex, setSelectedSpaceIndex] =
		useState<SpaceIndex>(null);
	const [turnNum, setTurnNum] = useState(1);
	const [sticks, setSticks] = useState<Stick[]>(INITIAL_STICKS);

	const turn: Turn = turnNum % 2 ? 'black' : 'white';
	const didSticksRoll = !sticks.every((stick) => stick === null);
	const spacesToMove =
		sticks.reduce((total: number, stick) => total + stick!, 0) ||
		(didSticksRoll ? 6 : 0);
	const turnPiece =
		turn === 'black' ? BLACK_PIECE : turn === 'white' ? WHITE_PIECE : null;
	const opponentPiece = turn === 'black' ? WHITE_PIECE : BLACK_PIECE;
	const legalForwardMoves = spaces.map((item, index) => {
		// TODO account for the following conditions:
		//   - 3 pieces in a row can't be attacked or passed
		if (item === turnPiece) {
			const possibleForwardIndex = index + spacesToMove;
			const isOpponentPieceGuarded =
				spaces[possibleForwardIndex - 1] !== turnPiece ||
				spaces[possibleForwardIndex + 1] !== turnPiece;

			if (
				spaces[possibleForwardIndex] !== turnPiece &&
				!(
					spaces[possibleForwardIndex] === opponentPiece &&
					isOpponentPieceGuarded
				)
			) {
				return possibleForwardIndex;
			}
		}

		return null;
	});

	// fill sticks with random bits
	function rollSticks() {
		setSticks(sticks.map((_) => Math.round(Math.random()) as Stick));
	}

	function nextTurn() {
		setTurnNum(turnNum + 1);
		setSelectedSpaceIndex(null);
		setSticks(INITIAL_STICKS);
	}

	function moveSelectedPiece(index: number) {
		const newSpaces = [...spaces];
		newSpaces[selectedSpaceIndex!] = newSpaces[index];
		newSpaces[index] = turnPiece;
		setSpaces(newSpaces);

		nextTurn();
	}

	return (
		<>
			<section className="mb-6">
				<h2>Game board</h2>

				<div className="grid grid-cols-10 gap-2">
					{spaces.map((item, index) => (
						<Space
							item={item}
							index={index}
							turn={turn}
							selectedSpaceIndex={selectedSpaceIndex}
							setSelectedSpaceIndex={setSelectedSpaceIndex}
							legalForwardMoves={legalForwardMoves}
							moveSelectedPiece={moveSelectedPiece}
							key={index}
						/>
					))}
				</div>
			</section>

			<Sticks sticks={sticks} />

			<section className="mb-6">
				<h2>Game status</h2>

				<p>turn number: {turnNum}</p>
				{/* TODO account for extra turns */}
				<p>
					{turn}'s turn:{' '}
					{didSticksRoll ? (
						<span className="inline-block rounded px-2 py-1 border-2 border-orange-900 border-dotted">
							{`move ${spacesToMove} space${spacesToMove > 1 ? 's' : ''}`}
						</span>
					) : (
						<button onClick={rollSticks}>Roll sticks</button>
					)}
				</p>
				{/* <p>legal forward moves: {JSON.stringify(legalForwardMoves)}</p> */}
			</section>
		</>
	);
}

interface SpaceProps {
	item: Item;
	index: number;
	turn: Turn;
	selectedSpaceIndex: SpaceIndex;
	setSelectedSpaceIndex: Dispatch<SetStateAction<SpaceIndex>>;
	legalForwardMoves: SpaceIndex[];
	moveSelectedPiece: (index: number) => void;
}

function Space({
	item,
	index,
	turn,
	selectedSpaceIndex,
	setSelectedSpaceIndex,
	legalForwardMoves,
	moveSelectedPiece,
}: SpaceProps) {
	const hasLegalForwardMoves = legalForwardMoves[index] !== null;
	const isLegalForwardMoveSpace =
		selectedSpaceIndex && legalForwardMoves[selectedSpaceIndex] === index;
	const isOwnPiece =
		(turn === 'black' && item === BLACK_PIECE) ||
		(turn === 'white' && item === WHITE_PIECE);
	const isOpponentPiece =
		(turn === 'black' && item === WHITE_PIECE) ||
		(turn === 'white' && item === BLACK_PIECE);
	const isNotAllowed =
		(isOwnPiece && !hasLegalForwardMoves) ||
		(isOpponentPiece && !isLegalForwardMoveSpace);
	const isMiddleRow = index >= NUM_COLUMNS && index < 2 * NUM_COLUMNS;
	// Tailwind can't find class names that are dynamically generated
	const middleRowColumnClass =
		index === 10
			? 'col-start-10'
			: index === 11
			? 'col-start-9'
			: index === 12
			? 'col-start-8'
			: index === 13
			? 'col-start-7'
			: index === 14
			? 'col-start-6'
			: index === 15
			? 'col-start-5'
			: index === 16
			? 'col-start-4'
			: index === 17
			? 'col-start-3'
			: index === 18
			? 'col-start-2'
			: 'col-start-1';

	function handleClick() {
		if (!isNotAllowed) {
			setSelectedSpaceIndex(index);
		}

		if (isLegalForwardMoveSpace) {
			moveSelectedPiece(index);
		}
	}

	return (
		<div
			className={clsx(
				'w-24 aspect-square relative grid place-items-center border-2 border-orange-900 text-5xl select-none',
				isMiddleRow && middleRowColumnClass,
				isMiddleRow && 'row-start-2',
				(isOwnPiece || isLegalForwardMoveSpace) && 'cursor-pointer',
				isNotAllowed && 'cursor-not-allowed'
			)}
			tabIndex={0}
			onClick={handleClick}
		>
			{/* space number */}
			<span className="absolute top-1 right-2 text-sm opacity-90">
				{index + 1}
			</span>

			{/* space symbol */}
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

			{/* TODO improve a11y */}
			{/* selection marker */}
			{selectedSpaceIndex === index ? (
				<span className="absolute w-16 aspect-square border-2 border-orange-900 rounded-full"></span>
			) : null}

			{/* potential selection marker */}
			{isLegalForwardMoveSpace ? (
				<span className="absolute w-16 aspect-square border-2 border-orange-900 border-dashed rounded-full"></span>
			) : null}

			{/* piece, if present */}
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
			<h2>Sticks</h2>

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
