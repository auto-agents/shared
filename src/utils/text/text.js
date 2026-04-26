/**
 * split a sentence for the dialoger sentence spliter
 * @param {Object} ctx
 * @param {string} text
 * @param {boolean} noTrim default false
 * @param {Object} conf conf. default to ctx.dialoger.sentenceSpliter
 * @returns
 */
export const splitSentence = (ctx, text, noTrim = false, conf) => {
	conf ||= ctx.dialoger.sentenceSpliter
	const sc = conf.splitChars
	var t = []
	var x = 0

	for (var i = 0; i < conf.replacePatterns.length; i++) {
		const p = conf.replacePatterns[i]
		text = text.replaceAll(p[0], p[1])
	}

	for (var i = 0; i < conf.removeChars.length; i++)
		text = text.replaceAll(conf.removeChars[i], '')

	for (var i = 0; i < text.length; i++) {
		var c = text[i]
		const pc = i > 0 ? text[i - 1] : null
		const nc = i < text.length ? text[i + 1] : null
		if (sc.includes(c)
			&& (
				pc != c && nc != c
			)
		) {
			// x -> i
			var addMoreEnd = false
			var j = i + 1
			while (!addMoreEnd && j < text.length) {
				c = text[j]
				if (conf.includeAfterSplit.includes(c))
					j++
				else
					addMoreEnd = true
			}
			t.push(
				!noTrim ? text.substring(x, j).trim()
					: text.substring(x, j))
			x = j
		}
	}
	if (x < text.length)
		t.push(!noTrim ? text.substring(x).trim()
			: text.substring(x, j))
	t = t.filter(x => x.length > 0)

	const t2 = []
	var k = 0
	while (k < t.length) {
		const s = t[k]
		if (s.length == 0) {
			k++
		}
		else {
			if (s.length == 1) {
				if (k > 0) {
					const z = t2.length - 1
					t2[z] = t2[z] + s[0]
					k++
				}
				else {
					t2.push(s)
					k++
				}
			}
			else {
				t2.push(s)
				k++
			}
		}
	}
	return t2
}

export const unescapeCodeString = (str) => {
	var i = 0
	var inStr = null
	var r = ''
	while (i < str.length) {
		var c = str[i]

		var pc = i > 0 ? str[i - 1] : null
		var nc = i < str.length - 1 ? str[i + 1] : null
		if (!inStr) {
			if (c == "'" || c == '"') {
				inStr = c
				r += c
				i++
			} else {
				if (c == '\\' && pc != '\\' && nc == 'n') {
					// skip a \
					r += '\n'
					i += 2
				}
				else {
					r += c
					i++
				}
			}
		} else {
			if (c == inStr) {
				inStr = null
				r += c
				i++
			} else {
				r += c
				i++
			}
		}
	}
	return r
}

/**
 * suppress 'noisy' words in a string
 * delete sentences having less word count than the specified value
 * @param {string} text
 * @param {number} minWordsPerSentence default 5
 */
export const noiseSuppressBySentenceWordCount = (text, minWordsPerSentence = 5) => {
	if (!text || !text.length) return text
	const t = text.split('\n')
	const r = []
	t.forEach(s => {
		const tt = t.split(' ')
		if (tt.length >= minWordsPerSentence)
			r.push(s)
	})
	return r.join('\n')
}

export default {
	splitSentence,
	unescapeCodeString,
	noiseSuppressBySentenceWordCount
}
