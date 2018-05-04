const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let from = 'the dude';
    let text = 'it really tied the room together';
    let message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({ from, text });
  });
});


describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    let from = 'Jeff';
    let latitude = 20;
    let longitude = 10;
    let url = 'https://www.google.com/maps?q=20,10';
    let message = generateLocationMessage(from, latitude, longitude);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({ from, url });
  });
});