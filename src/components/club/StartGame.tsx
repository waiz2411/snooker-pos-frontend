import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubContext } from '../../context/ClubContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PlayCircle, CircleDot, Users, DollarSign, ArrowRight } from 'lucide-react';
import { getTables, getCustomers, createGame, UpdateTable } from '../../utils/agentService';
import { stat } from 'fs';

export default function StartGame() {
  const navigate = useNavigate();
  const { startGame } = useClubContext();
  const [step, setStep] = useState(1);
  const [selectedTable, setSelectedTable] = useState('');
  const [pricingType, setPricingType] = useState<'Per Minute' | 'Full Game'>('Per Minute');
  const [pricePerMinute, setPricePerMinute] = useState(5);
  const [fixedPrice, setFixedPrice] = useState(50);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const clubId = localStorage.getItem("club_id");

  useEffect(() => {
    handleAutoFetch();
  }, [])

  const handleAutoFetch = async () => {
    getTables(clubId)
      .then((res) => {
        // console.log(res);
        setTables(res.tables);
      })
      .catch((err) => console.error("Error Creating Club"));

    getCustomers(clubId)
      .then((res) => {
        // console.log(res);
        setCustomers(res.customers);
      })
      .catch((err) => console.error("Error Creating Club"));
  }

  const availableTables = tables.filter(t => t.status === 'Free');

  const handleStartGame = () => {
    if (!selectedTable || !player1 || !player2) {
      alert('Please complete all steps');
      return;
    }

    if (player1 === player2) {
      alert('Please select different players');
      return;
    }

    const game = {
      table_id: selectedTable,
      player1_id: player1,
      player2_id: player2,
      billing_type: pricingType === 'Per Minute' ? "per_minute" : "full_game",
      price_per_minute: pricingType === 'Per Minute' ? pricePerMinute : undefined,
      full_game_price: pricingType === 'Full Game' ? fixedPrice : undefined,
    };

    const UpdateTableData = {
      status: 'Occupied'
    }

    createGame(clubId, game)
      .then((response) => {
        console.log("Started Game ID:", response.game.id);
        UpdateTable(selectedTable, UpdateTableData);
        alert('Game started successfully!');
        navigate(`/club/ongoing-games`);
      })
      .catch((err) => {
        console.error("Error Starting Game");
        alert('Error starting game. Please try again.');
      });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-white">Start a Game</h1>
        <p className="text-gray-400">Step-by-step game setup</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#00ff41] text-black' : 'bg-white/10 text-gray-500'
            }`}>
            1
          </div>
          <span className={step >= 1 ? 'text-[#00ff41]' : 'text-gray-500'}>
            Select Table
          </span>
        </div>
        <ArrowRight className="text-gray-500" />
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#00ff41] text-black' : 'bg-white/10 text-gray-500'
            }`}>
            2
          </div>
          <span className={step >= 2 ? 'text-[#00ff41]' : 'text-gray-500'}>
            Choose Pricing
          </span>
        </div>
        <ArrowRight className="text-gray-500" />
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#00ff41] text-black' : 'bg-white/10 text-gray-500'
            }`}>
            3
          </div>
          <span className={step >= 3 ? 'text-[#00ff41]' : 'text-gray-500'}>
            Select Players
          </span>
        </div>
      </div>

      {/* Step 1: Select Table */}
      {step === 1 && (
        <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6">
          <h2 className="text-white mb-4">Step 1: Select a Table</h2>
          {availableTables.length === 0 ? (
            <p className="text-gray-400">No tables available. All tables are currently occupied.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => {
                    setSelectedTable(table.id);
                    setStep(2);
                  }}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${selectedTable === table.id
                    ? 'border-[#00ff41] bg-[#00ff41]/10'
                    : 'border-white/10 bg-white/5 hover:border-[#00ff41]/50'
                    }`}
                >
                  <CircleDot className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-white mb-1">{table.table_name}</h3>
                  {/* <p className="text-gray-400">Table #{table.number}</p> */}
                  {/* <p className="text-gray-500">{table.type}</p> */}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Choose Pricing */}
      {step === 2 && (
        <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6">
          <h2 className="text-white mb-4">Step 2: Choose Pricing Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setPricingType('Per Minute')}
              className={`p-6 rounded-xl border-2 transition-all text-left ${pricingType === 'Per Minute'
                ? 'border-[#00ff41] bg-[#00ff41]/10'
                : 'border-white/10 bg-white/5 hover:border-[#00ff41]/50'
                }`}
            >
              <DollarSign className="w-8 h-8 text-[#00ff41] mb-3" />
              <h3 className="text-white mb-1">Charge Per Minute</h3>
              <p className="text-gray-400">Bill based on game duration</p>
            </button>
            <button
              onClick={() => setPricingType('Full Game')}
              className={`p-6 rounded-xl border-2 transition-all text-left ${pricingType === 'Full Game'
                ? 'border-[#00ff41] bg-[#00ff41]/10'
                : 'border-white/10 bg-white/5 hover:border-[#00ff41]/50'
                }`}
            >
              <DollarSign className="w-8 h-8 text-[#00ff41] mb-3" />
              <h3 className="text-white mb-1">Fixed Price</h3>
              <p className="text-gray-400">One-time charge for whole game</p>
            </button>
          </div>

          {pricingType === 'Per Minute' ? (
            <div>
              <label className="block text-gray-300 mb-2">Price Per Minute ($)</label>
              <Input
                type="number"
                value={pricePerMinute}
                onChange={(e) => setPricePerMinute(parseFloat(e.target.value) || 0)}
                className="bg-black/40 border-[#00ff41]/30 text-white max-w-xs"
              />
            </div>
          ) : (
            <div>
              <label className="block text-gray-300 mb-2">Fixed Game Price ($)</label>
              <Input
                type="number"
                value={fixedPrice}
                onChange={(e) => setFixedPrice(parseFloat(e.target.value) || 0)}
                className="bg-black/40 border-[#00ff41]/30 text-white max-w-xs"
              />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => setStep(1)}
              variant="ghost"
              className="text-gray-400"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Select Players */}
      {step === 3 && (
        <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6">
          <h2 className="text-white mb-4">Step 3: Select Two Players</h2>

          {customers.length < 2 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">You need at least 2 customers to start a game</p>
              <Button
                onClick={() => navigate('/club/customers')}
                className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
              >
                Add Customers
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2">Player 1</label>
                  <select
                    value={player1}
                    onChange={(e) => setPlayer1(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-[#00ff41]/30 text-white rounded-lg focus:outline-none focus:border-[#00ff41]"
                  >
                    <option value="">Select Player 1</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Player 2</label>
                  <select
                    value={player2}
                    onChange={(e) => setPlayer2(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-[#00ff41]/30 text-white rounded-lg focus:outline-none focus:border-[#00ff41]"
                  >
                    <option value="">Select Player 2</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Game Summary */}
              <div className="p-4 bg-[#00ff41]/10 border border-[#00ff41]/20 rounded-lg mb-6">
                <h3 className="text-[#00ff41] mb-3">Game Summary</h3>
                <div className="space-y-2 text-gray-300">
                  <p>Table: {tables.find(t => t.id === selectedTable)?.table_name}</p>
                  <p>Pricing: {pricingType}</p>
                  <p>
                    Rate: Rs {pricingType === 'Per Minute' ? `${pricePerMinute}/min` : fixedPrice}
                  </p>
                  <p>
                    Player 1: {customers.find(c => Number(c.id) === Number(player1))?.name || 'Not selected'}
                  </p>

                  <p>
                    Player 2: {customers.find(c => Number(c.id) === Number(player2))?.name || 'Not selected'}
                  </p>

                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(2)}
                  variant="ghost"
                  className="text-gray-400"
                >
                  Back
                </Button>
                <Button
                  onClick={handleStartGame}
                  className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Game
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
