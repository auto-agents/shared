export default class Vars {

	mem = {}

	contructor(ctx) {
		this.ctx = ctx
	}

	set(key, value) {
		mem[key] = value
	}

	get(key) {
		return mem[key]
	}

	del(key) {
		delete mem[key]
	}

	replaceCliEnvVars(text) {
		return this.replaceVars(
			text,
			k => '${' + k + '}'
		)
	}

	replaceContextVars(text) {
		return this.replaceVars(
			text,
			k => '{{' + k + '}}'
		)
	}

	replaceVars(text, keyFunc) {
		for (const [key, value] of Object.entries(this.mem)) {
			const pattern = keyFunc(key)
			text = text.replaceAll(pattern, value)
		}
		return text
	}
}
