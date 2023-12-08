import { differenceInSeconds } from 'date-fns';
import isNil from 'lodash/isNil';
import range from 'lodash/range';
import shuffle from 'lodash/shuffle';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'advent-of-code-day-8';
const CARDS_LIMIT = import.meta.env.DEV ? 4 : 24;
type CardNumber =
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23'
	| '24';
type CardState = {
	number: CardNumber;
	completed: boolean;
};

type State = {
	cards: CardState[];
	flippedCardIndex1?: number;
	flippedCardIndex2?: number;
	startTimestamp?: string;
	score?: number;
	previousScores: number[];
};

function initialize({ reset = false } = {}): State {
	const fromStorage = reset ? undefined : localStorage.getItem(STORAGE_KEY);

	if (fromStorage) return JSON.parse(fromStorage);

	const cards: State['cards'] = [];

	range(1, CARDS_LIMIT + 1).forEach((number) => {
		const cardNumber = String(number) as CardNumber;

		cards.push({ number: cardNumber, completed: false });
	});
	range(1, CARDS_LIMIT + 1).forEach((number) => {
		const cardNumber = String(number) as CardNumber;

		cards.push({ number: cardNumber, completed: false });
	});

	return { cards: shuffle(cards), previousScores: [] };
}

export async function createCardsStore() {
	const { subscribe, update } = writable<State>(initialize());

	// Keep syncing the state to local storage
	subscribe((state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)));

	function unsubscribe() {}

	function startGame() {
		update((state) => {
			const newState = initialize({ reset: true });

			newState.startTimestamp = new Date().toISOString();
			newState.previousScores = state.previousScores || [];

			return newState;
		});
	}

	function flipCard(index: number) {
		update((state) => {
			const card = state.cards[index];

			if (card.completed) return state;

			if (isNil(state.flippedCardIndex1)) state.flippedCardIndex1 = index;
			else if (isNil(state.flippedCardIndex2)) {
				if (state.flippedCardIndex1 === index) return state;

				state.flippedCardIndex2 = index;

				const card1 = state.cards[state.flippedCardIndex1];
				const card2 = state.cards[state.flippedCardIndex2];

				if (card1.number === card2.number) {
					state.cards[state.flippedCardIndex1] = { ...card, completed: true };
					state.cards[state.flippedCardIndex2] = { ...card, completed: true };
					state.flippedCardIndex1 = undefined;
					state.flippedCardIndex2 = undefined;
				}
			} else {
				state.flippedCardIndex1 = undefined;
				state.flippedCardIndex2 = undefined;
			}

			const completed = state.cards.every((card) => card.completed);
			if (completed) {
				state.score = Math.abs(differenceInSeconds(new Date(state.startTimestamp!), new Date()));
				console.log(state.previousScores);
				state.previousScores = [...state.previousScores, state.score];
			}

			return state;
		});
	}

	return { subscribe, unsubscribe, flipCard, startGame };
}
