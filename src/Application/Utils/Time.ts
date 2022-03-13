import {EventEmitter} from './';

export class Time extends EventEmitter
{
    public start: number;
    public current: number;
    public elapsed: number;
    public delta: number;
    public ticker: number;

    constructor() {
        super();

        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;

        this.tick = this.tick.bind(this);
        this.tick();
    }

    tick() {
        this.ticker = window.requestAnimationFrame(this.tick);

        const current = Date.now();

        this.delta = current - this.current;
        this.elapsed = current - this.start;
        this.current = current;

        if(this.delta > 60) this.delta = 60;

        this.trigger('tick');
    }

    stop() {
        window.cancelAnimationFrame(this.ticker);
    }
}
