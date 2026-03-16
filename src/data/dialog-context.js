import Dialoger from "../../../cli/source/components/dialog/dialoger"
import OutputContext from "./output-context"

export default class DialogContext {

    dialoger = null
    agent = null
    task = null
    round = null

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
        round = 1
    ) {
        this.outputContext = outputContext
        this.dialoger = dialoger
        this.agent = agent
        this.fromAgent = fromAgent
        this.task = task
        this.round = round
    }

    clone() {
        return new DialogContext(
            this.outputContext,
            this.dialoger,
            this.agent,
            this.fromAgent,
            this.task,
            this.round
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