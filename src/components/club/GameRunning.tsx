import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClubContext } from '../../context/ClubContext';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Clock, DollarSign, CircleDot, StopCircle, AlertCircle } from 'lucide-react';

export default function GameRunning() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { games, tables, customers, endGame } = useClubContext();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [selectedLoser, setSelectedLoser] = useState('');

  const game = games.find(g => g.id === gameId);
  const table = game ? tables.find(t => t.id === game.tableId) : null;
  const player1 = game ? customers.find(c => c.id === game.player1Id) : null;
  const player2 = game ? customers.find(c => c.id === game.player2Id) : null;

  useEffect(() => {
    if (!game) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - new Date(game.startTime).getTime()) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [game]);

  if (!game || !table || !player1 || !player2) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-12 text-center">
        <p className="text-gray-400">Game not found</p>
        <Button
          onClick={() => navigate('/club/dashboard')}
          className="mt-4 bg-[#00ff41] hover:bg-[#00dd38] text-black"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const isOvertime = minutes >= 30;

  const calculateAmount = () => {
    if (game.pricingType === 'Per Minute') {
      return minutes * (game.pricePerMinute || 0);
    }
    return game.fixedPrice || 0;
  };

  const currentAmount = calculateAmount();

  const handleEndGame = () => {
    if (!selectedLoser) {
      alert('Please select who lost the game');
      return;
    }

    endGame(game.id, selectedLoser, currentAmount)
      .then(() => {
        alert('Game ended successfully');
        setShowEndDialog(false);
        navigate('/club/dashboard');
      })
      .catch(() => {
        alert('Error ending game');
      });
    // setShowEndDialog(false);
    // navigate('/club/dashboard');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white">Game in Progress</h1>
          <p className="text-gray-400">{table.name} - {table.type}</p>
        </div>
        <Button
          onClick={() => setShowEndDialog(true)}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <StopCircle className="w-4 h-4 mr-2" />
          End Game
        </Button>
      </div>

      {/* Game Status Card */}
      <div className={`backdrop-blur-xl border-2 rounded-2xl p-8 transition-all ${
        isOvertime
          ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/20'
          : 'bg-white/5 border-[#00ff41]/20'
      }`}>
        {isOvertime && (
          <div className="flex items-center gap-3 mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-400 animate-pulse" />
            <div>
              <p className="text-red-400">OVERTIME!</p>
              <p className="text-gray-400">This game has exceeded 30 minutes</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Timer */}
          <div className="text-center">
            <Clock className={`w-12 h-12 mx-auto mb-3 ${isOvertime ? 'text-red-400' : 'text-[#00ff41]'}`} />
            <p className="text-gray-400 mb-2">Time Elapsed</p>
            <p className={`${isOvertime ? 'text-red-400' : 'text-white'}`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
          </div>

          {/* Billing */}
          <div className="text-center">
            <DollarSign className="w-12 h-12 text-[#00ff41] mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Current Bill</p>
            <p className="text-[#00ff41]">${currentAmount.toFixed(2)}</p>
          </div>

          {/* Table Status */}
          <div className="text-center">
            <CircleDot className={`w-12 h-12 mx-auto mb-3 ${isOvertime ? 'text-red-400' : 'text-blue-400'}`} />
            <p className="text-gray-400 mb-2">Table Status</p>
            <p className={isOvertime ? 'text-red-400' : 'text-blue-400'}>
              {isOvertime ? 'OVERTIME' : 'OCCUPIED'}
            </p>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="p-4 bg-black/30 rounded-lg border border-white/10 mb-6">
          <p className="text-gray-400">Pricing Type: {game.pricingType}</p>
          <p className="text-white">
            Rate: ${game.pricingType === 'Per Minute' 
              ? `${game.pricePerMinute}/minute` 
              : game.fixedPrice}
          </p>
        </div>

        {/* Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl">
            <p className="text-blue-400 mb-2">Player 1</p>
            <h3 className="text-white mb-4">{player1.name}</h3>
            <div className="space-y-2 text-gray-400">
              <p>Current Billed: ${player1.billedAmount}</p>
              <p>Paid: ${player1.paidAmount}</p>
              <p>Remaining: ${player1.remainingAmount}</p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl">
            <p className="text-purple-400 mb-2">Player 2</p>
            <h3 className="text-white mb-4">{player2.name}</h3>
            <div className="space-y-2 text-gray-400">
              <p>Current Billed: ${player2.billedAmount}</p>
              <p>Paid: ${player2.paidAmount}</p>
              <p>Remaining: ${player2.remainingAmount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* End Game Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent className="bg-[#0d1117] border-[#00ff41]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#00ff41]">End Game</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400">Select the player who lost. The loser will be billed for the game.</p>
            
            <div className="p-4 bg-[#00ff41]/10 border border-[#00ff41]/20 rounded-lg">
              <p className="text-gray-400">Total Amount to Bill</p>
              <p className="text-[#00ff41]">${currentAmount.toFixed(2)}</p>
              <p className="text-gray-500">
                Game Duration: {minutes} minutes {seconds} seconds
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 mb-2">Who Lost?</label>
              <button
                onClick={() => setSelectedLoser(player1.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedLoser === player1.id
                    ? 'border-[#00ff41] bg-[#00ff41]/10'
                    : 'border-white/10 bg-white/5 hover:border-[#00ff41]/50'
                }`}
              >
                <p className="text-white">{player1.name}</p>
                <p className="text-gray-400">
                  New Balance: ${player1.remainingAmount + currentAmount}
                </p>
              </button>
              <button
                onClick={() => setSelectedLoser(player2.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedLoser === player2.id
                    ? 'border-[#00ff41] bg-[#00ff41]/10'
                    : 'border-white/10 bg-white/5 hover:border-[#00ff41]/50'
                }`}
              >
                <p className="text-white">{player2.name}</p>
                <p className="text-gray-400">
                  New Balance: ${player2.remainingAmount + currentAmount}
                </p>
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowEndDialog(false)}
              className="text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEndGame}
              className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
            >
              End Game & Bill Loser
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
