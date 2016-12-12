import Vue from 'vue';
import Vuex from '../../../src/index';

Vue.use(Vuex);

describe( 'Plugins in modules', () => {
    it( 'register and unregister plugins', () => {
        let sawIt = {};

        let store = new Vuex.Store({
            state: { counter: 0},
            mutations: {
                'quux': state => state.counter++
            },
            modules: {
                foo: {
                    plugins: [ (store) => store.subscribe( () => sawIt.foo = true ) ],
                    modules: {
                        bar: {
                            plugins: [ 
                                (store) => store.subscribe( () => sawIt.bar = true ) 
                            ],
                        },
                    }
                },
            },
        });

        store.registerModule( ['foo','baz'], {
            plugins: [ store => store.subscribe( () => sawIt.baz = true ) ],
        });

        store.commit('quux');

        expect( sawIt ).toEqual({ 
            foo: true,
            bar: true,
            baz: true
        });

        store.unregisterModule( ['foo','baz'] );

        sawIt = {};

        store.commit('quux');

        expect( sawIt ).toEqual({ 
            foo: true,
            bar: true
        });
    })
});

