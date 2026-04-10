import { sessionDataFile, sessionPath, toJson } from "../../../shared/src/utils/utils"
import { existsSync, mkdir, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { appendFile, writeFile } from "fs/promises";
import DialogContext from "./dialog-context";

export default class Session {

	id = null
	description = null

	// load time command history
	commandHistory = []

	// root dialog context
	rootDialogContext = null

	// loaded plugins / agents
	// loaded agents ids
	agents = null
	dialogCurrentTargetAgent = null

	// agents config ? (prompt, instruct, ...)

	// dialog context root (session dialog context)

	constructor(id, ctx) {
		this.id = id
		this.ctx = ctx
		this.rootDialogContext = DialogContext.empty()
	}

	// late init session root data context
	checkRootDataContext(dialogEvent) {
		if (!this.rootDialogContext.dialoger) {
			const dc = dialogEvent.dialogContext
			this.rootDialogContext.outputContext =
				dc.outputContext
			this.rootDialogContext.dialoger =
				dc.dialoger
		}
		return this
	}

	static async load(ctx, id) {
		const p = sessionPath(ctx)
		if (!existsSync(p))
			throw new Error('session not found: ' + id)

		const s = await Session.loadFromFile(ctx, id)

		return s
	}

	static async loadFromFile(ctx, id) {
		const f = sessionDataFile(ctx, id)
		if (!existsSync(f)) {
			// new if missing
			return await Session.#buildNewSession(ctx, id)
		}
		// deserialize
		const st = JSON.parse(readFileSync(f).toString())
		const s = new Session(id, ctx)
		s.cloneFrom(st)
		s.commandHistory = Session.loadCommandHistory(ctx)
		return s
	}

	cloneFrom(s) {
		this.id = s.id
		this.description = s.description
		this.commandHistory = s.commandHistory
		this.agents = s.agents
		this.dialogCurrentTargetAgent = s.dialogCurrentTargetAgent
	}

	static async new(ctx, id) {
		const p = sessionPath(ctx)
		if (!existsSync(p))
			mkdir(p, null, (err) => {
				if (err) throw err;
			})
		else
			throw new Error('session already exists: ' + id)
		await Session.#buildNewSession(ctx, id)
		return s
	}

	static async #buildNewSession(ctx, id) {
		const s = new Session(id, ctx)
		Session.newCommandHistory(ctx, id)
		s.commandHistory = Session.loadCommandHistory(ctx)
		await s.save()
		return s
	}

	async save() {
		// serialize session data
		const h = this.commandHistory
		const ctx = this.ctx
		const rdc = this.rootDialogContext

		delete this.commandHistory
		delete this.ctx
		delete this.rootDialogContext

		const f = sessionDataFile(ctx, this.id)
		writeFileSync(f, toJson(this))

		this.commandHistory = h
		this.ctx = ctx
		this.rootDialogContext = rdc

		// save history (aside, not in)
		this.saveCommandHistory()
	}

	async updateCommandHistory(cmd) {
		this.commandHistory.push(cmd)
		await appendFile(
			Session.getHistoryFilePath(this.ctx, this.id),
			cmd
		)
	}

	static loadCommandHistory(ctx, id) {
		const h = Session.getHistoryFilePath(ctx, id)
		if (!existsSync(h)) Session.newCommandHistory(ctx, id)
		const histo = readFileSync(h).toString().split('\n')
		return histo
	}

	static newCommandHistory(ctx, id) {
		const h = Session.getHistoryFilePath(ctx, id)
		if (existsSync(h)) return
		writeFileSync(h)
	}

	async saveCommandHistory() {
		const h = Session.getHistoryFilePath(this.ctx, this.id)
		await writeFile(h, this.commandHistory.join('\n'))
	}

	static getHistoryFilePath(ctx, id) {
		return join(sessionPath(ctx, id),
			ctx.paths.commandHistoryFilename);
	}
}
