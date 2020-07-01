type Contract = {
  addresses: {
    [key: number]: string;
  };
  abi: Array<any>;
};

export default {
  addresses: {
    1: '0x0D69755e12107695E544842BF7F61D9193f09a54',
    3: '0x15dfbBE6Ae0BA2B27d2E9Adb54C014C388255BE9',
    4: '0x4ec3cb1d571Cd3B7A3B3C99EC6dCa02610bd6f1e',
    42: '0xA2b5742922ae4CA1676349009E33DA5fB4D05dCB'
  },
  abi: [
    {
      constant: true,
      inputs: [
        { name: 'account', type: 'address' },
        { name: 'currencyKey', type: 'bytes32' }
      ],
      name: 'totalSynthsInKey',
      outputs: [{ name: 'total', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'synthsRates',
      outputs: [
        { name: '', type: 'bytes32[]' },
        { name: '', type: 'uint256[]' }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'exchangeRates',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'synthetix',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'synthsBalances',
      outputs: [
        { name: '', type: 'bytes32[]' },
        { name: '', type: 'uint256[]' },
        { name: '', type: 'uint256[]' }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'frozenSynths',
      outputs: [{ name: '', type: 'bytes32[]' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { name: '_synthetix', type: 'address' },
        { name: '_exchangeRates', type: 'address' }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor'
    }
  ]
} as Contract;
