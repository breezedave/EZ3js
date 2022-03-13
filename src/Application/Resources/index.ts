import * as THREE from 'three'
import {Loader, Resource} from '../Utils/Loader';
import {EventEmitter} from '../Utils/EventEmitter';
// @ts-ignore
import resources from "../../Resources/.loadResources";

export class Resources extends EventEmitter {
    private loader: Loader;
    public items: {[key: string]: any}

    constructor() {
        super();

        this.loader = new Loader();
        this.items = {};

        this.loader.load(resources.textures);
        this.loader.load(resources.models);

        this.loader.on('fileEnd', (_resource: Resource, _data) => {
            this.items[_resource.name] = _data;

            if(_resource.type === 'texture') {
                const texture = new THREE.Texture(_data)
                texture.needsUpdate = true

                this.items[`${_resource.name}Texture`] = texture
            };

            const progressVal = this.loader.loaded / this.loader.toLoad;

            this.trigger('progress', [progressVal]);
        });

        this.loader.on('end', () => this.trigger('ready'));

        console.log(this.loader);
    }
}
