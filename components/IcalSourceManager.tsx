'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { HiTrash, HiRefresh, HiPlus, HiCheck, HiX } from 'react-icons/hi'

interface IcalSource {
  id: number
  roomId: number
  name: string
  url: string
  enabled: boolean
  lastSync: string | null
}

interface Props {
  roomId: number
}

export default function IcalSourceManager({ roomId }: Props) {
  const [sources, setSources] = useState<IcalSource[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSource, setNewSource] = useState({ name: '', url: '' })

  useEffect(() => {
    fetchSources()
  }, [roomId])

  const fetchSources = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/ical-sources')
      if (res.ok) {
        const data: IcalSource[] = await res.json()
        setSources(data.filter(s => s.roomId === roomId))
      }
    } catch (err) {
      console.error('Failed to fetch iCal sources:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSyncAll = async () => {
    setSyncing(true)
    try {
      // Sync each source individually so we can show per-source results
      const results = []
      for (const source of sources) {
        if (!source.enabled) continue
        const res = await fetch('/api/admin/ical-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sourceId: source.id }),
        })
        const data = await res.json()
        results.push({ name: source.name, ...data })
      }
      const summary = results
        .map((r: any) => `${r.name}: ${r.error || `${r.created} imported, ${r.deleted} removed`}`)
        .join('\n')
      toast.success(`Sync complete!\n${summary}`)
      fetchSources()
    } catch (err) {
      toast.error('Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  const handleSyncOne = async (sourceId: number, name: string) => {
    try {
      const res = await fetch('/api/admin/ical-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`${name}: ${data.created} imported, ${data.deleted} removed`)
        fetchSources()
      } else {
        toast.error(data.error || 'Sync failed')
      }
    } catch (err) {
      toast.error('Sync failed')
    }
  }

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/ical-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          name: newSource.name,
          url: newSource.url,
        }),
      })
      if (res.ok) {
        toast.success('iCal source added!')
        setShowAddForm(false)
        setNewSource({ name: '', url: '' })
        fetchSources()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to add source')
      }
    } catch (err) {
      toast.error('Failed to add source')
    }
  }

  const handleDeleteSource = async (sourceId: number) => {
    if (!confirm('Remove this iCal source? Any bookings imported from it will also be removed.')) return
    try {
      const res = await fetch(`/api/admin/ical-sources/${sourceId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Source removed')
        fetchSources()
      } else {
        toast.error('Failed to remove source')
      }
    } catch (err) {
      toast.error('Failed to remove source')
    }
  }

  const handleToggleEnabled = async (sourceId: number, enabled: boolean) => {
    try {
      const res = await fetch(`/api/admin/ical-sources/${sourceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !enabled }),
      })
      if (res.ok) {
        fetchSources()
      }
    } catch (err) {
      toast.error('Failed to update source')
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never'
    return new Date(dateStr).toLocaleString()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold">iCal Calendar Sync</h3>
          <p className="text-sm text-gray-500 mt-1">
            Import bookings from Airbnb & Bedandbreakfast to prevent double bookings.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition text-sm"
          >
            <HiPlus /> Add Source
          </button>
          <button
            onClick={handleSyncAll}
            disabled={syncing || sources.length === 0}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition text-sm disabled:opacity-50"
          >
            <HiRefresh className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync All'}
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddSource} className="mb-6 bg-amber-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Source Name</label>
              <input
                type="text"
                required
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                placeholder="Airbnb, Bedandbreakfast, etc."
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">iCal URL (.ics)</label>
              <input
                type="url"
                required
                value={newSource.url}
                onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-700 text-sm">
              Add Source
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Sources List */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : sources.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No iCal sources configured yet.</p>
          <p className="text-sm mt-1">Add your Airbnb and Bedandbreakfast calendar URLs above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map(source => (
            <div key={source.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{source.name}</h4>
                  {source.enabled ? (
                    <HiCheck className="text-green-600" title="Enabled" />
                  ) : (
                    <HiX className="text-red-600" title="Disabled" />
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1 truncate">{source.url}</p>
                <p className="text-xs text-gray-400 mt-0.5">Last sync: {formatDate(source.lastSync)}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleSyncOne(source.id, source.name)}
                  className="p-2 text-green-700 hover:bg-green-100 rounded-full"
                  title="Sync now"
                >
                  <HiRefresh size={16} />
                </button>
                <button
                  onClick={() => handleToggleEnabled(source.id, source.enabled)}
                  className={`p-2 rounded-full ${source.enabled ? 'text-amber-700 hover:bg-amber-100' : 'text-gray-400 hover:bg-gray-200'}`}
                  title={source.enabled ? 'Disable' : 'Enable'}
                >
                  {source.enabled ? <HiX size={16} /> : <HiCheck size={16} />}
                </button>
                <button
                  onClick={() => handleDeleteSource(source.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                  title="Remove"
                >
                  <HiTrash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Export URL info */}
      <div className="mt-6 border-t pt-4">
        <h4 className="font-semibold text-sm mb-2">Your iCal Export URL</h4>
        <p className="text-xs text-gray-500 mb-2">
          Give this URL to Airbnb and Bedandbreakfast so they can see your bookings:
        </p>
        <code className="block bg-gray-100 p-2 rounded text-xs break-all">
          {typeof window !== 'undefined' ? `${window.location.origin}/api/calendar/ical.ics?room=${roomId}` : `/api/calendar/ical.ics?room=${roomId}`}
        </code>
      </div>
    </div>
  )
}
