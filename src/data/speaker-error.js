/**
 * an exception from a speaker system. should never be spoken 
 * due to risk of cicrcular error
 */
export default class SpeakerError extends Error {

    constructor(message, options) {
        super(message, options)
    }

    static fromErr(message, err) {
        return new SpeakerError(message, { cause: err })
    }
}