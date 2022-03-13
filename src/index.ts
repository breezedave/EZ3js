import './styles/main.scss'
import {Application} from './Application';

declare global {
    interface Window { 
        application: Application; 
    }
}

window.application = new Application({
    canvas: document.querySelector('.js-canvas'),
    useComposer: true
});
