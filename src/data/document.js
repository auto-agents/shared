export default class Document {

	path = null				// doc path on disk (if any)
	content = null			// doc content
	name = null				// name (unique in a session)
	postfix = null			// a number count duplicates names to form a fully qualified name
	description = null		// a text describing the document (purpose,due to)

	owner = null			// a parent data or tool that owns the document

	constructor(ctx, path, content, name, postfix = null, owner = null) {
		this.ctx = ctx
		this.path = path
		this.content = content
		this.name = name
		this.postfix = postfix
		this.owner = owner
	}

	fullName() {
		return this.name + (this.postfix ? ('-' + this.postfix) : '')
	}
}
