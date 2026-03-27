export const splitSentence = (ctx, text) => {
    const conf = ctx.dialoger.sentenceSpliter
    const sc = conf.splitChars
    var t = []
    var x = 0

    for (var i = 0; i < conf.replacePatterns.length; i++) {
        const p = conf.replacePatterns[i]
        text = text.replaceAll(p[0], p[1])
    }

    for (var i = 0; i < conf.removeChars.length; i++)
        text = text.replaceAll(conf.removeChars[i], '')

    for (var i = 0; i < text.length; i++) {
        var c = text[i]
        const pc = i > 0 ? text[i - 1] : null
        const nc = i < text.length ? text[i + 1] : null
        if (sc.includes(c)
            && (
                pc != c && nc != c
            )
        ) {
            // x -> i
            var addMoreEnd = false
            var j = i + 1
            while (!addMoreEnd && j < text.length) {
                c = text[j]
                if (conf.includeAfterSplit.includes(c))
                    j++
                else
                    addMoreEnd = true
            }
            t.push(text.substring(x, j).trim())
            x = j
        }
    }
    if (x < text.length)
        t.push(text.substring(x).trim())
    t = t.filter(x => x.length > 0)

    const t2 = []
    var k = 0
    while (k < t.length) {
        const s = t[k]
        if (s.length == 0) {
            t2.push(s)
            k++
        }
        else {
            if (s.length == 1) {
                if (conf.includeAfterSplit.include(s[0])) {
                    k++
                    if (k < t.length) {
                        t2.push(s[0] + t[k])
                        k++
                    }
                    else
                        t2.push(s)
                }
                else {
                    t2.push(s)
                    k++
                }
            }
            else {
                t2.push(s)
                k++
            }
        }
    }
    return t2
}

export default {
    splitSentence
}