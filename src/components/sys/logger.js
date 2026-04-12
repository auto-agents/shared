import { appendFileSync } from 'node:fs';
import { join } from 'path'

export default class Logger {

	static ctx = null
	static appLogPath = null
	static errorLogPath = null

	static init(appLogFilePath, errorLogFilePath) {
		Logger.appLogPath = join(process.cwd(), appLogFilePath)
		Logger.errorLogPath = join(process.cwd(), errorLogFilePath)
	}

	static log(text) {
		appendFileSync(
			Logger.appLogPath,
			`[${new Date().toISOString()}] ${String(text)}\n`
		);
	}

	static logError(err) {
		appendFileSync(
			Logger.errorLogPath,
			`\n[${new Date().toISOString()}] ${String(err)}\n`
		);
	}
}
