"use client";

import { useState, useEffect } from "react";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [currencies, setCurrencies] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (data.rates) {
          setCurrencies(Object.keys(data.rates));
        }
      })
      .catch((error) => console.error("Error fetching currencies:", error));
  }, []);

  const convertCurrency = async () => {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();

      if (data.rates && data.rates[toCurrency]) {
        setConvertedAmount(Number((amount * data.rates[toCurrency]).toFixed(2)));
      } else {
        console.error("Invalid currency conversion.");
      }
    } catch (error) {
      console.error("Error converting currency:", error);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-white">
      <div className="p-6 max-w-md w-full bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Currency Converter</h2>
        
        <div className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border border-gray-300 p-2 rounded w-full text-center"
            placeholder="Enter amount"
          />

          <div className="flex items-center space-x-4">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="border border-gray-300 p-2 rounded w-1/2"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>

            {/* Swap Button */}
            <button
              onClick={swapCurrencies}
              className=" hover:bg-gray-400 text-black p-2 rounded-full transition"
              title="Swap Currencies"
            >
              🔄
            </button>

            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="border border-gray-300 p-2 rounded w-1/2"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>

          <button
            onClick={convertCurrency}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded w-full transition"
          >
            Convert
          </button>

          {/* Hide result if convertedAmount is null */}
          {convertedAmount !== null && (
            <p className="text-lg font-semibold text-gray-800">
              {amount} {fromCurrency} = <span className="text-blue-600">{convertedAmount} {toCurrency}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
