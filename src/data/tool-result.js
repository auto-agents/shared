export default class ToolResult {

	content = null
	error = null

	constructor(content, files) {
		this.content = content
		this.files = files
	}

	setError(error) {
		this.error = error
		return this
	}
}
