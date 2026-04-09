import Dialoger from "../../../cli/src/components/dialog/dialoger"
import OutputContext from "./output-context"
import PartialContentAccumulatorSplitter from "../utils/text/partial-content-accumulator-splitter"

export default class DialogContext {

	dialoger = null
	agent = null
	task = null
	round = null

	userOutputContext = null
	systemOutputContext = null
	systemResponseContentAccumulator = null

	previousTasks = []

	/**
	 * build a new DialogContext necessary to initiale a dialog
	 * @param {OutputContext} outputContext current output context
	 * @param {Dialoger} dialoger dialoger to be used
	 * @param {Object} agent loaded agent specification (ctx.components.agents.agents)
	 * @param {Object} fromAgent dialog initiator if is afent or null if from user, loaded agent specification (ctx.components.agents.agents)
	 * @param {Object} task running task if any
	 * @param {number} round round number
	 */
	constructor(
		outputContext,
		dialoger,
		agent,
		fromAgent = null,
		task = null,
		round = 1,
		userOutputContext = null,
		systemOutputContext = null,
		systemResponseContentAccumulator = null
	) {
		this.outputContext = outputContext
		this.dialoger = dialoger
		this.agent = agent
		this.fromAgent = fromAgent
		this.task = task
		this.round = round
		this.userOutputContext = userOutputContext
		this.systemOutputContext = systemOutputContext
		this.systemResponseContentAccumulator = systemResponseContentAccumulator
			|| new PartialContentAccumulatorSplitter(dialoger.ctx)
	}

	clone() {
		return new DialogContext(
			this.outputContext,
			this.dialoger,
			this.agent,
			this.fromAgent,
			this.task,
			this.round,
			this.userOutputContext,
			this.systemOutputContext,
			this.systemResponseContentAccumulator
		)
	}

	nextRound() {
		this.round++
		return this
	}

	setCurrentTask(task) {
		if (this.task != null)
			this.previousTasks.push(this.task)
		this.task = task
		return this
	}

}
