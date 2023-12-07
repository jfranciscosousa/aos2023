export function toMorseCode(
	input: string
): { success: false; error: string } | { success: true; message: string } {
	const morseCodeDict: { [key: string]: string } = {
		A: '.-',
		B: '-...',
		C: '-.-.',
		D: '-..',
		E: '.',
		F: '..-.',
		G: '--.',
		H: '....',
		I: '..',
		J: '.---',
		K: '-.-',
		L: '.-..',
		M: '--',
		N: '-.',
		O: '---',
		P: '.--.',
		Q: '--.-',
		R: '.-.',
		S: '...',
		T: '-',
		U: '..-',
		V: '...-',
		W: '.--',
		X: '-..-',
		Y: '-.--',
		Z: '--..',
		'1': '.----',
		'2': '..---',
		'3': '...--',
		'4': '....-',
		'5': '.....',
		'6': '-....',
		'7': '--...',
		'8': '---..',
		'9': '----.',
		'0': '-----',
		' ': ' ',
		'.': '.-.-.-',
		',': '--..--',
		'?': '..--..',
		"'": '.----.',
		'!': '-.-.--',
		'/': '-..-.',
		'(': '-.--.',
		')': '-.--.-',
		'&': '.-...',
		':': '---...',
		';': '-.-.-.',
		'=': '-...-',
		'+': '.-.-.',
		'-': '-....-',
		_: '..--.-',
		'"': '.-..-.',
		$: '...-..-',
		'@': '.--.-.'
	};

	let morseCode = '';

	for (const char of input.toUpperCase()) {
		if (morseCodeDict[char] === undefined) {
			return { success: false, error: `Unsupported character found: ${char}` };
		}

		morseCode += morseCodeDict[char] + ' ';
	}

	return { success: true, message: morseCode.trim() };
}

export function playMorseCode(morseCodeString: string, abortSignal: AbortSignal) {
	return new Promise<void>((resolve, reject) => {
		const dotDuration = 0.1; // Duration of a dot in seconds
		const dashDuration = dotDuration * 3;
		const partPause = dotDuration; // Pause between parts of a letter
		const letterPause = dotDuration * 3; // Pause between letters
		const wordPause = dotDuration * 7; // Pause between words
		const audioCtx = new window.AudioContext();
		let currentTime = audioCtx.currentTime;

		const morseSymbols = morseCodeString.split('');
		let totalDuration = 0;

		const abortCheck = () => {
			if (abortSignal.aborted) {
				audioCtx.close(); // Close the audio context to stop all ongoing audio
				reject('Playback aborted');
			}
		};

		morseSymbols.forEach((symbol, index) => {
			abortCheck();

			const oscillator = audioCtx.createOscillator();
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(440, currentTime); // 440 Hz frequency for the beep

			if (symbol === '.') {
				totalDuration = currentTime + dotDuration;
				oscillator.connect(audioCtx.destination);
				oscillator.start(currentTime);
				oscillator.stop(totalDuration);
				currentTime += dotDuration + partPause;
			} else if (symbol === '-') {
				totalDuration = currentTime + dashDuration;
				oscillator.connect(audioCtx.destination);
				oscillator.start(currentTime);
				oscillator.stop(totalDuration);
				currentTime += dashDuration + partPause;
			} else if (symbol === ' ') {
				const pauseDuration = morseCodeString[currentTime - 2] === ' ' ? wordPause : letterPause;
				currentTime += pauseDuration;
				if (index === morseSymbols.length - 1) {
					totalDuration = currentTime;
				}
			}

			oscillator.onended = () => {
				oscillator.disconnect();
				abortCheck();
				if (index === morseSymbols.length - 1) {
					resolve();
				}
			};
		});

		// Handle the case where the morse code string ends with a pause
		if (morseSymbols[morseSymbols.length - 1] === ' ') {
			setTimeout(() => {
				abortCheck();
				resolve();
			}, totalDuration - audioCtx.currentTime);
		}

		// Listen for abort signal
		abortSignal.addEventListener('abort', abortCheck);
	});
}
