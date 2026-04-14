import { appendFileSync, writeFileSync } from 'node:fs';
import { join } from 'path'

export default class Logger {

	static ctx = null
	static appLogPath = null
	static errorLogPath = null
	static outputLogPath = null

	static init(ctx, appLogFilePath, errorLogFilePath, outputLogFilePath) {
		Logger.ctx = ctx
		Logger.appLogPath = join(process.cwd(), appLogFilePath)
		Logger.errorLogPath = join(process.cwd(), errorLogFilePath)
		Logger.outputLogPath = join(process.cwd(), outputLogFilePath)
		Logger.clear()
		Logger.clearErrorLog()
		Logger.clearOutputLog()
	}

	static log(text) {
		if (!Logger.ctx.cli.log.enableAppLog) return
		appendFileSync(
			Logger.appLogPath,
			`[${new Date().toISOString()}] ${String(text)}\n`
		);
	}

	static logOutput(text) {
		if (!Logger.ctx.cli.log.enableOutputLog) return
		appendFileSync(
			Logger.outputLogPath,
			`[${new Date().toISOString()}]\n${text}\n`
		);
	}

	static clear() {
		if (!Logger.ctx.cli.log.enableAppLog) return
		writeFileSync(
			Logger.appLogPath, ''
		)
	}

	static clearErrorLog() {
		if (!Logger.ctx.cli.log.enableErrorLog) return
		writeFileSync(
			Logger.errorLogPath, ''
		)
	}

	static clearOutputLog() {
		if (!Logger.ctx.cli.log.enableOutputLog) return
		writeFileSync(
			Logger.outputLogPath, ''
		)
	}

	static logError(err) {
		if (!Logger.ctx.cli.log.enableErrorLog) return
		appendFileSync(
			Logger.errorLogPath,
			`\n[${new Date().toISOString()}] ${String(err)}\n`
		);
	}

	static logWarning(err) {
		if (!Logger.ctx.cli.log.enableErrorLog) return
		appendFileSync(
			Logger.errorLogPath,
			`\n[${new Date().toISOString()}] ${String(err)}\n`
		);
	}
}
