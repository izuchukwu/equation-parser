import { EquationNode } from './EquationNode'

import { ParserError } from './ParserError'
import { tokenize } from './tokenize'
import { parseSubexpression } from './parseExpression'
import { defaultErrorMessages } from './defaultErrorMessages'

type Options = {
	errorMessages?: typeof defaultErrorMessages,
}

export const createParser = ({ errorMessages = defaultErrorMessages }: Options = {}) => (input: string) => {
    const tokens = tokenize(input)

	try {
		const { result, last, terminator } = parseSubexpression(input, tokens, 0)

		if (terminator !== 'end') {
			throw new ParserError(tokens[last].position, 'expectedEnd')
		}

		return result
	} catch (error) {
		if (error instanceof ParserError) {
			return {
				type: 'parser-error',
				equation: input,
				errorType: error.type,
				position: error.position,
				values: error.values,
			}
		} else {
			throw error
		}
	}
}
