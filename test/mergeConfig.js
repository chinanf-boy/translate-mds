import test from 'ava'
import mergeConfig from '../src/config/mergeConfig'

test('cli config',t =>{
    let cli = {
        flags:{
            F:true,
            G:true,
            values:true,
            translate: 'hello',
            timewait: '1000'
        }
    }

    let config = mergeConfig(cli)

    t.is(Object.keys(config).length,8)
})
