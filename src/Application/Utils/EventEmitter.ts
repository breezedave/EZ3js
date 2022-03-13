declare type Callback = {
    [key: string]: Function[],
};

declare type Name = {
    original: string,
    value: string,
    namespace: string,
};

export class EventEmitter {
    public callbacks: {[key: string]: Callback}
    constructor() {
        this.callbacks = {}
        this.callbacks.base = {}
    }

    on(_names: string, callback: Function) {
        const self = this;

        if(typeof _names === 'undefined' || _names === '') {
            console.warn('wrong names');
            return false;
        }

        if(typeof callback === 'undefined') {
            console.warn('wrong callback');
            return false;
        }

        const names = this.resolveNames(_names);

        names.forEach((_name) => {
            const name = self.resolveName(_name);

            if(!(self.callbacks[ name.namespace ] instanceof Object)) self.callbacks[ name.namespace ] = {};
            if(!(self.callbacks[ name.namespace ][ name.value ] instanceof Array)) self.callbacks[ name.namespace ][ name.value ] = [];
            self.callbacks[ name.namespace ][ name.value ].push(callback);
        });

        return this;
    }

    off(_names: string) {
        const self = this;

        if(typeof _names === 'undefined' || _names === '') {
            console.warn('wrong name');
            return false;
        }

        const names = this.resolveNames(_names);

        names.forEach((_name) => {
            const name = self.resolveName(_name)

            if(name.namespace !== 'base' && name.value === '') {
                delete self.callbacks[name.namespace];
                return;
            }
           
            if(name.namespace === 'base') {
                for(const namespace in self.callbacks) {
                    if(self.callbacks[ namespace ] instanceof Object && self.callbacks[ namespace ][ name.value ] instanceof Array) {
                        delete self.callbacks[ namespace ][ name.value ];
                        if(Object.keys(self.callbacks[ namespace ]).length === 0) delete self.callbacks[ namespace ];
                    }
                }
                return;
            }

            if(
                self.callbacks[ name.namespace ] instanceof Object && 
                self.callbacks[ name.namespace ][ name.value ] instanceof Array
            ) {
                delete self.callbacks[ name.namespace ][ name.value ];

                if(Object.keys(self.callbacks[ name.namespace ]).length === 0) delete self.callbacks[ name.namespace ];
            }
        });

        return this;
    }

    trigger(_name: string, _args?: string|number[]) {
        if(typeof _name === 'undefined' || _name === '') {
            console.warn('wrong name');
            return false;
        }

        const self = this;
        let finalResult = null;
        
        const args = !(_args instanceof Array) ? [] : _args
        const names = this.resolveNames(_name);
        const name = this.resolveName(names[ 0 ]);

        if(name.namespace === 'base') {
            for(const namespace in self.callbacks) {
                if(
                    self.callbacks[ namespace ] instanceof Object && 
                    self.callbacks[ namespace ][ name.value ] instanceof Array
                ) {
                    self.callbacks[ namespace ][ name.value ].forEach((callback) => {
                        if(typeof finalResult === 'undefined') finalResult = callback.apply(self, args);
                    });
                }
            }
            return finalResult
        }
        
        if(this.callbacks[ name.namespace ] instanceof Object) {
            if(name.value === '') {
                console.warn('wrong name');
                return this;
            }

            self.callbacks[ name.namespace ][ name.value ].forEach((callback) => {
                if(typeof finalResult === 'undefined') finalResult = callback.apply(self, args)
            });
        }

        return finalResult
    }

    resolveNames(names: string) {
        return names
        .replace(/[^a-zA-Z0-9 ,/.]/g, '')
        .replace(/[,/]+/g, ' ')
        .split(' ');
    }

    resolveName(name: string) {
        const parts = name.split('.')
        
        const newName: Name = {
            original: name,
            value: parts[ 0 ],
            namespace: 'base',
        };

        if(parts.length > 1 && parts[ 1 ] !== '') newName.namespace = parts[ 1 ]

        return newName;
    }
}
