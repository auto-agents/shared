import { splitSentence } from "./text"

export default class PartialContentAccumulatorSplitter {

	accumulator = ''

	constructor(ctx) {
		this.ctx = ctx
	}

	// version 1 : split using sentenceSplitter
	getAccumulatedSplitted(id, partialContent, lastPart = false) {
		this.accumulator += partialContent
		const str = this.accumulator
		if (lastPart)
			return [str]

		const splits = this.ctx.dialoger.sentenceSpliter.splitChars
		var spEx = false
		splits.forEach(sp => {
			spEx |= str.includes(sp)
		});
		if (!spEx) return []

		const t = splitSentence(this.ctx, str)
		//console.log(t)
		const res = []
		const rest = []
		t.forEach(s => {
			if (this.#endsWithSplit(s))
				res.push(s)
			else
				rest.push(s)
		})
		this.accumulator = rest.join('')
		/*if (res.length > 0) {
			console.log(res)
		}*/
		return res
	}

	#endsWithSplit(s) {
		const splits = this.ctx.dialoger.sentenceSpliter.splitChars
		var r = false
		splits.forEach(sp => {
			r |= s.endsWith(sp)
		});
		return r
	}

	// version 0 : split on `n`
	getAccumulatedSplitted0(id, partialContent, lastPart = false) {
		this.accumulator += partialContent
		const str = this.accumulator
		//console.log(agentPartialResponseEvent.event?.choices[0]?.finish_reason)

		if (lastPart)
			return [str]

		if (!str.includes('\n')/* && !str.includes('.')*/) return []
		//var t = str.split('.')
		//t = t.map((x, i) => i < t.length - 1 ? x + '.' : x)
		var t = [str]
		var t2 = []
		for (var i = 0; i < t.length; i++) {
			var tt = t[i].split('\n')
			tt = tt.map((x, i) => i < tt.length - 1 ? x + '\n' : x)
			t2 = [...t2, ...tt]
		}
		t2 = t2.filter(x => x.endsWith('.') || x.endsWith('\n'))
		const rest = t2.filter(x => !x.endsWith('.') && !x.endsWith('\n'))
		this.accumulator = rest.join('')

		return t2
	}
}
