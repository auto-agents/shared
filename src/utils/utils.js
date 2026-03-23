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

export const isSpeechAvailable = agent => {
    return agent?.TTSModule !== null && agent?.TTSModule !== undefined
}

export const isUserSpeakEchoAvailable = ctx => {
    const a = getTUIAgent(ctx)
    return a?.repeatUserQuery?.enabled
        && isSpeechAvailable(a)
}

export const isTUIAgentSpeakEnabled = ctx => {
    const a = getTUIAgent(ctx)
    return a?.speak?.enabled
        && isSpeechAvailable(a)
}

export const isAgentSpeakEnabled = (ctx, agentId) => {
    const a = getLoadedAgent(ctx, agentId)
    return a?.speak?.enabled
        && isSpeechAvailable(a)
}

export const getAgentSpecification = (ctx, id) => {
    const t = ctx.agents.list.filter(x => x.id == id)
    return t.length > 0 ? t[0] : null
}

export const getLoadedAgent = (ctx, id) => {
    return ctx.components.agents.getAgent(id)
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
    const a = getTUIAgent(ctx)
    return a?.speakErrors.enabled
        && isSpeechAvailable(a)
}

export const isTUIAIAgentAvailable = ctx => {
    return getTUIAgent(ctx) != null
}

export const getSystemVoice = ctx => {
    const a = getTUIAgent(ctx)
    if (!a?.TTSModule) return null
    return a.TTSModule.getPreferredVoices(a.speak?.preferredVoices)
}

export const getAgentVoice = (ctx, agentId) => {
    const a = getLoadedAgent(ctx, agentId)
    if (!a?.TTSModule) return null
    return a.TTSModule.getPreferredVoices(a.speak?.preferredVoices)
}

export const getUserVoice = ctx => {
    const a = getTUIAgent(ctx)
    if (!a?.TTSModule) return null
    return a.TTSModule.getPreferredVoices(a.repeatUserQuery?.preferredVoices)
}

export const getErrorVoice = ctx => {
    const a = getTUIAgent(ctx)
    if (!a?.TTSModule) return null
    return a.TTSModule.getPreferredVoices(a.speakErrors?.preferredVoices)
}

export const isAppInitialized = ctx => {
    return ctx.components.app.isInitialized
}

export const addServer = (ctx, server) => {
    const srv = getServer(ctx, server)
    if (!srv) {
        ctx.servers.running.push(server)
        return 1
    }
    else
        srv.share = srv.share + 1
    return srv.share
}

export const getServer = (ctx, server) => {
    const lst = ctx.servers.running.filter(srv =>
        srv.equalsTo(server)
    )
    return lst.length > 0 ? lst[0] : null
}

export const removeServer = (ctx, server) => {
    const srv = getServer(ctx, server)
    if (srv) {
        srv.share--
        if (srv.share == 0)
            ctx.servers.running = ctx.servers.running.filter(s =>
                !s.equalsTo(srv)
            )
        return srv.share
    }
    return 0
}

export const isServerRunnning = (ctx, server) => {
    var running = false
    for (var i = 0; i < ctx.servers.running; i++) {
        const srv = ctx.servers.running[i]
        running |= srv.equalsTo(server)
    }
    return running
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
    isAgentSpeakEnabled,
    isSpeakErrorsEnabled,
    getLoadedAgent,
    getAgentVoice,
    getSystemVoice,
    getErrorVoice,
    getUserVoice,
    addServer,
    removeServer,
    getServer,
    isServerRunnning
}
