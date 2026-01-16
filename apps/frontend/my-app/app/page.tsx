'use client';

import { useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { injected } from 'wagmi/connectors';

const CONTRACT_ADDRESS = '0xf07826135b10ae7eade5ad6876bd1765ed62a6bd';

const SIMPLE_STORAGE_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnerSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newValue",
          "type": "uint256"
        }
      ],
      "name": "ValueUpdated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "getValue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "setValue",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

export default function Page() {

  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  const [inputValue, setInputValue] = useState('');

  const shortenAddress = (addr?: string) => {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
  });


  const {
    writeContract,
    isPending: isWriting,
  } = useWriteContract();

  const handleSetValue = async () => {
    if (!inputValue) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: SIMPLE_STORAGE_ABI,
      functionName: 'setValue',
      args: [BigInt(inputValue)],
    });
  };

  return (
  <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-zinc-950 text-white flex items-center justify-center p-3 relative overflow-hidden">
   
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent"></div>
    <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

    <div className="w-full max-w-lg relative z-10">
     
      <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl shadow-black/50 space-y-2">
        
       
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent tracking-tight">
            Blockchain Storage
          </h1>
        </div>

        
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800/50 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
          {!isConnected ? (
            <button
              onClick={() => connect({ connector: injected() })}
              disabled={isConnecting}
              className="group w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="flex items-center justify-center gap-3">
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 12a9 9 0 11-9-9 9 9 0 019 9z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>Connect Wallet</span>
                  </>
                )}
              </span>
            </button>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Connected Wallet</p>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <p className="relative font-mono text-sm bg-gray-900/50 border border-gray-800 p-4 rounded-xl backdrop-blur-sm break-all leading-relaxed">
                    {shortenAddress(address)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => disconnect()}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-red-400 border border-gray-800 py-3 rounded-xl font-medium hover:border-red-500/30 hover:text-red-400 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>

       
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800/50 rounded-xl p-2 space-y-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">On-chain Value</p>
              <p className="text-sm text-gray-500 mt-1">Current stored value</p>
            </div>
            
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 border border-gray-800 px-4 py-2 rounded-lg hover:bg-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>

          <div className="relative">
            {isReading ? (
              <div className="flex items-center justify-center h-24">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-3 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-gray-400 text-sm">Loading value...</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent tracking-tighter">
                  {value?.toString()}
                </p>
                <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800/50 rounded-2xl p-4 space-y-5 backdrop-blur-sm">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Update Contract Value</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="number"
                placeholder="Enter new value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-4 bg-gray-900/50 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 font-medium transition-all duration-300"
              />
            </div>

            <button
              onClick={handleSetValue}
              disabled={isWriting}
              className="group w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold py-4 rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="flex items-center justify-center gap-3">
                {isWriting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                
                    <span>Set Value</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
);
}
