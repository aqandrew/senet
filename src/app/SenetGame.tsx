import { Dispatch, SetStateAction, useRef, useState } from 'react';
import clsx from 'clsx';
import { toSentenceCase } from './utils';

const NUM_COLUMNS = 10;
const NUM_SPACES = 30;

const BLACK_PIECE = '♟';
const WHITE_PIECE = '♙';
type Item = typeof BLACK_PIECE | typeof WHITE_PIECE | null;
const INITIAL_SPACES = new Array(NUM_SPACES)
	.fill(null)
	.map((_, i) => (i < 10 ? (i % 2 ? BLACK_PIECE : WHITE_PIECE) : null));

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
	const [spaces, setSpaces] = useState<Item[]>(INITIAL_SPACES);
	const [selectedSpaceIndex, setSelectedSpaceIndex] =
		useState<SpaceIndex>(null);
	const [turnNum, setTurnNum] = useState(1);
	const [sticks, setSticks] = useState<Stick[]>(INITIAL_STICKS);
	const [remainderSpacesToMove, setRemainderSpacesToMove] = useState(0);
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	function resetGame() {
		setSpaces(INITIAL_SPACES);
		setSelectedSpaceIndex(null);
		setTurnNum(1);
		setSticks(INITIAL_STICKS);
		setRemainderSpacesToMove(0);
	}

	// check win conditions
	const didBlackWin = !spaces.includes(BLACK_PIECE);
	const didWhiteWin = !spaces.includes(WHITE_PIECE);

	if (didBlackWin || didWhiteWin) {
		if (dialogRef.current) {
			dialogRef.current.showModal();
		}
	}

	// if nobody won yet, work out turn logic
	const turn: Turn = turnNum % 2 ? 'black' : 'white';
	const didSticksRoll = !sticks.every((stick) => stick === null);
	const spacesToMove =
		remainderSpacesToMove ||
		sticks.reduce((total: number, stick) => total + stick!, 0) ||
		(didSticksRoll ? 6 : 0);
	const didGetExtraRoll =
		spacesToMove !== remainderSpacesToMove && [1, 4, 6].includes(spacesToMove);
	const turnPiece =
		turn === 'black' ? BLACK_PIECE : turn === 'white' ? WHITE_PIECE : null;
	const opponentPiece = turn === 'black' ? WHITE_PIECE : BLACK_PIECE;
	// TODO move backwards if there are no legal forward moves;
	//   if there are no backward moves, only then would a turn be skipped
	// TODO safe squares
	const legalForwardMoves = spaces.map((item, index) => {
		if (item === turnPiece) {
			const possibleForwardIndex = index + spacesToMove;
			const isOpponentPieceGuarded =
				spaces[possibleForwardIndex - 1] === opponentPiece ||
				spaces[possibleForwardIndex + 1] === opponentPiece;
			const isPathBlocked = (() => {
				let numAdjacentOpponentPieces = 0;

				for (let i = index; i < possibleForwardIndex; i++) {
					if (spaces[i] === opponentPiece) {
						numAdjacentOpponentPieces++;
					} else {
						numAdjacentOpponentPieces = 0;
					}

					if (numAdjacentOpponentPieces === 3) {
						return true;
					}
				}

				return false;
			})();
			const isPieceAllowedToBeRemovedIfPossible = !(
				possibleForwardIndex >= NUM_SPACES &&
				spaces.slice(0, NUM_COLUMNS).includes(turnPiece)
			);

			if (
				spaces[possibleForwardIndex] !== turnPiece &&
				!(
					spaces[possibleForwardIndex] === opponentPiece &&
					isOpponentPieceGuarded
				) &&
				!isPathBlocked &&
				isPieceAllowedToBeRemovedIfPossible
			) {
				return possibleForwardIndex;
			}
		}

		return null;
	});
	const noLegalForwardMoves = legalForwardMoves.every((move) => move === null);
	const canRemoveSelectedPiece =
		legalForwardMoves[selectedSpaceIndex!]! >= NUM_SPACES;

	// fill sticks with random bits
	function rollSticks() {
		setSticks(sticks.map((_) => Math.round(Math.random()) as Stick));
	}

	function nextTurn() {
		setTurnNum(turnNum + 1);
		setSelectedSpaceIndex(null);
		setSticks(INITIAL_STICKS);
	}

	function moveSelectedPiece(targetIndex: number) {
		const newSpaces = [...spaces];
		let newRemainderSpacesToMove = 0;

		// send piece back to House of Rebirth if it lands in House of Water
		if (targetIndex === HOUSE_OF_WATER) {
			targetIndex = HOUSE_OF_REBIRTH;

			// send piece back to the beginning (or closest empty space) if House of Rebirth is occupied
			if (spaces[HOUSE_OF_REBIRTH]) {
				targetIndex = spaces.findIndex((space) => space === null);
			}
		}

		// removing a piece from the board
		if (targetIndex === NUM_SPACES) {
			const possibleOverflowIndex = selectedSpaceIndex! + spacesToMove;
			newSpaces[selectedSpaceIndex!] = null;
			newRemainderSpacesToMove = possibleOverflowIndex % NUM_SPACES;
			setRemainderSpacesToMove(newRemainderSpacesToMove);
		}
		// normal move
		else {
			newSpaces[selectedSpaceIndex!] = newSpaces[targetIndex];
			newSpaces[targetIndex] = turnPiece;
			setRemainderSpacesToMove(0);
		}

		setSpaces(newSpaces);

		if (didGetExtraRoll || newRemainderSpacesToMove) {
			setSelectedSpaceIndex(null);
			setSticks(INITIAL_STICKS);
		} else {
			nextTurn();
		}
	}

	return (
		<>
			<section className="mb-6">
				<h2>Game board</h2>

				<div className="grid grid-cols-10 gap-2 relative">
					{spaces.map((item, index) => (
						<Space
							item={item}
							index={index}
							turn={turn}
							selectedSpaceIndex={selectedSpaceIndex}
							setSelectedSpaceIndex={setSelectedSpaceIndex}
							legalForwardMoves={legalForwardMoves}
							moveSelectedPiece={moveSelectedPiece}
							canRemoveSelectedPiece={canRemoveSelectedPiece}
							key={index}
						/>
					))}

					{canRemoveSelectedPiece ? (
						<div className="absolute bottom-0 left-[calc(100%_+_0.5rem)]">
							<Space
								item={null}
								index={NUM_SPACES}
								turn={turn}
								selectedSpaceIndex={selectedSpaceIndex}
								setSelectedSpaceIndex={setSelectedSpaceIndex}
								legalForwardMoves={legalForwardMoves}
								moveSelectedPiece={moveSelectedPiece}
								canRemoveSelectedPiece={canRemoveSelectedPiece}
							/>
						</div>
					) : null}
				</div>
			</section>

			<Sticks sticks={sticks} />

			<section className="mb-6">
				<h2>Game status</h2>

				<p>Turn number: {turnNum}</p>
				<p className="inline-flex items-center gap-2">
					{toSentenceCase(turn)}&apos;s turn:
					{didSticksRoll ? (
						<>
							<span
								className={clsx(
									'inline-block rounded px-2 py-1 border-2 border-orange-900 border-dotted',
									noLegalForwardMoves && 'line-through'
								)}
							>
								{`Move ${spacesToMove} space${spacesToMove > 1 ? 's' : ''}`}
							</span>

							{noLegalForwardMoves ? (
								<button onClick={nextTurn}>Skip turn</button>
							) : null}
						</>
					) : remainderSpacesToMove ? (
						<span className="inline-block rounded px-2 py-1 border-2 border-orange-900 border-dotted">
							Move {remainderSpacesToMove} more space
							{remainderSpacesToMove > 1 ? 's' : ''}
						</span>
					) : (
						<button onClick={rollSticks}>Roll sticks</button>
					)}
				</p>
				{didGetExtraRoll ? (
					// TODO maybe this copy / rules should say `Make an extra *roll*`
					<p>Rolled a {spacesToMove} → Take an extra turn</p>
				) : null}
				{/* <p>legal forward moves: {JSON.stringify(legalForwardMoves)}</p> */}
			</section>

			<dialog ref={dialogRef}>
				<h2>{didBlackWin ? 'Black wins!' : 'White wins!'}</h2>

				<p>Play again?</p>

				<form method="dialog">
					<button onClick={resetGame}>OK</button>
				</form>
			</dialog>
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
	canRemoveSelectedPiece: boolean;
}

function Space({
	item,
	index,
	turn,
	selectedSpaceIndex,
	setSelectedSpaceIndex,
	legalForwardMoves,
	moveSelectedPiece,
	canRemoveSelectedPiece,
}: SpaceProps) {
	const hasLegalForwardMoves = legalForwardMoves[index] !== null;
	const isLegalForwardMoveSpace =
		(selectedSpaceIndex !== null &&
			legalForwardMoves[selectedSpaceIndex] === index) ||
		(index === NUM_SPACES && canRemoveSelectedPiece);
	const isOwnPiece =
		(turn === 'black' && item === BLACK_PIECE) ||
		(turn === 'white' && item === WHITE_PIECE);
	const isOpponentPiece =
		(turn === 'black' && item === WHITE_PIECE) ||
		(turn === 'white' && item === BLACK_PIECE);
	const isNotAllowed =
		(isOwnPiece && !hasLegalForwardMoves) ||
		(isOpponentPiece && !isLegalForwardMoveSpace);
	const isSelectable = !isNotAllowed && (isOwnPiece || isLegalForwardMoveSpace);
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
		if (isSelectable) {
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
				isSelectable && 'cursor-pointer',
				isNotAllowed && 'cursor-not-allowed'
			)}
			tabIndex={isSelectable ? 0 : -1}
			onClick={handleClick}
		>
			{/* space number */}
			{index < NUM_SPACES ? (
				<span className="absolute top-1 right-2 text-sm opacity-90">
					{index + 1}
				</span>
			) : null}

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
