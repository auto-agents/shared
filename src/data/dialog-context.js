import Dialoger from "../../../cli/src/components/dialog/dialoger"
import OutputContext from "./output-context"
import PartialContentAccumulatorSplitter from "../utils/text/partial-content-accumulator-splitter"
import Logger from "../components/sys/logger"
import { DialogContext_Completion } from "../config/consts"

export default class DialogContext {

	static id_count = 0

	parentDialogContext = null
	childDialogContexts = []
	messages = []

	dialoger = null
	agent = null
	task = null
	round = 0

	userOutputContext = null
	systemOutputContext = null
	systemResponseContentAccumulator = null

	reasoningContent = []
	previousTasks = []
	nodeType = null

	static empty(nodeType) {
		const dc = new DialogContext(
			null,
			null,
			null,
			null,
			null,
			0,
			nodeType,
			null,
			null,
			new Object(),
			[])
		if (nodeType) dc.nodeType = nodeType
		dc.systemResponseContentAccumulator = null
		return dc
	}

	addChildDialogContext(dialogContext) {
		this.childDialogContexts.push(dialogContext)
		return this
	}

	addMessage(message) {
		this.messages.push(message)
	}

	addResponse(response) {
		var m = response.message.content || ''
		if (response.tool_calls && response.tool_calls.lenngth > 0)
			m += JSON.stringify(response.tool_calls)
		this.messages.push({
			role: response.message.role,
			content: m
		})
	}

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
		nodeType = DialogContext_Completion,
		userOutputContext = null,
		systemOutputContext = null,
		systemResponseContentAccumulator = null,
		reasoningContent = []
	) {
		this.outputContext = outputContext
		this.dialoger = dialoger
		this.agent = agent
		this.fromAgent = fromAgent
		this.task = task
		this.round = round || 1
		this.userOutputContext = userOutputContext
		this.systemOutputContext = systemOutputContext
		this.nodeType = nodeType
		this.systemResponseContentAccumulator = systemResponseContentAccumulator
			|| new PartialContentAccumulatorSplitter(dialoger.ctx)
		this.reasoningContent = reasoningContent
		this.messages = []
		this.childDialogContexts = []
		this.id = DialogContext.id_count
		DialogContext.id_count++
		this.logDc()
	}

	logDc() {
		const dir =
			(!this.fromAgent && !this.agent) ? '' :
				`${this.fromAgent?.id || ''} -> ${this.agent?.id || ''}`
		const nt = this.nodeType?.padEnd(12)
		const s = `${this.getMargin()}DialogContext: #${this.id} ${nt} [${this.round}] ${dir}`
		Logger.log(s)
	}

	getMargin(n = 0) {
		return !this.round ? '' : ' '.repeat((this.round - 1 + n) * 3)
	}

	clone(nodeType, incRound) {
		const dc = new DialogContext(
			this.outputContext,
			this.dialoger,
			this.agent,
			this.fromAgent,
			this.task,
			incRound ? this.round + 1 : this.round,
			nodeType || this.nodeType,
			this.userOutputContext,
			this.systemOutputContext,
			this.systemResponseContentAccumulator,
			this.reasoningContent
		)
		return dc
	}

	withType(nt) {
		this.nodeType = nt
		return this
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
