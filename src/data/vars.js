export default class Vars {

	mem = {}

	constructor(ctx) {
		this.ctx = ctx
		this.init()
	}

	init() {
		if (this.ctx.env) {
			for (const [key, value] of Object.entries(this.ctx.env)) {
				this.set(key, value)
			}
		}
	}

	set(key, value) {
		this.mem[key] = value
		return this
	}

	get(key) {
		return this.mem[key]
	}

	del(key) {
		delete this.mem[key]
		return this
	}

	list() {
		return this.mem
	}

	replaceVars(text) {
		return this.replaceContextVars(
			this.replaceCliEnvVars(text)
		);
	}

	replaceCliEnvVars(text) {
		return this.replaceVarsWithTpl(
			text,
			k => '${' + k + '}'
		)
	}

	replaceContextVars(text) {
		return this.replaceVarsWithTpl(
			text,
			k => '{{' + k + '}}'
		)
	}

	replaceVarsWithTpl(text, keyFunc) {
		for (const [key, value] of Object.entries(this.mem)) {
			const pattern = keyFunc(key)
			text = text.replaceAll(pattern, value)
		}
		return text
	}
}
