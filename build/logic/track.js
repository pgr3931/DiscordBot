"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
const voice_1 = require("@discordjs/voice");
const ytdl_core_1 = __importStar(require("ytdl-core"));
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => { };
/**
 * A Track represents information about a YouTube video (in this context) that can be added to a queue.
 * It contains the title and URL of the video, as well as functions onStart, onFinish, onError, that act
 * as callbacks that are triggered at certain points during the track's lifecycle.
 *
 * Rather than creating an AudioResource for each video immediately and then keeping those in a queue,
 * we use tracks as they don't pre-emptively load the videos. Instead, once a Track is taken from the
 * queue, it is converted into an AudioResource just in time for playback.
 */
class Track {
    constructor({ url, title, onStart, onFinish, onError }) {
        this.url = url;
        this.title = title;
        this.onStart = onStart;
        this.onFinish = onFinish;
        this.onError = onError;
    }
    /**
     * Creates an AudioResource from this Track.
     */
    createAudioResource() {
        const stream = (0, ytdl_core_1.default)(this.url, { filter: 'audioonly' });
        return (0, voice_1.createAudioResource)(stream, { inputType: voice_1.StreamType.Arbitrary, metadata: this });
    }
    /**
     * Creates a Track from a video URL and lifecycle callback methods.
     *
     * @param url The URL of the video
     * @param methods Lifecycle callbacks
     * @returns The created Track
     */
    static async from(url, methods) {
        const info = await (0, ytdl_core_1.getInfo)(url);
        // The methods are wrapped so that we can ensure that they are only called once.
        const wrappedMethods = {
            onStart() {
                wrappedMethods.onStart = noop;
                methods.onStart(info.videoDetails.title);
            },
            onFinish() {
                wrappedMethods.onFinish = noop;
                methods.onFinish(info.videoDetails.title);
            },
            onError(error) {
                wrappedMethods.onError = noop;
                methods.onError(error);
            },
        };
        return new Track({
            title: info.videoDetails.title,
            url,
            ...wrappedMethods,
        });
    }
}
exports.Track = Track;
