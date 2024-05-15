import * as R from 'ramda';
import {default as Generator} from './Generator.js';

export default class Processor {
  gene = new Generator();

  controleData = R.map(
    R.cond([
      [R.equals('pop'), R.when(R.isEmpty, console.log)(R.prop('pop', gameData))]
    ])
  );
}

// TEST ZONE

const proco = new Processor();

console.log(
  proco.controleData(['pop', 'reduc', '8'], {
    pop: '',
    reduc: 'comment ca va ?',
    8: 'bien bien'
  })
);

console.log(
  R.prop('pop', {
    pop: 'Bonsoir',
    reduc: 'comment ca va ?',
    8: 'bien bien'
  })
);
