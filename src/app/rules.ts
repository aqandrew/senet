export const RULES = [
	{
		title: 'Object of the Game',
		description:
			'Your goal is to move all your pieces off the end of the board before your opponent does. You can move your pieces from left to right on the back row, right to left on the middle row, and left to right on the front row. You cannot move pieces off the board until all of your pieces are out of the first row.',
	},
	{
		title: 'Rolling the Sticks',
		description:
			'Toss the throwing sticks to determine how many squares to move. Count the number of light sides that appear face up on the sticks. If 1, 2, 3, or 4 light sides appear, then that is how many squares to move. However if no light sides appear, then your roll is worth 6 squares. Notice that there is no way to roll a 5.',
	},
	{
		title: 'Extra Turns',
		description:
			'If you throw a 1, 4, or 6, you move your piece and get another turn. If you throw a 2 or 3, you move a piece and your turn ends.',
	},
	{
		title: 'Attacking Your Opponent',
		description:
			"Two pieces cannot occupy the same square. If you land on a square occupied by an opponent's piece, the opponent's piece is under attack and must be moved to the square your piece came from.",
	},
	{
		title: 'Protecting Your Pieces',
		description:
			"If you put two of your pieces together side by side, they protect each other from being attacked. If you line up three of your pieces in a row, this forms a block--the opponent's pieces cannot pass your block and they can't attack it either.",
	},
	// {
	// 	title: 'If You Cannot Move',
	// 	description:
	// 		"If you can't move any pieces forward, you must move one backward. If you move backward and your piece lands on a square occupied by an opponent's piece, the opponent's piece moves forward to the space your piece just left. If you cannot move a piece forward or backward on a roll, your turn ends.",
	// },
	{
		title: 'If You Cannot Move',
		description:
			'If you cannot move a piece forward on a roll, your turn ends.',
	},
	{
		title: 'The Water Trap',
		description:
			'Square 27, the water square, is a trap. A piece that lands on this square must go back to square 15 in the middle of the board. If square 15 is occupied, then you must move back to square 1. If square 1 is occupied, your piece goes to the unoccupied square nearest to square 1.',
	},
	// {
	// 	title: 'Safe Squares',
	// 	description:
	// 		"There are three squares with symbols in them that surround the water trap. These are safe squares, and your piece cannot be attacked here. If you land on a safe square that is occupied, you'll move back to the nearest open square. You can then use the remainder of your throw on another piece.",
	// },
	{
		title: 'Bearing Off Your Pieces',
		description:
			'If you move a piece off the bottom row, then that piece is taken off the board. If you roll a number greater than needed to move a piece off the board, you may use the remainder of that roll to move another of your pieces.',
	},
];
