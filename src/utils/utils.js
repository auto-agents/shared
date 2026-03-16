import { existsSync } from 'fs'
import path from 'path'
import chalk from 'chalk';
import { TUIAgentId } from '../config/consts.js'

export const callAsync = (func) => {
    (async () => {
        await func()
    })();
}

export const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const getTmpFile = (ctx) => {
    const tmpDir = path.join(
        process.cwd(),
        ctx.paths.tmp)
    var exists = true
    var name = null
    var fpath = null
    while (exists) {
        name = 'tmp-' + Math.floor(Math.random() * 1000000)
        exists = existsSync(path.join(tmpDir, name))
    }
    fpath = path.join(tmpDir, name)
    return {
        name: name,
        folder: tmpDir,
        path: fpath
    }
}

export const resolvePath = (baseBase, newPath) => {
    return path.isAbsolute(newPath) ? newPath : path.normalize(path.join(baseBase, newPath))
}

export const isSpeechAvailable = ctx => {
    return ctx.components.module.speech != null
        && ctx.components.module.speech !== undefined
}

export const isUserSpeakEchoAvailable = ctx => {
    return getTUIAgent(ctx)?.repeatUserQuery?.enabled
        && isSpeechAvailable(ctx)
}

export const isTUIAgentSpeakEnabled = ctx => {
    return getTUIAgent(ctx)?.speak?.enabled
        && isSpeechAvailable(ctx)
}

// TODO: rename to getAgentSpecification
export const getAgentSpecification = (ctx, id) => {
    const t = ctx.agents.list.filter(x => x.id == id)
    return t.length > 0 ? t[0] : null
}

export const getLoadedAgent = (ctx, id) => {
    const t = ctx.components.agents.getAgents()
    return t[id] || null
}

export const getTUIAgent = (ctx) => {
    return getLoadedAgent(ctx, TUIAgentId)
}

export const dumpLoadedAgent = (ctx, agentId, o, txt) => {
    o.newLine()
    o.appendLine(getLoadedAgentDump(ctx, agentId, txt))
}

export const getLoadedAgentDump = (ctx, agentId, txt) => {
    const agent = getLoadedAgent(ctx, agentId)
    if (txt != null) txt = ': ' + txt
    txt ||= ''
    return `agent '${agentId}' on ${agent?.moduleName} (provider: ${agent?.module?.config?.provider}) ${txt}`
}

export const isSpeakErrorsEnabled = ctx => {
    return getTUIAgent(ctx)?.speakErrors.enabled
        && isSpeechAvailable(ctx)
}

export const isTUIAIAgentAvailable = ctx => {
    return getTUIAgent(ctx) != null
}

export const isAppInitialized = ctx => {
    return ctx.components.app.isInitialized
}

export const trace = (ctx, str) => {
    const o = ctx.components.output
    o.newLine()
    o.appendLine(
        chalk.hex(ctx.theme.traceColor).italic(str)
    )
}

export const traceWarning = (ctx, str) => {
    const o = ctx.components.output
    o.newLine()
    o.appendLine('⚠️ ' +
        chalk.hex(ctx.theme.warningColor).italic(str)
    )
}

export const traceError = (ctx, str) => {
    const o = ctx.components.output
    o.newLine()
    o.appendLine('💥 ' +
        chalk.hex(ctx.theme.errorColor).italic(str)
    )
}

export const mdBlockJson = json => {
    return "```json\n" + json + "\n```"
}

export const mdTextBlock = text => {
    return "```\n" + text + "\n```"
}
const ValueObjectsKeys = [
]

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {

        if (!ValueObjectsKeys.includes(key)
            && (typeof value === "object" && value !== null)) {
            if (seen.has(value)) {
                return 'null' //"[Circular]";
            }
            seen.add(value);
        }
        return value;
    };
};

export const toJson = (o, tab = 2) => {
    return JSON.stringify(o, getCircularReplacer(), tab)
}

export default {
    callAsync,
    wait,
    getTmpFile,
    resolvePath,
    isSpeechAvailable,
    isTUIAIAgentAvailable,
    isUserSpeakEchoAvailable,
    trace,
    mdBlockJson,
    isSpeakErrorsEnabled,
    getLoadedAgent
}
