export const splitSentence = (ctx, text) => {
    const conf = ctx.dialoger.sentenceSpliter
    const sc = conf.splitChars
    const t = []
    var x = 0

    for (var i = 0; i < conf.replacePatterns.length; i++) {
        const p = conf.replacePatterns[i]
        text = text.replaceAll(p[0], p[1])
    }

    for (var i = 0; i < conf.removeChars.length; i++)
        text = text.replaceAll(conf.removeChars[i], '')

    for (var i = 0; i < text.length; i++) {
        const c = text[i]
        const pc = i > 0 ? text[i - 1] : null
        const nc = i < text.length ? text[i + 1] : null
        if (sc.includes(c)
            && (
                pc != c && nc != c
            )
        ) {
            // x -> i
            t.push(text.substring(x, i + 1).trim())
            x = i + 1
        }
    }
    if (x < text.length)
        t.push(text.substring(x).trim())
    return t.filter(x => x.length > 0)
}

export default {
    splitSentence
}