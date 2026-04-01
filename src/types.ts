export type View = 'dashboard' | 'realtime' | 'history' | 'servers' | 'cameras' | 'alarms' | 'settings';

export interface Alarm {
  id: string;
  timestamp: string;
  cameraName: string;
  serverName: string;
  type: 'flame' | 'smoke' | 'other';
  imageUrl: string;
  status: 'active' | 'resolved';
}

export interface Camera {
  id: string;
  name: string;
  ip: string;
  brand: string;
  rtspUrl: string;
  serverId: string;
  status: 'online' | 'offline';
  alarmTypes: string[];
}

export interface AudioVisualAlarm {
  id: string;
  name: string;
  ip: string;
  port: number;
  serverId: string;
  status: 'online' | 'offline';
}

export interface AlgorithmServer {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline';
  username?: string;
  password?: string;
  concurrency?: number;
  samplingFrequency?: number;
}
