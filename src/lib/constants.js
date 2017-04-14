const constants = {
  NAME: 'Week in Ethereum News',
  SUBSCRIBED_CONTROLS: [
    { type: 'button', label: 'Latest 📨', value: 'latest' },
    { type: 'button', label: 'Tip 💸', value: 'tip' },
    {
      type: 'group',
      label: 'More',
      controls: [
        { type: 'button', label: 'About', value: 'about' },
        { type: 'button', label: 'Previous Articles', value: 'historical' },
        { type: 'button', label: 'Unsubscribe 👋', value: 'unsubscribe' },
      ],
    },
  ],
  UNSUBSCRIBED_CONTROLS: [
    { type: 'button', label: 'Latest 📨', value: 'latest' },
    { type: 'button', label: 'Subscribe 📩', value: 'subscribe' },
  ],
  AMOUNTS: {
    amount1: 0.25,
    amount2: 1,
    amount3: 5,
    amount4: 25,
  }
}

module.exports = constants;
