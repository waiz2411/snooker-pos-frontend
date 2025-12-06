import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubContext } from '../../context/ClubContext';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Clock,
  DollarSign,
  CircleDot,
  StopCircle,
  Pause,
  Play,
  AlertCircle,
  Eye,
  Users,
  PlayCircle,
} from 'lucide-react';
import { getGames, getCustomers, getTables, completeGame, UpdateCustomer, UpdateTable } from '../../utils/agentService';

export default function OngoingGames() {
  const navigate = useNavigate();
  const { tables, customers, endGame, updateGame } = useClubContext();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showEndDialog, setShowEndDialog] = useState<string | null>(null);
  const [selectedLoser, setSelectedLoser] = useState('');
  const [Loser, setLoser] = useState([]);
  const [Winner, setWinner] = useState([]);
  const clubId = localStorage.getItem("club_id");
  const [games, setGames] = useState([]);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    handleAutoFetch();
  }, [])

  const handleAutoFetch = async () => {
    getGames(clubId)
      .then((res) => {
        // console.log(res.games);
        setGames(res.games);
      })
      .catch((err) => console.error("Error Creating Club"));
  }


  // Update current time every second for live timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const runningGames = games.filter(g => g.status === 'ongoing');

  const getGameDetails = (game: any) => {
    const table = tables.find(t => t.id === game.tableId);
    const player1 = customers.find(c => c.id === game.player1Id);
    const player2 = customers.find(c => c.id === game.player2Id);
    const elapsedSeconds = Math.floor((currentTime - new Date(game.startTime).getTime()) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const isOvertime = minutes >= 30;

    const calculateAmount = () => {
      if (game.pricingType === 'Per Minute') {
        return minutes * (game.pricePerMinute || 0);
      }
      return game.fixedPrice || 0;
    };

    return {
      table,
      player1,
      player2,
      minutes,
      seconds,
      isOvertime,
      currentAmount: calculateAmount(),
    };
  };

  const handlePauseGame = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      updateGame(gameId, { paused: true, pausedAt: new Date().toISOString() });
    }
  };

  const handleResumeGame = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game && game.paused) {
      // Calculate time paused and adjust start time
      const pauseDuration = Date.now() - new Date(game.pausedAt).getTime();
      const newStartTime = new Date(new Date(game.startTime).getTime() + pauseDuration).toISOString();
      updateGame(gameId, {
        paused: false,
        pausedAt: undefined,
        startTime: newStartTime
      });
    }
  };

  const handleEndGame = (gameId: string, calculatedAmount: number, table_id: number) => {
    if (!selectedLoser) {
      alert('Please select who lost the game');
      return;
    }

    // const game = games.find(g => g.id === gameId);
    // if (game) {
    //   const details = getGameDetails(game);
    //   endGame(gameId, selectedLoser, details.currentAmount);
    // }
    const completeData = {
      losers: [Loser.id],
      winners: [Winner.id]
    };
    const LoserData = {
      losses: Loser.losses + 1,
      billed_amount: Number(Loser.billed_amount) + Number(calculatedAmount),
      pending_amount: Number(Loser.pending_amount) + Number(calculatedAmount),
    }
    const WinnerData = {
      wins: Winner.wins + 1,
    }
    const UpdateTableData = {
      status: 'Free'
    }
    setLoading(true);
    // console.log("Ending Game Data:", completeData, LoserData, WinnerData, UpdateTableData);
    completeGame(gameId, completeData)
      .then((res) => {
        UpdateCustomer(clubId, Loser.id, LoserData);
        UpdateCustomer(clubId, Winner.id, WinnerData);
        UpdateTable(table_id, UpdateTableData)
          .then((res) => {
            setLoading(false);
            window.location.reload();
          })
      })
      .catch((err) => {
        console.error("Error Ending Game")
        setLoading(false);
      })
    console.log("Ending Game:", gameId, "Loser:", selectedLoser);

  };

  const openEndDialog = (gameId: string) => {
    setShowEndDialog(gameId);
    setSelectedLoser('');
  };

  const [overtimeWarnings, setOvertimeWarnings] = useState({});
  useEffect(() => {
    if (!runningGames) return;

    const interval = setInterval(() => {
      const updated = {};

      runningGames.forEach(game => {
        const start = new Date(game.created_at);
        const now = new Date();
        const diffMinutes = (now - start) / 1000 / 60;

        if (diffMinutes >= 30) {
          updated[game.id] = true;
        }
      });

      setOvertimeWarnings(prev => ({ ...prev, ...updated }));
    }, 30000);

    return () => clearInterval(interval);
  }, [games]);

  const [tablesMap, setTablesMap] = useState({});
  const [customersMap, setCustomersMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const resCustomers = await getCustomers(clubId);
        const allCustomers = resCustomers?.customers;

        if (Array.isArray(allCustomers) && allCustomers.length > 0) {
          const custObj = {};
          allCustomers.forEach(c => {
            custObj[c.id] = c;
          });
          setCustomersMap(custObj);
        }

        console.log("Customers Response:", resCustomers);

        // Fetch tables
        const resTables = await getTables(clubId);
        const allTables = resTables?.tables;

        if (Array.isArray(allTables) && allTables.length > 0) {
          const tableObj = {};
          allTables.forEach(t => {
            tableObj[t.id] = t;
          });
          setTablesMap(tableObj);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call async function
  }, [clubId]);




  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white">Ongoing Games</h1>
          <p className="text-gray-400">Monitor and manage all active games</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-[#00ff41]/10 border border-[#00ff41]/20 rounded-lg">
          <PlayCircle className="w-5 h-5 text-[#00ff41]" />
          <div>
            <p className="text-gray-400">Active Games</p>
            <p className="text-[#00ff41]">{runningGames.length}</p>
          </div>
        </div>
      </div>

      {runningGames.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-12 text-center">
          <CircleDot className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No games in progress</p>
          <Button
            onClick={() => navigate('/club/start-game')}
            className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
          >
            <Play className="w-4 h-4 mr-2" />
            Start a Game
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {runningGames.map((game) => {
            const details = game;


            const table = tablesMap[details.table_id];
            const player1 = customersMap[details.player1_id];
            const player2 = customersMap[details.player2_id];
            // console.log("Game Details:", table);

            if (!table || !player1 || !player2) return null;

            const isPaused = game.paused;
            const OvertimeWarning = overtimeWarnings[game.id];

            const start = new Date(game.start_time);
            const now = new Date();

            const diffMs = now - start; // difference in milliseconds

            const totalSeconds = Math.floor(diffMs / 1000);
            const minutes = Math.floor(totalSeconds / 60); // can exceed 60
            const seconds = totalSeconds % 60;
            // console.log("OvertimeWarning:", OvertimeWarning);
            // console.log("isPaused:", isPaused);
            // console.log("table:", table);
            // console.log("player1:", player1);
            // console.log("player2:", player2);
            return (
              <div
                key={game.id}
                className={`backdrop-blur-xl border-2 rounded-xl p-6 transition-all ${OvertimeWarning && !isPaused
                  ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/20'
                  : isPaused
                    ? 'bg-orange-500/10 border-orange-500/50'
                    : 'bg-white/5 border-[#00ff41]/20'
                  }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white mb-1">{table?.table_name}</h3>
                  </div>
                  <CircleDot
                    className={`w-6 h-6 ${isPaused
                      ? 'text-orange-400'
                      : OvertimeWarning
                        ? 'text-red-400 animate-pulse'
                        : 'text-blue-400'
                      }`}
                  />
                </div>

                {/* Status Badges */}
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-center ${isPaused
                    ? 'bg-orange-500/20 text-orange-400'
                    : OvertimeWarning
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-blue-500/20 text-blue-400'
                    }`}>
                    {isPaused ? 'PAUSED' : OvertimeWarning ? 'OVERTIME' : 'RUNNING'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#00ff41]/20 text-[#00ff41]">
                    {game.billing_type}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400">
                    {minutes} minutes {seconds} seconds
                  </span>
                </div>

                {/* Overtime Warning */}
                {OvertimeWarning && !isPaused && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                    <AlertCircle className="w-5 h-5 animate-pulse" />
                    <span>Game has exceeded 30 minutes!</span>
                  </div>
                )}

                {/* Pause Warning */}
                {isPaused && (
                  <div className="flex items-center gap-2 text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-4">
                    <Pause className="w-5 h-5" />
                    <span>Game is paused - Timer stopped</span>
                  </div>
                )}

                {/* Stats Grid */}
                {/* <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 bg-black/30 rounded-lg text-center">
                    <Clock className={`w-5 h-5 mx-auto mb-1 ${isPaused ? 'text-orange-400' : OvertimeWarning ? 'text-red-400' : 'text-[#00ff41]'
                      }`} />
                    <p className="text-gray-400 mb-1">Time</p>
                    <p className={`${isPaused ? 'text-orange-400' : OvertimeWarning ? 'text-red-400' : 'text-white'
                      }`}>
                      {String(details.minutes).padStart(2, '0')}:{String(details.seconds).padStart(2, '0')}
                    </p>
                  </div>
                  <div className="p-3 bg-black/30 rounded-lg text-center">
                    <DollarSign className="w-5 h-5 text-[#00ff41] mx-auto mb-1" />
                    <p className="text-gray-400 mb-1">Current</p>
                    <p className="text-[#00ff41]">${details.currentAmount.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-black/30 rounded-lg text-center">
                    <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-gray-400 mb-1">Players</p>
                    <p className="text-blue-400">2</p>
                  </div>
                </div> */}

                {/* Players */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-400 mb-1">Player 1</p>
                    <p className="text-white">{player1?.name}</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <p className="text-purple-400 mb-1">Player 2</p>
                    <p className="text-white">{player2?.name}</p>
                  </div>
                </div>

                {/* Pricing Info */}
                <div className="p-3 bg-black/30 rounded-lg border border-white/10 mb-4">
                  <p className="text-gray-400">
                    Rate: Rs {game.billing_type === 'per_minute'
                      ? `${game.price_per_minute}/min`
                      : game.full_game_price}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {/* {isPaused ? (
                    <Button
                      onClick={() => handleResumeGame(game.id)}
                      className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handlePauseGame(game.id)}
                      variant="ghost"
                      className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 border border-orange-500/20"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )} */}
                  {/* <Button
                    onClick={() => navigate(`/club/game/${game.id}`)}
                    variant="ghost"
                    className="text-[#00ff41] hover:text-[#00dd38] hover:bg-[#00ff41]/10 border border-[#00ff41]/20"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button> */}
                  <Button
                    onClick={() => openEndDialog(game.id)}
                    className="col-span-2 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <StopCircle className="w-4 h-4 mr-2" />
                    End Game
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* End Game Dialog */}
      {showEndDialog && (() => {
        const tempGame = games.filter(g => g.id === showEndDialog);
        const game = tempGame[0];
        if (!game) return null;
        const details = getGameDetails(game);

        const table = tablesMap[game.table_id];
        const player1 = customersMap[game.player1_id];
        const player2 = customersMap[game.player2_id];

        const start = new Date(game.start_time);
        const now = new Date();

        const diffMs = now - start; // difference in milliseconds

        const totalSeconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(totalSeconds / 60); // can exceed 60
        const seconds = totalSeconds % 60;

        let calculatedAmount = 0;
        if (game.billing_type === "per_minute") {
          calculatedAmount = minutes * (game.price_per_minute || 0);
        } else {
          calculatedAmount = game.full_game_price || 0;
        }
        console.log("End Game Details:", game);
        // if (!details.player1 || !details.player2) return null;

        return (
          <Dialog open={true} onOpenChange={() => setShowEndDialog(null)}>
            <DialogContent className="bg-[#0d1117] border-[#00ff41]/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-[#00ff41]">End Game</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-400">Select the player who lost. The loser will be billed for the game.</p>

                <div className="p-4 bg-[#00ff41]/10 border border-[#00ff41]/20 rounded-lg">
                  <p className="text-gray-400">Total Amount to Bill</p>
                  <p className="text-[#00ff41]">Rs {calculatedAmount}</p>
                  <p className="text-gray-500">
                    Game Duration: {minutes} minutes {seconds} seconds
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-300 mb-2">Who Lost?</label>
                  <button
                    onClick={() => { setWinner(player2); setLoser(player1); setSelectedLoser(player1.id) }}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedLoser === player1.id
                      ? 'border-[#00ff41] bg-[#00ff41]/10'
                      : 'border-white/10 bg-white/5 hover:border-[#00ff41]/50'
                      }`}
                  >
                    <p className="text-white">{player1.name}</p>
                    <p className="text-gray-400">
                      New Balance: Rs {Number(player1.pending_amount) + Number(calculatedAmount)}
                    </p>
                  </button>
                  <button
                    onClick={() => { setWinner(player1); setLoser(player2); setSelectedLoser(player2.id) }}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedLoser === player2.id
                      ? 'border-[#00ff41] bg-[#00ff41]/10'
                      : 'border-white/10 bg-white/5 hover:border-[#00ff41]/50'
                      }`}
                  >
                    <p className="text-white">{player2.name}</p>
                    <p className="text-gray-400">
                      New Balance: Rs {Number(player2.pending_amount) + Number(calculatedAmount)}
                    </p>
                  </button>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowEndDialog(null);
                    setSelectedLoser('');
                  }}
                  className="text-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleEndGame(game.id, calculatedAmount, game.table_id)}
                  className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
                >
                  {Loading ? "Loading ..." : "End Game & Bill Loser"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
}