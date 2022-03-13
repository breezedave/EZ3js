import { EventEmitter } from './';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

declare type LoaderType = {
    extensions: string[],
    action: (resource: Resource) => any,
};

export type Resource = {
    source: string,
    name: string,
    type?: string,
};

export class Loader extends EventEmitter {
    public toLoad: number;
    public loaded: number;
    public items: {[key: string]: any}
    public loaders: LoaderType[];
    
    constructor() {
        super();

        this.setLoaders();

        this.toLoad = 0;
        this.loaded = 0;
        this.items = {};
    }

    setLoaders() {
        this.loaders = [];

        this.loaders.push({
            extensions: ['jpg', 'png'],
            action: (_resource) => {
                const image = new Image();

                image.addEventListener('load', () => {
                    this.fileLoadEnd(_resource, image);
                });

                image.addEventListener('error', () => {
                    this.fileLoadEnd(_resource, image);
                });

                image.src = _resource.source;
            }
        })

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('draco/');
        dracoLoader.setDecoderConfig({ type: 'js' });

        this.loaders.push({
            extensions: ['drc'],
            action: (_resource) => {
                dracoLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data);

                    dracoLoader.dispose();
                });
            }
        });

        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        this.loaders.push({
            extensions: ['glb', 'gltf'],
            action: (_resource) => {
                gltfLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data)
                });
            },
        });

        const fbxLoader = new FBXLoader();

        this.loaders.push({
            extensions: ['fbx'],
            action: (_resource) => {
                fbxLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data);
                });
            },
        });
    }

    load(_resources:Resource[] = []) {
        _resources.forEach((_resource) => {
            this.toLoad++;
            const extensionMatch = _resource.source.match(/\.([a-z]+)$/);

            if(typeof extensionMatch[1] !== 'undefined') {
                const extension = extensionMatch[1];
                const loader = this.loaders.find((_loader) => _loader.extensions.find((_extension) => _extension === extension));

                if(loader) {
                    loader.action(_resource);
                    return;
                }
                
                console.warn(`Cannot found loader for ${_resource}`);
                return;
            }
            console.warn(`Cannot found extension of ${_resource}`);
        });
    }

    fileLoadEnd(_resource: Resource, _data: any) {
        this.loaded++;
        this.items[_resource.name] = _data;
        this.trigger('fileEnd', [_resource, _data]);
        if(this.loaded === this.toLoad) this.trigger('end')
    }
}
