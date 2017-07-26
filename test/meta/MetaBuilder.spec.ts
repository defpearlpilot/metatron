import {expect} from 'chai';
import {MetaBuilderFactory} from '../../src/meta/MetaBuilder';

describe('proxy meta builder test suite', function metaBuilderSuite() {
  it('tests building primitives', function testBuildingPrimitives() {

    const builder = MetaBuilderFactory.primitive('primitive');

    const primitive = builder.build();
    expect(primitive.name).to.be.equal('primitive');
    expect(primitive.isRequired).to.be.false;
    expect(primitive.isProxy).to.be.false;
    expect(primitive.canInvoke).to.be.false;

    const required = builder.required().build();
    expect(required.name).to.be.equal('primitive');
    expect(required.isRequired).to.be.true;

    const immutable = builder.immutable().build();
    expect(immutable.name).to.be.equal('primitive');
    expect(immutable.isMutable).to.be.false;
  });
});
