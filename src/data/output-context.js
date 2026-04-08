export default class OutputContext {

	y0 = 0
	y1 = 0
	x = null
	y = null

	constructor(ctx, output, margin = 0, x = null, y = null) {
		this.ctx = ctx
		this.output = output
		this.margin = margin
		this.marginBase = margin
		this.y0 = this.y1 = output.getSource().rows.length
		this.x = x
		this.y = y
	}

	lastPos() {
		const y = this.output.getSource().rows.length
		return { y0: y, y1: y }
	}

	clone() {
		const o = new OutputContext(this.ctx, this.output, this.margin)
		o.y0 = this.y0
		o.y1 = this.y1
		return o
	}

	addMargin(margin = 4) {
		this.margin += margin
		return this
	}

	addMargins(repeat, margin = 4) {
		this.margin += repeat * margin
		return this
	}

	getMargin() {
		return ' '.repeat(this.margin)
	}
}
