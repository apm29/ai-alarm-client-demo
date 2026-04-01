/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  History, 
  Server, 
  Camera, 
  Settings, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Play, 
  Pause, 
  ChevronRight, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  Maximize2, 
  RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { View, Alarm, Camera as CameraType, AlgorithmServer, AudioVisualAlarm } from './types';

// --- Mock Data ---
const MOCK_SERVERS: AlgorithmServer[] = [
  { id: 'mqtt-001', name: 'MQTT-Server-Alpha', ip: '192.168.1.101', status: 'online', username: 'admin', password: 'password123' },
  { id: 'mqtt-002', name: 'MQTT-Server-Beta', ip: '192.168.1.102', status: 'offline', username: 'user', password: 'password456' },
];

const MOCK_CAMERAS: CameraType[] = [
  { id: 'c1', name: 'Main Entrance', ip: '192.168.1.201', brand: 'Hikvision', rtspUrl: 'rtsp://admin:12345@192.168.1.201/h264/ch1/main/av_stream', serverId: 'mqtt-001', status: 'online', alarmTypes: ['flame'] },
  { id: 'c2', name: 'Warehouse A', ip: '192.168.1.202', brand: 'Dahua', rtspUrl: 'rtsp://admin:12345@192.168.1.202/cam/realmonitor?channel=1&subtype=0', serverId: 'mqtt-001', status: 'online', alarmTypes: ['flame', 'smoke'] },
  { id: 'c3', name: 'Parking Lot', ip: '192.168.1.203', brand: 'Uniview', rtspUrl: 'rtsp://admin:12345@192.168.1.203/video1', serverId: 'mqtt-002', status: 'offline', alarmTypes: ['flame'] },
];

const MOCK_ALARMS_DEVICES: AudioVisualAlarm[] = [
  { id: 'd1', name: 'Main Hall Alarm', ip: '192.168.1.50', port: 8080, serverId: 'mqtt-001', status: 'online' },
  { id: 'd2', name: 'Warehouse Alarm', ip: '192.168.1.51', port: 8080, serverId: 'mqtt-001', status: 'online' },
];

const MOCK_ALARMS: Alarm[] = [
  { id: 'a1', timestamp: '2026-03-31 10:15:22', cameraName: 'Warehouse A', serverName: 'MQTT-Server-Alpha', type: 'flame', imageUrl: 'https://picsum.photos/seed/fire1/400/300', status: 'active' },
  { id: 'a2', timestamp: '2026-03-31 09:45:10', cameraName: 'Main Entrance', serverName: 'MQTT-Server-Alpha', type: 'flame', imageUrl: 'https://picsum.photos/seed/fire2/400/300', status: 'resolved' },
  { id: 'a3', timestamp: '2026-03-31 08:30:05', cameraName: 'Warehouse A', serverName: 'MQTT-Server-Alpha', type: 'smoke', imageUrl: 'https://picsum.photos/seed/smoke1/400/300', status: 'resolved' },
];

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#151619] border border-[#2A2B2F] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-[#1C1D21] flex items-center justify-between">
          <h3 className="text-white text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-[#8E9299] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const Sidebar = ({ currentView, setView }: { currentView: View, setView: (v: View) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
    { id: 'realtime', label: '实时值守', icon: Activity },
    { id: 'history', label: '历史查询', icon: History },
    { id: 'servers', label: '算法服务器', icon: Server },
    { id: 'cameras', label: '摄像头管理', icon: Camera },
    { id: 'alarms', label: '声光报警器', icon: Bell },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#151619] border-r border-[#2A2B2F] flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
          <ShieldAlert className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">AI火焰报警系统</h1>
          <p className="text-[#8E9299] text-[10px] tracking-widest uppercase font-mono">控制中心</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                : 'text-[#8E9299] hover:bg-[#1C1D21] hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-white' : 'group-hover:text-white'}`} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2A2B2F]">
        <div className="bg-[#1C1D21] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-[#2A2B2F]">
            <User className="text-gray-400 w-5 h-5" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-white text-sm font-medium truncate">管理员</p>
            <p className="text-[#8E9299] text-xs truncate">yjw999wow@gmail.com</p>
          </div>
          <button className="text-[#8E9299] hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = ({ title }: { title: string }) => (
  <header className="h-20 bg-[#0A0B0D] border-b border-[#1C1D21] px-8 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
    <div className="flex items-center gap-4">
      <h2 className="text-white text-xl font-semibold tracking-tight">{title}</h2>
      <div className="h-4 w-[1px] bg-[#2A2B2F]" />
      <div className="flex items-center gap-2 text-[#8E9299] text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        系统在线
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="relative">
        <Bell className="text-[#8E9299] w-5 h-5 cursor-pointer hover:text-white transition-colors" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-[#0A0B0D]">3</span>
      </div>
      <div className="h-8 w-[1px] bg-[#2A2B2F]" />
      <div className="text-right">
        <p className="text-white text-sm font-medium">2026-03-31</p>
        <p className="text-[#8E9299] text-xs font-mono">13:59:41 UTC</p>
      </div>
    </div>
  </header>
);

const StatCard = ({ label, value, icon: Icon, trend, color }: { label: string, value: string | number, icon: any, trend?: string, color: string }) => (
  <div className="bg-[#151619] border border-[#1C1D21] rounded-2xl p-6 hover:border-[#2A2B2F] transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-[#8E9299] text-sm font-medium mb-1">{label}</h3>
    <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
  </div>
);

const Dashboard = ({ 
  serverCount, 
  cameraCount, 
  alarmCount 
}: { 
  serverCount: number, 
  cameraCount: number, 
  alarmCount: number 
}) => (
  <div className="p-8 space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="服务器总数" value={serverCount} icon={Server} color="bg-blue-500" />
      <StatCard label="在线摄像头" value={cameraCount} icon={Camera} color="bg-purple-500" trend="+1" />
      <StatCard label="今日报警" value={12} icon={AlertTriangle} color="bg-orange-500" trend="+24%" />
      <StatCard label="系统运行时间" value="99.9%" icon={Activity} color="bg-green-500" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-lg font-semibold">最近活动</h3>
          <button className="text-orange-500 text-sm hover:underline">查看全部</button>
        </div>
        <div className="bg-[#151619] border border-[#1C1D21] rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1C1D21] text-[#8E9299] text-[10px] uppercase tracking-wider font-mono">
                <th className="px-6 py-4">时间</th>
                <th className="px-6 py-4">摄像头</th>
                <th className="px-6 py-4">类型</th>
                <th className="px-6 py-4">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1D21]">
              {MOCK_ALARMS.map((alarm) => (
                <tr key={alarm.id} className="hover:bg-[#1C1D21]/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 text-[#8E9299] text-sm font-mono">{alarm.timestamp.split(' ')[1]}</td>
                  <td className="px-6 py-4 text-white text-sm font-medium">{alarm.cameraName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${alarm.type === 'flame' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {alarm.type === 'flame' ? '火焰' : '烟雾'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${alarm.status === 'active' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                      <span className={`text-xs ${alarm.status === 'active' ? 'text-red-500' : 'text-green-500'}`}>
                        {alarm.status === 'active' ? '正在报警' : '已处理'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-white text-lg font-semibold">服务器状态</h3>
        <div className="space-y-4">
          {MOCK_SERVERS.map((server) => (
            <div key={server.id} className="bg-[#151619] border border-[#1C1D21] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${server.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{server.name}</p>
                  <p className="text-[#8E9299] text-xs font-mono">{server.ip}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${server.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {server.status === 'online' ? '在线' : '离线'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const RealTimeMonitor = ({ cameras }: { cameras: CameraType[] }) => {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(cameras[0]?.id || null);

  return (
    <div className="p-8 h-[calc(100vh-80px)] flex gap-8">
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative flex-1 bg-black rounded-3xl overflow-hidden border border-[#1C1D21] group shadow-2xl">
          {selectedCamera ? (
            <>
              <img 
                src={`https://picsum.photos/seed/${selectedCamera}/1280/720`} 
                className="w-full h-full object-cover opacity-80" 
                alt="Camera Feed"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  实时
                </div>
                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-white text-xs font-medium">
                  {cameras.find(c => c.id === selectedCamera)?.name || '选择摄像头'}
                </div>
              </div>

              <div className="absolute top-6 right-6 flex gap-2">
                <button className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/20 transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/20 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
                    <Pause className="w-6 h-6 fill-current" />
                  </button>
                  <div className="text-white">
                    <p className="text-sm font-medium">1920x1080 @ 30fps</p>
                    <p className="text-[#8E9299] text-xs font-mono">H.264 Main Profile</p>
                  </div>
                </div>
                <div className="text-right text-white font-mono">
                  <p className="text-lg font-bold">13:59:41</p>
                  <p className="text-[#8E9299] text-xs">2026-03-31</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-[#8E9299]">
              请选择一个摄像头
            </div>
          )}
        </div>

        <div className="h-48 grid grid-cols-4 gap-4">
          {cameras.map((cam) => (
            <button 
              key={cam.id}
              onClick={() => setSelectedCamera(cam.id)}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all ${selectedCamera === cam.id ? 'border-orange-600 scale-[0.98]' : 'border-transparent hover:border-[#2A2B2F]'}`}
            >
              <img 
                src={`https://picsum.photos/seed/${cam.id}/300/200`} 
                className={`w-full h-full object-cover ${cam.status === 'offline' ? 'grayscale opacity-40' : 'opacity-60'}`} 
                alt={cam.name}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-white text-[10px] font-medium truncate">{cam.name}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${cam.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            </button>
          ))}
          <button className="border-2 border-dashed border-[#1C1D21] rounded-2xl flex flex-col items-center justify-center text-[#8E9299] hover:text-white hover:border-[#2A2B2F] transition-all group">
            <Plus className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-wider">添加视图</span>
          </button>
        </div>
      </div>

      <div className="w-80 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-lg font-semibold">实时报警</h3>
          <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-1 rounded-full">3 条新消息</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {MOCK_ALARMS.map((alarm) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={alarm.id} 
              className={`bg-[#151619] border rounded-2xl overflow-hidden transition-all hover:scale-[1.02] ${alarm.status === 'active' ? 'border-red-500/50 shadow-lg shadow-red-900/10' : 'border-[#1C1D21]'}`}
            >
              <div className="relative h-32">
                <img src={alarm.imageUrl} className="w-full h-full object-cover" alt="报警图片" referrerPolicy="no-referrer" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded font-mono">
                  {alarm.timestamp.split(' ')[1]}
                </div>
                {alarm.status === 'active' && (
                  <div className="absolute inset-0 border-2 border-red-500 animate-pulse" />
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-white text-sm font-bold">{alarm.cameraName}</h4>
                  <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{alarm.type === 'flame' ? '火焰' : '烟雾'}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-700 transition-colors">
                    确认报警
                  </button>
                  <button className="p-2 bg-[#1C1D21] text-[#8E9299] rounded-lg hover:text-white transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HistoryQuery = () => (
  <div className="p-8 space-y-8">
    <div className="bg-[#151619] border border-[#1C1D21] rounded-3xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-[#8E9299] text-xs font-bold uppercase tracking-wider">时间范围</label>
          <div className="relative">
            <input type="date" className="w-full bg-[#0A0B0D] border border-[#1C1D21] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[#8E9299] text-xs font-bold uppercase tracking-wider">算法服务器</label>
          <select className="w-full bg-[#0A0B0D] border border-[#1C1D21] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors appearance-none">
            <option>全部服务器</option>
            <option>Server-Alpha</option>
            <option>Server-Beta</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[#8E9299] text-xs font-bold uppercase tracking-wider">报警类型</label>
          <select className="w-full bg-[#0A0B0D] border border-[#1C1D21] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors appearance-none">
            <option>全部类型</option>
            <option>火焰</option>
            <option>烟雾</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20">
            <Search className="w-4 h-4" />
            搜索记录
          </button>
        </div>
      </div>
    </div>

    <div className="bg-[#151619] border border-[#1C1D21] rounded-3xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#1C1D21] text-[#8E9299] text-[10px] uppercase tracking-wider font-mono">
            <th className="px-8 py-5">时间戳</th>
            <th className="px-8 py-5">摄像头来源</th>
            <th className="px-8 py-5">服务器</th>
            <th className="px-8 py-5">报警类型</th>
            <th className="px-8 py-5">证据图片</th>
            <th className="px-8 py-5">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1C1D21]">
          {MOCK_ALARMS.map((alarm) => (
            <tr key={alarm.id} className="hover:bg-[#1C1D21]/30 transition-colors">
              <td className="px-8 py-6 text-white text-sm font-mono">{alarm.timestamp}</td>
              <td className="px-8 py-6 text-white text-sm font-medium">{alarm.cameraName}</td>
              <td className="px-8 py-6 text-[#8E9299] text-sm">{alarm.serverName}</td>
              <td className="px-8 py-6">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${alarm.type === 'flame' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                  {alarm.type === 'flame' ? '火焰' : '烟雾'}
                </span>
              </td>
              <td className="px-8 py-6">
                <div className="w-16 h-10 rounded-lg overflow-hidden border border-[#2A2B2F] cursor-zoom-in hover:scale-110 transition-transform">
                  <img src={alarm.imageUrl} className="w-full h-full object-cover" alt="证据图片" referrerPolicy="no-referrer" />
                </div>
              </td>
              <td className="px-8 py-6">
                <button className="text-orange-500 hover:text-orange-400 text-sm font-bold">详情</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const HardwareConfig = ({ 
  type, 
  servers, 
  cameras, 
  alarms, 
  onAdd, 
  onEdit, 
  onDelete 
}: { 
  type: 'servers' | 'cameras' | 'alarms',
  servers: AlgorithmServer[],
  cameras: CameraType[],
  alarms: AudioVisualAlarm[],
  onAdd: () => void,
  onEdit: (item: any) => void,
  onDelete: (id: string) => void
}) => {
  const getTitle = () => {
    switch (type) {
      case 'servers': return '算法服务器';
      case 'cameras': return '摄像头管理';
      case 'alarms': return '声光报警器';
    }
  };

  const getAddLabel = () => {
    switch (type) {
      case 'servers': return '服务器';
      case 'cameras': return '摄像头';
      case 'alarms': return '报警器';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold">{getTitle()}</h3>
        <button 
          onClick={onAdd}
          className="bg-orange-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-700 transition-all flex items-center gap-2 shadow-lg shadow-orange-900/20"
        >
          <Plus className="w-4 h-4" />
          添加 {getAddLabel()}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {type === 'servers' && servers.map((server) => {
          const cameraCount = cameras.filter(c => c.serverId === server.id).length;
          const alarmCount = alarms.filter(a => a.serverId === server.id).length;
          
          return (
            <div key={server.id} className="bg-[#151619] border border-[#1C1D21] rounded-3xl p-6 space-y-6 group hover:border-[#2A2B2F] transition-all">
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl ${server.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  <Server className="w-8 h-8" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(server)} className="p-2 text-[#8E9299] hover:text-white hover:bg-[#1C1D21] rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(server.id)} className="p-2 text-[#8E9299] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div>
                <h4 className="text-white text-xl font-bold mb-1">{server.name}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-[#8E9299] font-mono text-sm">{server.ip}</p>
                  <span className="text-[#2A2B2F] text-xs">|</span>
                  <p className="text-[#8E9299] font-mono text-xs">服务器 ID: {server.id}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#1C1D21]">
                <div>
                  <p className="text-[#8E9299] text-[10px] uppercase font-bold tracking-wider mb-1">账号</p>
                  <p className="text-white font-mono text-sm truncate">{server.username || '-'}</p>
                </div>
                <div>
                  <p className="text-[#8E9299] text-[10px] uppercase font-bold tracking-wider mb-1">密码</p>
                  <p className="text-white font-mono text-sm truncate">••••••••</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1C1D21] p-3 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Camera className="w-3 h-3 text-orange-500" />
                    <span className="text-[#8E9299] text-[10px] font-bold uppercase tracking-wider">摄像头</span>
                  </div>
                  <p className="text-white font-bold">{cameraCount} <span className="text-[10px] font-normal text-[#8E9299]">个</span></p>
                </div>
                <div className="bg-[#1C1D21] p-3 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="w-3 h-3 text-orange-500" />
                    <span className="text-[#8E9299] text-[10px] font-bold uppercase tracking-wider">报警器</span>
                  </div>
                  <p className="text-white font-bold">{alarmCount} <span className="text-[10px] font-normal text-[#8E9299]">个</span></p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${server.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`text-xs font-bold uppercase ${server.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>{server.status === 'online' ? '在线' : '离线'}</span>
                </div>
                <button className="text-orange-500 text-xs font-bold hover:underline">配置参数</button>
              </div>
            </div>
          );
        })}

        {type === 'cameras' && cameras.map((cam) => (
          <div key={cam.id} className="bg-[#151619] border border-[#1C1D21] rounded-3xl overflow-hidden group hover:border-[#2A2B2F] transition-all">
            <div className="relative h-40">
              <img src={`https://picsum.photos/seed/${cam.id}/400/200`} className="w-full h-full object-cover opacity-60" alt={cam.name} referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151619] to-transparent" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => onEdit(cam)} className="p-2 bg-black/60 backdrop-blur-md text-white rounded-lg border border-white/10 hover:bg-white/20 transition-all"><Edit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(cam.id)} className="p-2 bg-black/60 backdrop-blur-md text-white rounded-lg border border-white/10 hover:bg-red-500/20 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="absolute bottom-4 left-6">
                <h4 className="text-white text-xl font-bold">{cam.name}</h4>
                <p className="text-[#8E9299] font-mono text-xs">{cam.ip}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {cam.alarmTypes.map(type => (
                  <span key={type} className="bg-orange-500/10 text-orange-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                    {type === 'flame' ? '火焰' : '烟雾'} 检测
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#1C1D21]">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#8E9299]" />
                  <span className="text-[#8E9299] text-xs font-medium">所属服务器: {servers.find(s => s.id === cam.serverId)?.name || '未绑定'}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${cam.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {cam.status === 'online' ? '在线' : '离线'}
                </div>
              </div>
            </div>
          </div>
        ))}

        {type === 'alarms' && alarms.map((alarm) => (
          <div key={alarm.id} className="bg-[#151619] border border-[#1C1D21] rounded-3xl p-6 space-y-6 group hover:border-[#2A2B2F] transition-all">
            <div className="flex items-start justify-between">
              <div className={`p-4 rounded-2xl ${alarm.status === 'online' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
                <Bell className="w-8 h-8" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(alarm)} className="p-2 text-[#8E9299] hover:text-white hover:bg-[#1C1D21] rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(alarm.id)} className="p-2 text-[#8E9299] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div>
              <h4 className="text-white text-xl font-bold mb-1">{alarm.name}</h4>
              <p className="text-[#8E9299] font-mono text-sm">{alarm.ip}:{alarm.port}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#1C1D21]">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#8E9299]" />
                <span className="text-[#8E9299] text-xs font-medium">所属服务器: {servers.find(s => s.id === alarm.serverId)?.name || '未绑定'}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${alarm.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {alarm.status === 'online' ? '在线' : '离线'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [currentView, setView] = useState<View>('dashboard');
  const [servers, setServers] = useState<AlgorithmServer[]>(MOCK_SERVERS);
  const [cameras, setCameras] = useState<CameraType[]>(MOCK_CAMERAS);
  const [alarms, setAlarms] = useState<AudioVisualAlarm[]>(MOCK_ALARMS_DEVICES);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'servers' | 'cameras' | 'alarms'>('servers');

  const handleAdd = (type: 'servers' | 'cameras' | 'alarms') => {
    setModalType(type);
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (type: 'servers' | 'cameras' | 'alarms', item: any) => {
    setModalType(type);
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = (type: 'servers' | 'cameras' | 'alarms', id: string) => {
    if (!confirm('确定要删除该设备吗？')) return;
    switch (type) {
      case 'servers': setServers(prev => prev.filter(s => s.id !== id)); break;
      case 'cameras': setCameras(prev => prev.filter(c => c.id !== id)); break;
      case 'alarms': setAlarms(prev => prev.filter(a => a.id !== id)); break;
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());
    
    if (editingItem) {
      const updatedItem = { ...editingItem, ...data };
      switch (modalType) {
        case 'servers': setServers(prev => prev.map(s => s.id === editingItem.id ? updatedItem : s)); break;
        case 'cameras': setCameras(prev => prev.map(c => c.id === editingItem.id ? updatedItem : c)); break;
        case 'alarms': setAlarms(prev => prev.map(a => a.id === editingItem.id ? updatedItem : a)); break;
      }
    } else {
      const newItem = { 
        ...data, 
        id: modalType === 'servers' ? data.id : Math.random().toString(36).substr(2, 9), 
        status: 'online' 
      };
      switch (modalType) {
        case 'servers': setServers(prev => [...prev, newItem]); break;
        case 'cameras': setCameras(prev => [...prev, { ...newItem, alarmTypes: ['flame'] }]); break;
        case 'alarms': setAlarms(prev => [...prev, newItem]); break;
      }
    }
    setModalOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard serverCount={servers.length} cameraCount={cameras.length} alarmCount={alarms.length} />;
      case 'realtime': return <RealTimeMonitor cameras={cameras} />;
      case 'history': return <HistoryQuery />;
      case 'servers': return <HardwareConfig type="servers" servers={servers} cameras={cameras} alarms={alarms} onAdd={() => handleAdd('servers')} onEdit={(item) => handleEdit('servers', item)} onDelete={(id) => handleDelete('servers', id)} />;
      case 'cameras': return <HardwareConfig type="cameras" servers={servers} cameras={cameras} alarms={alarms} onAdd={() => handleAdd('cameras')} onEdit={(item) => handleEdit('cameras', item)} onDelete={(id) => handleDelete('cameras', id)} />;
      case 'alarms': return <HardwareConfig type="alarms" servers={servers} cameras={cameras} alarms={alarms} onAdd={() => handleAdd('alarms')} onEdit={(item) => handleEdit('alarms', item)} onDelete={(id) => handleDelete('alarms', id)} />;
      case 'settings': return (
        <div className="p-8 flex items-center justify-center h-[calc(100vh-160px)]">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-[#1C1D21] rounded-3xl flex items-center justify-center mx-auto border border-[#2A2B2F]">
              <Settings className="text-[#8E9299] w-10 h-10" />
            </div>
            <h3 className="text-white text-xl font-bold">系统设置</h3>
            <p className="text-[#8E9299] max-w-sm">配置全局系统参数、用户权限和云端同步设置。</p>
            <button className="bg-orange-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-700 transition-all">
              打开配置
            </button>
          </div>
        </div>
      );
      default: return <Dashboard serverCount={servers.length} cameraCount={cameras.length} alarmCount={alarms.length} />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return '系统概览';
      case 'realtime': return '实时值守';
      case 'history': return '历史报警查询';
      case 'servers': return '算法服务器配置';
      case 'cameras': return '摄像头管理';
      case 'alarms': return '声光报警器管理';
      case 'settings': return '系统设置';
      default: return 'AI火焰报警系统';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0B0D] font-sans selection:bg-orange-600 selection:text-white">
      <Sidebar currentView={currentView} setView={setView} />
      
      <main className="flex-1 flex flex-col">
        <Header title={getTitle()} />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title={`${editingItem ? '编辑' : '添加'}${modalType === 'servers' ? '服务器' : modalType === 'cameras' ? '摄像头' : '报警器'}`}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {modalType === 'servers' ? (
            <>
              <div className="space-y-2">
                <label className="text-[#8E9299] text-xs font-bold uppercase tracking-wider">MQTT 服务端名称</label>
                <input name="name" defaultValue={editingItem?.name} required className="w-full bg-[#0A0B0D] border border-[#1C1D21] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[#8E9299] text-xs font-bold uppercase tracking-wider">服务器 ID</label>
                <input name="id" defaultValue={editingItem?.id} required disabled={!!editingItem} className="w-full bg-[#0A0B0D] border border-[#1C1D21] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors disabled:opacity-50" />
              </div>
              <div className="space-y-2">
                <label className="text-[#8E9299] text-xs font-bold uppercase tracking-wider">IP 地址</label>
                <input name="ip" defaultValue={editingItem?.ip} required className="w-full bg-[#0A0B0D] border border-[#1C1D21] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[#8E9299] text-xs font-bold uppercase tracking-wider">账号</label>
                  <input name="username" defaultValue={editingItem?.username} required className="w-full bg-[#0A0B0D] border border-[#1C1D21] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[#8E9299] text-xs font-bold uppercase tracking-wider">密码</label>
                  <input name="password" type="password" defaultValue={editingItem?.password} required className="w-full bg-[#0A0B0D] border border-[#1C1D21] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[#8E9299] text-xs font-bold uppercase tracking-wider">名称</label>
                <input name="name" defaultValue={editingItem?.name} required className="w-full bg-[#0A0B0D] border border-[#1C1D21] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[#8E9299] text-xs font-bold uppercase tracking-wider">IP 地址</label>
                <input name="ip" defaultValue={editingItem?.ip} required className="w-full bg-[#0A0B0D] border border-[#1C1D21] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors" />
              </div>
            </>
          )}
          {(modalType === 'cameras' || modalType === 'alarms') && (
            <div className="space-y-2">
              <label className="text-[#8E9299] text-xs font-bold uppercase tracking-wider">所属服务器</label>
              <select name="serverId" defaultValue={editingItem?.serverId} required className="w-full bg-[#0A0B0D] border border-[#1C1D21] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600 transition-colors appearance-none">
                {servers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          <div className="pt-4">
            <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/20">
              保存配置
            </button>
          </div>
        </form>
      </Modal>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1C1D21;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2A2B2F;
        }
      `}</style>
    </div>
  );
}
