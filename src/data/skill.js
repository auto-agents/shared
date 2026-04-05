/**
 * skill model
 */
export default class Skill {

	name = null
	description = null
	location = null
	metadata = null

	constructor(name, description, location, metadata) {
		this.name = name
		this.description = description
		this.location = location
		// TODO: from metadata...
		this.metadata = null
	}

}
