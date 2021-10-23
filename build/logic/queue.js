"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queue = void 0;
let _queue = [];
exports.queue = {
    enqueue: (song) => _queue.push(song),
    dequeue: () => _queue.shift(),
    clear: () => _queue = [],
    toList: () => _queue.join('\n')
};
