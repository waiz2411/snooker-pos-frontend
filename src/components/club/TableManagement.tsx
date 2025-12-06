import { useState, useEffect } from 'react';
import { useClubContext } from '../../context/ClubContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { CircleDot, Plus, Clock, Trash2, AlertCircle } from 'lucide-react';
import { createTable, getTables, DeleteTable } from '../../utils/agentService';
import { stat } from 'fs';

export default function TableManagement() {
  const { deleteTable } = useClubContext();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    table_name: '',
    status: "Free"
  });
  const clubId = localStorage.getItem("club_id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [tables, setTables] = useState([]);

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
  }

  const handleAddTable = () => {
    if (formData.table_name) {
      createTable(clubId, formData)
        .then((res) => {
          setMessage("Table Added Successfully.");
          setLoading(true);
          handleAutoFetch();
        })
        .catch((err) => {
          setError("Error Adding Table.");
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
            setError("");
            setMessage("");
            setShowAddDialog(false);
          }, 2000);
        });
    } else {
      setError("Please fill in all required fields.");
      setTimeout(() => {
        setError("");
      }, 2000);
    }

    if (!loading && !error) {
      setFormData({ table_name: '' });
      setShowAddDialog(false);
    }
  };

  const handleDeleteTable = (tableId: string) => {
    if (confirm('Are you sure you want to delete this table?')) {
      DeleteTable(tableId)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => console.error("Error Deleting Table"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white">Table Management</h1>
          <p className="text-gray-400">Manage your snooker tables</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => {
          const isOccupied = table.status === 'Occupied';
          const gameStartTime = table.gameStartTime ? new Date(table.gameStartTime) : null;
          const minutesElapsed = gameStartTime
            ? Math.floor((new Date().getTime() - gameStartTime.getTime()) / 60000)
            : 0;
          const isOvertime = minutesElapsed > 30;

          return (
            <div
              key={table.id}
              className={`backdrop-blur-xl bg-white/5 border rounded-xl p-6 transition-all duration-300 ${isOccupied
                  ? isOvertime
                    ? 'border-red-500/50 bg-red-500/10 shadow-lg shadow-red-500/20'
                    : 'border-blue-500/30 bg-blue-500/5'
                  : 'border-[#00ff41]/20 hover:border-[#00ff41]/40'
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white mb-1">{table.table_name}</h3>
                  <p className="text-gray-400">
                    {table.table_name}
                  </p>
                </div>
                <CircleDot
                  className={`w-6 h-6 ${isOccupied
                      ? isOvertime ? 'text-red-400 animate-pulse' : 'text-blue-400'
                      : 'text-green-400'
                    }`}
                />
              </div>

              <div className="space-y-3">
                <div className={`px-4 py-2 rounded-lg text-center ${isOccupied
                    ? isOvertime
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-blue-500/20 text-blue-400'
                    : 'bg-green-500/20 text-green-400'
                  }`}>
                  {isOccupied ? (isOvertime ? 'OVERTIME' : 'OCCUPIED') : 'FREE'}
                </div>

                {/* {isOccupied && (
                  <>
                    {isOvertime && (
                      <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Over 30 minutes!</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Time Elapsed</span>
                      </div>
                      <span className={isOvertime ? 'text-red-400' : 'text-white'}>
                        {minutesElapsed} min
                      </span>
                    </div>
                    {table.pricingType && (
                      <div className="p-3 bg-black/30 rounded-lg">
                        <p className="text-gray-400">Pricing</p>
                        <p className="text-white">{table.pricingType}</p>
                      </div>
                    )}
                    {gameStartTime && (
                      <div className="p-3 bg-black/30 rounded-lg">
                        <p className="text-gray-400">Started At</p>
                        <p className="text-white">
                          {gameStartTime.toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </>
                )} */}

                {!isOccupied && (
                  <Button
                    onClick={() => handleDeleteTable(table.id)}
                    variant="ghost"
                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Table
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {tables.length === 0 && (
        <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-12 text-center">
          <CircleDot className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No tables added yet</p>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Table
          </Button>
        </div>
      )}

      {/* Add Table Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#0d1117] border-[#00ff41]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#00ff41]">Add New Table</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Table Name *</label>
              <Input
                type="text"
                value={formData.table_name}
                onChange={(e) => setFormData({ ...formData, table_name: e.target.value })}
                placeholder="Table 1"
                className="bg-black/40 border-[#00ff41]/30 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowAddDialog(false)}
              className="text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTable}
              className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
            >
              Add Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
